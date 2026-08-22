import { Request, Response } from 'express';
import { verifyWebhookSignature } from '../razorpay/index.js';
import { WebhookEvent } from '../models/WebhookEvent.js';
import { Transaction, PaymentStatus } from '../models/Transaction.js';
import { Notification } from '../models/Notification.js';
import { calculateRiskScore } from '../fraud/index.js';
import { logger } from '../utils/logger.js';

export async function handleRazorpayWebhook(req: Request, res: Response) {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    if (!signature) {
      logger.warn('Razorpay webhook attempt missing X-Razorpay-Signature header');
      return res.status(400).json({ success: false, message: 'Missing webhook signature' });
    }

    // 1. Verify HMAC SHA256 Webhook Signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      logger.warn('Razorpay webhook signature verification failed');
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventType = payload.event;
    const eventId = payload.event_id || req.headers['x-razorpay-event-id'] || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    logger.info(`Razorpay Webhook Event Received: ${eventType} | ID: ${eventId}`);

    // 2. Idempotency Check (Prevent duplicate event processing)
    const existingEvent = await WebhookEvent.findOne({ eventId });
    if (existingEvent && existingEvent.processed) {
      logger.info(`Webhook event ${eventId} already processed. Skipping duplicate.`);
      return res.status(200).json({ success: true, message: 'Event already processed (idempotent)' });
    }

    // Record webhook event in DB
    const webhookRecord = new WebhookEvent({
      eventId,
      eventType,
      payload,
      processed: false,
    });

    // 3. Handle Event Types
    switch (eventType) {
      case 'payment.captured': {
        const paymentEntity = payload.payload?.payment?.entity;
        if (paymentEntity) {
          const orderId = paymentEntity.order_id;
          const paymentId = paymentEntity.id;
          const amountInINR = paymentEntity.amount ? paymentEntity.amount / 100 : 0;

          let transaction = await Transaction.findOne({ razorpayOrderId: orderId });
          if (transaction) {
            transaction.status = 'CAPTURED' as PaymentStatus;
            transaction.razorpayPaymentId = paymentId;
            transaction.paymentMethod = paymentEntity.method || 'card';
            transaction.rawRazorpayResponse = paymentEntity;

            const risk = calculateRiskScore({
              amount: amountInINR,
              ip: paymentEntity.ip || '127.0.0.1',
              cardBin: paymentEntity.card?.network || 'VISA',
            });

            transaction.riskScore = risk.score;
            transaction.riskLevel = risk.level;
            await transaction.save();
          }

          // Create in-app Notification
          await Notification.create({
            merchantId: transaction?.merchantId || 'mch_rpai_live_8910',
            title: 'Payment Captured',
            message: `Payment of ₹${amountInINR.toLocaleString('en-IN')} captured via ${paymentEntity.method?.toUpperCase()}.`,
            type: 'payment_received',
            severity: 'success',
            relatedId: paymentId,
          });
        }
        break;
      }

      case 'payment.failed': {
        const paymentEntity = payload.payload?.payment?.entity;
        if (paymentEntity) {
          const orderId = paymentEntity.order_id;
          const paymentId = paymentEntity.id;
          const failureReason = paymentEntity.error_description || paymentEntity.error_reason || 'Payment failed';

          let transaction = await Transaction.findOne({ razorpayOrderId: orderId });
          if (transaction) {
            transaction.status = 'FAILED' as PaymentStatus;
            transaction.razorpayPaymentId = paymentId;
            transaction.failureReason = failureReason;
            transaction.errorCode = paymentEntity.error_code;
            transaction.errorDescription = failureReason;
            await transaction.save();
          }

          // Create Notification & Flag Alert
          await Notification.create({
            merchantId: transaction?.merchantId || 'mch_rpai_live_8910',
            title: 'Payment Failed',
            message: `Transaction ${paymentId} failed: ${failureReason}. RPAI Recovery nudge triggered.`,
            type: 'payment_failed',
            severity: 'warning',
            relatedId: paymentId,
          });
        }
        break;
      }

      case 'order.paid': {
        const orderEntity = payload.payload?.order?.entity;
        if (orderEntity) {
          await Transaction.updateOne(
            { razorpayOrderId: orderEntity.id },
            { $set: { status: 'CAPTURED' } }
          );
        }
        break;
      }

      case 'refund.created':
      case 'refund.processed': {
        const refundEntity = payload.payload?.refund?.entity;
        if (refundEntity) {
          const paymentId = refundEntity.payment_id;
          const refundAmount = refundEntity.amount ? refundEntity.amount / 100 : 0;

          await Transaction.updateOne(
            { razorpayPaymentId: paymentId },
            { $set: { status: 'REFUNDED' } }
          );

          await Notification.create({
            merchantId: 'mch_rpai_live_8910',
            title: 'Refund Completed',
            message: `Refund of ₹${refundAmount.toLocaleString('en-IN')} for ${paymentId} settled.`,
            type: 'refund_completed',
            severity: 'info',
            relatedId: paymentId,
          });
        }
        break;
      }

      default:
        logger.info(`Unhandled webhook event type: ${eventType}`);
        break;
    }

    // Mark event as processed
    webhookRecord.processed = true;
    webhookRecord.processedAt = new Date();
    await webhookRecord.save();

    return res.status(200).json({ success: true, message: 'Webhook event processed successfully' });
  } catch (error: any) {
    logger.error('Webhook processing error:', error);
    return res.status(500).json({ success: false, message: 'Internal webhook error' });
  }
}

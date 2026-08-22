import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { Notification } from '../models/Notification.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

const MOCK_NOTIFICATIONS = [
  {
    id: 'ntf_001',
    title: 'Payment Received',
    message: 'Payment of ₹45,000 from Aarav Sharma captured successfully via Visa •••• 4242.',
    type: 'payment_received',
    severity: 'success',
    isRead: false,
    relatedId: 'pay_NzkX9218ab',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ntf_002',
    title: 'High-Risk Transaction Detected',
    message: 'RPAI AI flagged payment pay_MkkX9102bc with risk score 78/100. Velocity spike from VPN endpoint detected.',
    type: 'risk_detected',
    severity: 'critical',
    isRead: false,
    relatedId: 'pay_MkkX9102bc',
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'ntf_003',
    title: 'Payment Failed',
    message: '3DS verification failed for ₹1,28,000 order from Priya Patel. Recovery workflow initiated.',
    type: 'payment_failed',
    severity: 'warning',
    isRead: false,
    relatedId: 'pay_MkkX9102bc',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ntf_004',
    title: 'Recovery Link Dispatched',
    message: 'Smart retry payment link sent to priya.patel@example.com via WhatsApp for ₹1,28,000 recovery.',
    type: 'recovery',
    severity: 'info',
    isRead: true,
    relatedId: 'rec_88192',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'ntf_005',
    title: 'Bank Reconciliation Complete',
    message: '1,240 transactions verified and matched against Razorpay bank statement. Net payout: ₹18,13,000.',
    type: 'ai_complete',
    severity: 'success',
    isRead: true,
    relatedId: 'SETTLE_2026_08_21_01',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function getNotifications(req: AuthRequest, res: Response) {
  return sendSuccess(res, MOCK_NOTIFICATIONS, 'Notifications fetched successfully');
}

export async function markAsRead(req: AuthRequest, res: Response) {
  const { id } = req.params;
  // In real app: update DB
  return sendSuccess(res, { id, isRead: true }, 'Notification marked as read');
}

export async function markAllAsRead(req: AuthRequest, res: Response) {
  return sendSuccess(res, null, 'All notifications marked as read');
}

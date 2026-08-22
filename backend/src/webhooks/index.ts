import crypto from 'crypto';
import { ENV } from '../config/env.js';

export function verifyRazorpaySignature(body: string, signature: string, secret: string = ENV.RAZORPAY_WEBHOOK_SECRET): boolean {
  if (!signature || !secret) return false;
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expectedSignature === signature;
}

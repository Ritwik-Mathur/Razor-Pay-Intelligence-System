import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  merchantId: string;
  title: string;
  message: string;
  type: 'payment_received' | 'payment_failed' | 'risk_detected' | 'refund_completed' | 'ai_complete' | 'system' | 'recovery';
  severity: 'info' | 'success' | 'warning' | 'critical';
  isRead: boolean;
  relatedId?: string; // paymentId, riskAlertId, etc
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    merchantId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['payment_received', 'payment_failed', 'risk_detected', 'refund_completed', 'ai_complete', 'system', 'recovery'],
      required: true,
    },
    severity: { type: String, enum: ['info', 'success', 'warning', 'critical'], default: 'info' },
    isRead: { type: Boolean, default: false },
    relatedId: { type: String },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

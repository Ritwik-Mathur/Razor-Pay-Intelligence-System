import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  merchantId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number; // in INR
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  method: 'card' | 'upi' | 'netbanking' | 'wallet';
  cardBrand?: string;
  cardLast4?: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    merchantId: { type: String, required: true, index: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'authorized', 'captured', 'failed', 'refunded'], required: true },
    method: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'], default: 'card' },
    cardBrand: { type: String },
    cardLast4: { type: String },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    customerName: { type: String },
    riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    riskScore: { type: Number, default: 10 },
    failureReason: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

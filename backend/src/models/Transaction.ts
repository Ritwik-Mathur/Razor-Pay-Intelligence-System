import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus =
  | 'CREATED'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'HELD'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'REQUIRES_REVIEW';

export interface ITransaction extends Document {
  merchantId: string;
  transactionId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number; // Amount in INR Rupees
  amountInPaise: number;
  currency: string;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet' | 'pending';
  cardBrand?: string;
  cardLast4?: string;
  vpa?: string; // UPI ID if applicable
  bank?: string; // Netbanking bank name
  wallet?: string;
  status: PaymentStatus;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskReasons: string[];
  failureReason?: string;
  errorCode?: string;
  errorDescription?: string;
  rawRazorpayResponse?: any;
  notes?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    merchantId: { type: String, required: true, index: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, index: true },
    customerPhone: { type: String },
    amount: { type: Number, required: true },
    amountInPaise: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'pending'],
      default: 'pending',
    },
    cardBrand: { type: String },
    cardLast4: { type: String },
    vpa: { type: String },
    bank: { type: String },
    wallet: { type: String },
    status: {
      type: String,
      enum: [
        'CREATED',
        'AUTHORIZED',
        'CAPTURED',
        'FAILED',
        'HELD',
        'REFUNDED',
        'PARTIALLY_REFUNDED',
        'REQUIRES_REVIEW',
      ],
      default: 'CREATED',
      required: true,
    },
    riskScore: { type: Number, default: 10 },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    riskReasons: [{ type: String }],
    failureReason: { type: String },
    errorCode: { type: String },
    errorDescription: { type: String },
    rawRazorpayResponse: { type: Schema.Types.Mixed },
    notes: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

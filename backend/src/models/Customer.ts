import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  merchantId: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
  averageTransactionValue: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'flagged' | 'blocked';
  aiSummary?: string;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    merchantId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    totalSpent: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
    successfulTransactions: { type: Number, default: 0 },
    failedTransactions: { type: Number, default: 0 },
    refundedTransactions: { type: Number, default: 0 },
    averageTransactionValue: { type: Number, default: 0 },
    riskScore: { type: Number, default: 10 },
    riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    status: { type: String, enum: ['active', 'flagged', 'blocked'], default: 'active' },
    aiSummary: { type: String },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

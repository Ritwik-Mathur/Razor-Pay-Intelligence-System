import mongoose, { Schema, Document } from 'mongoose';

export type ReconciliationResult = 'MATCHED' | 'MISMATCH' | 'MISSING_INTERNAL' | 'MISSING_RAZORPAY';

export interface IReconciliationItem {
  paymentId: string;
  razorpayOrderId?: string;
  customerName?: string;
  customerEmail?: string;
  internalAmount: number;        // RPAI internal record (INR)
  razorpayAmount: number;        // Razorpay reported amount (INR)
  internalStatus: string;
  razorpayStatus: string;
  refundInternal: number;
  refundRazorpay: number;
  result: ReconciliationResult;
  difference: number;            // razorpayAmount - internalAmount
  aiExplanation?: string;
  resolvedAt?: Date;
}

export interface IReconciliationRun extends Document {
  merchantId: string;
  batchId: string;
  runBy: string;
  actorType: 'HUMAN' | 'SYSTEM';
  dateRange: { from: Date; to: Date };
  totalTransactions: number;
  matched: number;
  mismatched: number;
  missingInternal: number;
  missingRazorpay: number;
  unresolved: number;
  totalDifference: number;       // Sum of all |difference| values
  items: IReconciliationItem[];
  status: 'running' | 'completed' | 'failed';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReconciliationItemSchema = new Schema<IReconciliationItem>({
  paymentId:       { type: String, required: true },
  razorpayOrderId: { type: String },
  customerName:    { type: String },
  customerEmail:   { type: String },
  internalAmount:  { type: Number, default: 0 },
  razorpayAmount:  { type: Number, default: 0 },
  internalStatus:  { type: String, default: 'UNKNOWN' },
  razorpayStatus:  { type: String, default: 'UNKNOWN' },
  refundInternal:  { type: Number, default: 0 },
  refundRazorpay:  { type: Number, default: 0 },
  result:          { type: String, enum: ['MATCHED', 'MISMATCH', 'MISSING_INTERNAL', 'MISSING_RAZORPAY'], required: true },
  difference:      { type: Number, default: 0 },
  aiExplanation:   { type: String },
  resolvedAt:      { type: Date },
}, { _id: false });

const ReconciliationRunSchema = new Schema<IReconciliationRun>(
  {
    merchantId:        { type: String, required: true, index: true },
    batchId:           { type: String, required: true, unique: true },
    runBy:             { type: String, required: true },
    actorType:         { type: String, enum: ['HUMAN', 'SYSTEM'], default: 'HUMAN' },
    dateRange:         { from: { type: Date }, to: { type: Date } },
    totalTransactions: { type: Number, default: 0 },
    matched:           { type: Number, default: 0 },
    mismatched:        { type: Number, default: 0 },
    missingInternal:   { type: Number, default: 0 },
    missingRazorpay:   { type: Number, default: 0 },
    unresolved:        { type: Number, default: 0 },
    totalDifference:   { type: Number, default: 0 },
    items:             [ReconciliationItemSchema],
    status:            { type: String, enum: ['running', 'completed', 'failed'], default: 'running' },
    completedAt:       { type: Date },
  },
  { timestamps: true }
);

export const ReconciliationRun = mongoose.model<IReconciliationRun>(
  'ReconciliationRun',
  ReconciliationRunSchema
);

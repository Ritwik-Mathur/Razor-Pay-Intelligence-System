import mongoose, { Schema, Document } from 'mongoose';

export interface IRecovery extends Document {
  merchantId: string;
  paymentId: string;
  customerEmail: string;
  amount: number;
  failureReason: string;
  recoveryStatus: 'pending' | 'link_sent' | 'recovered' | 'abandoned';
  recoveryStrategy: string;
  attemptsCount: number;
  recoveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RecoverySchema: Schema = new Schema(
  {
    merchantId: { type: String, required: true, index: true },
    paymentId: { type: String, required: true },
    customerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    failureReason: { type: String, required: true },
    recoveryStatus: { type: String, enum: ['pending', 'link_sent', 'recovered', 'abandoned'], default: 'pending' },
    recoveryStrategy: { type: String, default: 'Automated Smart Nudge' },
    attemptsCount: { type: Number, default: 0 },
    recoveredAt: { type: Date },
  },
  { timestamps: true }
);

export const Recovery = mongoose.model<IRecovery>('Recovery', RecoverySchema);

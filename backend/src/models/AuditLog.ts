import mongoose, { Schema, Document } from 'mongoose';

export type ActorType = 'AI' | 'HUMAN' | 'SYSTEM';

export interface IAuditLog extends Document {
  merchantId: string;
  actorType: ActorType;
  actor: string;
  action: string;
  category: 'auth' | 'payment' | 'risk' | 'recovery' | 'system' | 'settings';
  transactionId?: string;
  details: string;
  reason?: string;
  result: 'SUCCESS' | 'FAILED';
  ipAddress: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    merchantId: { type: String, required: true, index: true },
    actorType: { type: String, enum: ['AI', 'HUMAN', 'SYSTEM'], default: 'HUMAN', required: true },
    actor: { type: String, required: true },
    action: { type: String, required: true },
    category: {
      type: String,
      enum: ['auth', 'payment', 'risk', 'recovery', 'system', 'settings'],
      default: 'payment',
      required: true,
    },
    transactionId: { type: String, index: true },
    details: { type: String, required: true },
    reason: { type: String },
    result: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
    ipAddress: { type: String, default: '127.0.0.1' },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

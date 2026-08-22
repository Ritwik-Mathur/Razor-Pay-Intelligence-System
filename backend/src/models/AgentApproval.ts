import mongoose, { Schema, Document } from 'mongoose';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface IAgentApproval extends Document {
  approvalId: string;
  taskId: string;
  agentId: string;
  agentName: string;
  actionType: 'PAYOUT' | 'REFUND' | 'BATCH_PAYOUT' | 'INTERNAL_HOLD' | 'RECOVERY_CAMPAIGN' | 'OTHER';
  amount: number;
  recipient?: string;
  reason: string;
  riskScore: number;
  policyTriggered: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  expiresAt: Date;
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AgentApprovalSchema = new Schema<IAgentApproval>(
  {
    approvalId: { type: String, required: true, unique: true, index: true },
    taskId: { type: String, required: true, index: true },
    agentId: { type: String, required: true, index: true },
    agentName: { type: String, required: true },
    actionType: {
      type: String,
      enum: ['PAYOUT', 'REFUND', 'BATCH_PAYOUT', 'INTERNAL_HOLD', 'RECOVERY_CAMPAIGN', 'OTHER'],
      required: true,
    },
    amount: { type: Number, default: 0 },
    recipient: { type: String },
    reason: { type: String, required: true },
    riskScore: { type: Number, default: 0 },
    policyTriggered: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'],
      default: 'PENDING',
    },
    reviewedBy: { type: String },
    reviewedAt: { type: Date },
    expiresAt: { type: Date, required: true },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AgentApproval = mongoose.model<IAgentApproval>('AgentApproval', AgentApprovalSchema);

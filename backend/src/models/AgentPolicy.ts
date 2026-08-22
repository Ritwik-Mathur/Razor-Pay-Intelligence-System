import mongoose, { Schema, Document } from 'mongoose';

export interface IAgentPolicy extends Document {
  policyId: string;
  merchantId: string;
  maxAutoPaymentAmount: number;     // e.g. ₹10,000
  maxAutoPayoutAmount: number;      // e.g. ₹5,000
  maxAutoRefundAmount: number;      // e.g. ₹2,000
  dailyPayoutLimit: number;         // e.g. ₹100,000
  dailyTransactionCountLimit: number;// e.g. 50
  allowedRecipients: string[];
  blockedRecipients: string[];
  requireApprovalAboveAmount: number; // e.g. ₹5,000
  allowHighRiskAutoExecute: boolean;  // Default: false
  allowOutsideBusinessHours: boolean; // Default: true
  businessHoursStart: string;         // e.g. "09:00"
  businessHoursEnd: string;           // e.g. "18:00"
  globalKillSwitchActive: boolean;    // "Pause All Agents"
  updatedAt: Date;
}

const AgentPolicySchema = new Schema<IAgentPolicy>(
  {
    policyId: { type: String, required: true, unique: true, index: true },
    merchantId: { type: String, required: true, unique: true, index: true },
    maxAutoPaymentAmount: { type: Number, default: 25000 },
    maxAutoPayoutAmount: { type: Number, default: 5000 },
    maxAutoRefundAmount: { type: Number, default: 2000 },
    dailyPayoutLimit: { type: Number, default: 100000 },
    dailyTransactionCountLimit: { type: Number, default: 50 },
    allowedRecipients: [{ type: String }],
    blockedRecipients: [{ type: String }],
    requireApprovalAboveAmount: { type: Number, default: 5000 },
    allowHighRiskAutoExecute: { type: Boolean, default: false },
    allowOutsideBusinessHours: { type: Boolean, default: true },
    businessHoursStart: { type: String, default: '09:00' },
    businessHoursEnd: { type: String, default: '18:00' },
    globalKillSwitchActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AgentPolicy = mongoose.model<IAgentPolicy>('AgentPolicy', AgentPolicySchema);

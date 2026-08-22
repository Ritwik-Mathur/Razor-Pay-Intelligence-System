import mongoose, { Schema, Document } from 'mongoose';

export interface IAgentAuditLog extends Document {
  auditId: string;
  taskId: string;
  agentId: string;
  agentName: string;
  userId: string;
  goal: string;
  toolCalled?: string;
  policyResult: 'ALLOWED' | 'REQUIRES_APPROVAL' | 'BLOCKED';
  approvalState: 'AUTO_EXECUTED' | 'HUMAN_APPROVED' | 'REJECTED' | 'NONE';
  executionState: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  resultDetails: string;
  moneyMoved?: number;
  moneyRecovered?: number;
  ipAddress?: string;
  isDemoData: boolean;
  createdAt: Date;
}

const AgentAuditLogSchema = new Schema<IAgentAuditLog>(
  {
    auditId: { type: String, required: true, unique: true, index: true },
    taskId: { type: String, required: true, index: true },
    agentId: { type: String, required: true, index: true },
    agentName: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    goal: { type: String, required: true },
    toolCalled: { type: String },
    policyResult: { type: String, enum: ['ALLOWED', 'REQUIRES_APPROVAL', 'BLOCKED'], required: true },
    approvalState: { type: String, enum: ['AUTO_EXECUTED', 'HUMAN_APPROVED', 'REJECTED', 'NONE'], required: true },
    executionState: { type: String, enum: ['SUCCESS', 'FAILED', 'SKIPPED'], required: true },
    resultDetails: { type: String, required: true },
    moneyMoved: { type: Number, default: 0 },
    moneyRecovered: { type: Number, default: 0 },
    ipAddress: { type: String, default: '127.0.0.1' },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AgentAuditLog = mongoose.model<IAgentAuditLog>('AgentAuditLog', AgentAuditLogSchema);

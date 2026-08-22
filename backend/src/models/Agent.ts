import mongoose, { Schema, Document } from 'mongoose';

export type AgentStatus = 'ONLINE' | 'OFFLINE' | 'WORKING' | 'NEEDS_APPROVAL' | 'BLOCKED' | 'PAUSED';
export type AutonomyLevel = 1 | 2 | 3 | 4; // 1: Advisory, 2: Assisted, 3: Controlled Autonomy, 4: Full Automation
export type AgentRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IAgent extends Document {
  agentId: string;
  name: string;
  codeName: string;
  description: string;
  purpose: string;
  iconName: string;
  status: AgentStatus;
  autonomyLevel: AutonomyLevel;
  riskLevel: AgentRiskLevel;
  capabilities: string[];
  allowedTools: string[];
  tasksCompletedTotal: number;
  tasksCompletedToday: number;
  successRate: number; // 0 - 100
  lastRunAt?: Date;
  isPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    agentId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    codeName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    purpose: { type: String, required: true },
    iconName: { type: String, default: 'Bot' },
    status: {
      type: String,
      enum: ['ONLINE', 'OFFLINE', 'WORKING', 'NEEDS_APPROVAL', 'BLOCKED', 'PAUSED'],
      default: 'ONLINE',
    },
    autonomyLevel: { type: Number, enum: [1, 2, 3, 4], default: 3 },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
    capabilities: [{ type: String }],
    allowedTools: [{ type: String }],
    tasksCompletedTotal: { type: Number, default: 0 },
    tasksCompletedToday: { type: Number, default: 0 },
    successRate: { type: Number, default: 100 },
    lastRunAt: { type: Date },
    isPaused: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Agent = mongoose.model<IAgent>('Agent', AgentSchema);

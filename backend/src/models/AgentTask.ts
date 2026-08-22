import mongoose, { Schema, Document } from 'mongoose';

export type TaskStatus =
  | 'DRAFT'
  | 'PLANNING'
  | 'WAITING_FOR_POLICY_CHECK'
  | 'WAITING_FOR_APPROVAL'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'BLOCKED';

export interface ITaskStep {
  stepIndex: number;
  name: string;
  toolName?: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'SKIPPED';
  output?: string;
  error?: string;
  timestamp: Date;
}

export interface IAgentTask extends Document {
  taskId: string;
  agentId: string;
  agentName: string;
  userId: string;
  goal: string;
  recipient?: string;
  amount?: number;
  referenceId?: string;
  status: TaskStatus;
  estimatedActions: string[];
  steps: ITaskStep[];
  approvalId?: string;
  resultSummary?: string;
  moneyMoved?: number;
  moneyRecovered?: number;
  idempotencyKey: string;
  isDemoData: boolean;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskStepSchema = new Schema({
  stepIndex: Number,
  name: String,
  toolName: String,
  status: { type: String, enum: ['PENDING', 'RUNNING', 'PASSED', 'FAILED', 'SKIPPED'], default: 'PENDING' },
  output: String,
  error: String,
  timestamp: { type: Date, default: Date.now },
});

const AgentTaskSchema = new Schema<IAgentTask>(
  {
    taskId: { type: String, required: true, unique: true, index: true },
    agentId: { type: String, required: true, index: true },
    agentName: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    goal: { type: String, required: true },
    recipient: { type: String },
    amount: { type: Number },
    referenceId: { type: String },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'PLANNING',
        'WAITING_FOR_POLICY_CHECK',
        'WAITING_FOR_APPROVAL',
        'EXECUTING',
        'VERIFYING',
        'COMPLETED',
        'FAILED',
        'CANCELLED',
        'BLOCKED',
      ],
      default: 'DRAFT',
    },
    estimatedActions: [{ type: String }],
    steps: [TaskStepSchema],
    approvalId: { type: String },
    resultSummary: { type: String },
    moneyMoved: { type: Number, default: 0 },
    moneyRecovered: { type: Number, default: 0 },
    idempotencyKey: { type: String, required: true, index: true },
    isDemoData: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const AgentTask = mongoose.model<IAgentTask>('AgentTask', AgentTaskSchema);

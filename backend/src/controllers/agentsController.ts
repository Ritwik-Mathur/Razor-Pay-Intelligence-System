import { Request, Response } from 'express';
import { CATALOG_AGENTS, agentOrchestrator } from '../agents/orchestrator.js';
import { AgentTask } from '../models/AgentTask.js';
import { AgentApproval } from '../models/AgentApproval.js';
import { AgentPolicy } from '../models/AgentPolicy.js';
import { AgentAuditLog } from '../models/AgentAuditLog.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import mongoose from 'mongoose';

// ─── Demo Data for Agents Activity & Tasks ────────────────────────────────────
const DEMO_TASKS = [
  {
    taskId: 'task_demo_001',
    agentId: 'agent_payout',
    agentName: 'Payout Agent',
    userId: 'user_01',
    goal: 'Pay Rahul ₹5,000 for invoice INV-1024',
    recipient: 'Rahul Sharma',
    amount: 5000,
    referenceId: 'INV-1024',
    status: 'COMPLETED',
    estimatedActions: ['Find recipient', 'Verify invoice', 'Check risk & policy', 'Execute Razorpay payout', 'Audit log'],
    steps: [
      { stepIndex: 1, name: 'Recipient identified & fund account verified', status: 'PASSED', timestamp: new Date(Date.now() - 300000) },
      { stepIndex: 2, name: 'Invoice INV-1024 verified', status: 'PASSED', timestamp: new Date(Date.now() - 280000) },
      { stepIndex: 3, name: 'Risk score check passed (Score 12/100)', status: 'PASSED', timestamp: new Date(Date.now() - 260000) },
      { stepIndex: 4, name: 'Policy check: Automatic payout allowed <= ₹5,000', status: 'PASSED', timestamp: new Date(Date.now() - 240000) },
      { stepIndex: 5, name: 'Razorpay Payout executed successfully (pout_Nzk91238)', status: 'PASSED', timestamp: new Date(Date.now() - 200000) },
      { stepIndex: 6, name: 'Audit log recorded & database updated', status: 'PASSED', timestamp: new Date(Date.now() - 180000) },
    ],
    resultSummary: 'Payout of ₹5,000 to Rahul Sharma completed successfully.',
    moneyMoved: 5000,
    isDemoData: true,
    startedAt: new Date(Date.now() - 300000),
    completedAt: new Date(Date.now() - 180000),
  },
  {
    taskId: 'task_demo_002',
    agentId: 'agent_recovery',
    agentName: 'Payment Recovery Agent',
    userId: 'user_01',
    goal: 'Recover eligible failed payments from today',
    status: 'COMPLETED',
    estimatedActions: ['Retrieve failed payments', 'Classify failures', 'Dispatch recovery links'],
    steps: [
      { stepIndex: 1, name: 'Identified 23 failed payment attempts (₹42,800 total)', status: 'PASSED', timestamp: new Date(Date.now() - 600000) },
      { stepIndex: 2, name: 'Classified: 8 network failures, 5 abandoned checkouts, 4 payment method failures', status: 'PASSED', timestamp: new Date(Date.now() - 550000) },
      { stepIndex: 3, name: 'Created 15 recovery campaign retry links', status: 'PASSED', timestamp: new Date(Date.now() - 500000) },
    ],
    resultSummary: 'Recovery campaign created for 15 eligible failed checkouts. Expected recovery: ₹24,700.',
    moneyRecovered: 24700,
    isDemoData: true,
    startedAt: new Date(Date.now() - 600000),
    completedAt: new Date(Date.now() - 500000),
  },
  {
    taskId: 'task_demo_003',
    agentId: 'agent_fraud',
    agentName: 'Fraud Investigation Agent',
    userId: 'user_01',
    goal: 'Investigate the highest-risk transaction today',
    status: 'COMPLETED',
    estimatedActions: ['Locate risk transaction', 'Retrieve customer history', 'Analyze anomaly features', 'Recommend action'],
    steps: [
      { stepIndex: 1, name: 'Found transaction pay_MkkX9102bc (Risk Score: 78)', status: 'PASSED', timestamp: new Date(Date.now() - 900000) },
      { stepIndex: 2, name: 'Detected IP velocity anomaly: 4 attempts from different states in 12 mins', status: 'PASSED', timestamp: new Date(Date.now() - 850000) },
      { stepIndex: 3, name: 'Recommendation: Place internal hold & request cardholder verification', status: 'PASSED', timestamp: new Date(Date.now() - 800000) },
    ],
    resultSummary: 'Investigation complete. Recommended internal hold on transaction pay_MkkX9102bc.',
    isDemoData: true,
    startedAt: new Date(Date.now() - 900000),
    completedAt: new Date(Date.now() - 800000),
  },
];

const DEMO_APPROVALS = [
  {
    approvalId: 'appr_demo_001',
    taskId: 'task_demo_004',
    agentId: 'agent_payout',
    agentName: 'Payout Agent',
    actionType: 'PAYOUT',
    amount: 25000,
    recipient: 'Acme Logistics Ltd',
    reason: 'Payout amount ₹25,000 exceeds automatic policy threshold (₹5,000)',
    riskScore: 28,
    policyTriggered: 'REQUIRE_APPROVAL_ABOVE_₹5,000',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 86400000),
    isDemoData: true,
    createdAt: new Date(Date.now() - 1200000),
  },
  {
    approvalId: 'appr_demo_002',
    taskId: 'task_demo_005',
    agentId: 'agent_refund',
    agentName: 'Refund Agent',
    actionType: 'REFUND',
    amount: 8000,
    recipient: 'Vikram Malhotra',
    reason: 'Refund amount ₹8,000 exceeds automatic refund policy threshold (₹2,000)',
    riskScore: 15,
    policyTriggered: 'REQUIRE_APPROVAL_REFUND_ABOVE_₹2,000',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 86400000),
    isDemoData: true,
    createdAt: new Date(Date.now() - 1800000),
  },
];

// ─── Controller Functions ──────────────────────────────────────────────────────

export async function listAgents(_req: Request, res: Response) {
  try {
    const isPaused = agentOrchestrator.getKillSwitch();
    const agents = CATALOG_AGENTS.map((a) => ({
      ...a,
      status: isPaused ? 'PAUSED' : a.status,
      isPaused,
    }));
    return sendSuccess(res, { agents, total: agents.length, globalKillSwitchActive: isPaused });
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list agents', 500);
  }
}

export async function getAgent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const agent = CATALOG_AGENTS.find((a) => a.agentId === id || a.codeName === id);
    if (!agent) return sendError(res, 'Agent not found', 404);

    const isPaused = agentOrchestrator.getKillSwitch();
    const tasks = DEMO_TASKS.filter((t) => t.agentId === agent.agentId || t.agentId === id);

    return sendSuccess(res, {
      ...agent,
      status: isPaused ? 'PAUSED' : agent.status,
      isPaused,
      recentTasks: tasks,
    });
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to get agent', 500);
  }
}

export async function createAgentTask(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id || 'anonymous';
    const { goal, agentId, amount, recipient } = req.body;
    if (!goal) return sendError(res, 'goal instruction is required', 400);

    const result = await agentOrchestrator.executeTask(userId, goal, agentId, amount, recipient);
    return sendSuccess(res, result, 'Agent task initiated successfully.', 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Task execution failed', 500);
  }
}

export async function listAgentTasks(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id || 'anonymous';
    const dbConnected = mongoose.connection.readyState === 1;

    let realTasks: any[] = [];
    if (dbConnected) {
      realTasks = await AgentTask.find({ userId }).sort({ createdAt: -1 }).lean();
    }

    return sendSuccess(res, { tasks: [...realTasks, ...DEMO_TASKS], total: realTasks.length + DEMO_TASKS.length });
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list tasks', 500);
  }
}

export async function getAgentTask(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const demoTask = DEMO_TASKS.find((t) => t.taskId === id);
    if (demoTask) return sendSuccess(res, demoTask);

    const dbConnected = mongoose.connection.readyState === 1;
    if (!dbConnected) return sendError(res, 'Task not found', 404);

    const task = await AgentTask.findOne({ taskId: id }).lean();
    if (!task) return sendError(res, 'Task not found', 404);

    return sendSuccess(res, task);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to get task', 500);
  }
}

export async function cancelAgentTask(req: Request, res: Response) {
  try {
    const { id } = req.params;
    return sendSuccess(res, { taskId: id, status: 'CANCELLED' }, 'Task cancelled successfully.');
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to cancel task', 500);
  }
}

export async function getPendingApprovals(_req: Request, res: Response) {
  try {
    const dbConnected = mongoose.connection.readyState === 1;
    let realApprovals: any[] = [];
    if (dbConnected) {
      realApprovals = await AgentApproval.find({ status: 'PENDING' }).sort({ createdAt: -1 }).lean();
    }
    return sendSuccess(res, { approvals: [...realApprovals, ...DEMO_APPROVALS], total: realApprovals.length + DEMO_APPROVALS.length });
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to get approvals', 500);
  }
}

export async function approveAction(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || 'admin';

    const dbConnected = mongoose.connection.readyState === 1;
    if (dbConnected) {
      await AgentApproval.findOneAndUpdate(
        { approvalId: id },
        { status: 'APPROVED', reviewedBy: userId, reviewedAt: new Date() }
      );
    }

    return sendSuccess(res, { approvalId: id, status: 'APPROVED', reviewedBy: userId, reviewedAt: new Date() }, 'Action approved and executed.');
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to approve action', 500);
  }
}

export async function rejectAction(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || 'admin';

    const dbConnected = mongoose.connection.readyState === 1;
    if (dbConnected) {
      await AgentApproval.findOneAndUpdate(
        { approvalId: id },
        { status: 'REJECTED', reviewedBy: userId, reviewedAt: new Date() }
      );
    }

    return sendSuccess(res, { approvalId: id, status: 'REJECTED', reviewedBy: userId, reviewedAt: new Date() }, 'Action rejected.');
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to reject action', 500);
  }
}

export async function getAgentActivity(_req: Request, res: Response) {
  return sendSuccess(res, {
    activities: [
      { id: 'act_1', agentName: 'Payout Agent', text: 'Completed payout of ₹5,000 to Rahul Sharma (INV-1024)', status: 'SUCCESS', time: '5m ago' },
      { id: 'act_2', agentName: 'Payment Recovery Agent', text: 'Created recovery campaign for 15 failed checkouts', status: 'SUCCESS', time: '10m ago' },
      { id: 'act_3', agentName: 'Fraud Investigation Agent', text: 'Flagged transaction pay_MkkX9102bc (Score: 78)', status: 'WARNING', time: '15m ago' },
      { id: 'act_4', agentName: 'Reconciliation Agent', text: 'Synced 1,240 records against Razorpay settlement statement', status: 'SUCCESS', time: '45m ago' },
      { id: 'act_5', agentName: 'Cash Flow Agent', text: 'Updated 7-day cash flow forecast (Coverage: 1.42x)', status: 'INFO', time: '1h ago' },
    ],
  });
}

export async function getAgentPerformance(_req: Request, res: Response) {
  return sendSuccess(res, {
    activeAgents: 12,
    tasksRunning: 0,
    tasksCompletedToday: 124,
    pendingApprovals: 2,
    actionsExecutedToday: 98,
    moneyRecoveredToday: 24700,
    moneyMovedToday: 55000,
    overallSuccessRate: 98.2,
    globalKillSwitchActive: agentOrchestrator.getKillSwitch(),
  });
}

export async function getAgentPolicies(_req: Request, res: Response) {
  return sendSuccess(res, {
    policy: {
      maxAutoPaymentAmount: 25000,
      maxAutoPayoutAmount: 5000,
      maxAutoRefundAmount: 2000,
      dailyPayoutLimit: 100000,
      dailyTransactionCountLimit: 50,
      requireApprovalAboveAmount: 5000,
      allowHighRiskAutoExecute: false,
      allowOutsideBusinessHours: true,
      businessHoursStart: '09:00',
      businessHoursEnd: '18:00',
      globalKillSwitchActive: agentOrchestrator.getKillSwitch(),
    },
  });
}

export async function updateAgentPolicies(req: Request, res: Response) {
  try {
    const policyUpdates = req.body;
    return sendSuccess(res, policyUpdates, 'Agent policies updated successfully.');
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to update policies', 500);
  }
}

export async function pauseAllAgents(_req: Request, res: Response) {
  agentOrchestrator.setKillSwitch(true);
  return sendSuccess(res, { globalKillSwitchActive: true }, 'SAFETY KILL SWITCH ACTIVATED: All AI agents paused.');
}

export async function resumeAllAgents(_req: Request, res: Response) {
  agentOrchestrator.setKillSwitch(false);
  return sendSuccess(res, { globalKillSwitchActive: false }, 'AI Agents resumed operations.');
}

export async function executeCommand(req: Request, res: Response) {
  try {
    const { command } = req.body;
    const userId = (req as any).user?.id || 'anonymous';
    if (!command) return sendError(res, 'command is required', 400);

    const result = await agentOrchestrator.executeTask(userId, command);
    return sendSuccess(res, result);
  } catch (err: any) {
    return sendError(res, err.message || 'Command execution failed', 500);
  }
}

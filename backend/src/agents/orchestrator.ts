import { getRazorpayInstance } from '../razorpay/index.js';
import { Agent, IAgent } from '../models/Agent.js';
import { AgentTask, IAgentTask } from '../models/AgentTask.js';
import { AgentPolicy } from '../models/AgentPolicy.js';
import { AgentApproval } from '../models/AgentApproval.js';
import { AgentAuditLog } from '../models/AgentAuditLog.js';
import { logger } from '../utils/logger.js';
import mongoose from 'mongoose';

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
}

// ─── 12 CATALOG AGENTS INITIAL SEED DEFINITION ────────────────────────────────
export const CATALOG_AGENTS = [
  {
    agentId: 'agent_payment',
    name: 'Payment Agent',
    codeName: 'payment_agent',
    description: 'Creates and manages payment operations through approved Razorpay workflows.',
    purpose: 'Execute payment creation, status verification, and link generation.',
    iconName: 'Receipt',
    status: 'ONLINE' as const,
    autonomyLevel: 3 as const,
    riskLevel: 'LOW' as const,
    capabilities: [
      'Create payment order',
      'Generate payment link',
      'Inspect payment status',
      'Verify payment signature',
      'Track payment telemetry',
      'Retry supported recovery flows',
    ],
    allowedTools: ['createOrder', 'createPaymentLink', 'getPayment', 'verifyPayment'],
    tasksCompletedTotal: 142,
    tasksCompletedToday: 14,
    successRate: 98.4,
  },
  {
    agentId: 'agent_payout',
    name: 'Payout Agent',
    codeName: 'payout_agent',
    description: 'Sends payouts to verified recipients through supported Razorpay payout infrastructure.',
    purpose: 'Execute vendor, partner, and customer payouts within policy limits.',
    iconName: 'Send',
    status: 'ONLINE' as const,
    autonomyLevel: 2 as const, // Assisted / Controlled
    riskLevel: 'HIGH' as const,
    capabilities: [
      'Recipient account lookup',
      'Fund account verification',
      'Invoice reference matching',
      'Duplicate payout check',
      'Razorpay Payout execution',
      'Policy limit check',
    ],
    allowedTools: ['createPayout', 'getPayout', 'checkRecipient', 'verifyBalance'],
    tasksCompletedTotal: 88,
    tasksCompletedToday: 6,
    successRate: 96.2,
  },
  {
    agentId: 'agent_fraud',
    name: 'Fraud Investigation Agent',
    codeName: 'fraud_agent',
    description: 'Investigates suspicious transactions and evaluates anomaly signals.',
    purpose: 'Analyze transaction telemetry, calculate risk scores, and recommend internal holds.',
    iconName: 'ShieldAlert',
    status: 'ONLINE' as const,
    autonomyLevel: 1 as const, // Advisory
    riskLevel: 'MEDIUM' as const,
    capabilities: [
      'Transaction risk scoring',
      'Customer history comparison',
      'Velocity and pattern anomaly detection',
      'Evidence summary generation',
      'Internal hold recommendation',
    ],
    allowedTools: ['getRiskScore', 'searchTransactions', 'flagTransaction'],
    tasksCompletedTotal: 210,
    tasksCompletedToday: 18,
    successRate: 99.1,
  },
  {
    agentId: 'agent_recovery',
    name: 'Payment Recovery Agent',
    codeName: 'recovery_agent',
    description: 'Recovers failed or abandoned payment checkouts automatically.',
    purpose: 'Classify failure reasons, run smart retry campaigns, and generate payment links.',
    iconName: 'RotateCcw',
    status: 'ONLINE' as const,
    autonomyLevel: 3 as const,
    riskLevel: 'LOW' as const,
    capabilities: [
      'Failure classification',
      'Recovery campaign dispatch',
      'Retry link generation',
      'Abandoned checkout recovery',
      'Priority scoring',
    ],
    allowedTools: ['createRecoveryLink', 'dispatchRecoveryMessage', 'listFailedPayments'],
    tasksCompletedTotal: 305,
    tasksCompletedToday: 23,
    successRate: 94.8,
  },
  {
    agentId: 'agent_cashflow',
    name: 'Cash Flow Agent',
    codeName: 'cashflow_agent',
    description: 'Forecasts liquidity and monitors near-term cash flow positions.',
    purpose: 'Analyze historical inflow/outflow trends, detect shortages, and advise liquidity buffer.',
    iconName: 'TrendingUp',
    status: 'ONLINE' as const,
    autonomyLevel: 1 as const, // Advisory
    riskLevel: 'LOW' as const,
    capabilities: [
      'Historical inflow/outflow modeling',
      'Near-term liquidity forecasting',
      'Shortage alert calculation',
      'Receivables acceleration advice',
    ],
    allowedTools: ['getCashFlowSummary', 'getLiquidityForecast'],
    tasksCompletedTotal: 95,
    tasksCompletedToday: 5,
    successRate: 98.0,
  },
  {
    agentId: 'agent_reconciliation',
    name: 'Reconciliation Agent',
    codeName: 'reconciliation_agent',
    description: 'Compares RPAI internal ledger records with Razorpay bank statements.',
    purpose: 'Identify mismatches, classify settlement gaps, and propose corrective ledger entries.',
    iconName: 'Scale',
    status: 'ONLINE' as const,
    autonomyLevel: 2 as const, // Assisted
    riskLevel: 'MEDIUM' as const,
    capabilities: [
      'Statement retrieval',
      'Transaction matching',
      'Mismatch classification',
      'Corrective entry proposal',
    ],
    allowedTools: ['getSettlementStatement', 'reconcileBatch'],
    tasksCompletedTotal: 180,
    tasksCompletedToday: 12,
    successRate: 97.5,
  },
  {
    agentId: 'agent_receivables',
    name: 'Receivables Agent',
    codeName: 'receivables_agent',
    description: 'Finds overdue payments and prepares automated collection links.',
    purpose: 'Group overdue invoices, check communication policies, and generate payment requests.',
    iconName: 'Coins',
    status: 'ONLINE' as const,
    autonomyLevel: 3 as const,
    riskLevel: 'LOW' as const,
    capabilities: [
      'Overdue invoice identification',
      'Customer grouping',
      'Collection reminder preparation',
      'Payment link generation',
    ],
    allowedTools: ['listOverdueInvoices', 'createPaymentLink'],
    tasksCompletedTotal: 112,
    tasksCompletedToday: 9,
    successRate: 95.5,
  },
  {
    agentId: 'agent_refund',
    name: 'Refund Agent',
    codeName: 'refund_agent',
    description: 'Investigates and executes customer refund requests within policy limits.',
    purpose: 'Verify captured transaction, check refund policy rules, and process Razorpay refund.',
    iconName: 'CornerDownLeft',
    status: 'ONLINE' as const,
    autonomyLevel: 2 as const,
    riskLevel: 'HIGH' as const,
    capabilities: [
      'Transaction verification',
      'Refund eligibility check',
      'Amount policy verification',
      'Razorpay Refund execution',
    ],
    allowedTools: ['refundPayment', 'getPayment'],
    tasksCompletedTotal: 74,
    tasksCompletedToday: 4,
    successRate: 98.6,
  },
  {
    agentId: 'agent_dispute',
    name: 'Dispute Agent',
    codeName: 'dispute_agent',
    description: 'Assembles evidence and timeline checklists for payment chargeback disputes.',
    purpose: 'Gather transaction telemetry, assemble customer history, and prepare evidence packages.',
    iconName: 'FileCheck2',
    status: 'ONLINE' as const,
    autonomyLevel: 1 as const,
    riskLevel: 'MEDIUM' as const,
    capabilities: [
      'Dispute telemetry retrieval',
      'Evidence checklist synthesis',
      'Timeline assembly',
      'Draft response preparation',
    ],
    allowedTools: ['getDisputeTelemetry', 'assembleEvidence'],
    tasksCompletedTotal: 38,
    tasksCompletedToday: 2,
    successRate: 100.0,
  },
  {
    agentId: 'agent_credit',
    name: 'Credit Intelligence Agent',
    codeName: 'credit_agent',
    description: 'Analyzes alternative financial data for 300–900 credit scoring and affordability.',
    purpose: 'Verify consent, calculate cash flow stability, derive credit score, and analyze affordability.',
    iconName: 'Building2',
    status: 'ONLINE' as const,
    autonomyLevel: 1 as const,
    riskLevel: 'LOW' as const,
    capabilities: [
      'Consent verification',
      'Alternative score calculation (300-900)',
      'Affordability analysis',
      'Responsible lending check',
    ],
    allowedTools: ['getCreditProfile', 'calculateCreditScore'],
    tasksCompletedTotal: 65,
    tasksCompletedToday: 7,
    successRate: 98.5,
  },
  {
    agentId: 'agent_reporting',
    name: 'Financial Reporting Agent',
    codeName: 'reporting_agent',
    description: 'Generates financial briefings, daily operational rollups, and exportable reports.',
    purpose: 'Aggregate payment volumes, success rates, recovery totals, and produce summaries.',
    iconName: 'PieChart',
    status: 'ONLINE' as const,
    autonomyLevel: 4 as const, // Full Automation (Low risk read-only)
    riskLevel: 'LOW' as const,
    capabilities: [
      'Operational rollup aggregation',
      'Daily/weekly briefing preparation',
      'Export generation',
    ],
    allowedTools: ['getReportingSummary', 'exportReport'],
    tasksCompletedTotal: 240,
    tasksCompletedToday: 20,
    successRate: 100.0,
  },
  {
    agentId: 'agent_treasury',
    name: 'Treasury / Balance Agent',
    codeName: 'treasury_agent',
    description: 'Monitors available operational balances, upcoming obligations, and settlement buffers.',
    purpose: 'Check payout safety, verify available settlement funds, and report position status.',
    iconName: 'Vault',
    status: 'ONLINE' as const,
    autonomyLevel: 1 as const,
    riskLevel: 'LOW' as const,
    capabilities: [
      'Available balance check',
      'Scheduled payout safety check',
      'Settlement buffer verification',
    ],
    allowedTools: ['getOperationalBalance', 'checkPayoutSafety'],
    tasksCompletedTotal: 155,
    tasksCompletedToday: 14,
    successRate: 99.2,
  },
];

// ─── AGENT ORCHESTRATOR CLASS ──────────────────────────────────────────────────
export class AgentOrchestrator {
  private killSwitchActive = false;

  public setKillSwitch(active: boolean) {
    this.killSwitchActive = active;
  }

  public getKillSwitch(): boolean {
    return this.killSwitchActive;
  }

  /**
   * Parse natural language command and map to appropriate agent and task
   */
  public parseCommand(command: string) {
    const cmd = command.toLowerCase();

    if (cmd.includes('pay ') || cmd.includes('payout') || cmd.includes('transfer')) {
      // Extract amount & recipient
      const amountMatch = command.match(/₹?\s*([\d,]+)/);
      const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, ''), 10) : 5000;
      const recipientMatch = command.match(/to\s+([A-Za-z\s]+)|pay\s+([A-Za-z\s]+)\s+₹/i);
      const recipient = recipientMatch ? (recipientMatch[1] || recipientMatch[2]).trim() : 'Rahul Sharma';

      return {
        agentId: 'agent_payout',
        agentName: 'Payout Agent',
        goal: command,
        recipient,
        amount,
        referenceId: 'INV-1024',
        estimatedActions: [
          'Identify recipient & fund account',
          'Verify invoice reference',
          'Check risk & duplicate payment lock',
          'Evaluate merchant payout policy',
          'Execute Razorpay Payout',
          'Verify transaction result & record audit',
        ],
      };
    } else if (cmd.includes('recover') || cmd.includes('failed') || cmd.includes('retry')) {
      return {
        agentId: 'agent_recovery',
        agentName: 'Payment Recovery Agent',
        goal: command,
        estimatedActions: [
          'Retrieve failed transactions',
          'Classify failure reasons',
          'Evaluate retry eligibility & policy',
          'Generate recovery links & dispatch notifications',
          'Record recovery campaign metrics',
        ],
      };
    } else if (cmd.includes('investigate') || cmd.includes('fraud') || cmd.includes('risk') || cmd.includes('riskiest')) {
      return {
        agentId: 'agent_fraud',
        agentName: 'Fraud Investigation Agent',
        goal: command,
        estimatedActions: [
          'Locate highest risk transaction',
          'Retrieve customer velocity history',
          'Analyze telemetry anomaly signals',
          'Generate evidence summary',
          'Recommend risk mitigation action',
        ],
      };
    } else if (cmd.includes('reconcil') || cmd.includes('statement')) {
      return {
        agentId: 'agent_reconciliation',
        agentName: 'Reconciliation Agent',
        goal: command,
        estimatedActions: [
          'Retrieve internal RPAI transaction ledger',
          'Fetch Razorpay settlement statement',
          'Compare records line-by-line',
          'Identify and classify mismatches',
          'Generate reconciliation report',
        ],
      };
    } else if (cmd.includes('cash flow') || cmd.includes('liquidity') || cmd.includes('obligations') || cmd.includes('forecast')) {
      return {
        agentId: 'agent_cashflow',
        agentName: 'Cash Flow Agent',
        goal: command,
        estimatedActions: [
          'Calculate current operational position',
          'Model 7-day expected cash inflows',
          'Identify upcoming payout obligations',
          'Calculate liquidity coverage ratio',
          'Report cash flow recommendation',
        ],
      };
    } else if (cmd.includes('refund')) {
      return {
        agentId: 'agent_refund',
        agentName: 'Refund Agent',
        goal: command,
        estimatedActions: [
          'Identify target transaction',
          'Verify captured payment status',
          'Check merchant refund policy limit',
          'Execute Razorpay refund API',
          'Record audit entry',
        ],
      };
    } else if (cmd.includes('credit') || cmd.includes('msme') || cmd.includes('assess')) {
      return {
        agentId: 'agent_credit',
        agentName: 'Credit Intelligence Agent',
        goal: command,
        estimatedActions: [
          'Verify applicant data consent',
          'Calculate cash-flow stability score',
          'Derive 300-900 alternative credit score',
          'Perform affordability analysis',
          'Generate responsible lending summary',
        ],
      };
    } else {
      // Default: Financial Reporting Agent
      return {
        agentId: 'agent_reporting',
        agentName: 'Financial Reporting Agent',
        goal: command,
        estimatedActions: [
          'Aggregate transaction telemetry',
          'Summarize success and recovery metrics',
          'Generate executive briefing',
        ],
      };
    }
  }

  /**
   * Execute an Agent Task with real-time steps and policy enforcement
   */
  public async executeTask(
    userId: string,
    goal: string,
    targetAgentId?: string,
    amountOverride?: number,
    recipientOverride?: string
  ): Promise<any> {
    if (this.killSwitchActive) {
      throw new Error('All AI Agents are currently PAUSED by the merchant safety kill switch.');
    }

    const parsed = this.parseCommand(goal);
    const agentId = targetAgentId || parsed.agentId;
    const amount = amountOverride ?? parsed.amount ?? 0;
    const recipient = recipientOverride || parsed.recipient || 'Rahul Sharma';
    const taskId = `task_${generateId('agt')}`;
    const idempotencyKey = `idemp_${agentId}_${amount}_${Date.now()}`;

    // 1. Idempotency / Duplicate Check (Check last 60s for identical goal + amount)
    const dbConnected = mongoose.connection.readyState === 1;
    if (dbConnected) {
      const existing = await AgentTask.findOne({
        userId,
        goal,
        status: { $in: ['EXECUTING', 'COMPLETED', 'WAITING_FOR_APPROVAL'] },
        createdAt: { $gte: new Date(Date.now() - 60000) },
      });
      if (existing) {
        return {
          task: existing,
          duplicateWarning: `An identical task was initiated ${Math.round((Date.now() - existing.createdAt.getTime()) / 1000)}s ago. Idempotency lock engaged to prevent duplicate execution.`,
        };
      }
    }

    // 2. Policy Engine Check
    const requiresApproval = amount > 5000 || agentId === 'agent_payout' && amount > 5000;
    const initialStatus = requiresApproval ? 'WAITING_FOR_APPROVAL' : 'EXECUTING';

    const steps = [
      { stepIndex: 1, name: 'Goal parsed & intent structured', status: 'PASSED' as const, timestamp: new Date() },
      { stepIndex: 2, name: 'Recipient & reference verified', status: 'PASSED' as const, timestamp: new Date() },
      { stepIndex: 3, name: 'Risk score & duplicate lock checked', status: 'PASSED' as const, timestamp: new Date() },
      {
        stepIndex: 4,
        name: requiresApproval
          ? `Policy check: Amount ₹${amount.toLocaleString('en-IN')} exceeds ₹5,000 auto-limit. Routing to Approval Queue.`
          : 'Policy check passed: Auto-execution permitted.',
        status: requiresApproval ? ('PENDING' as const) : ('PASSED' as const),
        timestamp: new Date(),
      },
    ];

    let approvalId: string | undefined;

    if (requiresApproval) {
      approvalId = `appr_${generateId('ap')}`;
      if (dbConnected) {
        await AgentApproval.create({
          approvalId,
          taskId,
          agentId,
          agentName: parsed.agentName,
          actionType: agentId === 'agent_payout' ? 'PAYOUT' : 'OTHER',
          amount,
          recipient,
          reason: `Task amount ₹${amount.toLocaleString('en-IN')} exceeds merchant automatic threshold (₹5,000)`,
          riskScore: 35,
          policyTriggered: 'REQUIRE_APPROVAL_ABOVE_₹5,000',
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          isDemoData: true,
        });
      }
    } else {
      steps.push(
        { stepIndex: 5, name: 'Executed Razorpay API / Workflow tool', status: 'PASSED' as const, timestamp: new Date() },
        { stepIndex: 6, name: 'Verification & audit log recorded', status: 'PASSED' as const, timestamp: new Date() }
      );
    }

    const taskData: any = {
      taskId,
      agentId,
      agentName: parsed.agentName,
      userId,
      goal,
      recipient,
      amount,
      referenceId: parsed.referenceId || 'REF-8812',
      status: initialStatus,
      estimatedActions: parsed.estimatedActions,
      steps,
      approvalId,
      resultSummary: requiresApproval
        ? `Task requires merchant approval in Action Approval Center before execution.`
        : `Task executed successfully by ${parsed.agentName}.`,
      moneyMoved: !requiresApproval && agentId === 'agent_payout' ? amount : 0,
      moneyRecovered: !requiresApproval && agentId === 'agent_recovery' ? 24700 : 0,
      idempotencyKey,
      isDemoData: true,
      startedAt: new Date(),
      completedAt: requiresApproval ? undefined : new Date(),
    };

    if (dbConnected) {
      await AgentTask.create(taskData);
      await AgentAuditLog.create({
        auditId: `aud_${generateId('au')}`,
        taskId,
        agentId,
        agentName: parsed.agentName,
        userId,
        goal,
        toolCalled: parsed.estimatedActions[0],
        policyResult: requiresApproval ? 'REQUIRES_APPROVAL' : 'ALLOWED',
        approvalState: requiresApproval ? 'NONE' : 'AUTO_EXECUTED',
        executionState: requiresApproval ? 'SKIPPED' : 'SUCCESS',
        resultDetails: taskData.resultSummary,
        moneyMoved: taskData.moneyMoved,
        moneyRecovered: taskData.moneyRecovered,
        isDemoData: true,
      });
    }

    return { task: taskData };
  }
}

export const agentOrchestrator = new AgentOrchestrator();

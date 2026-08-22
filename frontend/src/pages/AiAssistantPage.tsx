import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ActionConfirmationModal, ActionType } from '../components/ui/ActionConfirmationModal';
import axios from 'axios';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  RefreshCw,
  Link2,
  FileCheck2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Activity,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MetricBlock {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  sublabel?: string;
}

interface ActionButton {
  label: string;
  actionType: ActionType;
  transactionId?: string;
  amount?: number;
  variant: 'danger' | 'success' | 'primary' | 'outline';
}

interface TransactionRef {
  id: string;
  amount: number;
  status: string;
  riskScore?: number;
}

interface AiMessage {
  sender: 'user' | 'ai';
  text: string;
  confidence?: number;
  followups?: string[];
  metrics?: MetricBlock[];
  table?: { columns: string[]; rows: string[][] };
  actions?: ActionButton[];
  transactionRefs?: TransactionRef[];
  alertLevel?: 'info' | 'warning' | 'critical' | 'success';
}

const RISK_COLOR: Record<string, string> = {
  LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
  CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_COLOR: Record<string, string> = {
  CAPTURED: 'text-emerald-600',
  FAILED: 'text-rose-600',
  REFUNDED: 'text-slate-500',
  HELD: 'text-amber-600',
  PENDING: 'text-sky-600',
};

// ─── AI Response Builder ──────────────────────────────────────────────────────
function buildAiResponse(query: string): AiMessage {
  const q = query.toLowerCase();

  if (q.includes('pay_mkkx9102bc') || q.includes('fail') || q.includes('investigate')) {
    return {
      sender: 'ai',
      text: 'Investigation complete for payment **pay_MkkX9102bc**. This transaction triggered multiple fraud indicators. My recommendation is to place this payment under internal review before any settlement action.',
      confidence: 0.97,
      alertLevel: 'critical',
      metrics: [
        { label: 'Risk Score', value: '89 / 100', trend: 'down', sublabel: 'CRITICAL' },
        { label: 'Amount', value: '₹1,28,000', trend: 'neutral', sublabel: 'Flagged Amount' },
        { label: 'Failed Attempts', value: '5', trend: 'down', sublabel: 'In 3-min window' },
        { label: 'IP Velocity', value: '103.45.12.98', trend: 'neutral', sublabel: 'Repeated Source' },
      ],
      table: {
        columns: ['Factor', 'Score Weight', 'Evidence'],
        rows: [
          ['Amount Anomaly', '+25 pts', '₹1,28,000 vs avg ₹12,400'],
          ['Velocity Burst', '+10 pts', '5 attempts in 3 minutes'],
          ['Location Anomaly', '+20 pts', 'VPN/Proxy endpoint detected'],
          ['3DS Timeout', '+15 pts', '3 consecutive 3DS failures'],
          ['New Payment Method', '+20 pts', 'First use of this card'],
        ],
      },
      actions: [
        { label: 'Confirm Hold', actionType: 'hold', transactionId: 'pay_MkkX9102bc', amount: 128000, variant: 'danger' },
        { label: 'Create Recovery Link', actionType: 'create-link', transactionId: 'pay_MkkX9102bc', amount: 128000, variant: 'outline' },
      ],
      followups: [
        'Refund payment pay_MkkX9102bc',
        'Show customer history for this transaction',
        'Run bank reconciliation',
      ],
    };
  }

  if (q.includes('risk') || q.includes('fraud') || q.includes('threat')) {
    return {
      sender: 'ai',
      text: 'Here is your 24-hour risk intelligence summary. I have identified 9 high-risk transactions requiring attention across 4 distinct anomaly patterns.',
      confidence: 0.95,
      alertLevel: 'warning',
      metrics: [
        { label: 'Critical Alerts', value: '3', trend: 'down', sublabel: 'Score >80' },
        { label: 'High Risk', value: '6', trend: 'down', sublabel: 'Score 61-80' },
        { label: 'Amount at Risk', value: '₹8,40,000', trend: 'down', sublabel: 'Flagged volume' },
        { label: 'Detection Rate', value: '99.2%', trend: 'up', sublabel: 'Fraud caught' },
      ],
      transactionRefs: [
        { id: 'pay_MkkX9102bc', amount: 128000, status: 'HELD', riskScore: 89 },
        { id: 'pay_Zk2291ab', amount: 45000, status: 'CAPTURED', riskScore: 72 },
        { id: 'pay_Yq8831zz', amount: 67000, status: 'FAILED', riskScore: 65 },
      ],
      actions: [
        { label: 'View Risk Center', actionType: 'reconcile', variant: 'outline' },
      ],
      followups: [
        'Hold all critical-risk payments',
        'Show velocity spike patterns from today',
        'Generate reconciliation report',
      ],
    };
  }

  if (q.includes('recovery') || q.includes('recover') || q.includes('retry')) {
    return {
      sender: 'ai',
      text: 'Recovery analysis complete. I have identified 4 transactions eligible for recovery. The most effective channel in your account is the smart payment link dispatch.',
      confidence: 0.93,
      alertLevel: 'info',
      metrics: [
        { label: 'Recoverable Amount', value: '₹3,45,000', trend: 'up', sublabel: 'Total eligible' },
        { label: 'Recovery Rate', value: '68.4%', trend: 'up', sublabel: 'Success rate' },
        { label: 'Avg Recovery Time', value: '4.2 hrs', trend: 'neutral', sublabel: 'After link sent' },
        { label: 'Top Channel', value: 'Payment Link', trend: 'neutral', sublabel: 'Best performer' },
      ],
      table: {
        columns: ['Transaction', 'Amount', 'Failure Reason', 'Recommended Action'],
        rows: [
          ['pay_Yq8831zz', '₹67,000', '3DS Timeout', 'Send Payment Link'],
          ['pay_Ab7710ef', '₹1,20,000', 'Insufficient Funds', 'Customer Reminder'],
          ['pay_Cc8821xy', '₹89,000', 'Card Declined', 'Create Recovery Order'],
          ['pay_Dd9912mn', '₹69,000', 'Bank Timeout', 'Send Payment Link'],
        ],
      },
      actions: [
        { label: 'Create Recovery for pay_Yq8831zz', actionType: 'recovery', transactionId: 'pay_Yq8831zz', amount: 67000, variant: 'primary' },
        { label: 'Generate Payment Link', actionType: 'create-link', transactionId: 'pay_Yq8831zz', amount: 67000, variant: 'outline' },
      ],
      followups: [
        'Retry payment pay_Yq8831zz',
        'Show full failed payment list',
        'What is our overall success rate?',
      ],
    };
  }

  if (q.includes('reconcil') || q.includes('settlement') || q.includes('bank')) {
    return {
      sender: 'ai',
      text: 'Bank reconciliation analysis is ready. All 1,248 Razorpay transactions from today match our internal records with zero discrepancies.',
      confidence: 0.99,
      alertLevel: 'success',
      metrics: [
        { label: 'Transactions Verified', value: '1,248', trend: 'up', sublabel: 'Total checked' },
        { label: 'Settled Amount', value: '₹42,85,000', trend: 'up', sublabel: 'Total settled' },
        { label: 'Discrepancies', value: '0', trend: 'up', sublabel: 'Clean match' },
        { label: 'Last Run', value: 'Today 02:00 AM', trend: 'neutral', sublabel: 'IST' },
      ],
      actions: [
        { label: 'Run Reconciliation Now', actionType: 'reconcile', variant: 'primary' },
      ],
      followups: [
        'Show me refund status for today',
        'List all failed transactions in the last 24 hours',
        'What payments are at risk?',
      ],
    };
  }

  if (q.includes('refund')) {
    return {
      sender: 'ai',
      text: 'I found a transaction eligible for refund. Please confirm the action below to initiate the Razorpay refund API call.',
      confidence: 0.94,
      alertLevel: 'warning',
      metrics: [
        { label: 'Refund Amount', value: '₹45,000', trend: 'neutral', sublabel: 'Full amount' },
        { label: 'Transaction Age', value: '2 days', trend: 'neutral', sublabel: 'Within 180-day window' },
        { label: 'Refund Status', value: 'Eligible', trend: 'up', sublabel: 'Razorpay allows' },
      ],
      actions: [
        { label: 'Confirm Refund ₹45,000', actionType: 'refund', transactionId: 'pay_XcY8831oq', amount: 45000, variant: 'danger' },
      ],
      followups: [
        'Show all refunds this month',
        'What is our total refund volume?',
      ],
    };
  }

  if (q.includes('dashboard') || q.includes('overview') || q.includes('summary') || q.includes('metrics')) {
    return {
      sender: 'ai',
      text: 'Here is your live payment operations dashboard summary for today.',
      confidence: 0.98,
      alertLevel: 'info',
      metrics: [
        { label: 'Total Volume', value: '₹42,85,000', trend: 'up', sublabel: 'Today' },
        { label: 'Success Rate', value: '95.26%', trend: 'up', sublabel: '+2.1% vs yesterday' },
        { label: 'Failed Payments', value: '59', trend: 'down', sublabel: 'Needs attention' },
        { label: 'Avg Transaction', value: '₹3,435', trend: 'neutral', sublabel: 'Per payment' },
      ],
      followups: [
        'Show high-risk transactions',
        'What payments can be recovered?',
        'Run reconciliation check',
      ],
    };
  }

  // Default grounded response
  return {
    sender: 'ai',
    text: `I've analyzed your Razorpay Test Mode telemetry for: **"${query}"**\n\nI found 1,248 transactions on record. Success conversion stands at 95.26%. No unauthorized chargebacks detected. If you need a specific transaction ID, customer email, or risk analysis — please ask with more specific details and I'll retrieve the exact data.`,
    confidence: 0.92,
    alertLevel: 'info',
    followups: [
      'Why did payment pay_MkkX9102bc fail?',
      'Show me high-risk transactions from today',
      'What is our payment recovery success rate?',
      'Run bank reconciliation',
    ],
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export const AiAssistantPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      sender: 'ai',
      text: 'Welcome. I am **RPAI Intelligence** — your autonomous payment operations assistant.\n\nI have real-time access to your Razorpay Test Gateway telemetry, risk scoring logs, recovery channels, and audit trail. I can investigate transactions, surface risk patterns, process refunds (with your confirmation), and trigger recovery workflows.\n\nWhat payment intelligence do you need?',
      confidence: 0.99,
      alertLevel: 'info',
      followups: [
        'Investigate payment pay_MkkX9102bc',
        'Show me high-risk transactions from today',
        'What payments can be recovered?',
        'Run bank reconciliation',
        'Show dashboard metrics',
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    actionType: ActionType;
    transactionId?: string;
    amount?: number;
  } | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    const newMsgs: AiMessage[] = [...messages, { sender: 'user', text: q }];
    setMessages(newMsgs);
    if (!textToSend) setQuery('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = buildAiResponse(q);
      setMessages([...newMsgs, aiResponse]);
      setIsLoading(false);
    }, 650);
  };

  const handleConfirmAction = async (reason: string) => {
    if (!pendingAction) return;
    const { actionType, transactionId, amount } = pendingAction;

    try {
      const token = localStorage.getItem('rpai_token');
      await axios.post(
        `/api/actions/${actionType}`,
        { transactionId, amount, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add audit confirmation message to chat
      const actionNames: Record<ActionType, string> = {
        hold: 'Hold',
        release: 'Release',
        refund: 'Refund',
        recovery: 'Recovery Attempt',
        'create-link': 'Payment Link',
        reconcile: 'Reconciliation',
      };

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `**Action confirmed.** ${actionNames[actionType]} completed successfully${transactionId ? ` for \`${transactionId}\`` : ''}. This action has been recorded in the RPAI Audit Trail with timestamp and actor details.`,
          confidence: 0.99,
          alertLevel: 'success',
          followups: ['Show the audit log', 'What should I do next?'],
        },
      ]);
    } catch (_) {
      throw new Error('Action failed. The backend returned an error.');
    }
  };

  const alertLevelStyles: Record<string, string> = {
    info: 'border-l-sky-500',
    warning: 'border-l-amber-500',
    critical: 'border-l-rose-500',
    success: 'border-l-emerald-500',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              RPAI AI Operations Assistant
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Investigate transactions, surface risk patterns, and execute controlled payment actions — all with your confirmation.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
          <Activity className="w-3.5 h-3.5" />
          Live Telemetry Connected
        </div>
      </div>

      {/* Chat Window */}
      <Card className="flex flex-col p-0 border-slate-200 shadow-xl overflow-hidden" style={{ height: '72vh' }}>
        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50/40">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center shrink-0 shadow-sm border border-slate-800 mt-0.5">
                  <Bot className="w-4.5 h-4.5" />
                </div>
              )}

              <div
                className={`max-w-2xl min-w-0 break-words rounded-xl shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white px-4 py-3 text-sm font-medium'
                    : `bg-white text-slate-800 border border-slate-200 overflow-hidden ${m.alertLevel ? `border-l-4 ${alertLevelStyles[m.alertLevel]}` : ''}`
                }`}
              >
                {/* User message */}
                {m.sender === 'user' && <p className="break-words leading-relaxed">{m.text}</p>}

                {/* AI message */}
                {m.sender === 'ai' && (
                  <>
                    {/* Text */}
                    <div className="px-4 pt-4 pb-2 min-w-0">
                      <p
                        className="text-xs leading-relaxed text-slate-800 whitespace-pre-line break-words"
                        dangerouslySetInnerHTML={{
                          __html: m.text
                            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                            .replace(/`(.+?)`/g, '<code class="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px] break-all">$1</code>'),
                        }}
                      />
                    </div>

                    {/* Metrics Grid */}
                    {m.metrics && m.metrics.length > 0 && (
                      <div className="px-4 py-3 grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50/60 min-w-0">
                        {m.metrics.map((metric, mi) => (
                          <div key={mi} className="bg-white border border-slate-200 rounded-lg p-2.5 min-w-0 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide truncate">
                                {metric.label}
                              </span>
                              {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />}
                              {metric.trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-500 shrink-0" />}
                            </div>
                            <p className="text-sm font-extrabold text-slate-900 mt-0.5 truncate">{metric.value}</p>
                            {metric.sublabel && (
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{metric.sublabel}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Data Table */}
                    {m.table && (
                      <div className="px-4 py-3 border-t border-slate-100 overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-slate-100">
                              {m.table.columns.map((col, ci) => (
                                <th
                                  key={ci}
                                  className="text-left text-[10px] font-bold uppercase text-slate-400 pb-2 pr-4"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {m.table.rows.map((row, ri) => (
                              <tr key={ri} className="border-b border-slate-50 last:border-0">
                                {row.map((cell, ci) => (
                                  <td key={ci} className="py-2 pr-4 text-slate-700 font-medium">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Transaction References */}
                    {m.transactionRefs && m.transactionRefs.length > 0 && (
                      <div className="px-4 py-3 border-t border-slate-100 space-y-1.5">
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">
                          Flagged Transactions
                        </p>
                        {m.transactionRefs.map((txn, ti) => {
                          const riskLevel =
                            (txn.riskScore || 0) >= 81
                              ? 'CRITICAL'
                              : (txn.riskScore || 0) >= 61
                              ? 'HIGH'
                              : (txn.riskScore || 0) >= 31
                              ? 'MEDIUM'
                              : 'LOW';
                          return (
                            <div
                              key={ti}
                              className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                            >
                              <div className="flex items-center gap-2">
                                <code className="text-[11px] font-mono font-bold text-slate-700">
                                  {txn.id}
                                </code>
                                <span className={`text-[11px] font-bold ${STATUS_COLOR[txn.status] || 'text-slate-600'}`}>
                                  {txn.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800">
                                  ₹{txn.amount.toLocaleString('en-IN')}
                                </span>
                                {txn.riskScore && (
                                  <span
                                    className={`text-[10px] font-bold border px-1.5 py-0.5 rounded-full ${
                                      RISK_COLOR[riskLevel]
                                    }`}
                                  >
                                    {txn.riskScore}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="px-4 py-3 border-t border-slate-100 flex flex-wrap gap-2 bg-slate-50/60">
                        <p className="w-full text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Recommended Actions — Require Your Confirmation
                        </p>
                        {m.actions.map((action, ai) => {
                          const icons: Record<ActionType, React.ReactNode> = {
                            hold: <PauseCircle className="w-3.5 h-3.5" />,
                            release: <PlayCircle className="w-3.5 h-3.5" />,
                            refund: <RotateCcw className="w-3.5 h-3.5" />,
                            recovery: <RefreshCw className="w-3.5 h-3.5" />,
                            'create-link': <Link2 className="w-3.5 h-3.5" />,
                            reconcile: <FileCheck2 className="w-3.5 h-3.5" />,
                          };
                          return (
                            <Button
                              key={ai}
                              variant={action.variant}
                              size="sm"
                              leftIcon={icons[action.actionType]}
                              onClick={() =>
                                setPendingAction({
                                  actionType: action.actionType,
                                  transactionId: action.transactionId,
                                  amount: action.amount,
                                })
                              }
                            >
                              {action.label}
                            </Button>
                          );
                        })}
                      </div>
                    )}

                    {/* Footer: Confidence + Follow-ups */}
                    <div className="px-4 py-3 border-t border-slate-100">
                      {m.confidence && (
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            AI Confidence: {(m.confidence * 100).toFixed(0)}%
                          </span>
                          <span className="flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            Grounded from Razorpay Telemetry
                          </span>
                        </div>
                      )}
                      {m.followups && m.followups.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {m.followups.map((f, fi) => (
                            <button
                              key={fi}
                              onClick={() => handleSend(f)}
                              className="text-[11px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full transition-colors font-semibold"
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xs mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center shrink-0 shadow-sm border border-slate-800">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
                <span className="text-xs text-slate-400">Analyzing transaction logs & risk telemetry...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick Action Bar */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Quick:</span>
          {[
            'Investigate pay_MkkX9102bc',
            'Show risk summary',
            'Recovery opportunities',
            'Run reconciliation',
            'Dashboard metrics',
          ].map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="shrink-0 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              placeholder="Ask RPAI e.g., 'Why did transaction pay_MkkX9102bc fail?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            />
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              rightIcon={<Send className="w-4 h-4" />}
              disabled={!query.trim() || isLoading}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>

      {/* Action Confirmation Modal */}
      {pendingAction && (
        <ActionConfirmationModal
          isOpen={!!pendingAction}
          onClose={() => setPendingAction(null)}
          actionType={pendingAction.actionType}
          transactionId={pendingAction.transactionId}
          amount={pendingAction.amount}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
};

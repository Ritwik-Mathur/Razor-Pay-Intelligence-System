import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Loader2, Clock,
  Shield, Terminal, Zap, Activity, RefreshCw, ChevronRight,
  DollarSign, XCircle, AlertCircle, Play
} from 'lucide-react';
import { apiService } from '../../services/api';

type StepStatus = 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'SKIPPED';
type TaskStatus =
  | 'DRAFT' | 'PLANNING' | 'WAITING_FOR_POLICY_CHECK' | 'WAITING_FOR_APPROVAL'
  | 'EXECUTING' | 'VERIFYING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'BLOCKED';

interface TaskStep {
  stepIndex: number;
  name: string;
  toolName?: string;
  status: StepStatus;
  output?: string;
  error?: string;
  timestamp: string;
}

interface AgentTaskData {
  taskId: string;
  agentId: string;
  agentName: string;
  goal: string;
  recipient?: string;
  amount?: number;
  referenceId?: string;
  status: TaskStatus;
  estimatedActions: string[];
  steps: TaskStep[];
  approvalId?: string;
  resultSummary?: string;
  moneyMoved?: number;
  moneyRecovered?: number;
  isDemoData?: boolean;
  startedAt: string;
  completedAt?: string;
}

const DEMO_TASK: AgentTaskData = {
  taskId: 'task_demo_001',
  agentId: 'agent_payout',
  agentName: 'Payout Agent',
  goal: 'Pay Rahul ₹5,000 for invoice INV-1024',
  recipient: 'Rahul Sharma',
  amount: 5000,
  referenceId: 'INV-1024',
  status: 'COMPLETED',
  estimatedActions: [
    'Identify recipient & fund account',
    'Verify invoice reference',
    'Check risk & duplicate payment lock',
    'Evaluate merchant payout policy',
    'Execute Razorpay Payout',
    'Verify transaction result & record audit',
  ],
  steps: [
    { stepIndex: 1, name: 'Recipient identified & fund account verified', status: 'PASSED', timestamp: new Date(Date.now() - 300000).toISOString() },
    { stepIndex: 2, name: 'Invoice INV-1024 verified & reference matched', status: 'PASSED', timestamp: new Date(Date.now() - 280000).toISOString() },
    { stepIndex: 3, name: 'Risk score check passed (Score: 12/100). No duplicate detected.', status: 'PASSED', timestamp: new Date(Date.now() - 260000).toISOString() },
    { stepIndex: 4, name: 'Policy check: Automatic payout allowed — Amount ≤ ₹5,000 threshold.', status: 'PASSED', timestamp: new Date(Date.now() - 240000).toISOString() },
    { stepIndex: 5, name: 'Razorpay Payout API executed (DEMO) — pout_Nzk91238', status: 'PASSED', timestamp: new Date(Date.now() - 200000).toISOString() },
    { stepIndex: 6, name: 'Verification confirmed. Immutable audit log recorded.', status: 'PASSED', timestamp: new Date(Date.now() - 180000).toISOString() },
  ],
  resultSummary: 'Payout of ₹5,000 to Rahul Sharma completed successfully. Reference: pout_Nzk91238.',
  moneyMoved: 5000,
  isDemoData: true,
  startedAt: new Date(Date.now() - 300000).toISOString(),
  completedAt: new Date(Date.now() - 180000).toISOString(),
};

const stepStatusColors: Record<StepStatus, string> = {
  PENDING: '#475569',
  RUNNING: '#3B82F6',
  PASSED: '#10B981',
  FAILED: '#EF4444',
  SKIPPED: '#64748B',
};

const taskStatusColors: Record<TaskStatus, string> = {
  DRAFT: '#64748B', PLANNING: '#8B5CF6', WAITING_FOR_POLICY_CHECK: '#F59E0B',
  WAITING_FOR_APPROVAL: '#F59E0B', EXECUTING: '#3B82F6', VERIFYING: '#6366F1',
  COMPLETED: '#10B981', FAILED: '#EF4444', CANCELLED: '#6B7280', BLOCKED: '#EF4444',
};

const StepIcon = ({ status }: { status: StepStatus }) => {
  const color = stepStatusColors[status];
  if (status === 'PASSED') return <CheckCircle2 size={18} style={{ color }} />;
  if (status === 'FAILED') return <XCircle size={18} style={{ color }} />;
  if (status === 'RUNNING') return <Loader2 size={18} style={{ color, animation: 'spin 1s linear infinite' }} />;
  if (status === 'SKIPPED') return <AlertCircle size={18} style={{ color }} />;
  return <Clock size={18} style={{ color }} />;
};

const AgentTaskExecutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<AgentTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res: any = await apiService.get(`/agents/tasks/${id}`);
        setTask(res.data?.data || res.data);
      } catch {
        setTask(DEMO_TASK);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task?.steps?.length]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} style={{ color: '#6366F1', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!task) return (
    <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: 16 }}>
      Task not found.
    </div>
  );

  const statusColor = taskStatusColors[task.status] || '#6B7280';
  const completedSteps = task.steps.filter(s => s.status === 'PASSED').length;
  const progress = task.steps.length > 0 ? (completedSteps / task.steps.length) * 100 : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#060B18', color: '#F1F5F9', fontFamily: "'Inter', sans-serif", padding: '0 0 80px 0' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,11,24,0) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 40px'
      }}>
        <button
          onClick={() => navigate('/agents')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', color: '#64748B',
            fontSize: 13, cursor: 'pointer', marginBottom: 16, padding: 0, fontWeight: 500
          }}
        >
          <ArrowLeft size={15} /> Back to Agents
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Activity size={18} style={{ color: '#818CF8' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 2, fontFamily: 'monospace' }}>{task.taskId}</div>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#F1F5F9' }}>{task.goal}</h1>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#64748B' }}>Agent: <span style={{ color: '#818CF8', fontWeight: 600 }}>{task.agentName}</span></span>
              {task.recipient && <span style={{ fontSize: 12, color: '#64748B' }}>To: <span style={{ color: '#CBD5E1' }}>{task.recipient}</span></span>}
              {task.amount && <span style={{ fontSize: 12, color: '#64748B' }}>Amount: <span style={{ color: '#10B981', fontWeight: 600 }}>₹{task.amount.toLocaleString('en-IN')}</span></span>}
              {task.referenceId && <span style={{ fontSize: 12, color: '#64748B' }}>Ref: <span style={{ color: '#CBD5E1', fontFamily: 'monospace' }}>{task.referenceId}</span></span>}
              {task.isDemoData && (
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 999, fontWeight: 700,
                  background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)'
                }}>DEMO</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <span style={{
              fontSize: 12, padding: '5px 14px', borderRadius: 999, fontWeight: 700,
              background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30`
            }}>{task.status}</span>
            <div style={{ fontSize: 11, color: '#475569' }}>
              Started: {new Date(task.startedAt).toLocaleTimeString()}
              {task.completedAt && ` · Completed: ${new Date(task.completedAt).toLocaleTimeString()}`}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: '#475569' }}>
            <span>Execution Progress</span>
            <span>{completedSteps}/{task.steps.length} steps</span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 999, width: `${progress}%`,
              background: `linear-gradient(90deg, #6366F1, ${statusColor})`,
              transition: 'width 0.5s ease',
              boxShadow: progress > 0 ? `0 0 8px ${statusColor}` : 'none'
            }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 40px', maxWidth: 1100, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

        {/* Step by Step Feed */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 16 }}>Execution Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {task.steps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 16 }}>

                {/* Left connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                  <div style={{ marginTop: 4 }}>
                    <StepIcon status={step.status} />
                  </div>
                  {idx < task.steps.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: step.status === 'PASSED' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', margin: '6px 0' }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 20 }}>
                  <div style={{
                    background: step.status === 'RUNNING'
                      ? 'rgba(59,130,246,0.06)'
                      : step.status === 'FAILED'
                        ? 'rgba(239,68,68,0.06)'
                        : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${step.status === 'RUNNING' ? 'rgba(59,130,246,0.2)' : step.status === 'FAILED' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 12, padding: '14px 16px',
                    boxShadow: step.status === 'RUNNING' ? '0 0 15px rgba(59,130,246,0.1)' : 'none',
                    animation: step.status === 'RUNNING' ? 'pulse 1.5s ease infinite' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 500 }}>
                        <span style={{ color: '#475569', marginRight: 8 }}>Step {step.stepIndex}:</span>
                        {step.name}
                      </div>
                      <span style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', whiteSpace: 'nowrap', marginLeft: 10 }}>
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {step.toolName && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6,
                        padding: '2px 10px', borderRadius: 999, fontSize: 11, fontFamily: 'monospace',
                        background: 'rgba(16,185,129,0.08)', color: '#34D399', border: '1px solid rgba(16,185,129,0.15)'
                      }}>
                        <Terminal size={11} /> {step.toolName}()
                      </div>
                    )}
                    {step.output && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#64748B', fontFamily: 'monospace', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                        {step.output}
                      </div>
                    )}
                    {step.error && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#F87171', padding: '6px 10px', background: 'rgba(239,68,68,0.06)', borderRadius: 6 }}>
                        {step.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={scrollRef} />

          {/* Result Summary */}
          {task.resultSummary && task.status === 'COMPLETED' && (
            <div style={{
              padding: '18px 20px', borderRadius: 14, marginTop: 8,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.04) 100%)',
              border: '1px solid rgba(16,185,129,0.2)'
            }}>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 700, marginBottom: 6 }}>✅ TASK COMPLETED SUCCESSFULLY</div>
              <div style={{ fontSize: 14, color: '#CBD5E1' }}>{task.resultSummary}</div>
            </div>
          )}

          {task.status === 'WAITING_FOR_APPROVAL' && (
            <div style={{
              padding: '18px 20px', borderRadius: 14, marginTop: 8,
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)'
            }}>
              <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700, marginBottom: 6 }}>⏳ AWAITING MERCHANT APPROVAL</div>
              <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 }}>{task.resultSummary}</div>
              <button
                onClick={() => navigate('/agents/approvals')}
                style={{
                  padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13,
                  background: 'rgba(245,158,11,0.12)', color: '#F59E0B',
                  border: '1px solid rgba(245,158,11,0.3)', cursor: 'pointer'
                }}
              >
                Go to Action Approval Center →
              </button>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>

          {/* Financial Impact */}
          {(task.moneyMoved || task.moneyRecovered) ? (
            <div style={{
              background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: 14, padding: 18
            }}>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 10 }}>FINANCIAL IMPACT</div>
              {task.moneyMoved ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <DollarSign size={16} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 13, color: '#94A3B8' }}>Money Moved:</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#10B981' }}>₹{task.moneyMoved.toLocaleString('en-IN')}</span>
                </div>
              ) : null}
              {task.moneyRecovered ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RefreshCw size={16} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 13, color: '#94A3B8' }}>Recovered:</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#10B981' }}>₹{task.moneyRecovered.toLocaleString('en-IN')}</span>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Planned Actions */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 18
          }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 10 }}>TASK PLAN</div>
            {task.estimatedActions.map((action, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: i < task.steps.filter(s => s.status === 'PASSED').length ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
                  color: i < task.steps.filter(s => s.status === 'PASSED').length ? '#10B981' : '#475569'
                }}>
                  {i < task.steps.filter(s => s.status === 'PASSED').length ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, color: '#94A3B8', paddingTop: 2 }}>{action}</span>
              </div>
            ))}
          </div>

          {/* Safety */}
          <div style={{
            background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)',
            borderRadius: 14, padding: 18
          }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 10 }}>POLICY CHECKS</div>
            {[
              { label: 'Duplicate Detection', passed: true },
              { label: 'Idempotency Lock', passed: true },
              { label: 'Risk Threshold', passed: true },
              { label: 'Amount Policy', passed: task.status !== 'WAITING_FOR_APPROVAL' },
            ].map((check, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ color: check.passed ? '#10B981' : '#F59E0B', fontSize: 13 }}>
                  {check.passed ? '✓' : '⏳'}
                </div>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{check.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: check.passed ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
                  {check.passed ? 'PASSED' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => navigate(`/agents/${task.agentId}`)} style={{
              width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              background: 'rgba(99,102,241,0.06)', color: '#818CF8',
              border: '1px solid rgba(99,102,241,0.15)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span>View Agent Details</span><ChevronRight size={13} />
            </button>
            {task.status === 'WAITING_FOR_APPROVAL' && (
              <button onClick={() => navigate('/agents/approvals')} style={{
                width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: 'rgba(245,158,11,0.06)', color: '#F59E0B',
                border: '1px solid rgba(245,158,11,0.15)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <span>Go to Approvals</span><ChevronRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.1); } 50% { box-shadow: 0 0 15px rgba(59,130,246,0.2); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default AgentTaskExecutionPage;

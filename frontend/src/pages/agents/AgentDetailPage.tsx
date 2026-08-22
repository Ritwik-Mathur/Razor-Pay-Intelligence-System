import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bot, Send, ShieldAlert, RotateCcw, TrendingUp, Scale,
  Coins, CornerDownLeft, FileCheck2, Building2, PieChart,
  ArrowLeft, Play, Zap, Clock, CheckCircle2, AlertTriangle,
  ChevronRight, Shield, Activity, AlertCircle, Settings, Loader2,
  Receipt, Terminal, Lock, ChevronDown, ChevronUp, X, Cpu
} from 'lucide-react';
import { apiService } from '../../services/api';

const iconMap: Record<string, React.ElementType> = {
  Receipt, Send, ShieldAlert, RotateCcw, TrendingUp, Scale,
  Coins, CornerDownLeft, FileCheck2, Building2, PieChart, Bot, Cpu,
  Vault: Shield,
};

const autonomyDesc: Record<number, { label: string; desc: string; color: string }> = {
  1: { label: 'Level 1: Advisory', desc: 'Provides analysis and recommendations. Zero autonomous financial actions.', color: '#3B82F6' },
  2: { label: 'Level 2: Assisted', desc: 'Executes pre-approved lower-risk operations within strict policy limits.', color: '#8B5CF6' },
  3: { label: 'Level 3: Controlled', desc: 'Executes most allowed operations autonomously. High-value actions require approval.', color: '#F59E0B' },
  4: { label: 'Level 4: Full Auto', desc: 'Fully autonomous for read-only/reporting tasks. All financial actions still gated.', color: '#10B981' },
};

const riskColors: Record<string, string> = {
  LOW: '#10B981', MEDIUM: '#F59E0B', HIGH: '#EF4444', CRITICAL: '#7F1D1D'
};

const TaskRow = ({ task }: { task: any }) => {
  const [expanded, setExpanded] = useState(false);
  const statusColors: Record<string, string> = {
    COMPLETED: '#10B981', FAILED: '#EF4444', EXECUTING: '#3B82F6',
    WAITING_FOR_APPROVAL: '#F59E0B', PLANNING: '#8B5CF6', CANCELLED: '#6B7280'
  };
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)'
        }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 500 }}>{task.goal}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
            {task.taskId} · {new Date(task.startedAt || task.createdAt).toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600,
            background: `${statusColors[task.status] || '#6B7280'}18`,
            color: statusColors[task.status] || '#6B7280',
            border: `1px solid ${statusColors[task.status] || '#6B7280'}30`
          }}>{task.status}</span>
          {expanded ? <ChevronUp size={14} style={{ color: '#475569' }} /> : <ChevronDown size={14} style={{ color: '#475569' }} />}
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {task.steps?.map((step: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: 8 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', fontSize: 10, fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step.status === 'PASSED' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.1)',
                color: step.status === 'PASSED' ? '#10B981' : '#64748B'
              }}>
                {step.status === 'PASSED' ? '✓' : step.stepIndex}
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', paddingTop: 2 }}>{step.name}</div>
            </div>
          ))}
          {task.resultSummary && (
            <div style={{
              marginTop: 8, padding: '10px 12px', borderRadius: 8,
              background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
              fontSize: 12, color: '#CBD5E1'
            }}>{task.resultSummary}</div>
          )}
        </div>
      )}
    </div>
  );
};

const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskDrawer, setShowTaskDrawer] = useState(false);
  const [taskGoal, setTaskGoal] = useState('');
  const [taskAmount, setTaskAmount] = useState('');
  const [taskRunning, setTaskRunning] = useState(false);
  const [taskResult, setTaskResult] = useState<any>(null);
  const [taskError, setTaskError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res: any = await apiService.get(`/agents/${id}`);
        setAgent(res.data?.data || res.data);
      } catch {
        // Fallback demo agent
        setAgent({
          agentId: id, name: 'Payment Recovery Agent', codeName: 'recovery_agent',
          iconName: 'RotateCcw', status: 'ONLINE', autonomyLevel: 3, riskLevel: 'LOW',
          description: 'Recovers failed or abandoned payment checkouts automatically.',
          purpose: 'Classify failure reasons, run smart retry campaigns, and generate payment links.',
          capabilities: ['Failure classification', 'Recovery campaign dispatch', 'Retry link generation', 'Abandoned checkout recovery', 'Priority scoring'],
          allowedTools: ['createRecoveryLink', 'dispatchRecoveryMessage', 'listFailedPayments'],
          tasksCompletedTotal: 305, tasksCompletedToday: 23, successRate: 94.8,
          recentTasks: [],
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleRunTask = async () => {
    if (!taskGoal.trim()) return;
    setTaskRunning(true);
    setTaskError('');
    try {
      const payload: any = { goal: taskGoal, agentId: id };
      if (taskAmount) payload.amount = Number(taskAmount);
      const res: any = await apiService.post('/agents/tasks', payload);
      setTaskResult(res.data?.data || res.data);
    } catch (err: any) {
      setTaskError(err.response?.data?.message || err.message || 'Task failed');
    } finally {
      setTaskRunning(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} style={{ color: '#6366F1', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const Icon = iconMap[agent?.iconName || 'Bot'] || Bot;
  const autonomy = autonomyDesc[agent?.autonomyLevel || 1];
  const riskColor = riskColors[agent?.riskLevel || 'LOW'];

  return (
    <div style={{ minHeight: '100vh', background: '#060B18', color: '#F1F5F9', fontFamily: "'Inter', sans-serif", padding: '0 0 60px 0' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,11,24,0) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 40px'
      }}>
        <button
          onClick={() => navigate('/agents')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'transparent',
            border: 'none', color: '#64748B', fontSize: 13, cursor: 'pointer', marginBottom: 20,
            padding: 0, fontWeight: 500
          }}
        >
          <ArrowLeft size={15} /> Back to Agents
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.25) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(99,102,241,0.3)',
              boxShadow: '0 0 20px rgba(99,102,241,0.2)'
            }}>
              <Icon size={28} style={{ color: '#818CF8' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#F1F5F9' }}>{agent?.name}</h1>
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 600,
                  background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)'
                }}>{agent?.status}</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748B' }}>{agent?.purpose}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate('/agents/policies')}
              style={{
                padding: '10px 18px', borderRadius: 10, fontWeight: 600, fontSize: 13,
                background: 'rgba(255,255,255,0.05)', color: '#94A3B8',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Settings size={14} /> Policies
            </button>
            <button
              onClick={() => setShowTaskDrawer(true)}
              style={{
                padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: '#fff', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <Play size={14} /> Run Task
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 40px', maxWidth: 1200 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Tasks Completed Today', value: agent?.tasksCompletedToday },
                { label: 'Total Tasks Completed', value: agent?.tasksCompletedTotal },
                { label: 'Success Rate', value: `${agent?.successRate}%` },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '16px 20px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#6366F1' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Capabilities */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: 24
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 16 }}>Capabilities</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(agent?.capabilities || []).map((cap: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <CheckCircle2 size={14} style={{ color: '#6366F1' }} />
                    </div>
                    <span style={{ fontSize: 13, color: '#CBD5E1' }}>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allowed Tools */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: 24
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 16 }}>Tool Registry</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(agent?.allowedTools || []).map((tool: string, i: number) => (
                  <span key={i} style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 12, fontFamily: 'monospace',
                    background: 'rgba(16,185,129,0.08)', color: '#34D399', fontWeight: 600,
                    border: '1px solid rgba(16,185,129,0.2)'
                  }}>{tool}()</span>
                ))}
              </div>
            </div>

            {/* Recent Tasks */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: 24
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 16 }}>Recent Tasks</div>
              {(agent?.recentTasks || []).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {agent.recentTasks.map((task: any) => <TaskRow key={task.taskId} task={task} />)}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#475569', fontSize: 13 }}>
                  No recent tasks. Run a task to see execution history.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Autonomy */}
            <div style={{
              background: `linear-gradient(135deg, ${autonomy.color}10 0%, ${autonomy.color}06 100%)`,
              border: `1px solid ${autonomy.color}25`,
              borderRadius: 16, padding: 20
            }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 6 }}>AUTONOMY LEVEL</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: autonomy.color, marginBottom: 8 }}>{autonomy.label}</div>
              <p style={{ margin: 0, fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>{autonomy.desc}</p>
            </div>

            {/* Risk */}
            <div style={{
              background: `${riskColor}08`, border: `1px solid ${riskColor}20`,
              borderRadius: 16, padding: 20
            }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 6 }}>OPERATIONAL RISK</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: riskColor }}>{agent?.riskLevel} RISK</div>
            </div>

            {/* Safety Rules */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: 20
            }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 12 }}>SAFETY CONTROLS</div>
              {[
                '💰 Payments > ₹5,000 require approval',
                '🔒 Duplicate action detection (60s lock)',
                '📋 Immutable audit trail for every call',
                '🛑 Global kill switch halts all operations',
                '🏷 Demo mode available for safe testing',
              ].map((rule, i) => (
                <div key={i} style={{ fontSize: 12, color: '#94A3B8', paddingBottom: 8, lineHeight: 1.4 }}>{rule}</div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => navigate('/agents/approvals')} style={{
                width: '100%', padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: 'rgba(245,158,11,0.06)', color: '#F59E0B',
                border: '1px solid rgba(245,158,11,0.15)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <span>Action Approvals</span><ChevronRight size={14} />
              </button>
              <button onClick={() => navigate('/agents/policies')} style={{
                width: '100%', padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: 'rgba(99,102,241,0.06)', color: '#818CF8',
                border: '1px solid rgba(99,102,241,0.15)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <span>Policy Settings</span><ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Drawer */}
      {showTaskDrawer && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'
        }} onClick={() => setShowTaskDrawer(false)}>
          <div
            style={{
              width: '100%', maxWidth: 500, background: '#0F172A',
              borderRadius: '20px 20px 0 0', borderTop: '1px solid rgba(255,255,255,0.1)',
              padding: 28, maxHeight: '85vh', overflowY: 'auto',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <style>{`@keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>Run Task: {agent?.name}</div>
              <button onClick={() => setShowTaskDrawer(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#94A3B8' }}>
                <X size={16} />
              </button>
            </div>

            {!taskResult ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 8 }}>GOAL *</label>
                  <textarea
                    value={taskGoal}
                    onChange={e => setTaskGoal(e.target.value)}
                    rows={3}
                    placeholder={`e.g. "Recover failed payments from today"`}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '10px 12px', color: '#F1F5F9', fontSize: 13,
                      resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 8 }}>AMOUNT (₹) – Optional</label>
                  <input
                    type="number" value={taskAmount} onChange={e => setTaskAmount(e.target.value)}
                    placeholder="5000"
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '10px 12px', color: '#F1F5F9', fontSize: 13,
                      outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
                    }}
                  />
                </div>
                {taskError && (
                  <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', fontSize: 13 }}>{taskError}</div>
                )}
                <button
                  onClick={handleRunTask}
                  disabled={!taskGoal.trim() || taskRunning}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                    background: taskGoal.trim() && !taskRunning ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'rgba(255,255,255,0.05)',
                    color: taskGoal.trim() && !taskRunning ? '#fff' : '#475569',
                    border: 'none', cursor: taskGoal.trim() && !taskRunning ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  {taskRunning ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Planning...</> : <><Zap size={16} /> Start Agent</>}
                </button>
              </>
            ) : (
              <div>
                <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginBottom: 6 }}>✓ TASK CREATED</div>
                  <div style={{ fontSize: 13, color: '#CBD5E1' }}>{taskResult.task?.resultSummary}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {taskResult.task?.taskId && (
                    <button onClick={() => navigate(`/agents/tasks/${taskResult.task.taskId}`)} style={{
                      flex: 1, padding: '11px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: '#fff', border: 'none', cursor: 'pointer'
                    }}>View Live Task</button>
                  )}
                  <button onClick={() => { setShowTaskDrawer(false); setTaskResult(null); setTaskGoal(''); }} style={{
                    flex: 1, padding: '11px', borderRadius: 10, fontWeight: 600, fontSize: 13,
                    background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer'
                  }}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        textarea::placeholder, input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
};

export default AgentDetailPage;

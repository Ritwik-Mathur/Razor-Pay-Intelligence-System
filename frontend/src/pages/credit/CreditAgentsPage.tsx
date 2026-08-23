import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Zap,
  Bot,
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Play,
  RefreshCw,
  TrendingUp,
  DollarSign,
  CreditCard,
  Building2,
  FileCheck2,
  UserCheck,
  Cpu,
} from 'lucide-react';

interface AgentInfo {
  id: string;
  name: string;
  role: string;
  icon: any;
  status: 'ACTIVE' | 'IDLE' | 'ANALYZING';
  lastAction: string;
  lastActionTime: string;
  dataSources: string[];
  capabilities: string[];
}

interface ActivityLog {
  timestamp: string;
  agentName: string;
  action: string;
  impact: string;
  type: 'info' | 'success' | 'warning';
}

export const CreditAgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([
    {
      id: 'cashflow',
      name: 'Cashflow Agent',
      role: 'Analyzes revenue, expenses, cash flow & reserves volatility',
      icon: DollarSign,
      status: 'ACTIVE',
      lastAction: 'Analyzed May 2026 monthly cash flow volatility (₹65,000 net)',
      lastActionTime: '2 mins ago',
      dataSources: ['Razorpay Telemetry', 'Merchant Cash Records', 'Bank Statements'],
      capabilities: ['Volatility tracking', 'Reserve monitoring', 'Financial stress alerts'],
    },
    {
      id: 'payment',
      name: 'Payment Behaviour Agent',
      role: 'Analyzes successful/failed payments, refunds & frequency',
      icon: CreditCard,
      status: 'ACTIVE',
      lastAction: 'Calculated payment success rate (96.0%) across 34 transactions',
      lastActionTime: '5 mins ago',
      dataSources: ['Razorpay Gateway Logs', 'Card BIN Telemetry', 'Settlement API'],
      capabilities: ['Failure detection', 'Refund ratio calculation', 'Velocity analysis'],
    },
    {
      id: 'stability',
      name: 'Business Stability Agent',
      role: 'Analyzes monthly revenue trends & customer continuity',
      icon: Building2,
      status: 'ACTIVE',
      lastAction: 'Confirmed 36-month operational continuity for Sharma Electronics',
      lastActionTime: '12 mins ago',
      dataSources: ['Merchant Profile', 'GST Filings', 'Invoice Frequency'],
      capabilities: ['Continuity verification', 'Growth trend scoring', 'Customer retention'],
    },
    {
      id: 'supplier',
      name: 'Supplier Agent',
      role: 'Tracks vendor obligations and on-time payment percentages',
      icon: FileCheck2,
      status: 'ACTIVE',
      lastAction: 'Verified on-time vendor payment rate at 91.0%',
      lastActionTime: '18 mins ago',
      dataSources: ['Vendor Invoices', 'Trade Payables Log', 'Bank Remittances'],
      capabilities: ['Late payment warning', 'Payable aging analysis', 'Vendor score boost'],
    },
    {
      id: 'repayment',
      name: 'Repayment Agent',
      role: 'Monitors existing business obligations & debt discipline',
      icon: UserCheck,
      status: 'ACTIVE',
      lastAction: 'Verified 100% repayment discipline (zero defaults recorded)',
      lastActionTime: '25 mins ago',
      dataSources: ['EMI Schedule', 'Loan Telemetry', 'Repayment Log'],
      capabilities: ['Obligation tracking', 'Default risk check', 'Discipline scoring'],
    },
    {
      id: 'coach',
      name: 'Credit Coach Agent',
      role: 'Primary AI Coach generating prioritized credit improvement plans',
      icon: Bot,
      status: 'ACTIVE',
      lastAction: 'Generated 5-point Credit Improvement Plan (+8 pts projected)',
      lastActionTime: 'Just now',
      dataSources: ['Combined Telemetry', 'CreditGrow Score Engine', 'Agent Feed'],
      capabilities: ['Score explanation', 'Improvement roadmap', 'Simulator integration'],
    },
  ]);

  const [liveLogs, setLiveLogs] = useState<ActivityLog[]>([
    {
      timestamp: new Date(Date.now() - 60000 * 1).toLocaleTimeString(),
      agentName: 'Credit Coach Agent',
      action: 'Generated 5-point Credit Improvement Plan (+8 pts projected)',
      impact: 'Score Roadmap Ready',
      type: 'success',
    },
    {
      timestamp: new Date(Date.now() - 60000 * 2).toLocaleTimeString(),
      agentName: 'Cashflow Agent',
      action: 'Analyzed May 2026 monthly cash flow volatility (₹65,000 net)',
      impact: 'Cashflow Health 74/100',
      type: 'info',
    },
    {
      timestamp: new Date(Date.now() - 60000 * 5).toLocaleTimeString(),
      agentName: 'Payment Behaviour Agent',
      action: 'Calculated payment success rate (96.0%) across 34 transactions',
      impact: 'Payment Behaviour 91/100',
      type: 'info',
    },
    {
      timestamp: new Date(Date.now() - 60000 * 12).toLocaleTimeString(),
      agentName: 'Business Stability Agent',
      action: 'Detected stable revenue trend (₹2,40,000 monthly average)',
      impact: 'Stability Score 79/100',
      type: 'info',
    },
    {
      timestamp: new Date(Date.now() - 60000 * 18).toLocaleTimeString(),
      agentName: 'Supplier Agent',
      action: 'Detected minor delay on 1 vendor invoice (91% on-time)',
      impact: 'Supplier Score 82/100',
      type: 'warning',
    },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);

  const handleTriggerAllAgents = () => {
    setIsSimulating(true);
    const now = new Date().toLocaleTimeString();

    const newLogs: ActivityLog[] = [
      {
        timestamp: now,
        agentName: 'Credit Coach Agent',
        action: 'Recalculated CreditGrow Score for Sharma Electronics: 78/100 (Strong)',
        impact: 'Score Updated',
        type: 'success',
      },
      {
        timestamp: now,
        agentName: 'Payment Behaviour Agent',
        action: 'Scanned 34 Razorpay transactions for drop anomalies',
        impact: '0 Anomalies Detected',
        type: 'info',
      },
      {
        timestamp: now,
        agentName: 'Cashflow Agent',
        action: 'Verified emergency reserve balance at ₹25,000',
        impact: 'Target Achieved',
        type: 'success',
      },
    ];

    setTimeout(() => {
      setLiveLogs((prev) => [...newLogs, ...prev]);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 banking-card-shadow">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CreditGrow AI Agent Center</h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
              6 Specialized Agents Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor autonomous AI agents continuously analyzing financial telemetry, detecting risks, and optimizing business credit readiness.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleTriggerAllAgents}
          isLoading={isSimulating}
          leftIcon={<RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />}
        >
          Run All Agent Diagnostics
        </Button>
      </div>

      {/* ─── 6 AGENT CARDS GRID ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card key={agent.id} className="p-5 border-slate-200 banking-card-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {agent.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{agent.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{agent.role}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">LAST ACTION ({agent.lastActionTime})</span>
                  <p className="text-xs text-slate-700 font-medium">{agent.lastAction}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">CONNECTED TELEMETRY</span>
                <div className="flex flex-wrap gap-1">
                  {agent.dataSources.map((ds, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {ds}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ─── LIVE AGENT ACTIVITY LOG STREAM ──────────────────────────────────── */}
      <Card className="p-6 border-slate-200 banking-card-shadow space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" /> Live Agent Activity Log
            </h2>
            <p className="text-xs text-slate-500">Real-time audit log of agent diagnostic actions and evaluations</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Auto-refreshing</span>
        </div>

        <div className="space-y-2">
          {liveLogs.map((log, index) => (
            <div
              key={index}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                log.type === 'success'
                  ? 'bg-emerald-50/50 border-emerald-200/60 text-emerald-950'
                  : log.type === 'warning'
                  ? 'bg-amber-50/50 border-amber-200/60 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-400 font-bold shrink-0">{log.timestamp}</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded text-[11px] shrink-0">
                  {log.agentName}
                </span>
                <span className="font-medium text-slate-800">{log.action}</span>
              </div>

              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shrink-0 self-start sm:self-auto">
                {log.impact}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

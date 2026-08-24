import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Toast } from '../components/ui/Toast';
import { RiskDistributionChart } from '../charts/RiskDistributionChart';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowUpRight,
  Filter,
  Sparkles,
  RefreshCw,
  Shield,
  Eye,
  Ban,
  CheckCheck,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const RiskCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'critical' | 'high' | 'medium' | 'low'>('critical');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [alerts, setAlerts] = useState([
    {
      id: 'alt_001',
      paymentId: 'pay_MkkX9102bc',
      customerName: 'Priya Patel',
      customerEmail: 'priya.patel@example.com',
      amount: 128000,
      riskScore: 78,
      riskLevel: 'high',
      factors: [
        'Velocity burst: 5 checkout attempts within 3 minutes',
        'IP routing originates from unusual anonymized VPN endpoint',
        '3DS authentication failed / cardholder challenge timeout',
      ],
      aiExplanation: 'Flagged with score 78 due to rapid velocity bursts and VPN node masking.',
      recommendedAction: 'Hold for manual operator review before re-attempting authorization.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'alt_002',
      paymentId: 'pay_Crit99182x',
      customerName: 'Unknown Cardholder',
      customerEmail: 'suspicious.tester@temp-mail.org',
      amount: 250000,
      riskScore: 89,
      riskLevel: 'critical',
      factors: [
        'Amount ₹2,50,000 exceeds single transaction threshold',
        'Multiple failed card BIN verification checks',
        'High-risk country IP mismatch (Lagos, Nigeria)',
      ],
      aiExplanation: 'Critical score 89/100. High probability of stolen card testing activity.',
      recommendedAction: 'Block customer and flag card BIN globally.',
      status: 'pending',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'alt_003',
      paymentId: 'pay_Med55182ab',
      customerName: 'Vikram Singh',
      customerEmail: 'vikram.singh@example.com',
      amount: 48000,
      riskScore: 42,
      riskLevel: 'medium',
      factors: [
        'New device fingerprint',
        'Unusual transaction time (02:15 AM)',
      ],
      aiExplanation: 'Score 42/100. Medium risk due to off-peak checkout hours.',
      recommendedAction: 'Proceed with standard automated monitoring.',
      status: 'reviewed',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
  ]);

  const trendData = [
    { time: '00:00', critical: 1, high: 2, medium: 4, low: 110 },
    { time: '04:00', critical: 0, high: 1, medium: 2, low: 45 },
    { time: '08:00', critical: 2, high: 3, medium: 8, low: 180 },
    { time: '12:00', critical: 1, high: 4, medium: 12, low: 320 },
    { time: '16:00', critical: 3, high: 6, medium: 15, low: 290 },
    { time: '20:00', critical: 1, high: 3, medium: 9, low: 210 },
  ];

  const topReasons = [
    { reason: 'Velocity Spikes (>3 attempts in 3 mins)', count: 18, percentage: 42 },
    { reason: 'Anonymized VPN / Proxy Endpoints', count: 12, percentage: 28 },
    { reason: 'Amount > 3x Customer Average', count: 8, percentage: 18 },
    { reason: '3DS Challenge Failure / Timeouts', count: 5, percentage: 12 },
  ];

  const handleAction = (alertId: string, actionType: 'approve' | 'hold' | 'block') => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: actionType === 'approve' ? 'reviewed' : 'resolved' } : a))
    );

    const msg =
      actionType === 'approve'
        ? 'Alert approved. Payment released from risk hold.'
        : actionType === 'hold'
        ? 'Payment marked for manual compliance review.'
        : 'Customer blocked and card BIN added to threat list.';

    setToast({ type: 'success', text: msg });
  };

  const filteredAlerts = alerts.filter((a) => a.riskLevel === activeTab);

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.text} onClose={() => setToast(null)} />}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <h1 className="text-xl font-extrabold tracking-tight">RPAI Risk & Fraud Intelligence Center</h1>
            <span className="text-xs font-black px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              ACTIVE DEFENSE
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Deterministic rule-based risk engine combined with grounded AI explanation models.
          </p>
        </div>

        {/* Center Gap: Razorpay Official Logo */}
        <div className="hidden md:flex items-center justify-center px-6 py-1 border-x border-slate-800">
          <img src="/razorpay-logo.png" alt="Razorpay" className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-bold">
            Risk Engine: ONLINE
          </span>
        </div>
      </div>

      {/* 4 Risk Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'critical', title: 'Critical Risk (>80)', count: 1, color: 'border-rose-500 text-rose-600 bg-rose-50' },
          { id: 'high', title: 'High Risk (61-80)', count: 1, color: 'border-amber-500 text-amber-600 bg-amber-50' },
          { id: 'medium', title: 'Medium Risk (31-60)', count: 1, color: 'border-blue-500 text-blue-600 bg-blue-50' },
          { id: 'low', title: 'Low Risk (0-30)', count: 1173, color: 'border-emerald-500 text-emerald-600 bg-emerald-50' },
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              activeTab === tab.id
                ? `${tab.color} shadow-md`
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider block">{tab.title}</span>
            <p className="text-xl font-black mt-1">{tab.count} Alerts</p>
          </div>
        ))}
      </div>

      {/* Risk Trends & Top Reasons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trends Line Chart */}
        <Card
          headerTitle={
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-extrabold text-slate-900">24-Hour Risk Velocity Trend</h3>
            </div>
          }
          className="lg:col-span-2"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="critical" stroke="#DC2626" strokeWidth={2.5} name="Critical" />
                <Line type="monotone" dataKey="high" stroke="#D97706" strokeWidth={2} name="High" />
                <Line type="monotone" dataKey="medium" stroke="#2563EB" strokeWidth={2} name="Medium" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Fraud Reasons Breakdown */}
        <Card
          headerTitle={
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Top Risk Factors</h3>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            {topReasons.map((r, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span className="truncate max-w-[200px]">{r.reason}</span>
                  <span className="font-mono text-slate-500">{r.count} ({r.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filtered Risk Alerts Feed */}
      <Card
        headerTitle={
          <div className="flex items-center justify-between w-full">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              {activeTab} Risk Alerts Telemetry ({filteredAlerts.length})
            </h3>
            <span className="text-xs text-slate-500 font-normal">Click inspect to open AI analysis</span>
          </div>
        }
      >
        <div className="divide-y divide-slate-100">
          {filteredAlerts.length === 0 ? (
            <p className="py-12 text-center text-xs text-slate-400 font-medium">
              No active {activeTab} risk alerts recorded in current telemetry window.
            </p>
          ) : (
            filteredAlerts.map((alt) => (
              <div key={alt.id} className="p-5 space-y-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-blue-600 hover:underline">
                        {alt.paymentId}
                      </span>
                      <Badge variant={alt.riskLevel === 'critical' || alt.riskLevel === 'high' ? 'danger' : 'warning'}>
                        Score: {alt.riskScore} / 100 ({alt.riskLevel.toUpperCase()})
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {alt.customerName} ({alt.customerEmail}) — <span className="text-slate-900 font-black">{formatCurrency(alt.amount)}</span>
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">{formatDate(alt.createdAt)}</span>
                </div>

                {/* Factors List */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Deterministic Risk Engine Evidence
                  </span>
                  <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                    {alt.factors.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation & Controlled Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  <div className="text-xs text-slate-600 font-medium">
                    <strong className="text-slate-900">Recommendation:</strong> {alt.recommendedAction}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/payments/${alt.paymentId}`)}
                      leftIcon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
                    >
                      Investigate with RPAI AI
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAction(alt.id, 'approve')}
                      className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
                      leftIcon={<CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    >
                      Approve Payment
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleAction(alt.id, 'block')}
                      leftIcon={<Ban className="w-3.5 h-3.5" />}
                    >
                      Block & Flag
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

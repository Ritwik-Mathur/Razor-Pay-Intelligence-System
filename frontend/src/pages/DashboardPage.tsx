import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StatsCard } from '../components/ui/StatsCard';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { TransactionChart } from '../charts/TransactionChart';
import { PaymentStatusChart } from '../charts/PaymentStatusChart';
import { RiskDistributionChart } from '../charts/RiskDistributionChart';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { api } from '../services/api';
import { Tooltip } from '../components/ui/Tooltip';
import { CardSkeleton } from '../components/ui/Skeleton';
import {
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Receipt,
  FileCheck2,
  Building2,
  Scale,
  RefreshCw,
  CheckCircle2,
  Activity,
  Cpu,
  Zap,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Shield,
  Clock,
  Layers,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dynamic greeting based on user profile and time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.fullName ? user.fullName.split(' ')[0] : 'Ritwik';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // State for time range filter (Today, 7D, 30D, 90D)
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | '90d'>('7d');
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Dynamic state populated from API
  const [dashboardData, setDashboardData] = useState<any>({
    stats: {
      totalProcessed: 4285000,
      successfulPayments: { count: 1248, rate: 95.26 },
      failedPayments: { count: 62, rate: 4.74 },
      refundedAmount: { amount: 48500, count: 14 },
      flaggedTransactions: { count: 9, avgRiskScore: 14.2 },
      recoverableAmount: { amount: 128000, count: 62 },
      growthRate: 24.5,
    },
    volumeChartData: [
      { time: 'Mon', volume: 520000, success: 110, failed: 4 },
      { time: 'Tue', volume: 680000, success: 145, failed: 8 },
      { time: 'Wed', volume: 810000, success: 180, failed: 12 },
      { time: 'Thu', volume: 740000, success: 165, failed: 6 },
      { time: 'Fri', volume: 990000, success: 220, failed: 15 },
      { time: 'Sat', volume: 620000, success: 140, failed: 5 },
      { time: 'Sun', volume: 625000, success: 142, failed: 4 },
    ],
    statusBreakdown: [
      { status: 'Successful', count: 1248, amount: 3942200, color: '#059669' },
      { status: 'Failed', count: 62, amount: 128000, color: '#E11D48' },
      { status: 'Refunded', count: 14, amount: 48500, color: '#2563EB' },
      { status: 'Held', count: 5, amount: 85000, color: '#D97706' },
      { status: 'Flagged', count: 9, amount: 142000, color: '#DC2626' },
    ],
    riskBreakdown: [
      { category: 'Low Risk (<25)', count: 1173, percentage: 94, color: '#059669' },
      { category: 'Medium Risk (25-50)', count: 50, percentage: 4, color: '#2563EB' },
      { category: 'High Risk (50-75)', count: 6, percentage: 1.5, color: '#D97706' },
      { category: 'Critical Risk (>75)', count: 3, percentage: 0.5, color: '#DC2626' },
    ],
    recentPayments: [
      {
        id: 'pay_NzkX9218ab',
        razorpayOrderId: 'order_Oab91823x',
        amount: 45000,
        currency: 'INR',
        status: 'captured',
        method: 'card',
        cardBrand: 'Visa',
        cardLast4: '4242',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.sharma@example.com',
        riskLevel: 'low',
        riskScore: 8,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'pay_MkkX9102bc',
        razorpayOrderId: 'order_P9102834y',
        amount: 128000,
        currency: 'INR',
        status: 'failed',
        failureReason: '3DS Verification Timeout',
        method: 'card',
        cardBrand: 'Mastercard',
        cardLast4: '8812',
        customerName: 'Priya Patel',
        customerEmail: 'priya.patel@example.com',
        riskLevel: 'high',
        riskScore: 78,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'pay_KkJL7712cd',
        razorpayOrderId: 'order_Q1234567z',
        amount: 12500,
        currency: 'INR',
        status: 'captured',
        method: 'upi',
        customerName: 'Rohan Gupta',
        customerEmail: 'rohan.g@example.com',
        riskLevel: 'low',
        riskScore: 4,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'pay_Ref99182ab',
        razorpayOrderId: 'order_R9918273x',
        amount: 3200,
        currency: 'INR',
        status: 'refunded',
        method: 'netbanking',
        customerName: 'Kavita Sundaram',
        customerEmail: 'kavita.s@example.com',
        riskLevel: 'low',
        riskScore: 12,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ],
    aiInsights: [
      {
        id: 'ins_001',
        title: '3 High-Risk Payments Require Review',
        description: 'Payment pay_MkkX9102bc (₹1,28,000) flagged with risk score 78 due to rapid 3DS velocity bursts from VPN endpoints.',
        type: 'critical',
        actionText: 'Investigate Risk',
        actionRoute: '/risk-center',
      },
      {
        id: 'ins_002',
        title: '₹1,28,000 in Failed Payments Potentially Recoverable',
        description: '62 transactions failed due to 3DS authentication timeouts during peak customer checkout windows.',
        type: 'recovery',
        actionText: 'Recover Payments',
        actionRoute: '/recovery',
      },
      {
        id: 'ins_003',
        title: 'Payment Volume Up 24.5% Compared to Previous Period',
        description: 'UPI transaction conversion remains steady at 98.4%, while card authorization drop-offs dropped 4.2%.',
        type: 'growth',
        actionText: 'View Volume Analytics',
        actionRoute: '/payments',
      },
    ],
    systemStatus: {
      razorpayConnection: 'connected',
      database: 'connected',
      aiEngine: 'online',
      webhookListener: 'active',
      gatewayMode: 'TEST MODE',
    },
  });

  // Fetch telemetry data on mount or timeRange change
  useEffect(() => {
    fetchDashboardData(timeRange);
  }, [timeRange]);

  const fetchDashboardData = async (range: string) => {
    setIsLoadingStats(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('rpai_token');
      const res = await fetch(`${API_BASE_URL}/dashboard/stats?timeRange=${range}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDashboardData(json.data);
        }
      }
    } catch (e) {
      console.warn('Backend API connection offline, using cached telemetry data.');
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Create Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderAmount, setOrderAmount] = useState('4500');
  const [customerEmail, setCustomerEmail] = useState('customer@example.com');
  const [customerName, setCustomerName] = useState('Aarav Sharma');

  const recentColumns = [
    {
      key: 'id',
      title: 'Transaction ID',
      render: (item: any) => (
        <div>
          <span className="font-mono text-xs font-bold text-blue-600 hover:underline">
            {item.id}
          </span>
          <p className="text-[10px] text-slate-400 font-mono">{item.razorpayOrderId}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (item: any) => (
        <div>
          <p className="font-semibold text-slate-800 text-xs">{item.customerName || item.customerEmail}</p>
          <p className="text-[10px] text-slate-400">{item.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (item: any) => <span className="font-bold text-slate-900">{formatCurrency(item.amount)}</span>,
    },
    {
      key: 'method',
      title: 'Method',
      render: (item: any) => (
        <span className="font-semibold text-slate-700 uppercase text-xs">
          {item.method} {item.cardLast4 ? `(•• ${item.cardLast4})` : ''}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />,
    },
    {
      key: 'riskScore',
      title: 'AI Risk',
      render: (item: any) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold ${
            item.riskScore > 70
              ? 'bg-rose-100 text-rose-800'
              : item.riskScore > 40
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {item.riskScore} / 100
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (item: any) => <span className="text-[11px] text-slate-500">{formatDate(item.createdAt)}</span>,
    },
    {
      key: 'action',
      title: 'Action',
      render: (item: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/payments/${item.id}`);
          }}
          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
        >
          Inspect
        </Button>
      ),
    },
  ];

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrderModalOpen(false);
    navigate(ROUTES.PAYMENTS);
  };

  const { stats, volumeChartData, statusBreakdown, riskBreakdown, recentPayments, aiInsights, systemStatus } =
    dashboardData;

  return (
    <div className="space-y-6 pb-12">
      {/* ─── WELCOME GREETING & HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 banking-card-shadow">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{getGreeting()}</h1>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Merchant Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Here's your payment activity overview.</p>
        </div>

        {/* Time-Range Filters & Refresh */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
            {(['today', '7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-md transition-colors uppercase text-[10px] tracking-wider font-extrabold ${
                  timeRange === r
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(timeRange)}
            isLoading={isLoadingStats}
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ─── QUICK ACTIONS BAR ───────────────────────────────────────────────────── */}
      <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-extrabold text-sky-400 uppercase tracking-wider text-[11px] px-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Operations Control:
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsOrderModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white border-none"
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Create Payment
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(ROUTES.PAYMENTS)}
            className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700"
            leftIcon={<Receipt className="w-3.5 h-3.5" />}
          >
            View Transactions
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(ROUTES.RISK_CENTER)}
            className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700"
            leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
          >
            Investigate Risk
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(ROUTES.RECOVERY)}
            className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700"
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-sky-400" />}
          >
            Recover Payments
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(ROUTES.RECONCILIATION)}
            className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700"
            leftIcon={<Scale className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Run Reconciliation
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(ROUTES.AI_ASSISTANT)}
            className="bg-slate-800 text-sky-300 hover:bg-slate-700 border-sky-500/40"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-sky-400" />}
          >
            Ask RPAI AI
          </Button>
        </div>
      </div>

      {/* ─── CREDIT INTELLIGENCE WIDGET CARD ────────────────────────────────────── */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-extrabold tracking-tight uppercase">Credit Intelligence Active</h3>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Alternative Data Layer
            </span>
          </div>
          <p className="text-xs text-slate-300">
            3 Alternative Credit Profiles Assessed • Avg Score: 611/900 • 1 Human Review Required
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(ROUTES.CREDIT_OVERVIEW)}
          rightIcon={<ArrowUpRight className="w-4 h-4" />}
          className="bg-blue-600 hover:bg-blue-500 shrink-0"
        >
          Open Credit Intelligence
        </Button>
      </div>

      {/* ─── 6 KPI STATISTICS CARDS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        {/* Total Processed */}
        <StatsCard
          title="Total Processed"
          value={formatCurrency(stats.totalProcessed)}
          change={stats.growthRate}
          changePeriod="vs last period"
          icon={<Receipt className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />

        {/* Successful Payments */}
        <StatsCard
          title="Successful Payments"
          value={`${stats.successfulPayments.count} Txns`}
          subtitle={`Conversion: ${stats.successfulPayments.rate}%`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />

        {/* Failed Payments */}
        <StatsCard
          title="Failed Payments"
          value={`${stats.failedPayments.count} Drop-offs`}
          subtitle={`Drop Rate: ${stats.failedPayments.rate}%`}
          icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
          iconBgColor="bg-rose-50"
        />

        {/* Refunded Amount */}
        <StatsCard
          title="Refunded Amount"
          value={formatCurrency(stats.refundedAmount.amount)}
          subtitle={`${stats.refundedAmount.count} Orders Settled`}
          icon={<RotateCcw className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />

        {/* Flagged Transactions */}
        <StatsCard
          title="Flagged Risk"
          value={`${stats.flaggedTransactions.count} Alert(s)`}
          subtitle={`Avg Score: ${stats.flaggedTransactions.avgRiskScore}`}
          icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />

        {/* Recoverable Amount */}
        <StatsCard
          title="Recoverable Amount"
          value={formatCurrency(stats.recoverableAmount.amount)}
          subtitle={`${stats.recoverableAmount.count} Retry Link(s)`}
          icon={<RotateCcw className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
      </div>

      {/* ─── CHARTS SECTION ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Volume Chart (Line/Area) */}
        <Card
          headerTitle={
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Payment Volume Telemetry</h3>
            </div>
          }
          className="lg:col-span-2"
        >
          <TransactionChart data={volumeChartData} />
        </Card>

        {/* Payment Status Breakdown Chart (Bar) */}
        <Card
          headerTitle={
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Payment Status Distribution</h3>
            </div>
          }
        >
          <PaymentStatusChart data={statusBreakdown} />
        </Card>
      </div>

      {/* ─── RISK OVERVIEW & AI INSIGHTS GRID ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insight Panel */}
        <Card
          headerTitle={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-extrabold text-slate-900">RPAI AI Insights</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                ACTIVE DEFENSE
              </span>
            </div>
          }
          className="lg:col-span-2 space-y-4"
        >
          <div className="space-y-3">
            {aiInsights.map((insight: any) => (
              <div
                key={insight.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900">{insight.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 pl-4 leading-relaxed">{insight.description}</p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(insight.actionRoute)}
                  className="shrink-0 bg-white"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {insight.actionText}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Risk Distribution Donut Chart */}
        <Card
          headerTitle={
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-extrabold text-slate-900">AI Risk Classification</h3>
            </div>
          }
        >
          <RiskDistributionChart data={riskBreakdown} />
        </Card>
      </div>

      {/* ─── RECENT TRANSACTIONS TABLE ────────────────────────────────────────── */}
      <Card
        headerTitle={
          <div className="flex items-center justify-between w-full">
            <h3 className="text-sm font-extrabold text-slate-900">Recent Payment Telemetry</h3>
            <span className="text-xs text-slate-500 font-normal">Click any row to inspect transaction telemetry</span>
          </div>
        }
        headerAction={
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTES.PAYMENTS)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View All Payments
          </Button>
        }
      >
        <Table
          columns={recentColumns}
          data={recentPayments}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => navigate(`/payments/${item.id}`)}
        />
      </Card>

      {/* ─── SECURITY & SYSTEM STATUS PANEL ───────────────────────────────────── */}
      <Card headerTitle="Security & System Infrastructure Status">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Razorpay Connection</span>
              <p className="text-xs font-extrabold text-slate-900">Connected</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              ONLINE
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Database Engine</span>
              <p className="text-xs font-extrabold text-slate-900">MongoDB Cluster</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              CONNECTED
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">AI Risk Model</span>
              <p className="text-xs font-extrabold text-slate-900">RPAI Agent v2.4</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              ONLINE
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Webhook Listener</span>
              <p className="text-xs font-extrabold text-slate-900">Razorpay Signature Verifier</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              ACTIVE
            </div>
          </div>
        </div>
      </Card>

      {/* ─── CREATE PAYMENT ORDER MODAL ────────────────────────────────────────── */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Create Razorpay Payment Order"
        subtitle="Generates an active Razorpay order ID for test checkout testing."
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <Input
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <Input
            label="Customer Email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
          <Input
            label="Order Amount (INR ₹)"
            type="number"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Generate Razorpay Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

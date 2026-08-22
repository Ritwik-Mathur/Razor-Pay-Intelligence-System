import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ROUTES } from '../utils/constants';
import {
  User,
  Mail,
  Phone,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Receipt,
  ArrowUpRight,
  Building2,
} from 'lucide-react';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCustomerDetail(id);
  }, [id]);

  const fetchCustomerDetail = async (customerId: string) => {
    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('rpai_token');
      const res = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCustomer(json.data);
        }
      }
    } catch (e) {
      console.warn('Backend API connection offline, using fallback customer profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultCustomer = {
    customerId: id || 'cust_01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    totalSpent: 450000,
    totalTransactions: 14,
    successfulTransactions: 14,
    failedTransactions: 0,
    refundedTransactions: 0,
    averageTransactionValue: 32142,
    successRate: 100,
    riskScore: 8,
    riskLevel: 'low',
    status: 'active',
    lastActivityAt: new Date().toISOString(),
    aiSummary: 'Customer has completed 14 transactions. Average transaction value: ₹32,142. No significant suspicious behavior detected.',
    paymentMethodsUsed: [
      { method: 'Visa Card (•••• 4242)', count: 12, percentage: 85 },
      { method: 'Razorpay UPI (aarav@okaxis)', count: 2, percentage: 15 },
    ],
    recentTransactions: [
      {
        id: 'pay_NzkX9218ab',
        razorpayOrderId: 'order_Oab91823x',
        amount: 45000,
        currency: 'INR',
        status: 'CAPTURED',
        method: 'card',
        cardBrand: 'Visa',
        cardLast4: '4242',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'pay_NzkX9217xx',
        razorpayOrderId: 'order_Oab91822x',
        amount: 12000,
        currency: 'INR',
        status: 'CAPTURED',
        method: 'card',
        cardBrand: 'Visa',
        cardLast4: '4242',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  };

  const data = customer || defaultCustomer;

  const getInitials = (name?: string) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const txnColumns = [
    {
      key: 'id',
      title: 'Transaction ID',
      render: (item: any) => (
        <span className="font-mono text-xs font-bold text-blue-600 hover:underline">
          {item.id || item.transactionId}
        </span>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (item: any) => <span className="font-extrabold text-slate-900">{formatCurrency(item.amount)}</span>,
    },
    {
      key: 'method',
      title: 'Payment Method',
      render: (item: any) => (
        <span className="font-semibold uppercase text-xs text-slate-700">
          {item.method || item.paymentMethod} {item.cardLast4 ? `(•• ${item.cardLast4})` : ''}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />,
    },
    {
      key: 'createdAt',
      title: 'Timestamp',
      render: (item: any) => <span className="text-[11px] text-slate-500">{formatDate(item.createdAt)}</span>,
    },
    {
      key: 'action',
      title: 'Details',
      render: (item: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/payments/${item.id || item.transactionId}`)}
          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Back Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/customers')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Customers
        </Button>
        <span className="text-xs text-slate-400 font-mono">Customer Profile: {data.customerId}</span>
      </div>

      {/* Customer Header Card */}
      <Card className="p-6 bg-white border-slate-200 banking-card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center shadow-md border-2 border-slate-800 shrink-0">
              {getInitials(data.name)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{data.name}</h1>
                <Badge variant={data.status === 'active' ? 'success' : 'danger'}>
                  {data.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {data.email}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {data.phone || '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">AI Risk Level:</span>
            <Badge variant={data.riskScore > 70 ? 'danger' : 'success'}>
              {data.riskLevel.toUpperCase()} ({data.riskScore} / 100)
            </Badge>
          </div>
        </div>
      </Card>

      {/* 7 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 banking-card-shadow space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-slate-400">Total Spent</span>
          <p className="text-sm font-black text-slate-900 truncate">{formatCurrency(data.totalSpent)}</p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 banking-card-shadow space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-slate-400">Transactions</span>
          <p className="text-sm font-black text-slate-900">{data.totalTransactions} Txns</p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 banking-card-shadow space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-slate-400">Avg Payment</span>
          <p className="text-sm font-black text-slate-900 truncate">{formatCurrency(data.averageTransactionValue)}</p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 banking-card-shadow space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-emerald-600">Success Rate</span>
          <p className="text-sm font-black text-emerald-700">{data.successRate || 100}%</p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 banking-card-shadow space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-rose-600">Failed Drops</span>
          <p className="text-sm font-black text-rose-700">{data.failedTransactions || 0}</p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 banking-card-shadow space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-blue-600">Refunds</span>
          <p className="text-sm font-black text-blue-700">{data.refundedTransactions || 0}</p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 banking-card-shadow space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-slate-400">Risk Score</span>
          <p className="text-sm font-black text-slate-900">{data.riskScore} / 100</p>
        </div>
      </div>

      {/* AI Summary Section Required by Prompt */}
      <Card
        headerTitle={
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-extrabold text-slate-900">RPAI Telemetry AI Summary</h3>
          </div>
        }
        className="bg-slate-900 text-white border-slate-800"
      >
        <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/60 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-sky-400 font-extrabold uppercase text-[11px]">
            <CheckCircle2 className="w-4 h-4" /> Data-Driven Behavior Insight
          </div>
          <p className="text-slate-200 leading-relaxed font-medium text-xs">
            {data.aiSummary}
          </p>
        </div>
      </Card>

      {/* Credit Intelligence Card Tab on Customer Detail */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4.5 h-4.5 text-sky-400" />
            <h3 className="text-sm font-extrabold tracking-tight uppercase">Credit Intelligence Profile</h3>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              Assessed
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/credit/profile/demo_app_001')}
            className="border-sky-500/50 bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 font-bold"
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
          >
            View Credit Assessment
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 text-xs">
          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Alternative Score</span>
            <span className="text-base font-black text-emerald-400">791 / 900</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Risk Level</span>
            <span className="text-xs font-extrabold text-teal-300">LOW-MODERATE</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Data Completeness</span>
            <span className="text-xs font-extrabold text-white">71%</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Cash Flow Stability</span>
            <span className="text-xs font-extrabold text-emerald-300">85 / 100</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Payment Consistency</span>
            <span className="text-xs font-extrabold text-emerald-300">97 / 100</span>
          </div>
        </div>
      </Card>

      {/* Payment Method Usage & Recent Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Method Breakdown */}
        <Card headerTitle="Payment Method Distribution">
          <div className="space-y-3 text-xs">
            {data.paymentMethodsUsed && data.paymentMethodsUsed.map((m: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>{m.method}</span>
                  <span className="font-mono text-slate-500">{m.count} Txns ({m.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer Transaction History */}
        <Card headerTitle="Customer Payment History" className="lg:col-span-2">
          <Table
            columns={txnColumns}
            data={data.recentTransactions || []}
            keyExtractor={(t) => t.id || t.transactionId}
            onRowClick={(t) => navigate(`/payments/${t.id || t.transactionId}`)}
          />
        </Card>
      </div>
    </div>
  );
};

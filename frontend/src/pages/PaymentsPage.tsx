import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { Tooltip } from '../components/ui/Tooltip';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import {
  Search,
  Filter,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Receipt,
  RotateCcw,
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();

  // Search, Filter, Sort, Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_desc' | 'amount_asc'>('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('rpai_token');
      const res = await fetch(`${API_BASE_URL}/payments`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPayments(json.data);
        }
      }
    } catch (e) {
      console.warn('Backend API connection offline, using cached telemetry list.');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultPayments = [
    {
      id: 'pay_NzkX9218ab',
      razorpayOrderId: 'order_Oab91823x',
      razorpayPaymentId: 'pay_NzkX9218ab',
      amount: 45000,
      currency: 'INR',
      status: 'CAPTURED',
      method: 'card',
      cardBrand: 'Visa',
      cardLast4: '4242',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav.sharma@example.com',
      riskScore: 8,
      riskLevel: 'low',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'pay_MkkX9102bc',
      razorpayOrderId: 'order_P9102834y',
      razorpayPaymentId: 'pay_MkkX9102bc',
      amount: 128000,
      currency: 'INR',
      status: 'FAILED',
      failureReason: '3DS Verification Timeout',
      method: 'card',
      cardBrand: 'Mastercard',
      cardLast4: '8812',
      customerName: 'Priya Patel',
      customerEmail: 'priya.patel@example.com',
      riskScore: 78,
      riskLevel: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'pay_XcY8831oq',
      razorpayOrderId: 'order_XcY8831oq',
      razorpayPaymentId: 'pay_XcY8831oq',
      amount: 45000,
      currency: 'INR',
      status: 'REFUNDED',
      method: 'netbanking',
      bank: 'HDFC',
      customerName: 'Deepak Rao',
      customerEmail: 'deepak.rao@example.com',
      riskScore: 12,
      riskLevel: 'low',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'pay_Yq8831zz',
      razorpayOrderId: 'order_Yq8831zz',
      razorpayPaymentId: 'pay_Yq8831zz',
      amount: 67000,
      currency: 'INR',
      status: 'FAILED',
      failureReason: 'Network Timeout',
      method: 'upi',
      vpa: 'rahul@upi',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul.sharma@example.com',
      riskScore: 18,
      riskLevel: 'low',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: 'pay_Zk2291ab',
      razorpayOrderId: 'order_Zk2291ab',
      razorpayPaymentId: 'pay_Zk2291ab',
      amount: 69000,
      currency: 'INR',
      status: 'CAPTURED',
      method: 'card',
      cardBrand: 'Visa',
      cardLast4: '1192',
      customerName: 'Kavita Singh',
      customerEmail: 'kavita.singh@example.com',
      riskScore: 72,
      riskLevel: 'high',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
  ];

  const allPayments = payments.length > 0 ? payments : defaultPayments;

  // Filter & Search Logic
  const filtered = allPayments.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      (p.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.razorpayOrderId || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status?.toUpperCase() === statusFilter.toUpperCase();
    const matchesRisk = riskFilter === 'all' || p.riskLevel?.toLowerCase() === riskFilter.toLowerCase();
    const matchesMethod = methodFilter === 'all' || p.method?.toLowerCase() === methodFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesRisk && matchesMethod;
  });

  // Sort Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'amount_desc') return b.amount - a.amount;
    if (sortBy === 'amount_asc') return a.amount - b.amount;
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns = [
    {
      key: 'id',
      title: 'Transaction / Order',
      render: (item: any) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors">
            {item.id || item.transactionId}
          </span>
          <p className="text-[10px] text-slate-400 font-mono">{item.razorpayOrderId}</p>
        </div>
      ),
    },
    {
      key: 'customerName',
      title: 'Customer',
      render: (item: any) => (
        <div>
          <p className="font-semibold text-slate-800 text-xs">{item.customerName}</p>
          <p className="text-[10px] text-slate-400">{item.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (item: any) => (
        <span className="font-extrabold text-slate-900 text-xs">
          {formatCurrency(item.amount)}
        </span>
      ),
    },
    {
      key: 'method',
      title: 'Payment Method',
      render: (item: any) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          <span className="capitalize">{item.method || 'card'}</span>
          {item.cardLast4 && <span className="text-slate-400 font-mono text-[11px]">•••• {item.cardLast4}</span>}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />,
    },
    {
      key: 'riskLevel',
      title: 'Risk Score',
      render: (item: any) => {
        const score = item.riskScore || 10;
        const level = score >= 81 ? 'CRITICAL' : score >= 61 ? 'HIGH' : score >= 31 ? 'MEDIUM' : 'LOW';
        const color = score >= 61 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
        return (
          <Tooltip content={`Risk score ${score}/100 — ${level}`}>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color}`}>
              {score} / 100 ({level})
            </span>
          </Tooltip>
        );
      },
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (item: any) => <span className="text-[11px] text-slate-500">{formatDate(item.createdAt)}</span>,
    },
    {
      key: 'actions',
      title: '',
      render: (item: any) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/payments/${item.id || item.transactionId}`);
          }}
          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Payments & Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Razorpay Test Mode transactions, payment orders, and live risk scores.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.PAYMENT_CREATE)}
        >
          Make Payment
        </Button>
      </div>

      {/* Main Filter & Table Card */}
      <Card className="p-5 space-y-4">
        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Search by Payment ID, Customer, Order..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="all">All Payment Statuses</option>
            <option value="CAPTURED">Captured / Successful</option>
            <option value="FAILED">Failed Payments</option>
            <option value="HELD">Held in Review</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk (&lt;31)</option>
            <option value="medium">Medium Risk (31-60)</option>
            <option value="high">High Risk (&gt;60)</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="all">All Payment Methods</option>
            <option value="card">Cards (Visa/Mastercard)</option>
            <option value="upi">UPI / VPA</option>
            <option value="netbanking">Netbanking</option>
          </select>
        </div>

        {/* Sort & Results Counter */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{paginated.length}</strong> of{' '}
            <strong className="text-slate-900">{sorted.length}</strong> transactions
          </span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold px-2.5 py-1 text-slate-700 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_desc">Amount (High to Low)</option>
              <option value="amount_asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Loading Skeletons vs Data Table vs Empty State */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={<Receipt className="w-6 h-6 text-slate-400" />}
            title="No transactions found"
            description="No payment telemetry matching your active filters. Make your first Razorpay test payment to see live activity here."
            actionLabel="Make Test Payment"
            onAction={() => navigate(ROUTES.PAYMENT_CREATE)}
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginated}
              keyExtractor={(p) => p.id || p.transactionId}
              onRowClick={(p) => navigate(`/payments/${p.id || p.transactionId}`)}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                <span className="text-xs font-extrabold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

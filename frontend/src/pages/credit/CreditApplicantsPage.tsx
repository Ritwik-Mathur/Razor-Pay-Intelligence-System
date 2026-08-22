import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ROUTES } from '../../utils/constants';
import { Search, Filter, Plus, ArrowUpRight, ShieldCheck, Building2, User } from 'lucide-react';

export const CreditApplicantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rpai_token');
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/credit/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.applications) {
          setApplicants(json.data.applications);
        }
      }
    } catch (err) {
      console.warn('Fetch applicants error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applicants.filter((app) => {
    const matchesSearch =
      app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || app.applicantType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns = [
    {
      key: 'applicant',
      title: 'Applicant',
      render: (item: any) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
            {item.applicantType === 'MSME' ? <Building2 className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-emerald-600" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-xs">{item.fullName}</span>
              {item.isDemoData && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase">
                  DEMO
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">{item.businessName || item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'applicantType',
      title: 'Type',
      render: (item: any) => (
        <span className="text-xs font-bold text-slate-700">{item.applicantType}</span>
      ),
    },
    {
      key: 'requestedLoanAmount',
      title: 'Requested Loan',
      render: (item: any) => (
        <span className="font-mono font-extrabold text-xs text-slate-900">
          ₹{Number(item.requestedLoanAmount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'score',
      title: 'Credit Score',
      render: (item: any) => {
        if (!item.score) return <span className="text-xs text-slate-400 italic">Not Assessed</span>;
        const color = item.score >= 700 ? 'text-emerald-600' : item.score >= 580 ? 'text-amber-500' : 'text-rose-500';
        return (
          <div className="flex items-center gap-1">
            <span className={`font-black text-sm ${color}`}>{item.score}</span>
            <span className="text-[10px] text-slate-400">/ 900</span>
          </div>
        );
      },
    },
    {
      key: 'riskLevel',
      title: 'Risk Level',
      render: (item: any) => (
        <StatusBadge status={item.riskLevel || 'PENDING'} />
      ),
    },
    {
      key: 'dataCompleteness',
      title: 'Completeness',
      render: (item: any) => (
        <div className="w-24">
          <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-0.5">
            <span>{item.dataCompleteness || 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.dataCompleteness || 0}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />,
    },
    {
      key: 'action',
      title: 'Action',
      render: (item: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/credit/profile/${item.applicationId}`)}
          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Credit Applicants</h1>
          <p className="text-xs text-slate-500">Manage and review alternative credit assessments.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.CREDIT_APPLY)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Application
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, business, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-medium"
            >
              <option value="ALL">All Types</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="MSME">MSME</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="ASSESSED">Assessed</option>
              <option value="REVIEW_REQUIRED">Review Required</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        <Table
          data={filtered}
          columns={columns}
          keyExtractor={(item) => item.applicationId}
          emptyMessage="No credit applications match the criteria."
        />
      </Card>
    </div>
  );
};

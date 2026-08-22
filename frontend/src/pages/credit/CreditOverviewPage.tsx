import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/ui/StatsCard';
import { ROUTES } from '../../utils/constants';
import {
  Building2,
  Users,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calculator,
  Bot,
  Lock,
  ArrowRight,
  Info,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const CreditOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    applicationsAssessed: 3,
    alternativeProfiles: 3,
    averageCreditScore: 611,
    lowRiskApplicants: 1,
    moderateRiskApplicants: 1,
    highRiskApplicants: 1,
    pendingConsent: 0,
    humanReviewsRequired: 1,
  });

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rpai_token');
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/credit/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setMetrics(json.data);
      }
    } catch (err) {
      console.warn('Overview fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 banking-card-shadow">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Credit Intelligence</h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
              Alternative Data Module
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Alternative credit insights for individuals and MSMEs with limited traditional credit history.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.CREDIT_APPLY)}
            leftIcon={<FileText className="w-3.5 h-3.5" />}
          >
            Start Assessment
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.CREDIT_SIMULATOR)}
            leftIcon={<Calculator className="w-3.5 h-3.5" />}
          >
            Loan Simulator
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.CREDIT_AI)}
            leftIcon={<Bot className="w-3.5 h-3.5 text-sky-500" />}
          >
            AI Credit Advisor
          </Button>
        </div>
      </div>

      {/* ─── MANDATORY DISCLAIMER BANNER ──────────────────────────────────────── */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">Responsible Lending & Informational Assessment Notice:</span>
          <span>
            RPAI provides AI-assisted financial risk insights for informational and lender-review purposes only. It does not guarantee loan approval or disburse loans directly. All final credit decisions require a licensed lender review.
          </span>
        </div>
      </div>

      {/* ─── 8 CREDIT DASHBOARD METRICS ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Applications Assessed"
          value={metrics.applicationsAssessed}
          subtitle="3 Demo Profiles Loaded"
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />

        <StatsCard
          title="Alternative Profiles"
          value={metrics.alternativeProfiles}
          subtitle="Razorpay + Cash Flow signals"
          icon={<Building2 className="w-5 h-5 text-sky-600" />}
          iconBgColor="bg-sky-50"
        />

        <StatsCard
          title="Average Credit Score"
          value={`${metrics.averageCreditScore} / 900`}
          subtitle="Scale: 300 to 900"
          icon={<PieChart className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />

        <StatsCard
          title="Low Risk Applicants"
          value={metrics.lowRiskApplicants}
          subtitle="Score >= 700"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />

        <StatsCard
          title="Moderate Risk Applicants"
          value={metrics.moderateRiskApplicants}
          subtitle="Score 580 - 699"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />

        <StatsCard
          title="High Risk Applicants"
          value={metrics.highRiskApplicants}
          subtitle="Score < 580"
          icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
          iconBgColor="bg-rose-50"
        />

        <StatsCard
          title="Pending Consent"
          value={metrics.pendingConsent}
          subtitle="Data source consents"
          icon={<Lock className="w-5 h-5 text-slate-600" />}
          iconBgColor="bg-slate-100"
        />

        <StatsCard
          title="Human Reviews Required"
          value={metrics.humanReviewsRequired}
          subtitle="Workflow queue"
          icon={<Users className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />
      </div>

      {/* ─── DEMO PROFILES SECTION ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">Synthetic Demo Profiles</h2>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
              DEMO DATA
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.CREDIT_APPLICANTS)} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            View All Applicants
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile 1: Strong */}
          <Card className="hover:border-slate-300 transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  Strong Profile
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">Aarav Mehta</h3>
                <p className="text-xs text-slate-500">Mehta Digital Solutions (MSME)</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600">791</span>
                <span className="text-[10px] text-slate-400 block font-mono">/ 900</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Monthly Inflow</span>
                <span className="font-extrabold text-slate-800">₹1,20,000</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Requested Loan</span>
                <span className="font-extrabold text-slate-800">₹5,00,000</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => navigate('/credit/profile/demo_app_001')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Assessment
            </Button>
          </Card>

          {/* Profile 2: Moderate */}
          <Card className="hover:border-slate-300 transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                  Moderate Profile
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">Priya Nair</h3>
                <p className="text-xs text-slate-500">Freelance Creative (Individual)</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-500">624</span>
                <span className="text-[10px] text-slate-400 block font-mono">/ 900</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Monthly Inflow</span>
                <span className="font-extrabold text-slate-800">₹55,000</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Requested Loan</span>
                <span className="font-extrabold text-slate-800">₹2,00,000</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => navigate('/credit/profile/demo_app_002')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Assessment
            </Button>
          </Card>

          {/* Profile 3: High Risk */}
          <Card className="hover:border-slate-300 transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                  High-Risk Profile
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">Rajesh Kumar</h3>
                <p className="text-xs text-slate-500">Street Vendor (Individual)</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-rose-500">418</span>
                <span className="text-[10px] text-slate-400 block font-mono">/ 900</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Monthly Inflow</span>
                <span className="font-extrabold text-slate-800">₹18,000</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Requested Loan</span>
                <span className="font-extrabold text-slate-800">₹80,000</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => navigate('/credit/profile/demo_app_003')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Assessment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

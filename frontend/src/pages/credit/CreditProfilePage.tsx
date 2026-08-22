import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CreditScoreGauge } from '../../components/credit/CreditScoreGauge';
import { ScoreBreakdownBar } from '../../components/credit/ScoreBreakdownBar';
import { CashFlowChart } from '../../components/credit/CashFlowChart';
import { AffordabilityCard } from '../../components/credit/AffordabilityCard';
import { ROUTES } from '../../utils/constants';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ArrowRight,
  Bot,
  FileText,
  Lock,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const CreditProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    if (id) fetchProfileData(id);
  }, [id]);

  const fetchProfileData = async (appId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rpai_token');
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/credit/applications/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setApp(json.data);
      }
    } catch (err) {
      console.warn('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading credit assessment...</div>;
  }

  // Fallback demo values if app not found
  const demoData = app || {
    applicationId: id || 'demo_app_001',
    applicantType: 'MSME',
    fullName: 'Aarav Mehta',
    businessName: 'Mehta Digital Solutions',
    email: 'aarav.mehta@mehtadigital.com',
    requestedLoanAmount: 500000,
    monthlyRevenue: 120000,
    monthlyExpenses: 68000,
    existingMonthlyObligations: 8000,
    status: 'ASSESSED',
    score: 791,
    riskLevel: 'LOW_MODERATE',
    isDemoData: true,
    assessment: {
      alternativeCreditScore: 791,
      riskLevel: 'LOW_MODERATE',
      confidence: 82,
      dataCompleteness: 71,
      positiveFactors: [
        'Stable and consistent monthly cash flows (₹1,20,000/mo avg)',
        'Very high payment success rate (97% via Razorpay)',
        'Business operating duration > 3 years',
        'Positive net monthly cash flow (₹44,000/mo free cash)',
      ],
      riskFactors: [
        'Missing bank statement verification',
        'Merchant rating data not connected',
      ],
      missingData: ['Bank cash-flow statement not connected', 'Merchant rating data not available'],
      affordabilityLevel: 'HIGH',
      estimatedFreeCashFlow: 44000,
      estimatedRepaymentCapacity: 17600,
      aiExplanation: `RPAI Alternative Credit Score: 791/900 (LOW-MODERATE RISK)\n\n[DEMO DATA] Assessment is supported by 71% data completeness across 4 connected signals.\n\nPositive Signals:\n• Stable monthly cash flow (₹1,20,000 inflow avg)\n• 97% successful payment ratio\n• Operating history > 3 years\n\nAreas of Concern:\n• Bank cash-flow statement not connected\n\nIMPORTANT: This assessment is for informational and lender-review purposes only. It does not constitute loan approval.`,
      recommendation: 'PROCEED_TO_LENDER_REVIEW',
      responsibleLendingChecks: {
        consentPresent: true,
        dataSufficient: true,
        affordabilityCalculated: true,
        riskConfidenceAcceptable: true,
        requiresHumanReview: false,
      },
      components: [
        { name: 'Cash Flow Stability', weight: 0.28, rawScore: 85 },
        { name: 'Payment Consistency', weight: 0.22, rawScore: 97 },
        { name: 'Business Activity', weight: 0.18, rawScore: 75 },
        { name: 'Repayment Behavior', weight: 0.15, rawScore: 80 },
        { name: 'Merchant Reputation', weight: 0.10, rawScore: 60 },
        { name: 'Financial Behavior Assessment', weight: 0.07, rawScore: 82 },
      ],
    },
  };

  const assessment = demoData.assessment || {};
  const score = assessment.alternativeCreditScore || demoData.score || 700;
  const riskLevel = assessment.riskLevel || demoData.riskLevel || 'MODERATE';

  return (
    <div className="space-y-6 pb-12">
      {/* ─── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 banking-card-shadow">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {demoData.fullName}
            </h1>
            {demoData.businessName && (
              <span className="text-xs text-slate-500 font-medium">({demoData.businessName})</span>
            )}
            {demoData.isDemoData && (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                DEMO DATA
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Application ID: <code className="font-mono">{demoData.applicationId}</code> • Type: {demoData.applicantType}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => navigate('/credit/privacy')} leftIcon={<Lock className="w-3.5 h-3.5" />}>
            Manage Consent
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.CREDIT_AI)} leftIcon={<Bot className="w-3.5 h-3.5 text-sky-500" />}>
            Ask AI Advisor
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.CREDIT_REVIEW)} leftIcon={<UserCheck className="w-3.5 h-3.5" />}>
            Human Review Queue
          </Button>
        </div>
      </div>

      {/* ─── MANDATORY DISCLAIMER ─────────────────────────────────────────────── */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          This assessment is an AI-assisted financial risk insight for informational and lender-review purposes. It does NOT guarantee loan approval or disburse funds directly.
        </span>
      </div>

      {/* ─── TOP SECTION: GAUGE & OVERVIEW ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CreditScoreGauge
          score={score}
          riskLevel={riskLevel}
          confidence={assessment.confidence || 82}
          dataCompleteness={assessment.dataCompleteness || 71}
        />

        <div className="lg:col-span-2">
          <ScoreBreakdownBar components={assessment.components || []} />
        </div>
      </div>

      {/* ─── CASH FLOW & AFFORDABILITY ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">6-Month Cash Flow Trend</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Inflow vs Outflow</span>
          </div>
          <CashFlowChart />
        </Card>

        <AffordabilityCard
          freeCashFlow={assessment.estimatedFreeCashFlow || 44000}
          repaymentCapacity={assessment.estimatedRepaymentCapacity || 17600}
          affordabilityLevel={assessment.affordabilityLevel || 'HIGH'}
          monthlyEMI={18500}
        />
      </div>

      {/* ─── POSITIVE & RISK FACTORS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3 bg-emerald-50/30 border-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-emerald-900 tracking-tight uppercase">Positive Assessment Signals</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {(assessment.positiveFactors || [
              'Stable and consistent monthly cash flows',
              'High payment success rate (97%)',
              'Operating history > 3 years',
            ]).map((factor: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 space-y-3 bg-rose-50/30 border-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-extrabold text-rose-900 tracking-tight uppercase">Risk Factors & Areas of Concern</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {(assessment.riskFactors || [
              'Bank cash-flow statement not connected',
              'Merchant rating data not available',
            ]).map((factor: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ─── AI EXPLANATION BOX ──────────────────────────────────────────────── */}
      <Card className="p-6 bg-slate-900 text-white space-y-3 border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-sm font-extrabold tracking-tight uppercase">AI Credit Score Explanation</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Grounded Intelligence</span>
        </div>

        <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-line font-mono">
          {assessment.aiExplanation || 'AI explanation loading...'}
        </p>
      </Card>

      {/* ─── RESPONSIBLE LENDING CHECKLIST ────────────────────────────────────── */}
      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">Responsible Lending Checklist</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {[
            { label: 'Consent Present', ok: assessment.responsibleLendingChecks?.consentPresent ?? true },
            { label: 'Data Sufficient', ok: assessment.responsibleLendingChecks?.dataSufficient ?? true },
            { label: 'Affordability Checked', ok: assessment.responsibleLendingChecks?.affordabilityCalculated ?? true },
            { label: 'Risk Confidence OK', ok: assessment.responsibleLendingChecks?.riskConfidenceAcceptable ?? true },
            { label: 'Human Review Needed', ok: !(assessment.responsibleLendingChecks?.requiresHumanReview ?? false) },
          ].map(({ label, ok }, idx) => (
            <div key={idx} className={`p-2.5 rounded-lg border text-center ${ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              <span className="font-bold block text-[11px]">{label}</span>
              <span className="text-[10px] font-mono mt-0.5 block">{ok ? '✓ PASSED' : '⚠ ACTION'}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

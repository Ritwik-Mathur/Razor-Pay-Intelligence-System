import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ShieldAlert, AlertTriangle, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';

export const CreditRiskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessment
        </button>
        <span className="text-xs font-bold text-slate-400">Application: {id}</span>
      </div>

      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Credit Risk Profile & Safeguards</h1>
            <p className="text-xs text-slate-500">Risk classification and responsible lending compliance checks.</p>
          </div>
        </div>
        <StatusBadge status="MODERATE" />
      </div>

      {/* Non-Negotiable Responsible Lending Guarantees */}
      <Card className="p-6 bg-slate-900 text-white space-y-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold tracking-tight uppercase text-sky-400">Responsible Lending Governance</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
            PCI & Fairness Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-extrabold text-emerald-400 block">✓ No Protected Characteristics</span>
            <p className="text-slate-400 text-[11px]">
              RPAI strictly excludes race, religion, caste, gender, sexual orientation, or health conditions from all credit scoring algorithms.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-extrabold text-emerald-400 block">✓ No Autonomous Loan Approvals</span>
            <p className="text-slate-400 text-[11px]">
              AI outputs are recommendation signals only. Every high-impact assessment requires human lender review before disbursement.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-extrabold text-emerald-400 block">✓ Consent-Gated Data Access</span>
            <p className="text-slate-400 text-[11px]">
              Data sources are accessed only after explicit user consent. Revoked consents immediately purge cached feature vectors.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-extrabold text-emerald-400 block">✓ Grounded AI Explanations</span>
            <p className="text-slate-400 text-[11px]">
              LLM explanations are strictly constrained to backend-calculated feature scores to eliminate hallucinations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

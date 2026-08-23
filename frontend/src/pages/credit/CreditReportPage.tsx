import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  FileText,
  Printer,
  Download,
  Building,
  CheckCircle2,
  AlertTriangle,
  Award,
  ShieldCheck,
  TrendingUp,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const CreditReportPage: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* ─── ACTION BAR (Hidden when printing) ─────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 banking-card-shadow print:hidden">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Business Credit Readiness Report</h1>
          <p className="text-xs text-slate-500">Official CreditGrow AI Evaluation Statement for Sharma Electronics</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print / Save as PDF
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Download className="w-4 h-4" />}>
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* ─── PRINTABLE REPORT CONTAINER ───────────────────────────────────────── */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 banking-card-shadow space-y-8 text-slate-900 print:border-none print:shadow-none">

        {/* REPORT HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-indigo-600">RPAI</span>
              <span className="text-xs font-bold text-slate-400">| CreditGrow AI Engine</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">BUSINESS CREDIT READINESS REPORT</h2>
            <p className="text-xs text-slate-500">Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-right sm:w-64">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">CREDITGROW SCORE</span>
            <div className="text-3xl font-black text-indigo-600 mt-0.5">78 <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-1">
              Readiness Status: STRONG
            </span>
          </div>
        </div>

        {/* MANDATORY DISCLAIMER */}
        <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
          <strong className="block font-bold">⚠️ Notice & Disclaimer:</strong>
          CreditGrow Score is an AI-generated business credit-readiness indicator designed for informational and lender-review purposes. It is NOT an official credit-bureau or CIBIL score and does not guarantee loan financing or approval.
        </div>

        {/* SECTION 1: BUSINESS OVERVIEW */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
            1. Business Overview & Telemetry Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] font-bold block uppercase">BUSINESS NAME</span>
              <span className="font-bold text-slate-900 mt-0.5 block">Sharma Electronics</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] font-bold block uppercase">CATEGORY</span>
              <span className="font-bold text-slate-900 mt-0.5 block">Electronics Retail</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] font-bold block uppercase">MONTHLY REVENUE</span>
              <span className="font-bold text-slate-900 mt-0.5 block">₹2,40,000</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] font-bold block uppercase">MONTHLY EXPENSES</span>
              <span className="font-bold text-slate-900 mt-0.5 block">₹1,75,000</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: SCORE COMPONENT BREAKDOWN */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
            2. Transparent Score Component Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { name: 'Revenue Stability', score: 88, weight: '20%', status: 'Strong' },
              { name: 'Cash Flow Health', score: 74, weight: '20%', status: 'Good' },
              { name: 'Payment Behaviour', score: 91, weight: '20%', status: 'Excellent' },
              { name: 'Repayment Behaviour', score: 95, weight: '15%', status: 'Excellent' },
              { name: 'Supplier Behaviour', score: 82, weight: '10%', status: 'Good' },
              { name: 'Business Stability', score: 79, weight: '10%', status: 'Good' },
              { name: 'Digital Financial Footprint', score: 71, weight: '5%', status: 'Fair' },
            ].map((c, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{c.name} ({c.weight})</span>
                  <span className="text-[10px] text-slate-500 font-medium">Status: {c.status}</span>
                </div>
                <div className="text-right font-black text-indigo-600 text-sm">{c.score} <span className="text-[10px] text-slate-400 font-normal">/100</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: STRENGTHS & RISK FACTORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Key Business Strengths
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Consistently stable monthly revenue (₹2,40,000 avg) over 36 months of operation.</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>100% repayment discipline record with zero loan defaults.</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>High digital payment success rate (96%) processed via Razorpay.</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
              Identified Risk Factors
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Monthly expense volatility (₹1,75,000) causes moderate cash flow swings.</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>27% of total revenue is merchant-reported cash sales (₹65,000/mo).</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Supplier on-time payment rate stands at 91% (minor payable delays).</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: AI EXECUTIVE SUMMARY */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5 text-xs text-indigo-950">
          <span className="font-bold block text-indigo-900">🧠 Credit Coach AI Executive Summary</span>
          <p className="leading-relaxed text-indigo-900 font-medium">
            Based on available business telemetry, <strong>Sharma Electronics</strong> currently demonstrates strong credit readiness. By maintaining minimum cash reserves of ₹25,000, reducing payment drops below 3%, and increasing documented digital transaction share, the business is projected to achieve a CreditGrow score of <strong>84/100 (+6 pts)</strong> within 3–6 months.
          </p>
        </div>

        {/* REPORT FOOTER */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>RPAI Platform © 2026 — CreditGrow AI Engine</span>
          <span>Verified Report Hash: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">rpt_sharma_78_2026</code></span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Award,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TimelineEvent {
  month: string;
  score: number;
  label: string;
  status: 'Strong' | 'Good' | 'Fair' | 'Poor';
  highlights: string[];
  riskNoted?: string;
}

export const CreditJourneyPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('May 2026');

  const timelineData: TimelineEvent[] = [
    {
      month: 'Jan 2026',
      score: 61,
      label: 'Fair',
      status: 'Fair',
      highlights: [
        'Initial baseline profile created',
        'Connected Razorpay payment telemetry',
        'Recorded first ₹60,000 cash revenue',
      ],
      riskNoted: 'Elevated payment failure rate (12%)',
    },
    {
      month: 'Feb 2026',
      score: 65,
      label: 'Fair',
      status: 'Fair',
      highlights: [
        'Payment failure rate reduced from 12% to 9%',
        'Zero supplier payment delays',
        'Monthly revenue expanded to ₹2,35,000',
      ],
    },
    {
      month: 'Mar 2026',
      score: 69,
      label: 'Good',
      status: 'Good',
      highlights: [
        'Completed 3 consecutive months of positive cash flow',
        'Established ₹20,000 emergency cash reserve',
        'Supplier on-time payment rate reached 90%',
      ],
    },
    {
      month: 'Apr 2026',
      score: 74,
      label: 'Good',
      status: 'Good',
      highlights: [
        'Payment failure rate dropped below 5%',
        'Achieved 100% obligation repayment record',
        'Documented digital footprint score improved',
      ],
    },
    {
      month: 'May 2026',
      score: 78,
      label: 'Strong',
      status: 'Strong',
      highlights: [
        'Revenue stability score reached 88/100',
        'Maintained ₹25,000 minimum cash reserves',
        'Supplier payment consistency reached 91%',
      ],
    },
  ];

  const activeEvent = timelineData.find((e) => e.month === selectedMonth) || timelineData[4];

  return (
    <div className="space-y-6 pb-12">
      {/* ─── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 banking-card-shadow">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Credit Journey & Timeline</h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
              CreditGrow Progression
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track how your business financial profile and CreditGrow score have evolved over time with milestone events.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
          <Award className="w-4 h-4 text-emerald-600" />
          <div className="text-right">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">CURRENT SCORE</span>
            <span className="text-sm font-black text-slate-900">78 / 100 <span className="text-xs text-emerald-600 font-bold">(+17 pts)</span></span>
          </div>
        </div>
      </div>

      {/* ─── SCORE TREND GRAPH (5 Months) ────────────────────────────────────── */}
      <Card className="p-6 border-slate-200 banking-card-shadow space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">CreditGrow Score Progress (Jan – May 2026)</h2>
            <p className="text-xs text-slate-500">Historical trend showing continuous credit readiness improvement</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
            <span className="text-xs font-semibold text-slate-600">CreditGrow Score</span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 90]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: any) => [`${v} / 100`, 'CreditGrow Score']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ─── TIMELINE CARDS & DETAIL VIEW ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* MONTHLY MILESTONE TIMELINE (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">Select Month to Inspect</h2>
          {timelineData.map((item, index) => {
            const isSelected = item.month === selectedMonth;
            return (
              <div
                key={item.month}
                onClick={() => setSelectedMonth(item.month)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.score}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.month}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">Status: {item.status}</span>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-400'}`} />
              </div>
            );
          })}
        </div>

        {/* MONTH DETAIL BREAKDOWN (7 cols) */}
        <Card className="lg:col-span-7 p-6 border-slate-200 banking-card-shadow space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">MILESTONE DETAILS</span>
              <h2 className="text-xl font-black text-slate-900">{activeEvent.month} Snapshot</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-600">{activeEvent.score} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 block mt-0.5">
                {activeEvent.status} Readiness
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Accomplishments & Events</h3>
            <div className="space-y-2">
              {activeEvent.highlights.map((h, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {activeEvent.riskNoted && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Identified Risk Factor</h3>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{activeEvent.riskNoted}</span>
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">💡 Credit Coach AI Summary</span>
            Between January and May 2026, <strong>Sharma Electronics</strong> improved its CreditGrow score by <strong>+17 points</strong> primarily by reducing payment failure rates from 12% down to 4% and establishing a consistent ₹25,000 cash reserve.
          </div>
        </Card>
      </div>
    </div>
  );
};

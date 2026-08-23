import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  DollarSign,
  Smartphone,
  CreditCard,
  Building,
  Plus,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RevenueRecord {
  month: string;
  digital: number;
  cash: number;
  total: number;
  merchantReportedNotes?: string;
  dateAdded: string;
}

export const CreditRevenuePage: React.FC = () => {
  const [revenueHistory, setRevenueHistory] = useState<RevenueRecord[]>([
    { month: 'Jan 2026', digital: 165000, cash: 60000, total: 225000, dateAdded: '2026-01-31' },
    { month: 'Feb 2026', digital: 170000, cash: 65000, total: 235000, dateAdded: '2026-02-28' },
    { month: 'Mar 2026', digital: 175000, cash: 65000, total: 240000, dateAdded: '2026-03-31' },
    { month: 'Apr 2026', digital: 172000, cash: 66000, total: 238000, dateAdded: '2026-04-30' },
    { month: 'May 2026', digital: 178000, cash: 64000, total: 242000, dateAdded: '2026-05-31' },
  ]);

  const [month, setMonth] = useState('Jun 2026');
  const [cashAmount, setCashAmount] = useState<number | ''>(45000);
  const [notes, setNotes] = useState('Counter cash sales & manual receipts');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddCashSales = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashAmount || Number(cashAmount) <= 0) return;

    const digitalEst = 180000;
    const newRecord: RevenueRecord = {
      month,
      digital: digitalEst,
      cash: Number(cashAmount),
      total: digitalEst + Number(cashAmount),
      merchantReportedNotes: notes,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setRevenueHistory((prev) => [...prev, newRecord]);
    setSuccessMsg(`Logged ₹${Number(cashAmount).toLocaleString('en-IN')} cash sales for ${month}!`);
    setCashAmount('');
    setNotes('');

    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const totalDigital = revenueHistory.reduce((acc, r) => acc + r.digital, 0);
  const totalCash = revenueHistory.reduce((acc, r) => acc + r.cash, 0);
  const totalOverall = totalDigital + totalCash;
  const cashSharePercentage = Math.round((totalCash / totalOverall) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* ─── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 banking-card-shadow">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cash & Digital Revenue Tracking</h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              CreditGrow AI Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track digital Razorpay telemetry alongside merchant-reported cash sales for a complete business financial profile.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
          <Building className="w-4 h-4 text-indigo-600" />
          <div className="text-right">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">MERCHANT</span>
            <span className="text-xs font-bold text-slate-900">Sharma Electronics</span>
          </div>
        </div>
      </div>

      {/* ─── MANDATORY DATA DISCLAIMER BANNER ─────────────────────────────────── */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Merchant-Reported Data Notice:</span>
          <span>
            Cash sales entered below are explicitly categorized as <strong className="font-bold text-amber-950">Merchant-Reported Data</strong>. They are analyzed by CreditGrow AI to evaluate business scale, but are NOT treated as independently verified bank settlements.
          </span>
        </div>
      </div>

      {/* ─── METRICS CARDS ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-slate-200 banking-card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Documented Digital Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{(totalDigital / 5).toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo avg</span></p>
          <span className="text-[11px] font-medium text-emerald-600 mt-1 block">Verified via Razorpay Telemetry</span>
        </Card>

        <Card className="p-5 border-slate-200 banking-card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Merchant-Reported Cash</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{(totalCash / 5).toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo avg</span></p>
          <span className="text-[11px] font-medium text-amber-600 mt-1 block">{cashSharePercentage}% of Total Reported Revenue</span>
        </Card>

        <Card className="p-5 border-slate-200 banking-card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Combined Monthly Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{(totalOverall / 5).toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo avg</span></p>
          <span className="text-[11px] font-medium text-indigo-600 mt-1 block">Total Financial Volume Base</span>
        </Card>
      </div>

      {/* ─── MAIN CHART & ENTRY FORM ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* REVENUE BREAKDOWN CHART (8 cols) */}
        <Card className="lg:col-span-8 p-6 border-slate-200 banking-card-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Monthly Revenue Stream (Digital vs Cash)</h2>
              <p className="text-xs text-slate-500">Comparison of documented digital payments vs merchant-reported cash sales</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Digital Footprint Score: 71/100
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar dataKey="digital" name="Digital Revenue (Razorpay)" fill="#4f46e5" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="cash" name="Merchant-Reported Cash" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* LOG CASH SALES FORM (4 cols) */}
        <Card className="lg:col-span-4 p-6 border-slate-200 banking-card-shadow space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" /> Log Cash Revenue
            </h2>
            <p className="text-xs text-slate-500">Record counter cash sales for CreditGrow analysis</p>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAddCashSales} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">MONTH & YEAR</label>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500"
                placeholder="Jun 2026"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">CASH SALES AMOUNT (₹)</label>
              <Input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="45000"
                leftIcon={<span className="text-xs font-bold text-slate-400">₹</span>}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">NOTES / REGISTER RECEIPT REF</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500"
                placeholder="Counter cash sales register #104"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700 block mb-0.5">🏷️ Labeled as Merchant-Reported Data</span>
              Entries will increase overall revenue volume evaluation, but digital documented revenue carries higher weight (20% vs 5%).
            </div>

            <Button type="submit" variant="primary" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
              Save Cash Sales Record
            </Button>
          </form>
        </Card>
      </div>

      {/* ─── LOGGED HISTORY TABLE ────────────────────────────────────────────── */}
      <Card className="p-6 border-slate-200 banking-card-shadow space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">Historical Revenue Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Digital (Razorpay)</th>
                <th className="py-3 px-4">Merchant Cash</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Data Type</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {revenueHistory.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.month}</td>
                  <td className="py-3 px-4 text-indigo-600 font-bold">₹{row.digital.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-amber-600 font-bold">₹{row.cash.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-slate-900 font-extrabold">₹{row.total.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      Merchant-Reported
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Calculator,
  Info,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCcw,
  ArrowRight,
} from 'lucide-react';

export const LoanSimulatorPage: React.FC = () => {
  // Simulator Variable States
  const initialScore = 72;

  const [paymentFailures, setPaymentFailures] = useState<number>(3); // 8% down to 3%
  const [revenueGrowth, setRevenueGrowth] = useState<number>(10); // 0%, 10%, 20%
  const [supplierOnTime, setSupplierOnTime] = useState<number>(98); // 91% up to 98%
  const [expenseReduction, setExpenseReduction] = useState<number>(10); // 0%, 5%, 10%
  const [hasEmergencyReserve, setHasEmergencyReserve] = useState<boolean>(true); // ₹25,000

  // Calculate dynamic simulated score
  let failureBonus = Math.round((8 - paymentFailures) * 0.8);
  let revenueBonus = Math.round(revenueGrowth * 0.2);
  let supplierBonus = Math.round((supplierOnTime - 91) * 0.3);
  let expenseBonus = Math.round(expenseReduction * 0.2);
  let reserveBonus = hasEmergencyReserve ? 2 : 0;

  let scoreDiff = failureBonus + revenueBonus + supplierBonus + expenseBonus + reserveBonus;
  let simulatedScore = Math.min(98, Math.max(50, initialScore + scoreDiff));

  const handleReset = () => {
    setPaymentFailures(8);
    setRevenueGrowth(0);
    setSupplierOnTime(91);
    setExpenseReduction(0);
    setHasEmergencyReserve(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 banking-card-shadow">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Credit Simulator ("What If?" Tool)</h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              Interactive Scenario Modeling
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Test business decision scenarios for Sharma Electronics and observe real-time projected impact on your CreditGrow Score.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}>
          Reset to Initial Baseline (72)
        </Button>
      </div>

      {/* ─── MANDATORY DISCLAIMER BANNER ──────────────────────────────────────── */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Simulation & Estimation Disclaimer:</span>
          <span>
            Simulated scores are projections based on CreditGrow AI model parameters. They are designed for financial planning and decision modeling, and do not guarantee future credit-bureau scores or loan approvals.
          </span>
        </div>
      </div>

      {/* ─── MAIN SIMULATOR GRID ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* INPUT CONTROLS (7 cols) */}
        <Card className="lg:col-span-7 p-6 border-slate-200 banking-card-shadow space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" /> Scenario Variable Controls
            </h2>
            <span className="text-xs text-slate-400 font-medium">Real-time update</span>
          </div>

          {/* VARIABLE 1: Payment Failure Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-extrabold text-slate-800">What if Payment Failures Decrease?</label>
              <span className="font-bold text-indigo-600">{paymentFailures}% failure rate <span className="text-[10px] text-slate-400 font-normal">(was 8%)</span></span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={paymentFailures}
              onChange={(e) => setPaymentFailures(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1% (Minimal drops)</span>
              <span>10% (High failure rate)</span>
            </div>
          </div>

          {/* VARIABLE 2: Revenue Growth */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-extrabold text-slate-800">What if Monthly Revenue Increases?</label>
              <span className="font-bold text-emerald-600">+{revenueGrowth}% growth <span className="text-[10px] text-slate-400 font-normal">(Baseline ₹2.4L)</span></span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 20, 30].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setRevenueGrowth(g)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    revenueGrowth === g
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  +{g}%
                </button>
              ))}
            </div>
          </div>

          {/* VARIABLE 3: Supplier On-time Payment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-extrabold text-slate-800">What if Supplier Payments Become On-Time?</label>
              <span className="font-bold text-indigo-600">{supplierOnTime}% on-time <span className="text-[10px] text-slate-400 font-normal">(was 91%)</span></span>
            </div>
            <input
              type="range"
              min="80"
              max="100"
              step="1"
              value={supplierOnTime}
              onChange={(e) => setSupplierOnTime(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>80% (Frequent delays)</span>
              <span>100% (Perfect supplier history)</span>
            </div>
          </div>

          {/* VARIABLE 4: Monthly Expense Reduction */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-extrabold text-slate-800">What if Monthly Expenses Decrease?</label>
              <span className="font-bold text-emerald-600">-{expenseReduction}% expenses <span className="text-[10px] text-slate-400 font-normal">(Baseline ₹1.75L)</span></span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 15].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setExpenseReduction(ex)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    expenseReduction === ex
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  -{ex}%
                </button>
              ))}
            </div>
          </div>

          {/* VARIABLE 5: Emergency Reserve Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">Maintain ₹25,000 Emergency Cash Reserve</span>
              <span className="text-[11px] text-slate-500 font-medium">Mitigates cash flow volatility impact (+2 pts)</span>
            </div>
            <button
              type="button"
              onClick={() => setHasEmergencyReserve(!hasEmergencyReserve)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                hasEmergencyReserve ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${hasEmergencyReserve ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </Card>

        {/* OUTPUT SCORE DISPLAY (5 cols) */}
        <Card className="lg:col-span-5 p-6 border-slate-200 banking-card-shadow flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">SIMULATION OUTPUT</span>

            {/* SCORE COMPARISON BOX */}
            <div className="p-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-around">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">BASELINE</span>
                  <span className="text-3xl font-black text-slate-700">{initialScore}</span>
                  <span className="text-[10px] text-slate-400 font-bold block">/ 100</span>
                </div>

                <div className="text-indigo-600 font-bold text-xl">→</div>

                <div>
                  <span className="text-[10px] font-bold text-indigo-600 block uppercase">SIMULATED</span>
                  <span className="text-4xl font-black text-indigo-600">{simulatedScore}</span>
                  <span className="text-[10px] text-indigo-400 font-bold block">/ 100</span>
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-100 flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-700">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Projected Score Change: +{scoreDiff} Points</span>
              </div>
            </div>

            {/* FACTOR ATTRIBUTION BREAKDOWN */}
            <div className="space-y-2 text-left">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Simulated Factor Attribution</h3>
              <div className="space-y-1.5 text-xs font-medium">
                {failureBonus > 0 && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950">
                    <span>Payment failure reduction ({paymentFailures}%)</span>
                    <span className="font-extrabold text-emerald-700">+{failureBonus} pts</span>
                  </div>
                )}
                {revenueBonus > 0 && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950">
                    <span>Revenue growth (+{revenueGrowth}%)</span>
                    <span className="font-extrabold text-emerald-700">+{revenueBonus} pts</span>
                  </div>
                )}
                {supplierBonus > 0 && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950">
                    <span>Supplier payment improvement ({supplierOnTime}%)</span>
                    <span className="font-extrabold text-emerald-700">+{supplierBonus} pts</span>
                  </div>
                )}
                {expenseBonus > 0 && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950">
                    <span>Expense reduction (-{expenseReduction}%)</span>
                    <span className="font-extrabold text-emerald-700">+{expenseBonus} pts</span>
                  </div>
                )}
                {reserveBonus > 0 && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950">
                    <span>Emergency cash reserve buffer</span>
                    <span className="font-extrabold text-emerald-700">+{reserveBonus} pts</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">🧠 Credit Coach AI Takeaway</span>
            Decreasing payment failures from 8% to {paymentFailures}% and keeping a ₹25,000 cash reserve yields the highest impact boost for Sharma Electronics.
          </div>
        </Card>
      </div>
    </div>
  );
};

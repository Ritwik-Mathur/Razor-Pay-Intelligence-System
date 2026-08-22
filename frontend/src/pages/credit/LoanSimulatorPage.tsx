import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Calculator, Info, ArrowRight, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

export const LoanSimulatorPage: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(300000);
  const [tenureMonths, setTenureMonths] = useState<number>(18);
  const [interestRate, setInterestRate] = useState<number>(12);

  // Calculate EMI
  const monthlyRate = interestRate / 100 / 12;
  let emi = 0;
  if (monthlyRate === 0) {
    emi = Math.round(loanAmount / tenureMonths);
  } else {
    emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );
  }

  const totalRepayment = emi * tenureMonths;
  const totalInterest = totalRepayment - loanAmount;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Loan Repayment Simulator</h1>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
              Illustrative Tool
            </span>
          </div>
          <p className="text-xs text-slate-500">Simulate monthly repayment schedules for financial planning.</p>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Illustrative Simulation Only:</strong> This calculator is for estimation and financial planning purposes. RPAI is not a lender and does not offer or approve loans directly.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="p-6 space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">Simulation Inputs</h3>

          {/* Loan Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-extrabold text-slate-700">Loan Amount</label>
              <span className="font-mono font-extrabold text-blue-600 text-sm">
                ₹{loanAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹50,000</span>
              <span>₹20,000,000</span>
            </div>
          </div>

          {/* Tenure Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-extrabold text-slate-700">Tenure (Months)</label>
              <span className="font-mono font-extrabold text-slate-900">{tenureMonths} Months</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[6, 12, 18, 24, 36].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTenureMonths(m)}
                  className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                    tenureMonths === m
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700">Illustrative Interest Rate (% p.a.)</label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              placeholder="12"
            />
          </div>
        </Card>

        {/* Results */}
        <Card className="p-6 bg-slate-900 text-white space-y-5 border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated EMI Breakdown</span>
              <span className="text-[10px] font-mono text-emerald-400">Monthly Schedule</span>
            </div>

            <div className="text-center py-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium">Illustrative Monthly EMI</span>
              <span className="text-3xl font-black text-emerald-400 tracking-tight mt-1 block">
                ₹{emi.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Interest</span>
                <span className="font-mono font-extrabold text-sky-300 mt-0.5 block">
                  ₹{totalInterest.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Repayment</span>
                <span className="font-mono font-extrabold text-white mt-0.5 block">
                  ₹{totalRepayment.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <p>
              * Figures are illustrative estimates based on reducing balance EMI calculation. Final terms depend on lender risk assessment.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

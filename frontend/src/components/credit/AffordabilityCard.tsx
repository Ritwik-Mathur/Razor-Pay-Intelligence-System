import React from 'react';
import { cn } from '../../utils/cn';
import { ShieldCheck, Info } from 'lucide-react';

interface AffordabilityCardProps {
  freeCashFlow: number;
  repaymentCapacity: number;
  affordabilityLevel: 'HIGH' | 'MODERATE' | 'LOW' | string;
  monthlyEMI?: number;
  className?: string;
}

export const AffordabilityCard: React.FC<AffordabilityCardProps> = ({
  freeCashFlow,
  repaymentCapacity,
  affordabilityLevel,
  monthlyEMI,
  className,
}) => {
  const getLevelConfig = (lvl: string) => {
    switch (lvl.toUpperCase()) {
      case 'HIGH':
        return { label: 'HIGH AFFORDABILITY', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', barBg: 'bg-emerald-500' };
      case 'MODERATE':
        return { label: 'MODERATE AFFORDABILITY', bg: 'bg-amber-50 text-amber-800 border-amber-200', barBg: 'bg-amber-500' };
      case 'LOW':
      default:
        return { label: 'LOW AFFORDABILITY', bg: 'bg-rose-50 text-rose-800 border-rose-200', barBg: 'bg-rose-500' };
    }
  };

  const cfg = getLevelConfig(affordabilityLevel);

  return (
    <div className={cn('p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">Affordability Analysis</h3>
        <span className={cn('text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider', cfg.bg)}>
          {cfg.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Estimated Free Cash Flow</span>
          <span className="text-lg font-black text-slate-900 mt-0.5 block">
            ₹{freeCashFlow.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500">Inflow minus expenses & obligations</span>
        </div>

        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
          <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Potential Repayment Capacity</span>
          <span className="text-lg font-black text-emerald-900 mt-0.5 block">
            ₹{repaymentCapacity.toLocaleString('en-IN')}<span className="text-xs font-medium text-emerald-700">/mo</span>
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Conservative 40% FCF cap</span>
        </div>
      </div>

      {monthlyEMI && monthlyEMI > 0 && (
        <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl text-xs">
          <span>Illustrative Monthly EMI:</span>
          <span className="font-mono font-bold text-sky-300">₹{monthlyEMI.toLocaleString('en-IN')}/mo</span>
        </div>
      )}

      <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-500 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <span>
          This affordability estimate does NOT guarantee loan approval or actual repayment ability. Final assessment requires licensed lender review.
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { cn } from '../../utils/cn';

export interface ScoreComponentData {
  name: string;
  weight: number; // e.g. 0.28
  rawScore: number; // 0-100
  weightedScore?: number;
  positiveFactors?: string[];
  negativeFactors?: string[];
}

interface ScoreBreakdownBarProps {
  components: ScoreComponentData[];
  className?: string;
}

export const ScoreBreakdownBar: React.FC<ScoreBreakdownBarProps> = ({ components, className }) => {
  const defaultComponents: ScoreComponentData[] = [
    { name: 'Cash Flow Stability', weight: 0.28, rawScore: 78 },
    { name: 'Payment Consistency', weight: 0.22, rawScore: 92 },
    { name: 'Business Activity', weight: 0.18, rawScore: 68 },
    { name: 'Repayment Behavior', weight: 0.15, rawScore: 80 },
    { name: 'Merchant Reputation', weight: 0.10, rawScore: 60 },
    { name: 'Financial Behavior Assessment', weight: 0.07, rawScore: 75 },
  ];

  const items = components && components.length > 0 ? components : defaultComponents;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 text-emerald-700';
    if (score >= 65) return 'bg-teal-500 text-teal-700';
    if (score >= 50) return 'bg-amber-500 text-amber-700';
    return 'bg-rose-500 text-rose-700';
  };

  return (
    <div className={cn('space-y-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">Score Components & Weights</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configurable Model</span>
      </div>

      <div className="space-y-3.5">
        {items.map((comp, idx) => {
          const weightPercent = Math.round(comp.weight * 100);
          const score = comp.rawScore;

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{comp.name}</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                    {weightPercent}%
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900">{score} / 100</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700 ease-out', getScoreColor(score).split(' ')[0])}
                  style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

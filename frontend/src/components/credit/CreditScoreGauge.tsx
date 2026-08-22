import React from 'react';
import { cn } from '../../utils/cn';

interface CreditScoreGaugeProps {
  score: number; // 300 - 900
  riskLevel: 'LOW' | 'LOW_MODERATE' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' | string;
  confidence?: number;
  dataCompleteness?: number;
  className?: string;
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({
  score,
  riskLevel,
  confidence = 82,
  dataCompleteness = 71,
  className,
}) => {
  // Map score 300-900 to angle -120 deg to +120 deg (total 240 deg sweep)
  const normalizedScore = Math.max(300, Math.min(900, score));
  const percentage = (normalizedScore - 300) / 600; // 0 to 1
  const angle = -120 + percentage * 240;

  const getRiskConfig = (level: string) => {
    switch (level.toUpperCase()) {
      case 'LOW':
        return { label: 'LOW RISK', color: 'text-emerald-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', arcColor: '#10b981' };
      case 'LOW_MODERATE':
        return { label: 'LOW-MODERATE RISK', color: 'text-teal-500', bg: 'bg-teal-50 text-teal-700 border-teal-200', arcColor: '#14b8a6' };
      case 'MODERATE':
        return { label: 'MODERATE RISK', color: 'text-amber-500', bg: 'bg-amber-50 text-amber-700 border-amber-200', arcColor: '#f59e0b' };
      case 'HIGH':
        return { label: 'HIGH RISK', color: 'text-orange-500', bg: 'bg-orange-50 text-orange-700 border-orange-200', arcColor: '#f97316' };
      case 'VERY_HIGH':
      default:
        return { label: 'VERY HIGH RISK', color: 'text-rose-500', bg: 'bg-rose-50 text-rose-700 border-rose-200', arcColor: '#ef4444' };
    }
  };

  const riskCfg = getRiskConfig(riskLevel);

  return (
    <div className={cn('flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden', className)}>
      <div className="w-full flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
        <span className="uppercase tracking-wider font-extrabold text-[10px] text-slate-400">RPAI Alternative Score</span>
        <span className="text-[10px] font-mono text-slate-400">Range: 300–900</span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative w-56 h-36 flex items-center justify-center my-2">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 120">
          {/* Background Track Arc */}
          <path
            d="M 20 110 A 80 80 0 1 1 180 110"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Color Segments */}
          {/* Very High (300-450) */}
          <path d="M 20 110 A 80 80 0 0 1 48 53" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" opacity="0.3" />
          {/* High (450-580) */}
          <path d="M 48 53 A 80 80 0 0 1 85 32" fill="none" stroke="#f97316" strokeWidth="16" opacity="0.3" />
          {/* Moderate (580-700) */}
          <path d="M 85 32 A 80 80 0 0 1 115 32" fill="none" stroke="#f59e0b" strokeWidth="16" opacity="0.3" />
          {/* Low Moderate (700-800) */}
          <path d="M 115 32 A 80 80 0 0 1 152 53" fill="none" stroke="#14b8a6" strokeWidth="16" opacity="0.3" />
          {/* Low (800-900) */}
          <path d="M 152 53 A 80 80 0 0 1 180 110" fill="none" stroke="#10b981" strokeWidth="16" strokeLinecap="round" opacity="0.3" />

          {/* Active Arc Highlight */}
          <path
            d="M 20 110 A 80 80 0 1 1 180 110"
            fill="none"
            stroke={riskCfg.arcColor}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="335"
            strokeDashoffset={335 - 335 * percentage}
            className="transition-all duration-1000 ease-out"
          />

          {/* Needle Center Pin */}
          <circle cx="100" cy="110" r="8" fill="#0f172a" />
          <circle cx="100" cy="110" r="4" fill="#38bdf8" />

          {/* Rotating Needle */}
          <g transform={`rotate(${angle}, 100, 110)`} className="transition-transform duration-1000 ease-out">
            <line x1="100" y1="110" x2="100" y2="38" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </svg>

        {/* Score Readout Displayed Centered Below Needle Base */}
        <div className="absolute bottom-0 text-center">
          <span className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            {normalizedScore}
          </span>
          <span className="text-xs font-bold text-slate-400 block -mt-0.5">/ 900</span>
        </div>
      </div>

      {/* Risk Badge & Metrics */}
      <div className="w-full flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
        <span className={cn('text-[11px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider', riskCfg.bg)}>
          {riskCfg.label}
        </span>
        <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
          <span>Confidence: <strong className="text-slate-800">{confidence}%</strong></span>
          <span>Completeness: <strong className="text-slate-800">{dataCompleteness}%</strong></span>
        </div>
      </div>
    </div>
  );
};

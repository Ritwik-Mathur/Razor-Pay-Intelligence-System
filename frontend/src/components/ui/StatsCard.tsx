import React from 'react';
import { cn } from '../../utils/cn';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changePeriod?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changePeriod = 'vs last period',
  icon,
  iconBgColor = 'bg-slate-100 text-slate-700',
  subtitle,
}) => {
  const isPositive = change !== undefined && change >= 0;
  const stringValue = String(value);

  return (
    <Card className="hover:border-slate-300 transition-all p-4 min-w-0 overflow-hidden banking-card-shadow">
      {/* Top Header Row: Title on Left, Icon Badge isolated on Right */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-slate-100">
        <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider truncate min-w-0" title={title}>
          {title}
        </p>
        <div className={cn('p-1.5 rounded-lg flex items-center justify-center shrink-0 shadow-2xs', iconBgColor)}>
          {icon}
        </div>
      </div>

      {/* Main Value Display */}
      <Tooltip content={stringValue}>
        <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate leading-tight my-1">
          {value}
        </h4>
      </Tooltip>

      {/* Footer Subtitle / Change */}
      {(change !== undefined || subtitle) && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] min-w-0 flex-wrap">
          {change !== undefined && (
            <span
              className={cn(
                'inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0',
                isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {Math.abs(change)}%
            </span>
          )}
          <span className="text-slate-400 text-[10px] truncate max-w-full font-medium">{subtitle || changePeriod}</span>
        </div>
      )}
    </Card>
  );
};

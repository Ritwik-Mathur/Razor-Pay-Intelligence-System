import React from 'react';
import { cn } from '../../utils/cn';
import { CreditCard as CardIcon } from 'lucide-react';

export interface RpaiCreditCardProps {
  network: 'VISA' | 'MASTERCARD' | 'RUPAY' | 'AMEX' | string;
  last4: string;
  holderName: string;
  label?: string;
  status?: string;
  onClick?: () => void;
  className?: string;
}

export const RpaiCreditCard: React.FC<RpaiCreditCardProps> = ({
  network,
  last4,
  holderName,
  label = 'Payment method',
  status = 'Verified Safe',
  onClick,
  className,
}) => {
  const getCardStyle = (net: string) => {
    switch (net.toUpperCase()) {
      case 'VISA':
        return 'from-slate-900 via-blue-950 to-slate-900 border-blue-500/30 text-white';
      case 'MASTERCARD':
        return 'from-slate-900 via-rose-950 to-slate-900 border-rose-500/30 text-white';
      case 'RUPAY':
        return 'from-slate-900 via-emerald-950 to-slate-900 border-emerald-500/30 text-white';
      case 'AMEX':
      case 'AMERICAN EXPRESS':
        return 'from-slate-900 via-amber-950 to-slate-900 border-amber-500/30 text-white';
      default:
        return 'from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white';
    }
  };

  const isFlagged = status.toLowerCase().includes('flagged') || status.toLowerCase().includes('risk');

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative w-full min-h-[195px] rounded-2xl p-4 sm:p-5 bg-gradient-to-br border shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer select-none group',
        getCardStyle(network),
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header: Brand & Status Badge */}
      <div className="flex items-start justify-between gap-2 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-md bg-white/10 backdrop-blur-xs border border-white/20 shrink-0">
            <CardIcon className="w-4 h-4 text-sky-300" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-sky-300 block truncate">
              RPAI TOKENIZED
            </span>
            <p className="text-[11px] font-bold text-white/90 leading-tight truncate max-w-[130px]" title={label}>
              {label}
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <span
          className={cn(
            'text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border backdrop-blur-xs shrink-0 whitespace-nowrap',
            isFlagged
              ? 'bg-rose-500/25 text-rose-200 border-rose-400/40'
              : 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40'
          )}
        >
          {status}
        </span>
      </div>

      {/* Card Center: Chip & Masked Identifier */}
      <div className="z-10 my-3 space-y-2.5">
        {/* EMV Chip & Contactless Signal */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-6 rounded bg-gradient-to-r from-amber-400 to-amber-200 border border-amber-500/50 shadow-inner flex items-center justify-center">
            <div className="w-4 h-3 border border-amber-600/40 rounded-xs" />
          </div>
          <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>

        {/* Masked Card Number */}
        <div className="flex items-center justify-between text-base font-mono font-bold tracking-widest text-white">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span className="text-sky-300">{last4}</span>
        </div>
      </div>

      {/* Card Footer: Holder Name & Network */}
      <div className="flex items-end justify-between z-10 pt-2 border-t border-white/10 mt-auto">
        <div className="min-w-0 pr-2">
          <span className="text-[9px] font-extrabold uppercase text-white/50 tracking-wider block">Cardholder</span>
          <p className="text-xs font-bold text-white tracking-wide truncate uppercase">
            {holderName}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="font-black tracking-wider text-xs text-white italic drop-shadow-sm">
            {network.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

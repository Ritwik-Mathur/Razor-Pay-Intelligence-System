import React from 'react';
import { cn } from '../../utils/cn';

interface RpaiLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const RpaiLogo: React.FC<RpaiLogoProps> = ({
  className,
  showText = true,
  size = 'md',
  variant = 'dark',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div className={cn('relative flex items-center justify-center shrink-0 drop-shadow-md', sizeClasses[size])}>
        <img
          src="/rpai-logo.png"
          alt="RPAI Official Logo"
          className="w-full h-full object-contain filter drop-shadow-sm"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={cn('font-black tracking-tight leading-none', textClasses[size], variant === 'light' ? 'text-white' : 'text-slate-900')}>
              RPAI
            </span>
            <span className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 uppercase">
              AI OPS
            </span>
          </div>
          <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
            Detect. Decide. Recover.
          </span>
        </div>
      )}
    </div>
  );
};

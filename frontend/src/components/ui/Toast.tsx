import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  onClose,
  durationMs = 5000,
}) => {
  useEffect(() => {
    if (durationMs > 0) {
      const timer = setTimeout(onClose, durationMs);
      return () => clearTimeout(timer);
    }
  }, [onClose, durationMs]);

  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      accent: 'bg-emerald-600',
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      accent: 'bg-rose-600',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      accent: 'bg-amber-600',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
      accent: 'bg-blue-600',
    },
  };

  const current = styles[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border banking-card-shadow relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-2 duration-200',
        current.bg
      )}
    >
      <div className={cn('absolute left-0 top-0 bottom-0 w-1', current.accent)} />
      {current.icon}
      <div className="flex-1 min-w-0 pr-4">
        {title && <h4 className="text-xs font-extrabold uppercase tracking-wider mb-0.5">{title}</h4>}
        <p className="text-xs font-medium leading-relaxed">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-md">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

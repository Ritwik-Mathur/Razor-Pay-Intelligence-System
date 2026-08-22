import React from 'react';
import { Button } from './Button';
import { AlertOctagon, RefreshCw, ShieldAlert, WifiOff, ServerOff } from 'lucide-react';

export type ErrorStateType = 'razorpay' | 'ai' | 'database' | 'webhook' | 'generic';

interface ErrorStateProps {
  type?: ErrorStateType;
  title?: string;
  description?: string;
  onRetry?: () => void;
}

const ERROR_CONFIGS: Record<ErrorStateType, { title: string; desc: string; icon: React.ReactNode }> = {
  razorpay: {
    title: 'Razorpay Gateway Connection Warning',
    desc: 'Unable to reach Razorpay Test Gateway API. Check server connectivity or credentials.',
    icon: <WifiOff className="w-6 h-6 text-amber-600" />,
  },
  ai: {
    title: 'AI Intelligence Engine Offline',
    desc: 'The autonomous fraud risk analysis model is temporarily unavailable. Using rule-based fallback evaluation.',
    icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
  },
  database: {
    title: 'Database Synchronization Delayed',
    desc: 'Local ledger sync is temporarily delayed. Transaction telemetry will resume automatically.',
    icon: <ServerOff className="w-6 h-6 text-slate-600" />,
  },
  webhook: {
    title: 'Razorpay Webhook Event Delayed',
    desc: 'Real-time payment capture webhook is pending verification. Check Razorpay Dashboard webhook logs.',
    icon: <AlertOctagon className="w-6 h-6 text-amber-600" />,
  },
  generic: {
    title: 'System Telemetry Warning',
    desc: 'An unexpected error occurred while fetching payment data. Please try again.',
    icon: <AlertOctagon className="w-6 h-6 text-rose-600" />,
  },
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'generic',
  title,
  description,
  onRetry,
}) => {
  const cfg = ERROR_CONFIGS[type];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 border border-rose-200 rounded-xl my-4 banking-card-shadow">
      <div className="w-12 h-12 rounded-xl bg-white border border-rose-200 flex items-center justify-center mb-3 shadow-2xs">
        {cfg.icon}
      </div>
      <h3 className="text-sm font-bold text-rose-900">{title || cfg.title}</h3>
      <p className="text-xs text-rose-700/80 max-w-md mt-1 mb-4 leading-relaxed">
        {description || cfg.desc}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};

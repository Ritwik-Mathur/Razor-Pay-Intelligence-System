import React from 'react';
import { getStatusBadgeColor } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { bg, text, border } = getStatusBadgeColor(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border',
        bg,
        text,
        border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full fill-current', text.replace('text-', 'bg-'))} />
      {status}
    </span>
  );
};

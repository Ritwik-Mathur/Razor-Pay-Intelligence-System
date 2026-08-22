import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  headerTitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  headerTitle,
  headerAction,
  footer,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 banking-card-shadow overflow-hidden flex flex-col',
        className
      )}
      {...props}
    >
      {(headerTitle || headerAction) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          {typeof headerTitle === 'string' ? (
            <h3 className="text-sm font-semibold text-slate-800 tracking-tight">{headerTitle}</h3>
          ) : (
            headerTitle
          )}
          {headerAction}
        </div>
      )}
      <div className="p-5 flex-1">{children}</div>
      {footer && <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">{footer}</div>}
    </div>
  );
};

import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('rounded-md animate-shimmer', className)}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3 banking-card-shadow">
    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
    <Skeleton className="h-7 w-36" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden banking-card-shadow">
    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

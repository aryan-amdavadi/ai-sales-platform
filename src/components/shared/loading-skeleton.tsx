import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function TableLoadingSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3 p-4">
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <Skeleton className="h-4 w-32 bg-slate-800" />
        <Skeleton className="h-4 w-24 bg-slate-800" />
        <Skeleton className="h-4 w-20 bg-slate-800" />
        <Skeleton className="h-4 w-28 bg-slate-800" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-800/50">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-48 bg-slate-800" />
            <Skeleton className="h-3 w-32 bg-slate-800/60" />
          </div>
          <Skeleton className="h-5 w-24 bg-slate-800" />
          <Skeleton className="h-5 w-16 bg-slate-800" />
          <Skeleton className="h-8 w-20 bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

export function DetailLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-slate-800" />
          <Skeleton className="h-4 w-40 bg-slate-800/70" />
        </div>
        <Skeleton className="h-10 w-32 bg-slate-800" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48 rounded-xl bg-slate-800" />
        <Skeleton className="h-48 rounded-xl bg-slate-800" />
        <Skeleton className="h-48 rounded-xl bg-slate-800" />
      </div>
      <Skeleton className="h-64 rounded-xl bg-slate-800" />
    </div>
  );
}

export const LoadingSkeleton = TableLoadingSkeleton;

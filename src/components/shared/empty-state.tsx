import React from 'react';
import { LucideIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search query, filters, or reset to view all items.',
  icon: Icon = Search,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 my-6">
      <div className="p-3.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-200">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-mono"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

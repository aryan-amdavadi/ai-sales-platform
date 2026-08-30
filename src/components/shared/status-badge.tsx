import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'urgency' | 'source' | 'intent';
  className?: string;
}

export function StatusBadge({ status, type = 'status', className }: StatusBadgeProps) {
  let variantClass = 'bg-slate-800 text-slate-300 border-slate-700';

  if (type === 'urgency') {
    switch (status) {
      case 'IMMEDIATE':
        variantClass = 'bg-red-500/10 text-red-400 border-red-500/30 font-semibold';
        break;
      case 'HIGH':
        variantClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        break;
      case 'MEDIUM':
        variantClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        break;
      case 'LOW':
        variantClass = 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        break;
    }
  } else if (type === 'source') {
    switch (status) {
      case 'LINKEDIN':
        variantClass = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
        break;
      case 'X':
        variantClass = 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30';
        break;
      case 'WEBSITE':
        variantClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        break;
      case 'PUBLIC_DIRECTORY':
        variantClass = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
        break;
      case 'FREELANCE_PLATFORM':
        variantClass = 'bg-teal-500/10 text-teal-400 border-teal-500/30';
        break;
    }
  } else {
    // Lead / Call Status
    switch (status) {
      case 'HIGH_INTENT':
      case 'QUALIFIED':
        variantClass = 'bg-teal-500/15 text-teal-300 border-teal-500/40 font-medium';
        break;
      case 'INTERESTED':
      case 'MEETING':
        variantClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-medium';
        break;
      case 'CONTACTED':
        variantClass = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40';
        break;
      case 'RELEVANT':
        variantClass = 'bg-sky-500/15 text-sky-300 border-sky-500/40';
        break;
      case 'DISCOVERED':
        variantClass = 'bg-slate-500/15 text-slate-400 border-slate-600';
        break;
      case 'COMPLETED':
        variantClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
        break;
      case 'IN_PROGRESS':
        variantClass = 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse';
        break;
      case 'ACTIVE':
        variantClass = 'bg-teal-500/15 text-teal-300 border-teal-500/40';
        break;
    }
  }

  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono tracking-tight border',
        variantClass,
        className
      )}
    >
      {label}
    </span>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'urgency' | 'source' | 'intent';
  className?: string;
}

export function StatusBadge({ status, type = 'status', className }: StatusBadgeProps) {
  let variantClass = 'bg-slate-500/10 text-slate-600 border-slate-300/80';

  if (type === 'urgency') {
    switch (status) {
      case 'IMMEDIATE':
        variantClass = 'bg-rose-500/15 text-rose-700 border-rose-500/30 font-semibold';
        break;
      case 'HIGH':
        variantClass = 'bg-amber-500/15 text-amber-700 border-amber-500/30';
        break;
      case 'MEDIUM':
        variantClass = 'bg-blue-500/15 text-blue-700 border-blue-500/30';
        break;
      case 'LOW':
        variantClass = 'bg-slate-500/10 text-slate-600 border-slate-300/80';
        break;
    }
  } else if (type === 'source') {
    switch (status) {
      case 'LINKEDIN':
        variantClass = 'bg-blue-500/15 text-blue-700 border-blue-500/30';
        break;
      case 'X':
        variantClass = 'bg-slate-800/10 text-slate-700 border-slate-300/80';
        break;
      case 'WEBSITE':
        variantClass = 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30';
        break;
      case 'PUBLIC_DIRECTORY':
        variantClass = 'bg-teal-500/15 text-teal-700 border-teal-500/30';
        break;
      case 'FREELANCE_PLATFORM':
        variantClass = 'bg-indigo-500/15 text-indigo-700 border-indigo-500/30';
        break;
    }
  } else {
    // Lead / Call Status
    switch (status) {
      case 'HIGH_INTENT':
      case 'QUALIFIED':
        variantClass = 'bg-blue-500/15 text-blue-700 border-blue-500/30 font-semibold';
        break;
      case 'INTERESTED':
      case 'MEETING':
        variantClass = 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-semibold';
        break;
      case 'CONTACTED':
        variantClass = 'bg-indigo-500/15 text-indigo-700 border-indigo-500/30';
        break;
      case 'RELEVANT':
        variantClass = 'bg-teal-500/15 text-teal-700 border-teal-500/30';
        break;
      case 'DISCOVERED':
        variantClass = 'bg-slate-500/10 text-slate-600 border-slate-300/80';
        break;
      case 'COMPLETED':
        variantClass = 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30';
        break;
      case 'IN_PROGRESS':
        variantClass = 'bg-amber-500/15 text-amber-700 border-amber-500/30';
        break;
      case 'ACTIVE':
        variantClass = 'bg-blue-500/15 text-blue-700 border-blue-500/30';
        break;
    }
  }

  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium tracking-tight border backdrop-blur-sm shadow-xs',
        variantClass,
        className
      )}
    >
      {label}
    </span>
  );
}

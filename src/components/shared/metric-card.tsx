import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  variant?: 'default' | 'blue' | 'teal' | 'emerald' | 'indigo' | 'amber';
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  isPositive,
  icon: Icon,
  variant = 'default',
  className,
}: MetricCardProps) {
  const iconColors = {
    default: 'text-slate-500 bg-slate-100/70 border-slate-200/80',
    blue: 'text-blue-600 bg-blue-50/70 border-blue-200/60',
    teal: 'text-teal-600 bg-teal-50/70 border-teal-200/60',
    emerald: 'text-emerald-600 bg-emerald-50/70 border-emerald-200/60',
    indigo: 'text-indigo-600 bg-indigo-50/70 border-indigo-200/60',
    amber: 'text-amber-600 bg-amber-50/70 border-amber-200/60',
  };

  return (
    <Card
      className={cn(
        'p-3 xl:p-2.5 2xl:p-3.5 bg-white/85 backdrop-blur-md border border-slate-200/80 hover:border-blue-400/50 hover:bg-white transition-all duration-200 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 relative overflow-hidden min-w-0 rounded-xl group',
        className
      )}
    >
      <div className="flex items-start justify-between gap-1.5 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] 2xl:text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate" title={title}>
            {title}
          </p>
          <h3 className="text-base sm:text-lg xl:text-[15px] 2xl:text-xl font-bold text-slate-900 mt-0.5 tracking-tight font-sans truncate" title={String(value)}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] 2xl:text-xs text-slate-400 mt-0.5 truncate" title={subtitle}>
              {subtitle}
            </p>
          )}
          {change && (
            <p
              className={cn(
                'text-xs mt-1 font-medium flex items-center gap-1',
                isPositive ? 'text-emerald-600' : 'text-slate-400'
              )}
            >
              <span>{change}</span>
            </p>
          )}
        </div>
        <div
          className={cn(
            'p-1.5 2xl:p-2 rounded-lg border flex-shrink-0 backdrop-blur-sm shadow-2xs transition-transform group-hover:scale-105 ml-1',
            iconColors[variant]
          )}
        >
          <Icon className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
        </div>
      </div>
    </Card>
  );
}

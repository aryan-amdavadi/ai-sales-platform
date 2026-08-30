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
    default: 'text-slate-400 bg-slate-800/80 border-slate-700/60',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    teal: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <Card
      className={cn(
        'p-4 bg-slate-900/90 border-slate-800 hover:border-slate-700 transition-colors shadow-sm relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1.5 tracking-tight font-sans">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {change && (
            <p
              className={cn(
                'text-xs mt-1.5 font-medium flex items-center gap-1',
                isPositive ? 'text-emerald-400' : 'text-slate-400'
              )}
            >
              <span>{change}</span>
            </p>
          )}
        </div>
        <div className={cn('p-2 rounded-lg border', iconColors[variant])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
}


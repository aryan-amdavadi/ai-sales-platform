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
    default: 'text-[#64748B] bg-[#F7F9FC] border-[#DCE5EF]',
    blue: 'text-[#2563EB] bg-[#EFF6FF] border-[#2563EB]/20',
    teal: 'text-[#0F9D9A] bg-[#E8F7F5] border-[#0F9D9A]/20',
    emerald: 'text-[#16A34A] bg-[#DCFCE7]/60 border-[#16A34A]/20',
    indigo: 'text-[#2563EB] bg-[#EFF6FF] border-[#2563EB]/20',
    amber: 'text-[#D97706] bg-[#FEF3C7]/60 border-[#D97706]/20',
  };

  return (
    <Card
      className={cn(
        'p-4 bg-white border border-[#DCE5EF] hover:border-[#2563EB]/40 transition-colors shadow-sm relative overflow-hidden rounded-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-[#10233F] mt-1 tracking-tight font-sans">{value}</h3>
          {subtitle && <p className="text-xs text-[#64748B] text-slate-400 mt-1">{subtitle}</p>}
          {change && (
            <p
              className={cn(
                'text-xs mt-1.5 font-medium flex items-center gap-1',
                isPositive ? 'text-[#16A34A]' : 'text-[#64748B]'
              )}
            >
              <span>{change}</span>
            </p>
          )}
        </div>
        <div className={cn('p-2 rounded-md border flex-shrink-0', iconColors[variant])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
}

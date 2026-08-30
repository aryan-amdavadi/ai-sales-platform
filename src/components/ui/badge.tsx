import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-teal-500/20 text-teal-300 border-teal-500/30',
        secondary: 'border-transparent bg-slate-800 text-slate-300 border-slate-700',
        destructive: 'border-transparent bg-red-500/20 text-red-300 border-red-500/30',
        outline: 'text-slate-300 border-slate-700',
        highIntent: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 animate-pulse-subtle',
        mediumIntent: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
        lowIntent: 'border-slate-600 bg-slate-800/80 text-slate-400',
        urgencyImmediate: 'border-rose-500/50 bg-rose-500/20 text-rose-300 font-bold',
        urgencyHigh: 'border-orange-500/40 bg-orange-500/20 text-orange-300',
        platform: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

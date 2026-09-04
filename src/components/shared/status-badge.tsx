import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'urgency' | 'source' | 'intent';
  className?: string;
}

export function StatusBadge({ status, type = 'status', className }: StatusBadgeProps) {
  let variantClass = 'bg-[#F1F5F9] text-[#627D98] border-[#D9E2EC]';

  if (type === 'urgency') {
    switch (status) {
      case 'IMMEDIATE':
        variantClass = 'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/30 font-semibold';
        break;
      case 'HIGH':
        variantClass = 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30';
        break;
      case 'MEDIUM':
        variantClass = 'bg-[#EAF2FF] text-[#2563EB] border-[#2563EB]/30';
        break;
      case 'LOW':
        variantClass = 'bg-[#F1F5F9] text-[#627D98] border-[#D9E2EC]';
        break;
    }
  } else if (type === 'source') {
    switch (status) {
      case 'LINKEDIN':
        variantClass = 'bg-[#EAF2FF] text-[#2563EB] border-[#2563EB]/30';
        break;
      case 'X':
        variantClass = 'bg-[#F1F5F9] text-[#627D98] border-[#D9E2EC]';
        break;
      case 'WEBSITE':
        variantClass = 'bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30';
        break;
      case 'PUBLIC_DIRECTORY':
        variantClass = 'bg-[#E8F7F5] text-[#0F9D9A] border-[#0F9D9A]/30';
        break;
      case 'FREELANCE_PLATFORM':
        variantClass = 'bg-[#EAF2FF] text-[#163A5F] border-[#163A5F]/30';
        break;
    }
  } else {
    // Lead / Call Status
    switch (status) {
      case 'HIGH_INTENT':
      case 'QUALIFIED':
        variantClass = 'bg-[#EAF2FF] text-[#2563EB] border-[#2563EB]/30 font-semibold';
        break;
      case 'INTERESTED':
      case 'MEETING':
        variantClass = 'bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30 font-semibold';
        break;
      case 'CONTACTED':
        variantClass = 'bg-[#EAF2FF] text-[#163A5F] border-[#163A5F]/30';
        break;
      case 'RELEVANT':
        variantClass = 'bg-[#E8F7F5] text-[#0F9D9A] border-[#0F9D9A]/30';
        break;
      case 'DISCOVERED':
        variantClass = 'bg-[#F1F5F9] text-[#627D98] border-[#D9E2EC]';
        break;
      case 'COMPLETED':
        variantClass = 'bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30';
        break;
      case 'IN_PROGRESS':
        variantClass = 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30';
        break;
      case 'ACTIVE':
        variantClass = 'bg-[#EAF2FF] text-[#2563EB] border-[#2563EB]/30';
        break;
    }
  }

  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium tracking-tight border',
        variantClass,
        className
      )}
    >
      {label}
    </span>
  );
}

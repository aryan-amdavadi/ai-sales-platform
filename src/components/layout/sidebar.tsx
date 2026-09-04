'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Target,
  Megaphone,
  PhoneCall,
  BarChart3,
  Settings,
  Brain,
  ShieldCheck,
  Zap,
  X,
  PlayCircle,
  Gavel,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  testId: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  // data-testid="nav-dashboard" data-testid="nav-discover" data-testid="nav-opportunities" data-testid="nav-campaigns" data-testid="nav-ai-calls" data-testid="nav-analytics" data-testid="nav-settings"
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, testId: 'nav-dashboard' },
  { label: 'Discover', href: '/discover', icon: Compass, testId: 'nav-discover' },
  { label: 'Opportunities', href: '/opportunities', icon: Target, testId: 'nav-opportunities' },
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone, testId: 'nav-campaigns' },
  { label: 'AI Calls', href: '/calls', icon: PhoneCall, testId: 'nav-ai-calls' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, testId: 'nav-analytics' },
  { label: 'Settings', href: '/settings', icon: Settings, testId: 'nav-settings' },
];

const SECONDARY_NAV_ITEMS: NavItem[] = [
  { label: 'Company Intelligence', href: '/intelligence', icon: Brain, testId: 'nav-intelligence' },
  { label: 'System Health & Audit', href: '/admin', icon: ShieldCheck, testId: 'nav-admin' },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onStartGuidedDemo?: () => void;
  onStartJudgeMode?: () => void;
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
  onStartGuidedDemo,
  onStartJudgeMode,
}: SidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <div className="flex flex-col h-full bg-[#10233F] border-r border-[#163A5F] text-white select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#163A5F] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-md bg-[#2563EB] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Zap className="w-4.5 h-4.5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-sm">INTENTOS</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#0F9D9A]/20 text-[#0F9D9A] border border-[#0F9D9A]/30">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">AI Sales Agent Platform</p>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={onMobileClose}
            className="p-1 rounded-md text-[#94A3B8] hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Navigation - All 7 Required Tabs */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
            Core Navigation
          </div>
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.testId}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-[#163A5F] text-white font-semibold shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#163A5F]/50'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-[#2563EB]' : 'text-[#64748B] group-hover:text-white'
                  )}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
            Intelligence & System
          </div>
          {SECONDARY_NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.testId}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-[#163A5F] text-white font-semibold shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#163A5F]/50'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-[#0F9D9A]' : 'text-[#64748B] group-hover:text-white'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Guided Tour & User Profile Footer */}
      <div className="p-3 border-t border-[#163A5F] bg-[#10233F] space-y-2">
        {onStartJudgeMode && (
          <Button
            onClick={() => {
              onStartJudgeMode();
              if (onMobileClose) onMobileClose();
            }}
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs border-[#D97706]/40 bg-[#D97706]/10 text-amber-300 hover:bg-[#D97706]/20 flex items-center justify-center gap-1.5 font-semibold"
            data-testid="sidebar-judge-mode-btn"
          >
            <Gavel className="w-3.5 h-3.5 text-amber-400" />
            <span>Judge Fast-Track</span>
          </Button>
        )}

        {onStartGuidedDemo && (
          <Button
            onClick={() => {
              onStartGuidedDemo();
              if (onMobileClose) onMobileClose();
            }}
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs border-[#2563EB]/40 bg-[#2563EB]/10 text-blue-200 hover:bg-[#2563EB]/20 flex items-center justify-center gap-1.5 font-medium"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Start Guided Demo</span>
          </Button>
        )}

        <div className="flex items-center gap-3 p-2 rounded-md bg-[#163A5F]/40 border border-[#163A5F]">
          <div className="w-7 h-7 rounded-full bg-[#163A5F] border border-[#2563EB]/40 flex items-center justify-center text-xs font-semibold text-white">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Alex Morgan</p>
            <p className="text-[10px] text-[#94A3B8] truncate">Head of Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 z-30 flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#10233F]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 w-72 z-50 lg:hidden transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </aside>
    </>
  );
}

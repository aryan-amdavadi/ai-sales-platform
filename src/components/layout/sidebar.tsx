'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Compass,
  Megaphone,
  PhoneCall,
  Brain,
  BarChart3,
  Settings,
  ShieldCheck,
  Zap,
  Sparkles,
  X,
  PlayCircle,
  HelpCircle,
  Gavel,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Opportunities', href: '/opportunities', icon: Target },
      { label: 'Discover Engine', href: '/discover', icon: Compass },
      { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
      { label: 'AI Voice Calls', href: '/calls', icon: PhoneCall },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { label: 'Company Intelligence', href: '/intelligence', icon: Brain },
      { label: 'Pipeline Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'System Health & Logs', href: '/admin', icon: ShieldCheck },
    ],
  },
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
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80 text-slate-200">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-slate-100 text-sm">INTENTOS</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400">AI Sales Intelligence</p>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={onMobileClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors group',
                    isActive
                      ? 'bg-slate-900 text-blue-400 font-semibold border border-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Guided Tour & Account Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950 space-y-2">
        {onStartJudgeMode && (
          <Button
            onClick={() => {
              onStartJudgeMode();
              if (onMobileClose) onMobileClose();
            }}
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 flex items-center justify-center gap-1.5 font-semibold"
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
            className="w-full h-8 text-xs border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 flex items-center justify-center gap-1.5 font-medium"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Start Guided Demo</span>
          </Button>
        )}

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/50 border border-slate-800/60">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">Alex Morgan</p>
            <p className="text-[10px] text-slate-400 truncate">Head of Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 h-screen sticky top-0 z-30 flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
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

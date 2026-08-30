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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Opportunities', href: '/opportunities', icon: Target },
  { label: 'Discover Engine', href: '/discover', icon: Compass },
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { label: 'AI Voice Calls', href: '/calls', icon: PhoneCall },
  { label: 'Intelligence', href: '/intelligence', icon: Brain },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Admin & Health', href: '/admin', icon: ShieldCheck },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 text-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-all shadow-sm">
            <Zap className="w-4 h-4 fill-teal-400 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-slate-100 font-mono text-base">INTENTOS</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">AI Sales Intelligence</p>
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

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Core Workspaces
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                isActive
                  ? 'bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Workspace Profile / Onboarding Link */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
        <Link
          href="/onboarding"
          className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition-colors"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono">Setup Assistant</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Wizard</span>
        </Link>
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/40">
          <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-mono font-bold">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">Alex Morgan</p>
            <p className="text-[10px] text-slate-400 truncate">Head of Sales</p>
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

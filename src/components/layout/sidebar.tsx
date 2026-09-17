'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
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
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const navContent = (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-xl border-r border-slate-200/80 text-slate-800 select-none shadow-[2px_0_20px_rgba(15,23,42,0.03)]">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all group-hover:scale-105 group-hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)]">
            <Zap className="w-4.5 h-4.5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-slate-900 text-sm">INTENTOS</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">AI Sales Agent Platform</p>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={onMobileClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Navigation - All 7 Required Tabs */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                  'group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 border',
                  isActive
                    ? 'bg-blue-50/90 text-blue-700 font-semibold shadow-xs border-blue-200/70 backdrop-blur-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                  'group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 border',
                  isActive
                    ? 'bg-teal-50/90 text-teal-800 font-semibold shadow-xs border-teal-200/70 backdrop-blur-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600 shadow-[0_0_8px_rgba(13,148,136,0.6)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="mt-auto p-3 border-t border-slate-200/80 bg-slate-50/70 backdrop-blur-md space-y-2">
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 border border-slate-200 flex items-center justify-center text-xs font-bold text-white shadow-xs overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
              ) : (
                session?.user?.name?.substring(0, 2).toUpperCase() || 'U'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{session?.user?.name || 'Loading...'}</p>
              <p className="text-[10px] text-slate-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={async () => {
              await authClient.signOut();
              window.location.href = '/login';
            }}
            className="w-full justify-start h-7 text-[10px] text-slate-600 hover:text-red-600 hover:bg-red-50"
          >
            Sign out
          </Button>
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
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

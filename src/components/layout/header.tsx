'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  PhoneCall,
  Calendar,
  Database,
  UserCheck,
  PlayCircle,
  Gavel,
  Flame,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  onStartGuidedDemo?: () => void;
  onStartJudgeMode?: () => void;
}

interface NotificationItem {
  id: string;
  type:
    | 'HIGH_INTENT'
    | 'CALL_COMPLETED'
    | 'HUMAN_HANDOFF'
    | 'MEETING_RECOMMENDED'
    | 'CALLBACK_SCHEDULED'
    | 'CRM_SYNC';
  title: string;
  message: string;
  timestamp: string;
  link: string;
  read: boolean;
}

export function Header({
  onMobileMenuToggle,
  onStartGuidedDemo,
  onStartJudgeMode,
}: HeaderProps) {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'HIGH_INTENT',
      title: 'High-Intent Lead Discovered',
      message:
        'TechNova Solutions (John Smith - CTO) scored 94 intent for Microsoft 365 & SharePoint Implementation.',
      timestamp: '5m ago',
      link: '/opportunities',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'CALL_COMPLETED',
      title: 'AI Voice Qualification Completed',
      message: 'John Smith confirmed 30-day procurement window and agreed to scoping call.',
      timestamp: '15m ago',
      link: '/calls',
      read: false,
    },
    {
      id: 'notif-handoff',
      type: 'HUMAN_HANDOFF',
      title: 'Human Handoff Available',
      message:
        'Live autonomous call with CTO John Smith can be transferred to human sales engineer with one click.',
      timestamp: '20m ago',
      link: '/calls',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'MEETING_RECOMMENDED',
      title: 'Meeting Recommended (Hot Lead)',
      message:
        'Schedule a technical scoping call for Thursday 2 PM with CTO John Smith ($55,000 pipeline).',
      timestamp: '25m ago',
      link: '/opportunities',
      read: false,
    },
    {
      id: 'notif-4',
      type: 'CALLBACK_SCHEDULED',
      title: 'Follow-Up Callback Scheduled',
      message: 'John Smith requested follow-up on Thursday at 14:00 EST.',
      timestamp: '40m ago',
      link: '/calls',
      read: true,
    },
    {
      id: 'notif-5',
      type: 'CRM_SYNC',
      title: 'CRM Push Synchronized',
      message: 'Opportunity & contact created in Salesforce/HubSpot (CRM-SYNC-819204).',
      timestamp: '1h ago',
      link: '/calls',
      read: true,
    },
  ]);

  const popoverRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Overview Dashboard';
    if (path.startsWith('/opportunities/')) return 'Opportunity Intelligence';
    if (path.startsWith('/opportunities')) return 'Opportunities Explorer';
    if (path.startsWith('/discover')) return 'Public Intent Discovery';
    if (path.startsWith('/campaigns/')) return 'Campaign Management';
    if (path.startsWith('/campaigns')) return 'Outreach Campaigns';
    if (path.startsWith('/calls/')) return 'Call Session Intelligence';
    if (path.startsWith('/calls')) return 'AI Voice Cockpit';
    if (path.startsWith('/intelligence')) return 'Account Intelligence';
    if (path.startsWith('/analytics')) return 'Conversion Analytics';
    if (path.startsWith('/settings')) return 'Platform Settings';
    if (path.startsWith('/admin')) return 'System Health & Audit Logs';
    return 'Sales Intelligence';
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'HIGH_INTENT':
        return <Flame className="w-3.5 h-3.5 text-blue-400" />;
      case 'CALL_COMPLETED':
        return <PhoneCall className="w-3.5 h-3.5 text-teal-400" />;
      case 'MEETING_RECOMMENDED':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'CALLBACK_SCHEDULED':
        return <Calendar className="w-3.5 h-3.5 text-blue-400" />;
      case 'HUMAN_HANDOFF':
        return <UserCheck className="w-3.5 h-3.5 text-amber-400" />;
      case 'CRM_SYNC':
        return <Database className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/85 backdrop-blur-xl text-slate-800 border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 shadow-[0_1px_4px_rgba(15,23,42,0.02)]">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Workspace</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="font-semibold text-slate-900 tracking-tight">{getPageTitle(pathname)}</span>
        </div>
      </div>

      {/* Right: Quick Search, Guided Demo, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <Link
          href="/opportunities"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/90 text-xs text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Quick search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-500 font-mono shadow-2xs">
            ⌘K
          </kbd>
        </Link>

        {/* Judge Mode Fast-Track Button */}
        {onStartJudgeMode && (
          <Button
            onClick={onStartJudgeMode}
            size="sm"
            variant="outline"
            className="h-8 text-xs font-semibold border-amber-200/90 bg-amber-50/90 text-amber-900 hover:bg-amber-100 hover:border-amber-300 shadow-2xs flex items-center gap-1.5 transition-all"
            data-testid="judge-mode-trigger"
          >
            <Gavel className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Judge Mode</span>
          </Button>
        )}

        {/* Guided Demo Launch Button */}
        {onStartGuidedDemo && (
          <Button
            onClick={onStartGuidedDemo}
            size="sm"
            variant="outline"
            className="h-8 text-xs font-medium border-blue-200/90 bg-blue-50/90 text-blue-700 hover:bg-blue-100 hover:border-blue-300 shadow-2xs flex items-center gap-1.5 transition-all"
            data-testid="guided-demo-btn"
          >
            <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Guided Demo</span>
          </Button>
        )}

        {/* Live Engine Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[11px] font-semibold text-emerald-800">Nova AI: Active</span>
        </div>

        {/* Notification Center */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            aria-label="Notification center"
            data-testid="notifications-trigger"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs text-slate-800"
              data-testid="notifications-panel"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900">
                    Notifications ({unreadCount})
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-semibold"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                      );
                      setNotificationsOpen(false);
                    }}
                    className={`block p-2.5 rounded-lg border transition-all ${
                      n.read
                        ? 'bg-slate-50/70 border-slate-200/80 text-slate-500 hover:bg-slate-100/80'
                        : 'bg-blue-50/70 border-blue-200/70 text-slate-800 hover:bg-blue-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-900">
                        {getIcon(n.type)}
                        <span>{n.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {n.message}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link
          href="/settings"
          className="flex items-center gap-2 pl-2 border-l border-slate-200"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 border border-slate-200 text-white flex items-center justify-center text-xs font-bold shadow-xs hover:ring-2 hover:ring-blue-500/30 transition-all">
            AM
          </div>
        </Link>
      </div>
    </header>
  );
}

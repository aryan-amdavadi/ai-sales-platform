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
        return <Flame className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'CALL_COMPLETED':
        return <PhoneCall className="w-3.5 h-3.5 text-[#0F9D9A]" />;
      case 'MEETING_RECOMMENDED':
        return <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />;
      case 'CALLBACK_SCHEDULED':
        return <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'HUMAN_HANDOFF':
        return <UserCheck className="w-3.5 h-3.5 text-[#D97706]" />;
      case 'CRM_SYNC':
        return <Database className="w-3.5 h-3.5 text-[#16A34A]" />;
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 glass-header bg-white/80 backdrop-blur-md border-b border-[#DCE5EF] flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-1.5 rounded-md text-[#475569] hover:text-[#10233F] hover:bg-[#F1F5F9] lg:hidden"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#64748B] hidden sm:inline">Workspace</span>
          <span className="text-[#CBD5E1] hidden sm:inline">/</span>
          <span className="font-semibold text-[#10233F]">{getPageTitle(pathname)}</span>
        </div>
      </div>

      {/* Right: Quick Search, Guided Demo, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <Link
          href="/opportunities"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] text-xs text-[#64748B] hover:text-[#10233F] hover:border-[#2563EB]/40 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Quick search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#DCE5EF] text-[10px] text-[#64748B] font-mono shadow-sm">
            ⌘K
          </kbd>
        </Link>

        {/* Judge Mode Fast-Track Button */}
        {onStartJudgeMode && (
          <Button
            onClick={onStartJudgeMode}
            size="sm"
            variant="outline"
            className="h-8 text-xs font-semibold border-[#D97706]/40 bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 flex items-center gap-1.5"
            data-testid="judge-mode-trigger"
          >
            <Gavel className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Judge Mode</span>
          </Button>
        )}

        {/* Guided Demo Launch Button */}
        {onStartGuidedDemo && (
          <Button
            onClick={onStartGuidedDemo}
            size="sm"
            variant="outline"
            className="h-8 text-xs font-medium border-[#2563EB]/30 bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB]/10 flex items-center gap-1.5"
            data-testid="guided-demo-btn"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guided Demo</span>
          </Button>
        )}

        {/* Live Engine Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#E8F7F5] border border-[#0F9D9A]/30 text-[#0F9D9A] text-xs">
          <span className="w-2 h-2 rounded-full bg-[#0F9D9A] animate-pulse-subtle" />
          <span className="text-[11px] font-medium text-[#0F9D9A]">Nova AI: Active</span>
        </div>

        {/* Notification Center */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-md text-[#475569] hover:text-[#10233F] hover:bg-[#F1F5F9] transition-colors relative"
            aria-label="Notification center"
            data-testid="notifications-trigger"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-white border border-[#DCE5EF] shadow-lg p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs"
              data-testid="notifications-panel"
            >
              <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#2563EB]" />
                  <span className="font-semibold text-[#10233F]">
                    Notifications ({unreadCount})
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#2563EB] hover:underline font-medium"
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
                    className={`block p-2.5 rounded-md border transition-all ${
                      n.read
                        ? 'bg-white border-[#DCE5EF] text-[#64748B] hover:bg-[#F7F9FC]'
                        : 'bg-[#EFF6FF] border-[#2563EB]/30 text-[#10233F] hover:bg-[#EFF6FF]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 font-semibold text-[11px] text-[#10233F]">
                        {getIcon(n.type)}
                        <span>{n.title}</span>
                      </div>
                      <span className="text-[10px] text-[#64748B]">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
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
          className="flex items-center gap-2 pl-2 border-l border-[#DCE5EF]"
        >
          <div className="w-7 h-7 rounded-full bg-[#10233F] text-white flex items-center justify-center text-xs font-semibold shadow-sm">
            AM
          </div>
        </Link>
      </div>
    </header>
  );
}

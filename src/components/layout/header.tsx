'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Bell,
  Terminal,
  Sparkles,
  PhoneCall,
  Calendar,
  Database,
  Flame,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

interface NotificationItem {
  id: string;
  type: 'HIGH_INTENT' | 'CALL_COMPLETED' | 'MEETING_RECOMMENDED' | 'CALLBACK_SCHEDULED' | 'CRM_SYNC';
  title: string;
  message: string;
  timestamp: string;
  link: string;
  read: boolean;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'HIGH_INTENT',
      title: 'High-Intent Lead Discovered',
      message: 'ABC Technologies (Marcus Vance - CTO) scored 94 intent for SharePoint Modernization.',
      timestamp: '5m ago',
      link: '/opportunities',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'CALL_COMPLETED',
      title: 'AI Voice Qualification Completed',
      message: 'Marcus Vance confirmed 30-day procurement window and agreed to discovery.',
      timestamp: '15m ago',
      link: '/calls',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'MEETING_RECOMMENDED',
      title: 'Meeting Recommended (Hot Lead)',
      message: 'Schedule a technical discovery meeting within 48 hours for $150,000 ARR opportunity.',
      timestamp: '25m ago',
      link: '/opportunities',
      read: false,
    },
    {
      id: 'notif-4',
      type: 'CALLBACK_SCHEDULED',
      title: 'Follow-Up Callback Scheduled',
      message: 'Marcus Vance requested follow-up on Sep 2 at 14:00 EST.',
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

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'HIGH_INTENT':
        return <Flame className="w-3.5 h-3.5 text-red-400" />;
      case 'CALL_COMPLETED':
        return <PhoneCall className="w-3.5 h-3.5 text-teal-400" />;
      case 'MEETING_RECOMMENDED':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'CALLBACK_SCHEDULED':
        return <Calendar className="w-3.5 h-3.5 text-indigo-400" />;
      case 'CRM_SYNC':
        return <Database className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-20 h-14 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 lg:hidden"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-200 font-semibold">WORKSPACE:</span>
          <span className="text-teal-400">Production Pipeline</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Autonomous Intent Discovery</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search shortcut */}
        <Link
          href="/opportunities"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors font-mono"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </Link>

        {/* AI Agent Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span>Nova AI Engine: Live</span>
        </div>

        {/* Notification Center Trigger & Dropdown */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors relative"
            aria-label="Notification center"
            data-testid="notifications-trigger"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {notificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150 font-mono text-xs"
              data-testid="notifications-panel"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-slate-100 uppercase tracking-wide">
                    Live Notifications ({unreadCount})
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-teal-400 hover:text-teal-300 transition-colors"
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
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-950 hover:text-slate-200'
                        : 'bg-teal-950/20 border-teal-500/30 text-slate-200 hover:bg-teal-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-200">
                        {getIcon(n.type)}
                        <span>{n.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                      {n.message}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Telemetry / Admin Link */}
        <Link
          href="/admin"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
          title="System Health & Telemetry"
        >
          <Terminal className="w-4 h-4" />
        </Link>

        {/* User Account / Role */}
        <Link
          href="/settings"
          className="flex items-center gap-2 pl-2 border-l border-slate-800"
        >
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-200 font-medium">
            AM
          </div>
        </Link>
      </div>
    </header>
  );
}

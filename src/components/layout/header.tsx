'use client';

import React from 'react';
import { Menu, Search, Bell, Shield, Terminal, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
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
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search opportunities...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </Link>

        {/* AI Agent Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span>Nova AI Engine: Live</span>
        </div>

        {/* Documentation / Problem Spec Link */}
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

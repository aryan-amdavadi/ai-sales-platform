'use client';

import React, { useState } from 'react';
import { Database, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DemoBanner() {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    try {
      setResetting(true);
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      if (res.ok) {
        setResetSuccess(true);
        setTimeout(() => {
          setResetSuccess(false);
          window.location.reload();
        }, 1200);
      }
    } catch (e) {
      console.error('Reset failed:', e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-slate-900/95 border-b border-teal-500/20 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </span>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-teal-400 font-mono font-semibold tracking-wide">DEMO MODE ACTIVE:</span>
          <span className="text-slate-300">105+ Seeded Enterprise Buying Requirements across 20 Companies</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-block text-slate-400 text-[11px] font-mono">
          Hero: ABC Technologies (CTO Marcus Vance, 94 Intent)
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          disabled={resetting || resetSuccess}
          className="h-7 px-2.5 text-xs font-mono border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-all"
        >
          {resetSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Reset Done</span>
            </>
          ) : (
            <>
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-teal-400' : 'text-slate-400'}`} />
              <span>{resetting ? 'Resetting...' : 'Reset Demo Data'}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

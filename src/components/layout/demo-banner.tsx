'use client';

import React, { useState } from 'react';
import { RotateCcw, Check, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoBannerProps {
  onStartGuidedDemo?: () => void;
  onStartJudgeMode?: () => void;
}

export function DemoBanner({ onStartGuidedDemo, onStartJudgeMode }: DemoBannerProps) {
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
        }, 800);
      }
    } catch (e) {
      console.error('Reset failed:', e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-[#070A10]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/25 backdrop-blur-sm">
          <Database className="w-3 h-3 text-blue-400" />
          <span>Demo Environment</span>
        </span>
        <span className="text-slate-400 text-xs hidden md:inline">
          Deterministic dataset with 10 enterprise buying requirements across 10 verticals.
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onStartJudgeMode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onStartJudgeMode}
            className="h-7 px-2.5 text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/15 flex items-center gap-1.5 font-medium border border-amber-500/25 rounded-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Judge Fast-Track</span>
          </Button>
        )}

        {onStartGuidedDemo && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onStartGuidedDemo}
            className="h-7 px-2.5 text-xs text-slate-200 hover:text-white hover:bg-white/[0.08] flex items-center gap-1.5 font-medium rounded-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive Tour</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          disabled={resetting || resetSuccess}
          className="h-7 px-2.5 text-xs border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 flex items-center gap-1.5 transition-all rounded-md"
          data-testid="reset-demo-btn"
        >
          {resetSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Reset Complete</span>
            </>
          ) : (
            <>
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
              <span>{resetting ? 'Resetting...' : 'Reset Demo State'}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

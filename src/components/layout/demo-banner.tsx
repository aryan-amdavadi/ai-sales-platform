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
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Database className="w-3 h-3" />
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
            className="h-7 px-2.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-1 font-medium border border-amber-500/20"
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
            className="h-7 px-2.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Tour</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          disabled={resetting || resetSuccess}
          className="h-7 px-2.5 text-xs border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors"
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

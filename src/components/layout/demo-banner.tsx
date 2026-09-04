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
    <div className="bg-[#10233F] border-b border-[#163A5F] px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-white">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2563EB]/20 text-[#EFF6FF] border border-[#2563EB]/30">
          <Database className="w-3 h-3 text-[#2563EB]" />
          <span>Demo Environment</span>
        </span>
        <span className="text-[#94A3B8] text-xs hidden md:inline">
          Deterministic dataset with 10 enterprise buying requirements across 10 verticals.
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onStartJudgeMode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onStartJudgeMode}
            className="h-7 px-2.5 text-xs text-amber-300 hover:text-amber-200 hover:bg-[#D97706]/20 flex items-center gap-1 font-medium border border-[#D97706]/30"
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
            className="h-7 px-2.5 text-xs text-[#EFF6FF] hover:text-white hover:bg-[#163A5F] flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Interactive Tour</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          disabled={resetting || resetSuccess}
          className="h-7 px-2.5 text-xs border-[#163A5F] bg-[#163A5F]/60 hover:bg-[#163A5F] text-white flex items-center gap-1.5 transition-colors"
          data-testid="reset-demo-btn"
        >
          {resetSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="text-[#16A34A]">Reset Complete</span>
            </>
          ) : (
            <>
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-[#2563EB]' : 'text-[#94A3B8]'}`} />
              <span>{resetting ? 'Resetting...' : 'Reset Demo State'}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

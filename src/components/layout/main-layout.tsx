'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { DemoBanner } from './demo-banner';
import { GuidedDemo } from '@/components/shared/guided-demo';
import { JudgeMode } from '@/components/shared/judge-mode';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guidedDemoOpen, setGuidedDemoOpen] = useState(false);
  const [judgeModeOpen, setJudgeModeOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9]/60 to-[#EFF6FF]/40 text-[#0F172A] flex flex-col antialiased">
      <DemoBanner
        onStartGuidedDemo={() => setGuidedDemoOpen(true)}
        onStartJudgeMode={() => setJudgeModeOpen(true)}
      />
      <div className="flex-1 flex w-full min-w-0 overflow-hidden">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onStartGuidedDemo={() => setGuidedDemoOpen(true)}
          onStartJudgeMode={() => setJudgeModeOpen(true)}
        />
        <div className="flex-1 flex flex-col min-w-0 w-full overflow-y-auto">
          <Header
            onMobileMenuToggle={() => setMobileOpen((prev) => !prev)}
            onStartGuidedDemo={() => setGuidedDemoOpen(true)}
            onStartJudgeMode={() => setJudgeModeOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-6 2xl:p-8 max-w-[1536px] w-full mx-auto space-y-6 box-border min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      <GuidedDemo
        isOpen={guidedDemoOpen}
        onClose={() => setGuidedDemoOpen(false)}
      />
      <JudgeMode
        isOpen={judgeModeOpen}
        onClose={() => setJudgeModeOpen(false)}
      />
    </div>
  );
}

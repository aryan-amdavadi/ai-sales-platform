'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { DemoBanner } from './demo-banner';
import { GuidedDemo } from '@/components/shared/guided-demo';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guidedDemoOpen, setGuidedDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <DemoBanner onStartGuidedDemo={() => setGuidedDemoOpen(true)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onStartGuidedDemo={() => setGuidedDemoOpen(true)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header
            onMobileMenuToggle={() => setMobileOpen((prev) => !prev)}
            onStartGuidedDemo={() => setGuidedDemoOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      <GuidedDemo
        isOpen={guidedDemoOpen}
        onClose={() => setGuidedDemoOpen(false)}
      />
    </div>
  );
}

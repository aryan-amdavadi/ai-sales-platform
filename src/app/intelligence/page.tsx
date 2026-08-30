'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Cpu,
  UserPlus,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function IntelligencePage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntelligence = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/intelligence');
      if (!res.ok) throw new Error('Failed to load intelligence signals');
      const data = await res.json();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching company intelligence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  const filtered = companies.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.industry.toLowerCase().includes(term) ||
      (c.techStack && c.techStack.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold tracking-tight text-slate-100 uppercase">ACCOUNT & FIRMOGRAPHIC INTELLIGENCE</h1>
        <TableLoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold tracking-tight text-slate-100 uppercase">ACCOUNT & FIRMOGRAPHIC INTELLIGENCE</h1>
        <ErrorState message={error} onRetry={fetchIntelligence} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto" data-testid="intelligence-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100 uppercase">
                ACCOUNT & FIRMOGRAPHIC INTELLIGENCE
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Deep enrichment across tech stacks, active hiring signals, funding rounds, and growth trajectories.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Filter companies or technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-950 border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Intelligence Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((comp) => {
          const isHero = comp.name === 'ABC Technologies';
          return (
            <Card
              key={comp.id}
              className={`p-5 bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-colors space-y-4 ${
                isHero ? 'border-blue-500/40 bg-blue-950/10' : ''
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">{comp.name}</h3>
                    {isHero && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                        HERO ACCOUNT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {comp.industry} &bull; {comp.location} &bull; {comp.size}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">AVG INTENT</span>
                  <span className="text-base font-bold text-blue-400">{comp.averageIntent}</span>
                </div>
              </div>

              {/* Signals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Tech Stack */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-400 text-[11px] font-semibold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Technology Stack</span>
                  </div>
                  <p className="text-slate-300 text-xs line-clamp-2">
                    {comp.techStack || 'Cloud native infrastructure, modern data pipelines.'}
                  </p>
                </div>

                {/* Hiring Signal */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-semibold">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Hiring Velocity</span>
                  </div>
                  <p className="text-slate-300 text-xs line-clamp-2">
                    {comp.hiringSignals || 'Active technical job postings.'}
                  </p>
                </div>

                {/* Funding Signal */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Funding & Capital</span>
                  </div>
                  <p className="text-slate-300 text-xs line-clamp-2">
                    {comp.fundingSignals || 'Well-capitalized enterprise entity.'}
                  </p>
                </div>

                {/* Growth Signal */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Growth Indicators</span>
                  </div>
                  <p className="text-slate-300 text-xs line-clamp-2">
                    {comp.growthSignals || 'Consistent headcount growth.'}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                <span className="text-slate-400">{comp.totalLeads} Identified Buying Opportunities</span>
                <Link href={`/opportunities?search=${encodeURIComponent(comp.name)}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <span>View Opportunities</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


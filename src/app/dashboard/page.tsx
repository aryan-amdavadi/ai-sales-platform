'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Flame,
  UserCheck,
  PhoneCall,
  HeartHandshake,
  CalendarCheck,
  DollarSign,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { DashboardMetrics } from '@/types';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
            SALES INTELLIGENCE DASHBOARD
          </h1>
          <p className="text-sm text-slate-400">Loading autonomous buying intent signals...</p>
        </div>
        <TableLoadingSkeleton rows={5} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
          SALES INTELLIGENCE DASHBOARD
        </h1>
        <ErrorState message={error || 'No data returned'} onRetry={fetchMetrics} />
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-10" data-testid="dashboard-page">
      {/* Header & Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
              SALES INTELLIGENCE COMMAND
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Live Stream
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            "Turn public buying signals into sales-ready opportunities."
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/discover">
            <Button variant="outline" className="text-xs font-mono border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
              Run Public Scan
            </Button>
          </Link>
          <Link href="/opportunities">
            <Button className="text-xs font-mono bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold flex items-center gap-1.5">
              <span>View All Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 7 Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        <MetricCard
          title="Total Opps"
          value={data.totalOpportunities}
          subtitle="Public Signals"
          icon={Target}
          variant="default"
        />
        <MetricCard
          title="High Intent"
          value={data.highIntentCount}
          subtitle="Intent >= 80"
          icon={Flame}
          variant="teal"
        />
        <MetricCard
          title="Ready to Contact"
          value={data.readyToContactCount}
          subtitle="Pre-Qualified"
          icon={UserCheck}
          variant="indigo"
        />
        <MetricCard
          title="AI Voice Calls"
          value={data.aiCallsCount}
          subtitle="Autonomously Executed"
          icon={PhoneCall}
          variant="default"
        />
        <MetricCard
          title="Interested"
          value={data.interestedCount}
          subtitle="Buying Intent Validated"
          icon={HeartHandshake}
          variant="emerald"
        />
        <MetricCard
          title="Meetings"
          value={data.meetingsCount}
          subtitle="Demo / Discovery Booked"
          icon={CalendarCheck}
          variant="amber"
        />
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(data.totalPipelineValue)}
          subtitle="Identified Requirement ARR"
          icon={DollarSign}
          variant="teal"
          className="col-span-2 sm:col-span-1 lg:col-span-1"
        />
      </div>

      {/* Priority Queue + Funnel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Priority Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold font-mono tracking-tight text-slate-100">
                AI PRIORITY QUEUE
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Top High-Probability Targets</span>
          </div>

          <Card className="bg-slate-900/70 border-slate-800 overflow-hidden divide-y divide-slate-800/80">
            {data.priorityQueue.map((lead) => {
              const isHero = lead.companyName === 'ABC Technologies';
              return (
                <div
                  key={lead.id}
                  className={`p-4 transition-colors hover:bg-slate-800/40 ${
                    isHero ? 'bg-teal-950/20 border-l-2 border-l-teal-400' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/opportunities/${lead.id}`}
                          className="text-sm font-semibold text-slate-100 hover:text-teal-300 transition-colors flex items-center gap-1 group"
                        >
                          <span>{lead.companyName}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-400" />
                        </Link>
                        {isHero && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/40">
                            HERO TARGET
                          </span>
                        )}
                        <StatusBadge status={lead.urgency} type="urgency" />
                        <StatusBadge status={lead.primarySource} type="source" />
                      </div>

                      <p className="text-xs text-slate-400">
                        <span className="text-slate-300 font-medium">{lead.contactName}</span> ({lead.contactTitle}) —{' '}
                        <span className="text-slate-400 italic">{lead.topRequirement}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:self-center">
                      <div className="text-right">
                        <div className="text-xs font-mono text-slate-400">INTENT SCORE</div>
                        <div className="text-lg font-bold font-mono text-teal-400">{lead.intentScore}</div>
                      </div>

                      <Link href={`/opportunities/${lead.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-mono border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          Engage
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Opportunity Funnel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold font-mono tracking-tight text-slate-100">
                OPPORTUNITY FUNNEL
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Stage Conversion</span>
          </div>

          <Card className="p-5 bg-slate-900/70 border-slate-800 space-y-4">
            {data.funnelData.map((stage) => {
              const maxCount = Math.max(...data.funnelData.map((f) => f.count), 1);
              const barWidth = Math.max(10, Math.round((stage.count / maxCount) * 100));

              return (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-medium">{stage.stage.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">{stage.percentage}%</span>
                      <span className="font-bold text-slate-100 font-mono">{stage.count}</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Funnel Efficiency</span>
              <span className="text-emerald-400 font-medium">94% Intent Precision</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

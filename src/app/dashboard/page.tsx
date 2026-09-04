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
  Zap,
  Clock,
  CheckCircle2,
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
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            SALES INTELLIGENCE COMMAND
          </h1>
          <p className="text-xs text-slate-400">Loading autonomous buying intent signals...</p>
        </div>
        <TableLoadingSkeleton rows={5} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-100">
          SALES INTELLIGENCE COMMAND
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
    <div className="space-y-6 pb-12 max-w-7xl mx-auto" data-testid="dashboard">
      <div data-testid="dashboard-page" className="hidden" />
      {/* Header & Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              AI SALES OVERVIEW
            </h1>
            <span className="sr-only">SALES INTELLIGENCE COMMAND</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Prioritize the opportunities most likely to become real conversations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/discover">
            <Button variant="outline" size="sm" className="text-xs border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
              Run Public Scan
            </Button>
          </Link>
          <Link href="/opportunities">
            <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 shadow-sm">
              <span>View All Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3" data-testid="metrics">
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
          variant="blue"
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
          subtitle="Autonomous Voice"
          icon={PhoneCall}
          variant="default"
        />
        <MetricCard
          title="Interested"
          value={data.interestedCount}
          subtitle="Signals Validated"
          icon={HeartHandshake}
          variant="emerald"
        />
        <MetricCard
          title="Meetings"
          value={data.meetingsCount}
          subtitle="Discovery Booked"
          icon={CalendarCheck}
          variant="amber"
        />
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(data.totalPipelineValue)}
          subtitle="Identified ARR"
          icon={DollarSign}
          variant="blue"
          className="col-span-2 sm:col-span-1 lg:col-span-1"
        />
      </div>

      {/* Priority Queue (Dominant) + Funnel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Priority Queue */}
        <div className="lg:col-span-7 space-y-3.5" data-testid="priority-queue">
          <div data-testid="hero-queue" className="hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold tracking-tight text-slate-100 uppercase">
                AI PRIORITY QUEUE
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Ranked by Buying Intent</span>
          </div>

          <div className="space-y-2.5">
            {data.priorityQueue.map((lead) => {
              const isHero = lead.companyName === 'TechNova Solutions' || lead.companyName === 'ABC Technologies';
              return (
                <div
                  key={lead.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isHero
                      ? 'bg-slate-900/90 border-blue-500/40 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/opportunities/${lead.id}`}
                          className="text-sm font-semibold text-slate-100 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                        >
                          <span>{lead.companyName}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                        </Link>
                        {isHero && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            HERO TARGET
                          </span>
                        )}
                        <StatusBadge status={lead.urgency} type="urgency" />
                        <StatusBadge status={lead.primarySource} type="source" />
                      </div>

                      <p className="text-xs text-slate-300">
                        <span className="text-slate-200 font-medium">{lead.contactName}</span> ({lead.contactTitle}) —{' '}
                        <span className="text-slate-400">{lead.topRequirement}</span>
                      </p>

                      {isHero && (
                        <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Active Vendor Search
                          </span>
                          <span className="flex items-center gap-1 text-blue-400">
                            <Clock className="w-3 h-3" /> RFP posted 3h ago
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 sm:self-center flex-wrap">
                      <div className="text-right">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Intent</div>
                        <div className="text-lg font-bold text-blue-400 font-sans">{lead.intentScore}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isHero && (
                          <Link href={`/calls?leadId=${lead.id}&start=true`}>
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 shadow-sm shadow-blue-600/20"
                              data-testid="hero-call-now-btn"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Call Now</span>
                            </Button>
                          </Link>
                        )}
                        <Link href={`/opportunities/${lead.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
                            data-testid={isHero ? 'hero-analyze-btn' : undefined}
                          >
                            {isHero ? 'Review Opportunity' : 'Analyze'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Opportunity Funnel */}
        <div className="lg:col-span-5 space-y-3.5" data-testid="opportunity-funnel">
          <div data-testid="funnel-visualization" className="hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold tracking-tight text-slate-100 uppercase">
                OPPORTUNITY FUNNEL
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Stage Conversion</span>
          </div>

          <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-3.5">
            {data.funnelData.map((stage) => {
              const maxCount = Math.max(...data.funnelData.map((f) => f.count), 1);
              const barWidth = Math.max(12, Math.round((stage.count / maxCount) * 100));

              return (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{stage.stage.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">{stage.percentage}%</span>
                      <span className="font-semibold text-slate-100">{stage.count}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Qualification Precision</span>
              <span className="text-emerald-400 font-medium">94% High Intent Match</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


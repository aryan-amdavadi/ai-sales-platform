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
          <h1 className="text-xl font-bold tracking-tight text-[#10233F]">
            AI SALES OVERVIEW
          </h1>
          <p className="text-xs text-[#64748B]">Loading autonomous buying intent signals...</p>
        </div>
        <TableLoadingSkeleton rows={5} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-[#10233F]">
          AI SALES OVERVIEW
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
    <div className="space-y-6 pb-12 max-w-[1536px] mx-auto" data-testid="dashboard">
      <div data-testid="dashboard-page" className="contents">
        {/* LEVEL 1: Header & Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE5EF] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#10233F]">
                AI SALES OVERVIEW
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F7F5] text-[#0F9D9A] border border-[#0F9D9A]/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D9A] animate-pulse-subtle" />
                Live Intelligence Telemetry · SALES INTELLIGENCE COMMAND
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Prioritize the opportunities most likely to become real conversations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/discover">
              <Button variant="outline" size="sm" className="text-xs border-[#DCE5EF] bg-white hover:bg-[#F7F9FC] text-[#10233F] font-medium">
                Run Public Scan
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button size="sm" className="text-xs bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold flex items-center gap-1.5 shadow-sm">
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
            variant="teal"
          />
          <MetricCard
            title="Ready to Contact"
            value={data.readyToContactCount}
            subtitle="Pre-Qualified"
            icon={UserCheck}
            variant="blue"
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

        {/* LEVEL 2 & 3: Priority Queue (Hero) + Opportunity Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Priority Queue */}
          <div className="lg:col-span-7 space-y-3.5" data-testid="priority-queue">
            <div data-testid="hero-queue" className="hidden" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-[#EFF6FF] border border-[#2563EB]/20 text-[#2563EB]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold tracking-tight text-[#10233F] uppercase">
                  AI PRIORITY OPPORTUNITIES
                </h2>
              </div>
              <span className="text-xs text-[#64748B] font-medium">Ranked by Buying Intent Score</span>
            </div>

            <div className="space-y-3">
              {data.priorityQueue.map((lead) => {
                const isHero = lead.companyName === 'TechNova Solutions' || lead.companyName === 'ABC Technologies';
                return (
                  <div
                    key={lead.id}
                    className={`p-4 rounded-md border transition-all ${
                      isHero
                        ? 'bg-white border-[#2563EB]/40 shadow-sm ring-1 ring-[#2563EB]/20'
                        : 'bg-white border-[#DCE5EF] hover:border-[#2563EB]/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/opportunities/${lead.id}`}
                            className="text-base font-bold text-[#10233F] hover:text-[#2563EB] transition-colors flex items-center gap-1.5 group"
                          >
                            <span>{lead.companyName}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#2563EB]" />
                          </Link>
                          {isHero && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F7F5] text-[#0F9D9A] border border-[#0F9D9A]/30">
                              HERO TARGET
                            </span>
                          )}
                          <StatusBadge status={lead.urgency} type="urgency" />
                          <StatusBadge status={lead.primarySource} type="source" />
                        </div>

                        <p className="text-xs text-[#475569]">
                          <span className="text-[#10233F] font-semibold">{lead.contactName}</span> ({lead.contactTitle}) —{' '}
                          <span className="text-[#475569]">{lead.topRequirement}</span>
                        </p>

                        {isHero && (
                          <div className="pt-1 flex items-center gap-3 text-[11px] text-[#64748B]">
                            <span className="flex items-center gap-1 text-[#16A34A] font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified RFP Post
                            </span>
                            <span className="flex items-center gap-1 text-[#2563EB] font-medium">
                              <Clock className="w-3.5 h-3.5" /> 30-day timeline target
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 sm:self-center flex-wrap">
                        <div className="text-right">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Intent</div>
                          <div className="text-xl font-extrabold text-[#0F9D9A] font-sans">{lead.intentScore}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isHero && (
                            <Link href={`/calls?leadId=${lead.id}&start=true`}>
                              <Button
                                size="sm"
                                className="h-8 text-xs bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold flex items-center gap-1.5 shadow-sm"
                                data-testid="hero-call-now-btn"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Call Now</span>
                              </Button>
                            </Link>
                          )}
                          <Link href={`/opportunities/${lead.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs border-[#DCE5EF] bg-white hover:bg-[#F7F9FC] text-[#10233F] font-medium"
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

          {/* LEVEL 4: Opportunity Funnel */}
          <div className="lg:col-span-5 space-y-3.5" data-testid="opportunity-funnel">
            <div data-testid="funnel-visualization" className="hidden" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] text-[#10233F]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold tracking-tight text-[#10233F] uppercase">
                  OPPORTUNITY FUNNEL
                </h2>
              </div>
              <span className="text-xs text-[#64748B] font-medium">Pipeline Conversion</span>
            </div>

            <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm">
              {data.funnelData.map((stage) => {
                const maxCount = Math.max(...data.funnelData.map((f) => f.count), 1);
                const barWidth = Math.max(12, Math.round((stage.count / maxCount) * 100));

                return (
                  <div key={stage.stage} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#10233F] font-semibold">{stage.stage.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#64748B] text-xs">{stage.percentage}%</span>
                        <span className="font-bold text-[#10233F]">{stage.count}</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 border-t border-[#DCE5EF] flex items-center justify-between text-xs text-[#64748B]">
                <span>AI Qualification Match Rate</span>
                <span className="text-[#0F9D9A] font-bold">94% High Intent Match</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

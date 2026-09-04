'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Target,
  FileCheck,
  CheckCircle2,
  Flame,
  PhoneCall,
  UserCheck,
  Calendar,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/shared/metric-card';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';

// Executive palette: Royal Blue primary, Teal secondary, Slate neutrals
const ENTERPRISE_CHART_COLORS = ['#2563EB', '#0F9D9A', '#163A5F', '#475569', '#16A34A', '#D97706'];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to load analytics');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1536px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-[#10233F] uppercase">
          CONVERSION & INTENT ANALYTICS
        </h1>
        <TableLoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6 max-w-[1536px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-[#10233F] uppercase">
          CONVERSION & INTENT ANALYTICS
        </h1>
        <ErrorState message={error || 'No analytics data'} onRetry={fetchAnalytics} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-[1536px] mx-auto" data-testid="analytics-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE5EF] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#10233F] uppercase">
                CONVERSION & INTENT ANALYTICS
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Real-time executive performance telemetry across intent scoring, multi-channel sourcing, and conversion velocity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 10 CORE METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Requirements Analyzed"
          value={data.requirementsAnalyzed}
          subtitle="Public Sourcing Signals"
          icon={FileCheck}
          variant="default"
        />
        <MetricCard
          title="Relevant Opportunities"
          value={data.relevantOpportunities}
          subtitle="Score >= 60"
          icon={Target}
          variant="blue"
        />
        <MetricCard
          title="High-Intent Opps"
          value={data.highIntentOpportunities}
          subtitle="Score >= 80 (HOT)"
          icon={Flame}
          variant="teal"
        />
        <MetricCard
          title="Qualified Leads"
          value={data.qualifiedLeads}
          subtitle="BANT Validated"
          icon={CheckCircle2}
          variant="emerald"
        />
        <MetricCard
          title="Autonomous Calls"
          value={data.calls}
          subtitle="AI Voice Sessions"
          icon={PhoneCall}
          variant="amber"
        />
        <MetricCard
          title="Interested Prospects"
          value={data.interestedProspects}
          subtitle="Positive Engagement"
          icon={UserCheck}
          variant="default"
        />
        <MetricCard
          title="Meetings Booked"
          value={data.meetings}
          subtitle="Discovery Scheduled"
          icon={Calendar}
          variant="blue"
        />
        <MetricCard
          title="Average Intent"
          value={`${data.averageIntent}/100`}
          subtitle="AI Intent Engine"
          icon={Zap}
          variant="teal"
        />
        <MetricCard
          title="Avg Qualification"
          value={`${data.averageQualification}%`}
          subtitle="BANT Score Average"
          icon={Award}
          variant="emerald"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.conversionRate}%`}
          subtitle="Meeting Conversion"
          icon={Sparkles}
          variant="amber"
        />
      </div>

      {/* CHARTS ROW 1: Funnel Conversion & Intent Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunity Funnel */}
        <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-xs font-bold text-[#10233F] uppercase">
                1. Opportunity Funnel Conversion
              </h3>
            </div>
            <span className="text-xs text-[#64748B] font-semibold">Total: {data.totalOpportunities} Opps</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.funnel} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#64748B" textAnchor="end" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#10233F" fontSize={11} width={90} fontWeight={600} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE5EF', color: '#10233F', fontSize: '12px', borderRadius: '4px' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Intent Trend & Progression */}
        <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#0F9D9A]" />
              <h3 className="text-xs font-bold text-[#10233F] uppercase">
                2. Intent Score Progression Trend
              </h3>
            </div>
            <span className="text-xs text-[#64748B] font-semibold">Average Intent Curve</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.intentTrend} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE5EF', color: '#10233F', fontSize: '12px', borderRadius: '4px' }}
                />
                <Line type="monotone" dataKey="avgIntent" stroke="#0F9D9A" strokeWidth={2.5} dot={{ fill: '#0F9D9A' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* CHARTS ROW 2: Source Distribution & Industry Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Platform Distribution */}
        <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-xs font-bold text-[#10233F] uppercase">
                3. Public Source Breakdown
              </h3>
            </div>
            <span className="text-xs text-[#64748B] font-semibold">Multi-Channel Ingestion</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.sourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="source"
                >
                  {data.sourceDistribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={ENTERPRISE_CHART_COLORS[index % ENTERPRISE_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE5EF', color: '#10233F', fontSize: '12px', borderRadius: '4px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Industry Distribution */}
        <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-xs font-bold text-[#10233F] uppercase">
                4. Opportunities By Industry
              </h3>
            </div>
            <span className="text-xs text-[#64748B] font-semibold">10 Sector Verticals</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.industryDistribution} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="industry" stroke="#64748B" fontSize={9} angle={-30} textAnchor="end" interval={0} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE5EF', color: '#10233F', fontSize: '12px', borderRadius: '4px' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* CHARTS ROW 3: Campaign Performance Breakdown */}
      <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-[#10233F] uppercase">
              5. Campaign Outreach & Conversion Performance
            </h3>
          </div>
          <span className="text-xs text-[#64748B] font-semibold">{data.campaignPerformance?.length || 0} ICP Campaigns</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.campaignPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 35 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} angle={-20} textAnchor="end" interval={0} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE5EF', color: '#10233F', fontSize: '12px', borderRadius: '4px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#475569', paddingTop: '10px' }} />
              <Bar dataKey="leads" name="Total Leads" fill="#64748B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="contacted" name="Contacted" fill="#163A5F" radius={[3, 3, 0, 0]} />
              <Bar dataKey="interested" name="Interested" fill="#2563EB" radius={[3, 3, 0, 0]} />
              <Bar dataKey="meetings" name="Meetings" fill="#0F9D9A" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

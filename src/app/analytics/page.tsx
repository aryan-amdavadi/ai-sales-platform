'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import {
  BarChart3, Download, Search, Filter, Calendar, TrendingUp, DollarSign, Target
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/shared/metric-card';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';

const COLORS = ['#2563EB', '#0F9D9A', '#163A5F', '#475569', '#16A34A', '#D97706'];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [source, setSource] = useState('ALL');
  const [industry, setIndustry] = useState('ALL');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (source !== 'ALL') params.append('source', source);
      if (industry !== 'ALL') params.append('industry', industry);
      
      const res = await fetch(`/api/analytics?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load analytics');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error fetching analytics data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, source, industry]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExport = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (source !== 'ALL') params.append('source', source);
    if (industry !== 'ALL') params.append('industry', industry);
    params.append('format', 'csv');
    window.location.href = `/api/analytics?${params.toString()}`;
  };

  const m = data?.metrics || {};
  const trendData = data?.trendData || [];

  return (
    <div className="space-y-6 pb-16 max-w-[1536px] w-full mx-auto" data-testid="analytics-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D9E2EC] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#102A43] uppercase">
                REVENUE INTELLIGENCE
              </h1>
              <p className="text-sm text-[#486581] mt-0.5">
                Workspace-aware sales analytics and pipeline metrics.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-wrap items-center gap-4 bg-white">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4" />
          <span>From</span>
          <input type="date" className="border rounded px-2 py-1" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <span>To</span>
          <input type="date" className="border rounded px-2 py-1" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 ml-4">
          <Filter className="w-4 h-4" />
          <select className="border rounded px-2 py-1" value={source} onChange={e => setSource(e.target.value)}>
            <option value="ALL">All Sources</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="WEBSITE">Website</option>
            <option value="CSV">CSV Import</option>
          </select>
          <select className="border rounded px-2 py-1 ml-2" value={industry} onChange={e => setIndustry(e.target.value)}>
            <option value="ALL">All Industries</option>
            <option value="Software">Software</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <TableLoadingSkeleton rows={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAnalytics} />
      ) : (
        <div className="space-y-8">
          {/* Top Line Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Pipeline Value"
              value={`$${m.revenue?.pipelineValue?.toLocaleString() || 0}`}
              icon={DollarSign}
              subtitle="Total discovered pipeline"
            />
            <MetricCard
              title="Qualified Pipeline"
              value={`$${m.revenue?.qualifiedPipeline?.toLocaleString() || 0}`}
              icon={Target}
              subtitle="Value of qualified opportunities"
            />
            <MetricCard
              title="Meeting Value"
              value={`$${m.revenue?.meetingValue?.toLocaleString() || 0}`}
              icon={TrendingUp}
              subtitle="Pipeline with booked meetings"
            />
            <MetricCard
              title="Opportunities"
              value={m.discovery?.opportunities?.toString() || '0'}
              icon={BarChart3}
              subtitle="Total leads discovered"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <Card className="p-5 flex flex-col min-h-[400px]">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#102A43] uppercase tracking-wide">Pipeline Trend</h2>
                <p className="text-sm text-[#486581]">Daily pipeline accumulation over the period</p>
              </div>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="pipeline" name="Pipeline Value" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Source Distribution */}
            <Card className="p-5 flex flex-col min-h-[400px]">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#102A43] uppercase tracking-wide">Source Distribution</h2>
                <p className="text-sm text-[#486581]">Where opportunities were discovered</p>
              </div>
              <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={m.discovery?.sourceDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(m.discovery?.sourceDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          {/* Deep Metrics Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card className="p-5">
              <h3 className="text-md font-bold mb-4 uppercase">Voice Analytics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Attempted</span><span className="font-medium">{m.voice?.callsAttempted}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Connected</span><span className="font-medium">{m.voice?.connectedCalls}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Answer Rate</span><span className="font-medium">{m.voice?.answerRate}%</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Avg Duration</span><span className="font-medium">{m.voice?.averageDuration}s</span></div>
              </div>
             </Card>

             <Card className="p-5">
              <h3 className="text-md font-bold mb-4 uppercase">Quality & Intent</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Average Intent</span><span className="font-medium text-emerald-600">{m.quality?.averageIntent}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Avg Qualification</span><span className="font-medium">{m.quality?.averageQualification}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">High Intent %</span><span className="font-medium text-emerald-600">{m.quality?.highIntentPercentage}%</span></div>
              </div>
             </Card>

             <Card className="p-5">
              <h3 className="text-md font-bold mb-4 uppercase">Campaign Operations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Enrolled Leads</span><span className="font-medium">{m.campaign?.enrolled}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Contacted</span><span className="font-medium">{m.campaign?.contacted}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Meetings</span><span className="font-medium">{m.campaign?.meeting}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">AI Voice Minutes</span><span className="font-medium text-blue-600">{m.operations?.voiceMinutes}</span></div>
              </div>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}

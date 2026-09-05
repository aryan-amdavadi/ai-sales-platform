'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { OpportunityItem } from '@/types';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('ALL');
  const [source, setSource] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [urgency, setUrgency] = useState('ALL');
  const [minIntent, setMinIntent] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'intent' | 'newest' | 'qualification' | 'company'>('intent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (industry !== 'ALL') params.set('industry', industry);
      if (source !== 'ALL') params.set('source', source);
      if (status !== 'ALL') params.set('status', status);
      if (urgency !== 'ALL') params.set('urgency', urgency);
      if (minIntent !== '') params.set('minIntent', minIntent.toString());
      if (sortBy) params.set('sortBy', sortBy);
      if (sortOrder) params.set('sortOrder', sortOrder);
      params.set('limit', '100');

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load opportunities');
      const data = await res.json();
      setOpportunities(data.items || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Error fetching opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOpportunities();
    }, 250);
    return () => clearTimeout(handler);
  }, [search, industry, source, status, urgency, minIntent, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearch('');
    setIndustry('ALL');
    setSource('ALL');
    setStatus('ALL');
    setUrgency('ALL');
    setMinIntent('');
    setSortBy('intent');
    setSortOrder('desc');
  };

  const industries = [
    'ALL',
    'Enterprise Cloud Services',
    'Financial Technology',
    'Healthcare & EHR',
    'Cybersecurity & IAM',
    'Smart Logistics & Supply Chain',
    'Industrial IoT & Manufacturing',
    'Clean Energy & Smart Grid',
    'E-Commerce & Retail AI',
    'EdTech & Learning Analytics',
    'Maritime & Port Logistics',
  ];

  const sources = ['ALL', 'LINKEDIN', 'X', 'WEBSITE', 'PUBLIC_DIRECTORY', 'FREELANCE_PLATFORM'];
  const statuses = [
    'ALL',
    'DISCOVERED',
    'RELEVANT',
    'HIGH_INTENT',
    'QUALIFIED',
    'CONTACTED',
    'INTERESTED',
    'MEETING',
  ];
  const urgencies = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'IMMEDIATE'];

  return (
    <div className="space-y-6 pb-12 max-w-[1536px] w-full mx-auto" data-testid="opportunities-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D9E2EC] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#102A43]">
              OPPORTUNITY EXPLORER
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/20">
              {total} Total Signals
            </span>
          </div>
          <p className="text-xs text-[#627D98] mt-1">
            Browse, filter, and prioritize buying intent discovered across public enterprise channels.
          </p>
        </div>

        <Button
          onClick={handleResetFilters}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto text-xs border-[#D9E2EC] bg-white hover:bg-[#F5F7FA] text-[#102A43] flex items-center gap-1.5 font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#627D98]" />
          <span>Reset Filters</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5 glass-card border-slate-200/80 space-y-4 rounded-xl shadow-glass">
        {/* Row 1: Search & Quick Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by prospect name, title, company, or requirement keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-white/90 border-slate-200/90 text-slate-800 text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 font-sans font-medium rounded-lg"
              data-testid="search-input"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap font-bold">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-9 bg-white/90 border border-slate-200/90 rounded-lg px-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-sans font-semibold"
              data-testid="sort-by-select"
            >
              <option value="intent">Intent Score</option>
              <option value="qualification">Qualification Score</option>
              <option value="newest">Newest Discovered</option>
              <option value="company">Company Name</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap font-bold">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full h-9 bg-white/90 border border-slate-200/90 rounded-lg px-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-sans font-semibold"
            >
              <option value="desc">Descending (Highest First)</option>
              <option value="asc">Ascending (Lowest First)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Multi-facet Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-200/80 text-xs">
          {/* Industry Filter */}
          <div className="space-y-1">
            <label className="text-slate-500 text-[11px] font-bold">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-9 bg-white/90 border border-slate-200/90 rounded-lg px-2 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-sans font-medium"
              data-testid="industry-filter"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Source Platform Filter */}
          <div className="space-y-1">
            <label className="text-slate-500 text-[11px] font-bold">Source Platform</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-9 bg-white/90 border border-slate-200/90 rounded-lg px-2 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-sans font-medium"
              data-testid="source-filter"
            >
              {sources.map((src) => (
                <option key={src} value={src}>
                  {src.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-slate-500 text-[11px] font-bold">Pipeline Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-9 bg-white/90 border border-slate-200/90 rounded-lg px-2 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-sans font-medium"
              data-testid="status-filter"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="space-y-1">
            <label className="text-slate-500 text-[11px] font-bold">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full h-9 bg-white/90 border border-slate-200/90 rounded-lg px-2 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-sans font-medium"
              data-testid="urgency-filter"
            >
              {urgencies.map((urg) => (
                <option key={urg} value={urg}>
                  {urg}
                </option>
              ))}
            </select>
          </div>

          {/* Min Intent Filter */}
          <div className="space-y-1">
            <label className="text-slate-500 text-[11px] font-bold">Min Intent Score</label>
            <select
              value={minIntent}
              onChange={(e) => setMinIntent(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full h-9 bg-white/90 border border-slate-200/90 rounded-lg px-2 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-sans font-medium"
              data-testid="min-intent-filter"
            >
              <option value="">Any Intent (0+)</option>
              <option value="60">60+ (Moderate)</option>
              <option value="75">75+ (High)</option>
              <option value="85">85+ (Very High)</option>
              <option value="90">90+ (Critical)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results Table Section */}
      <div className="space-y-4">
        {loading ? (
          <TableLoadingSkeleton rows={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchOpportunities} />
        ) : opportunities.length === 0 ? (
          <EmptyState
            title="No matching opportunities found"
            description="Try broadening your keyword query or resetting industry and platform filters."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="w-full min-w-0 overflow-hidden border border-slate-200/80 rounded-xl glass-panel shadow-glass">
            <div className="w-full overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[840px] text-left text-xs border-collapse" data-testid="opportunities-table">
                <thead className="bg-slate-100/70 backdrop-blur-sm border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="py-3 px-3 w-[22%] min-w-[160px]">Company & Prospect</th>
                    <th className="py-3 px-3 w-[24%] min-w-[160px]">Primary Requirement</th>
                    <th className="py-3 px-3 text-center w-[8%] min-w-[70px]">Intent Score</th>
                    <th className="py-3 px-3 text-center w-[8%] min-w-[70px]">Qualification</th>
                    <th className="py-3 px-3 w-[8%] min-w-[70px]">Source</th>
                    <th className="py-3 px-3 w-[8%] min-w-[70px]">Urgency</th>
                    <th className="py-3 px-3 w-[8%] min-w-[70px]">Status</th>
                    <th className="py-3 px-3 w-[7%] min-w-[65px]">Discovered</th>
                    <th className="py-3 px-3 text-right w-[7%] min-w-[65px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70">
                  {opportunities.map((item) => {
                    const isHero = item.company?.name === 'TechNova Solutions' || item.company?.name === 'ABC Technologies';
                    const req = item.requirements?.[0] || {};

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#F5F7FA] transition-colors group ${
                          isHero ? 'bg-[#EAF2FF]/50 font-semibold' : ''
                        }`}
                      >
                        {/* Prospect & Company */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <Link
                              href={`/opportunities/${item.id}`}
                              className="font-bold text-[#102A43] group-hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
                            >
                              <span>{item.company.name}</span>
                              {isHero && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E8F7F5] text-[#0F9D9A] border border-[#0F9D9A]/30">
                                  HERO
                                </span>
                              )}
                            </Link>
                            <span className="text-[11px] text-[#627D98]">
                              {item.name} &bull; {item.title}
                            </span>
                            <span className="text-[10px] text-[#627D98]/80">
                              {item.company.industry}
                            </span>
                          </div>
                        </td>

                        {/* Requirement */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <p className="font-bold text-[#102A43] truncate" title={req?.title}>
                              {req?.title || 'System Modernization'}
                            </p>
                            <p className="text-[11px] text-[#627D98] line-clamp-1">
                              {req?.description}
                            </p>
                          </div>
                        </td>

                        {/* Intent Score */}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-md font-bold text-xs bg-[#E8F7F5] border border-[#0F9D9A]/30 text-[#0F9D9A]">
                            {item.intentScore}
                          </div>
                        </td>

                        {/* Qualification Score */}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold text-[#102A43]">
                            {item.qualificationScore}%
                          </div>
                        </td>

                        {/* Source */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <StatusBadge status={item.source?.platform || 'LINKEDIN'} type="source" />
                        </td>

                        {/* Urgency */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <StatusBadge status={item.urgency} type="urgency" />
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <StatusBadge status={item.status} type="status" />
                        </td>

                        {/* Discovered Date */}
                        <td className="py-3 px-3 whitespace-nowrap text-[11px] text-[#627D98] font-medium">
                          {new Date(item.discoveredAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <Link
                            href={`/opportunities/${item.id}`}
                            className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-xs text-[#2563EB] hover:text-[#1d4ed8] hover:bg-[#EAF2FF] font-semibold transition-colors"
                          >
                            <span>Review</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

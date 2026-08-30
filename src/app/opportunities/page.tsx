'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  ExternalLink,
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
    <div className="space-y-6 pb-12" data-testid="opportunities-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
              OPPORTUNITY EXPLORER
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-teal-300 border border-slate-700">
              {total} Total Signals
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse, filter, and prioritize buying intent discovered across public enterprise channels.
          </p>
        </div>

        <Button
          onClick={handleResetFilters}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto text-xs font-mono border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Filters</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-slate-900/80 border-slate-800 space-y-4">
        {/* Row 1: Search & Quick Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by prospect name, title, company, or requirement keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-950 border-slate-800 text-slate-200 text-xs font-mono placeholder:text-slate-500 focus-visible:ring-teal-500"
              data-testid="search-input"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <label className="text-xs font-mono text-slate-400 whitespace-nowrap">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-teal-500"
              data-testid="sort-by-select"
            >
              <option value="intent">Intent Score</option>
              <option value="qualification">Qualification Score</option>
              <option value="newest">Newest Discovered</option>
              <option value="company">Company Name</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <label className="text-xs font-mono text-slate-400 whitespace-nowrap">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="desc">Descending (Highest First)</option>
              <option value="asc">Ascending (Lowest First)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Multi-facet Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-800/70 text-xs font-mono">
          {/* Industry Filter */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-slate-200 text-xs focus:outline-none focus:border-teal-500"
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
            <label className="text-slate-400 text-[11px]">Source Platform</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-slate-200 text-xs focus:outline-none focus:border-teal-500"
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
            <label className="text-slate-400 text-[11px]">Pipeline Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-slate-200 text-xs focus:outline-none focus:border-teal-500"
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
            <label className="text-slate-400 text-[11px]">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-slate-200 text-xs focus:outline-none focus:border-teal-500"
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
            <label className="text-slate-400 text-[11px]">Min Intent Score</label>
            <select
              value={minIntent}
              onChange={(e) => setMinIntent(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-slate-200 text-xs focus:outline-none focus:border-teal-500"
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

      {/* Results State */}
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
        <Card className="bg-slate-900/90 border-slate-800 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs" data-testid="opportunities-table">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Company & Prospect</th>
                <th className="py-3 px-4">Primary Requirement</th>
                <th className="py-3 px-4 text-center">Intent Score</th>
                <th className="py-3 px-4 text-center">Qualification</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Discovered</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {opportunities.map((item) => {
                const isHero = item.company.name === 'ABC Technologies';
                const req = item.requirements[0];

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors group ${
                      isHero ? 'bg-teal-950/20 font-medium' : ''
                    }`}
                  >
                    {/* Prospect & Company */}
                    <td className="py-3.5 px-4 min-w-[180px]">
                      <div className="flex flex-col">
                        <Link
                          href={`/opportunities/${item.id}`}
                          className="font-semibold text-slate-100 group-hover:text-teal-300 transition-colors flex items-center gap-1.5"
                        >
                          <span>{item.company.name}</span>
                          {isHero && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/40">
                              HERO
                            </span>
                          )}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                          {item.name} &bull; {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.company.industry}
                        </span>
                      </div>
                    </td>

                    {/* Requirement */}
                    <td className="py-3.5 px-4 max-w-[260px]">
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-200 truncate" title={req?.title}>
                          {req?.title || 'System Modernization'}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {req?.description}
                        </p>
                      </div>
                    </td>

                    {/* Intent Score */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center justify-center px-2.5 py-1 rounded font-mono font-bold text-xs bg-slate-950 border border-slate-800 text-teal-400">
                        {item.intentScore}
                      </div>
                    </td>

                    {/* Qualification Score */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center justify-center px-2 py-0.5 rounded font-mono text-xs text-slate-300">
                        {item.qualificationScore}%
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.source?.platform || 'LINKEDIN'} type="source" />
                    </td>

                    {/* Urgency */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.urgency} type="urgency" />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} type="status" />
                    </td>

                    {/* Discovered Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px] font-mono text-slate-400">
                      {new Date(item.discoveredAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link href={`/opportunities/${item.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs font-mono text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

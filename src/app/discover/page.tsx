'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { OpportunityItem } from '@/types';

export default function DiscoveryPage() {
  const [keyword, setKeyword] = useState('');
  const [source, setSource] = useState('ALL');
  const [industry, setIndustry] = useState('ALL');
  const [location, setLocation] = useState('ALL');
  const [minIntent, setMinIntent] = useState<number>(70);
  const [results, setResults] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const fetchDiscoveryResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword) params.set('search', keyword);
      if (source !== 'ALL') params.set('source', source);
      if (industry !== 'ALL') params.set('industry', industry);
      if (location !== 'ALL') params.set('location', location);
      params.set('minIntent', minIntent.toString());
      params.set('limit', '50');

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoveryResults();
  }, [source, industry, location, minIntent]);

  const handleManualScan = () => {
    setScanning(true);
    setTimeout(() => {
      fetchDiscoveryResults();
      setScanning(false);
    }, 800);
  };

  const sources = [
    { key: 'ALL', label: 'All Public Channels' },
    { key: 'LINKEDIN', label: 'LinkedIn Executive RFPs' },
    { key: 'X', label: 'X / Twitter Signals' },
    { key: 'WEBSITE', label: 'Corporate RFP Portals' },
    { key: 'PUBLIC_DIRECTORY', label: 'Public Procurement Registers' },
    { key: 'FREELANCE_PLATFORM', label: 'Enterprise Contract Boards' },
  ];

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
  ];

  const locations = ['ALL', 'Austin, TX', 'San Francisco, CA', 'Boston, MA', 'Seattle, WA', 'New York, NY', 'Chicago, IL'];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto" data-testid="discovery-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100 uppercase">
                PUBLIC INTENT DISCOVERY ENGINE
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Continuously ingest and analyze public procurement signals, RFPs, and executive technology searches.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleManualScan}
          disabled={scanning}
          size="sm"
          className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 h-8"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'Scanning Public Feeds...' : 'Scan Public Feeds'}</span>
        </Button>
      </div>

      {/* Discovery Query Builder */}
      <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search intent signals by keyword (e.g. 'SharePoint', 'Migration', 'SOC2')..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDiscoveryResults()}
              className="pl-9 bg-slate-950 border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 focus-visible:ring-blue-500"
            />
          </div>

          {/* Source Platform Selector */}
          <div className="md:col-span-6">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {sources.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/70 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 text-[11px] font-medium">Industry Focus</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[11px] font-medium">Geography / Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[11px] font-medium">Min Intent Filter: {minIntent}+</label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minIntent}
              onChange={(e) => setMinIntent(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Discovery Results Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Found {results.length} public intent requirements matching ICP</span>
        <span className="text-blue-400 font-medium">Autonomous Ingestion Queue Active</span>
      </div>

      {/* Results Cards */}
      {loading ? (
        <TableLoadingSkeleton rows={5} />
      ) : results.length === 0 ? (
        <EmptyState
          title="No discovery signals matched your parameters"
          description="Adjust your min intent slider or keyword filter to discover more requirements."
          actionLabel="Reset to Default Discovery Scan"
          onAction={() => {
            setKeyword('');
            setSource('ALL');
            setIndustry('ALL');
            setLocation('ALL');
            setMinIntent(70);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item) => {
            const isHero = item.company.name === 'ABC Technologies';
            const req = item.requirements[0];

            return (
              <Card
                key={item.id}
                className={`p-5 bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-colors space-y-3 ${
                  isHero ? 'border-blue-500/40 bg-blue-950/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/opportunities/${item.id}`}
                        className="font-semibold text-sm text-slate-100 hover:text-blue-400 transition-colors"
                      >
                        {item.company.name}
                      </Link>
                      {isHero && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          HERO
                        </span>
                      )}
                      <StatusBadge status={item.source?.platform || 'LINKEDIN'} type="source" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.name} &bull; {item.title} &bull; {item.company.industry}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">INTENT</div>
                    <div className="text-base font-bold text-blue-400">{item.intentScore}</div>
                  </div>
                </div>

                {/* Requirement Snippet */}
                <div className="space-y-1 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                  <h4 className="text-xs font-semibold text-slate-200">{req?.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    &ldquo;{req?.rawEvidence || req?.description}&rdquo;
                  </p>
                </div>

                {/* Footer Meta & Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                  <span className="text-emerald-400 font-semibold">
                    ${item.pipelineValue?.toLocaleString()} Pipeline
                  </span>
                  <Link href={`/opportunities/${item.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1"
                    >
                      <span>Review & Qualify</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


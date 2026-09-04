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
    <div className="space-y-6 pb-12 max-w-[1536px] mx-auto" data-testid="discovery-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE5EF] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#10233F] uppercase">
                PUBLIC INTENT DISCOVERY ENGINE
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Continuously ingest and analyze public procurement signals, RFPs, and executive technology searches.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleManualScan}
          disabled={scanning}
          size="sm"
          className="text-xs font-semibold bg-[#2563EB] hover:bg-[#1d4ed8] text-white flex items-center gap-2 h-8 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'Scanning Public Feeds...' : 'Scan Public Feeds'}</span>
        </Button>
      </div>

      {/* Discovery Query Builder */}
      <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search intent signals by keyword (e.g. 'SharePoint', 'Migration', 'SOC2')..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDiscoveryResults()}
              className="pl-9 bg-white border-[#DCE5EF] text-[#10233F] text-xs placeholder:text-[#64748B] focus-visible:ring-[#2563EB] font-medium"
            />
          </div>

          {/* Source Platform Selector */}
          <div className="md:col-span-6">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-white border border-[#DCE5EF] rounded-md px-3 py-2 text-xs text-[#10233F] focus:outline-none focus:border-[#2563EB] font-semibold"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#DCE5EF] text-xs">
          <div>
            <label className="text-[#64748B] block mb-1 text-[11px] font-bold">Industry Focus</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-white border border-[#DCE5EF] rounded-md p-1.5 text-[#10233F] focus:outline-none focus:border-[#2563EB] text-xs font-medium"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#64748B] block mb-1 text-[11px] font-bold">Geography / Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-[#DCE5EF] rounded-md p-1.5 text-[#10233F] focus:outline-none focus:border-[#2563EB] text-xs font-medium"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#64748B] block mb-1 text-[11px] font-bold">Min Intent Filter: {minIntent}+</label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minIntent}
              onChange={(e) => setMinIntent(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Discovery Results Count Header */}
      <div className="flex items-center justify-between text-xs text-[#64748B] px-1 font-medium">
        <span>Found {results.length} public intent requirements matching ICP</span>
        <span className="text-[#0F9D9A] font-bold">Autonomous Ingestion Queue Active</span>
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
            const isHero =
              item.company.name === 'TechNova Solutions' ||
              item.company.name === 'ABC Technologies';
            const req = item.requirements[0];

            return (
              <Card
                key={item.id}
                className={`p-5 bg-white border-[#DCE5EF] hover:border-[#2563EB]/40 transition-colors space-y-3 rounded-md shadow-sm ${
                  isHero ? 'border-[#2563EB]/40 bg-[#EFF6FF]/40 ring-1 ring-[#2563EB]/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/opportunities/${item.id}`}
                        className="font-bold text-sm text-[#10233F] hover:text-[#2563EB] transition-colors"
                      >
                        {item.company.name}
                      </Link>
                      {isHero && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F7F5] text-[#0F9D9A] border border-[#0F9D9A]/30">
                          HERO
                        </span>
                      )}
                      <StatusBadge status={item.source?.platform || 'LINKEDIN'} type="source" />
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                      {item.name} &bull; {item.title} &bull; {item.company.industry}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-[#64748B] uppercase font-bold">INTENT</div>
                    <div className="text-base font-extrabold text-[#0F9D9A]">{item.intentScore}</div>
                  </div>
                </div>

                {/* Requirement Snippet */}
                <div className="space-y-1 bg-[#F7F9FC] p-3 rounded-md border border-[#DCE5EF]">
                  <h4 className="text-xs font-bold text-[#10233F]">{req?.title}</h4>
                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed font-medium">
                    &ldquo;{req?.rawEvidence || req?.description}&rdquo;
                  </p>
                </div>

                {/* Footer Meta & Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-[#DCE5EF] text-xs">
                  <span className="text-[#16A34A] font-bold">
                    ${item.pipelineValue?.toLocaleString()} Pipeline
                  </span>
                  <Link href={`/opportunities/${item.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-[#DCE5EF] bg-white hover:bg-[#F7F9FC] text-[#10233F] flex items-center gap-1 font-semibold"
                    >
                      <span>Review & Qualify</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
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

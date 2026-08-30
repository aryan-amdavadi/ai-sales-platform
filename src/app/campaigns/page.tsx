'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, Plus, ArrowRight, Target, Users, PhoneCall, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/campaigns');
      if (!res.ok) throw new Error('Failed to load campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">OUTBOUND CAMPAIGNS</h1>
        </div>
        <TableLoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">OUTBOUND CAMPAIGNS</h1>
        <ErrorState message={error} onRetry={fetchCampaigns} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12" data-testid="campaigns-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
              AUTONOMOUS OUTREACH CAMPAIGNS
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Orchestrate AI voice qualification and multi-channel follow-ups mapped to public buying requirements.
          </p>
        </div>

        <Link href="/onboarding">
          <Button className="text-xs font-mono font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>New ICP Campaign</span>
          </Button>
        </Link>
      </div>

      {/* Campaigns Table */}
      <Card className="bg-slate-900/90 border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-4">Campaign Name & Goal</th>
              <th className="py-3.5 px-4">Target ICP Audience</th>
              <th className="py-3.5 px-4 text-center">Total Leads</th>
              <th className="py-3.5 px-4 text-center">Contacted</th>
              <th className="py-3.5 px-4 text-center">Interested</th>
              <th className="py-3.5 px-4 text-center">Meetings</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-slate-800/40 transition-colors group">
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <Link
                      href={`/campaigns/${camp.id}`}
                      className="font-bold text-slate-100 group-hover:text-teal-300 transition-colors text-sm"
                    >
                      {camp.name}
                    </Link>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{camp.goal}</p>
                  </div>
                </td>

                <td className="py-3.5 px-4 max-w-[200px]">
                  <span className="text-slate-300 text-xs line-clamp-1">{camp.targetAudience}</span>
                </td>

                <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                  {camp.totalLeads}
                </td>

                <td className="py-3.5 px-4 text-center font-mono text-indigo-400">
                  {camp.contacted}
                </td>

                <td className="py-3.5 px-4 text-center font-mono text-emerald-400 font-bold">
                  {camp.interested}
                </td>

                <td className="py-3.5 px-4 text-center font-mono text-teal-300 font-bold">
                  {camp.meetings}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={camp.status} type="status" />
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <Link href={`/campaigns/${camp.id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs font-mono text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Megaphone, Target, Users, PhoneCall, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/campaigns/${id}`);
        if (!res.ok) throw new Error('Campaign not found');
        const data = await res.json();
        setCampaign(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <DetailLoadingSkeleton />;
  if (error || !campaign) {
    return (
      <div className="space-y-6">
        <Link href="/campaigns" className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Campaigns
        </Link>
        <ErrorState message={error || 'Campaign not found'} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/campaigns"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
                {campaign.name}
              </h1>
              <StatusBadge status={campaign.status} type="status" />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Target: {campaign.targetAudience}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Target Audience</span>
          <p className="text-sm font-semibold text-slate-200 mt-1">{campaign.targetAudience}</p>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Channels</span>
          <p className="text-sm font-semibold text-teal-400 mt-1">{campaign.channels || 'Voice AI, Email'}</p>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Opportunities</span>
          <p className="text-xl font-bold font-mono text-slate-100 mt-1">{campaign.leads?.length || 0}</p>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Voice Calls Logged</span>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{campaign.calls?.length || 0}</p>
        </Card>
      </div>

      {/* Leads in Campaign */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-300">
          Enrolled Opportunities ({campaign.leads?.length || 0})
        </h3>
        <Card className="bg-slate-900/90 border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Company & Prospect</th>
                <th className="py-3 px-4">Requirement</th>
                <th className="py-3 px-4 text-center">Intent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {campaign.leads?.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-200 block">{lead.company?.name}</span>
                    <span className="text-[11px] text-slate-400">{lead.name} &bull; {lead.title}</span>
                  </td>
                  <td className="py-3 px-4 max-w-[240px] truncate text-slate-300">
                    {lead.requirements?.[0]?.title || 'System Modernization'}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-teal-400">
                    {lead.intentScore}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={lead.status} type="status" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/opportunities/${lead.id}`}>
                      <Button size="sm" variant="ghost" className="h-7 text-xs font-mono text-teal-400">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

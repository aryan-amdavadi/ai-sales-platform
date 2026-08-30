'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  ArrowRight,
  Target,
  Users,
  PhoneCall,
  CheckCircle,
  Sparkles,
  Globe,
  Clock,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Campaign Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formGoal, setFormGoal] = useState('');
  const [formAudience, setFormAudience] = useState('Enterprise CTOs & VPs of IT');
  const [formMinIntent, setFormMinIntent] = useState(75);
  const [formIndustry, setFormIndustry] = useState('Enterprise Software & IT');
  const [formLocation, setFormLocation] = useState('Austin, TX');
  const [formLanguage, setFormLanguage] = useState<'en-US' | 'hi-IN' | 'gu-IN'>('en-US');
  const [formCallWindow, setFormCallWindow] = useState('09:00 - 17:00 EST');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      setCreating(true);
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          targetAudience: formAudience,
          goal: formGoal || `Autonomous qualification for ${formIndustry} accounts with ${formMinIntent}+ intent.`,
          minIntent: formMinIntent,
          industry: formIndustry,
          location: formLocation,
          language: formLanguage,
          callWindow: formCallWindow,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowCreateModal(false);
        setFormName('');
        setFormGoal('');
        showToast(`Campaign created successfully with ${json.enrolledCount} initial opportunities enrolled!`);
        fetchCampaigns();
      } else {
        throw new Error(json.error || 'Failed to create campaign');
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100 uppercase">
          Autonomous Outreach Campaigns
        </h1>
        <TableLoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100 uppercase">
          Autonomous Outreach Campaigns
        </h1>
        <ErrorState message={error} onRetry={fetchCampaigns} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16" data-testid="campaigns-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-teal-950/90 border border-teal-500/50 text-teal-200 text-xs font-mono flex items-center justify-between shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-teal-400 hover:text-teal-200">
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100 uppercase">
              Autonomous Outreach Campaigns
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Orchestrate AI voice qualification, minimum intent gating, and multi-channel follow-ups mapped to public buying requirements.
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="text-xs font-mono font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5 shadow-sm"
          data-testid="create-campaign-btn"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New ICP Campaign</span>
        </Button>
      </div>

      {/* Campaigns Table */}
      <Card className="bg-slate-900/90 border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs font-sans" data-testid="campaigns-table">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-4">Campaign Name & Goal</th>
              <th className="py-3.5 px-4">Target ICP & Filters</th>
              <th className="py-3.5 px-4 text-center">Enrolled</th>
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
                      className="font-bold text-slate-100 group-hover:text-teal-300 transition-colors text-sm font-mono"
                    >
                      {camp.name}
                    </Link>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{camp.goal}</p>
                  </div>
                </td>

                <td className="py-3.5 px-4 max-w-[220px]">
                  <span className="text-slate-300 text-xs line-clamp-1">{camp.targetAudience}</span>
                  <span className="text-[10px] font-mono text-teal-400 block mt-0.5">{camp.channels || 'Voice AI, Email'}</span>
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
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* CREATE CAMPAIGN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <Card className="p-6 bg-slate-900 border border-slate-800 max-w-lg w-full space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase">Create ICP Outreach Campaign</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-200">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Healthcare EHR Cloud Migration Q4"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Target ICP Persona</label>
                <input
                  type="text"
                  required
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Minimum Intent Gate</label>
                  <select
                    value={formMinIntent}
                    onChange={(e) => setFormMinIntent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value={60}>60+ (Moderate Intent)</option>
                    <option value={75}>75+ (High Intent)</option>
                    <option value={85}>85+ (Critical / Immediate)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Language</label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="hi-IN">Hindi (हिंदी)</option>
                    <option value="gu-IN">Gujarati (ગુજરાતી)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Industry</label>
                  <select
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Enterprise Software & IT">Enterprise Software & IT</option>
                    <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                    <option value="Financial Services & FinTech">Financial Services & FinTech</option>
                    <option value="Manufacturing & Logistics">Manufacturing & Logistics</option>
                    <option value="ALL">All Industries</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Calling Window</label>
                  <input
                    type="text"
                    value={formCallWindow}
                    onChange={(e) => setFormCallWindow(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Campaign Goal / Milestone</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule 10 technical discovery sessions for $100k+ ARR migration opportunities."
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  size="sm"
                  className="border-slate-800 bg-slate-950 text-slate-400 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  {creating ? 'Enrolling Leads...' : 'Launch Campaign'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

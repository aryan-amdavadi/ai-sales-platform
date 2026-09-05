'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  ArrowRight,
  Sparkles,
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
      <div className="space-y-6 max-w-[1536px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-[#10233F] uppercase">
          AUTONOMOUS OUTREACH CAMPAIGNS
        </h1>
        <TableLoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-[1536px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-[#10233F] uppercase">
          AUTONOMOUS OUTREACH CAMPAIGNS
        </h1>
        <ErrorState message={error} onRetry={fetchCampaigns} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-[1536px] w-full mx-auto" data-testid="campaigns-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-md bg-white border border-[#2563EB]/40 text-[#102A43] text-xs flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#627D98] hover:text-[#102A43] text-sm font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D9E2EC] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/20">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#102A43] uppercase">
                AUTONOMOUS OUTREACH CAMPAIGNS
              </h1>
              <p className="text-xs text-[#627D98] mt-0.5">
                Orchestrate AI voice qualification, minimum intent gating, and multi-channel follow-ups mapped to public buying requirements.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          size="sm"
          className="text-xs font-semibold bg-[#2563EB] hover:bg-[#1d4ed8] text-white flex items-center gap-1.5 shadow-sm h-8"
          data-testid="create-campaign-btn"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New ICP Campaign</span>
        </Button>
      </div>

      {/* Campaigns Table Container */}
      <div className="w-full min-w-0 overflow-hidden border border-slate-200/80 rounded-xl glass-panel shadow-glass">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[900px] text-left text-xs border-collapse" data-testid="campaigns-table">
            <thead className="bg-slate-100/70 backdrop-blur-sm border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-4 w-[28%]">Campaign Name & Goal</th>
                <th className="py-3.5 px-4 w-[24%]">Target ICP & Filters</th>
                <th className="py-3.5 px-4 text-center w-[8%]">Enrolled</th>
                <th className="py-3.5 px-4 text-center w-[8%]">Contacted</th>
                <th className="py-3.5 px-4 text-center w-[8%]">Interested</th>
                <th className="py-3.5 px-4 text-center w-[8%]">Meetings</th>
                <th className="py-3.5 px-4 w-[8%]">Status</th>
                <th className="py-3.5 px-4 text-right w-[8%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-[#F5F7FA] transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <Link
                        href={`/campaigns/${camp.id}`}
                        className="font-bold text-[#102A43] group-hover:text-[#2563EB] transition-colors text-sm"
                      >
                        {camp.name}
                      </Link>
                      <p className="text-[11px] text-[#627D98] line-clamp-1 font-medium">{camp.goal}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-[220px]">
                    <span className="text-[#102A43] text-xs line-clamp-1 font-medium">{camp.targetAudience}</span>
                    <span className="text-[10px] text-[#2563EB] block mt-0.5 font-bold">{camp.channels || 'Voice AI, Email'}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-[#102A43]">
                    {camp.totalLeads}
                  </td>

                  <td className="py-3.5 px-4 text-center text-[#163A5F] font-bold">
                    {camp.contacted}
                  </td>

                  <td className="py-3.5 px-4 text-center text-[#16A34A] font-bold">
                    {camp.interested}
                  </td>

                  <td className="py-3.5 px-4 text-center text-[#2563EB] font-bold">
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
                        className="h-7 text-xs text-[#2563EB] hover:text-[#1d4ed8] hover:bg-[#EAF2FF] font-semibold"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10233F]/70 backdrop-blur-sm p-4">
          <Card className="p-6 bg-white border border-[#DCE5EF] max-w-lg w-full space-y-4 rounded-md shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#10233F] uppercase">Create ICP Outreach Campaign</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-[#64748B] hover:text-[#10233F] font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#10233F] font-bold block mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Healthcare EHR Cloud Migration Q4"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-[#DCE5EF] p-2.5 rounded text-[#10233F] focus:outline-none focus:border-[#2563EB] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[#10233F] font-bold block mb-1">Target ICP Persona</label>
                <input
                  type="text"
                  required
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value)}
                  className="w-full bg-white border border-[#DCE5EF] p-2.5 rounded text-[#10233F] focus:outline-none focus:border-[#2563EB] text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#10233F] font-bold block mb-1">Minimum Intent Gate</label>
                  <select
                    value={formMinIntent}
                    onChange={(e) => setFormMinIntent(Number(e.target.value))}
                    className="w-full bg-white border border-[#DCE5EF] p-2.5 rounded text-[#10233F] focus:outline-none focus:border-[#2563EB] text-xs font-semibold"
                  >
                    <option value={60}>60+ (Moderate Intent)</option>
                    <option value={75}>75+ (High Intent)</option>
                    <option value={85}>85+ (Critical / Immediate)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#10233F] font-bold block mb-1">Target Language</label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value as any)}
                    className="w-full bg-white border border-[#DCE5EF] p-2.5 rounded text-[#10233F] focus:outline-none focus:border-[#2563EB] text-xs font-semibold"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="hi-IN">Hindi (हिंदी)</option>
                    <option value="gu-IN">Gujarati (ગુજરાતી)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#10233F] font-bold block mb-1">Target Industry</label>
                  <select
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    className="w-full bg-white border border-[#DCE5EF] p-2.5 rounded text-[#10233F] focus:outline-none focus:border-[#2563EB] text-xs font-semibold"
                  >
                    <option value="Enterprise Software & IT">Enterprise Software & IT</option>
                    <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                    <option value="Financial Services & FinTech">Financial Services & FinTech</option>
                    <option value="Manufacturing & Logistics">Manufacturing & Logistics</option>
                    <option value="ALL">All Industries</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#10233F] font-bold block mb-1">Calling Window</label>
                  <input
                    type="text"
                    value={formCallWindow}
                    onChange={(e) => setFormCallWindow(e.target.value)}
                    className="w-full bg-white border border-[#DCE5EF] p-2.5 rounded text-[#10233F] focus:outline-none focus:border-[#2563EB] text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#10233F] font-bold block mb-1">Campaign Goal / Milestone</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule 10 technical discovery sessions for $100k+ ARR migration opportunities."
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  className="w-full bg-white border border-[#DCE5EF] p-2.5 rounded text-[#10233F] focus:outline-none focus:border-[#2563EB] text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DCE5EF]">
                <Button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  size="sm"
                  className="border-[#DCE5EF] bg-white text-[#64748B] text-xs font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  size="sm"
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-xs"
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

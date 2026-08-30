'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Megaphone,
  Target,
  Users,
  PhoneCall,
  Calendar,
  ArrowRight,
  Edit,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';
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

  // Edit Campaign State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [editGoal, setEditGoal] = useState('');
  const [editAudience, setEditAudience] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter Target Leads
  const [searchLead, setSearchLead] = useState('');
  const [minIntentFilter, setMinIntentFilter] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/campaigns/${id}`);
      if (!res.ok) throw new Error('Campaign not found');
      const data = await res.json();
      setCampaign(data);
      setEditName(data.name);
      setEditStatus(data.status);
      setEditGoal(data.goal || '');
      setEditAudience(data.targetAudience || '');
    } catch (err: any) {
      setError(err.message || 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setEditing(true);
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          status: editStatus,
          goal: editGoal,
          targetAudience: editAudience,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        showToast('Campaign settings updated successfully!');
        fetchCampaign();
      }
    } catch (err: any) {
      showToast(`Update error: ${err.message}`);
    } finally {
      setEditing(false);
    }
  };

  if (loading) return <DetailLoadingSkeleton />;
  if (error || !campaign) {
    return (
      <div className="space-y-6">
        <Link href="/campaigns" className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Campaigns
        </Link>
        <ErrorState message={error || 'Campaign not found'} onRetry={fetchCampaign} />
      </div>
    );
  }

  // Filtered Leads
  const leads = campaign.leads || [];
  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch =
      !searchLead ||
      lead.name.toLowerCase().includes(searchLead.toLowerCase()) ||
      lead.company?.name?.toLowerCase().includes(searchLead.toLowerCase()) ||
      lead.requirements?.[0]?.title?.toLowerCase().includes(searchLead.toLowerCase());
    const matchesIntent = lead.intentScore >= minIntentFilter;
    return matchesSearch && matchesIntent;
  });

  const contactedCount = leads.filter((l: any) => ['CONTACTED', 'INTERESTED', 'MEETING', 'CONVERTED'].includes(l.status)).length;
  const interestedCount = leads.filter((l: any) => ['INTERESTED', 'MEETING', 'CONVERTED'].includes(l.status)).length;
  const meetingsCount = leads.filter((l: any) => ['MEETING', 'CONVERTED'].includes(l.status)).length;

  return (
    <div className="space-y-6 pb-16">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/campaigns"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
                {campaign.name}
              </h1>
              <StatusBadge status={campaign.status} type="status" />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Goal: <span className="text-slate-200">{campaign.goal}</span>
            </p>
          </div>
        </div>

        <Button
          onClick={() => setShowEditModal(true)}
          variant="outline"
          size="sm"
          className="h-8 font-mono text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-slate-100 flex items-center gap-1.5"
        >
          <Edit className="w-3.5 h-3.5 text-teal-400" />
          <span>Edit Campaign</span>
        </Button>
      </div>

      {/* Campaign Dashboard Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Enrolled Leads</span>
          <p className="text-2xl font-bold font-mono text-slate-100 mt-1">{leads.length}</p>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Contacted</span>
          <p className="text-2xl font-bold font-mono text-indigo-400 mt-1">{contactedCount}</p>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Interested</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{interestedCount}</p>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Meetings Booked</span>
          <p className="text-2xl font-bold font-mono text-teal-300 mt-1">{meetingsCount}</p>
        </Card>
      </div>

      {/* Filter Target Leads Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search enrolled accounts..."
            value={searchLead}
            onChange={(e) => setSearchLead(e.target.value)}
            className="bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none text-xs w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Min Intent:</span>
          <select
            value={minIntentFilter}
            onChange={(e) => setMinIntentFilter(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs p-1 rounded focus:outline-none"
          >
            <option value={0}>All Scores (0+)</option>
            <option value={60}>60+ Intent</option>
            <option value={75}>75+ Intent</option>
            <option value={85}>85+ (Critical)</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-300">
          Target Opportunities ({filteredLeads.length})
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
              {filteredLeads.map((lead: any) => (
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
                      <Button size="sm" variant="ghost" className="h-7 text-xs font-mono text-teal-400 hover:bg-teal-500/10">
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

      {/* EDIT CAMPAIGN MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <Card className="p-6 bg-slate-900 border border-slate-800 max-w-md w-full space-y-4 font-mono">
            <h3 className="text-base font-bold text-slate-100 uppercase">Edit Campaign Settings</h3>
            <form onSubmit={handleUpdateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={editAudience}
                  onChange={(e) => setEditAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Campaign Goal</label>
                <textarea
                  rows={2}
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  size="sm"
                  className="border-slate-800 bg-slate-950 text-slate-400 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editing}
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  {editing ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

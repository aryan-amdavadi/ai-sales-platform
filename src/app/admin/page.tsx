'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  Target,
  PhoneCall,
  Megaphone,
  Clock,
  Activity,
  Server,
  CheckCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/shared/metric-card';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin');
      if (!res.ok) throw new Error('Failed to load system admin data');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error fetching admin metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">SYSTEM HEALTH & TELEMETRY</h1>
        <TableLoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">SYSTEM HEALTH & TELEMETRY</h1>
        <ErrorState message={error || 'No admin data'} onRetry={fetchAdmin} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16" data-testid="admin-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
              ADMIN OBSERVABILITY & AUDIT LOGS
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            System status, infrastructure health, compute utilization, and transactional activity logs.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Active Users"
          value={data.users?.length || 2}
          subtitle="Enterprise Workspace"
          icon={Users}
          variant="default"
        />
        <MetricCard
          title="Opportunities"
          value={data.totalOpportunities}
          subtitle="In Database"
          icon={Target}
          variant="teal"
        />
        <MetricCard
          title="Campaigns"
          value={data.totalCampaigns}
          subtitle="Configured ICPs"
          icon={Megaphone}
          variant="indigo"
        />
        <MetricCard
          title="Voice Calls"
          value={data.totalCalls}
          subtitle="Autonomous Sessions"
          icon={PhoneCall}
          variant="emerald"
        />
        <MetricCard
          title="Voice Minutes"
          value={`${data.totalVoiceMinutes}m`}
          subtitle="Total Call Time"
          icon={Clock}
          variant="amber"
        />
      </div>

      {/* System Health Status */}
      <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100">
              SUBSYSTEM OPERATIONAL STATUS
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-medium">All Subsystems Operational</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px]">DATABASE STATUS</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{data.systemStatus?.database}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px]">VOICE INFERENCE ENGINE</span>
            <div className="flex items-center gap-1.5 text-teal-400 font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{data.systemStatus?.voiceEngine}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px]">UPTIME & LATENCY</span>
            <div className="flex items-center gap-1.5 text-slate-200 font-bold">
              <span>{data.systemStatus?.uptime} &bull; {data.systemStatus?.latencyMs}ms</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100">
              SYSTEM ACTIVITY & SIGNAL AUDIT TRAIL
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Last 20 Events</span>
        </div>

        <Card className="bg-slate-900/90 border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Action</th>
                <th className="py-3 px-4">Associated Entity</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {data.recentActivity?.map((act: any) => (
                <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {new Date(act.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700 font-mono text-[11px]">
                      {act.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-200 font-medium">
                    {act.lead?.company?.name || 'System'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs">
                    {act.details}
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

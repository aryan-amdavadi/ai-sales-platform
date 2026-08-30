'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PhoneCall, Play, Clock, Sparkles, MessageSquare, ChevronRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/calls');
      if (!res.ok) throw new Error('Failed to load calls');
      const data = await res.json();
      setCalls(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching calls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">AI VOICE CALL SESSIONS</h1>
        <TableLoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">AI VOICE CALL SESSIONS</h1>
        <ErrorState message={error} onRetry={fetchCalls} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12" data-testid="calls-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
              AI VOICE CALL SESSIONS & TRANSCRIPTS
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Review autonomous voice qualifications, conversational turn transcripts, and extracted buying signals.
          </p>
        </div>
      </div>

      {/* Calls Table */}
      <Card className="bg-slate-900/90 border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-4">Prospect & Company</th>
              <th className="py-3.5 px-4">Call Summary & Key Signals</th>
              <th className="py-3.5 px-4 text-center">Duration</th>
              <th className="py-3.5 px-4">Sentiment</th>
              <th className="py-3.5 px-4">Interest Level</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {calls.map((call) => {
              const isHero = call.lead?.company?.name === 'ABC Technologies';
              return (
                <tr
                  key={call.id}
                  className={`hover:bg-slate-800/40 transition-colors group ${
                    isHero ? 'bg-teal-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/calls/${call.id}`}
                      className="font-bold text-slate-100 group-hover:text-teal-300 transition-colors block"
                    >
                      {call.lead?.company?.name || 'Enterprise Account'}
                    </Link>
                    <span className="text-[11px] text-slate-400">
                      {call.lead?.name} &bull; {call.lead?.title}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-[320px]">
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {call.summary}
                    </p>
                    {call.nextStep && (
                      <p className="text-[11px] text-teal-400 font-mono mt-1 truncate">
                        Next: {call.nextStep}
                      </p>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-300 whitespace-nowrap">
                    {formatDuration(call.durationSeconds)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-200">
                    <span
                      className={`px-2 py-0.5 rounded border text-[11px] ${
                        call.sentiment === 'HIGHLY_INTERESTED'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold'
                          : call.sentiment === 'POSITIVE'
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {call.sentiment || 'POSITIVE'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                        call.interestLevel === 'EXTREME'
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                          : call.interestLevel === 'HIGH'
                          ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {call.interestLevel || 'MEDIUM'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={call.status} type="status" />
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link href={`/calls/${call.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs font-mono text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
                      >
                        <span>Transcript</span>
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
    </div>
  );
}

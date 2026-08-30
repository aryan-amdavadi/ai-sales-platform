'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  PhoneCall,
  User,
  Building2,
  Clock,
  Sparkles,
  MessageSquare,
  Activity,
  CheckCircle,
  TrendingUp,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function CallDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [call, setCall] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/calls/${id}`);
        if (!res.ok) throw new Error('Call session record not found');
        const data = await res.json();
        setCall(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load call detail');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <DetailLoadingSkeleton />;
  if (error || !call) {
    return (
      <div className="space-y-6">
        <Link href="/calls" className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Calls
        </Link>
        <ErrorState message={error || 'Call not found'} />
      </div>
    );
  }

  const dialogue = call.transcript?.dialogue ? JSON.parse(call.transcript.dialogue) : [];
  const sentimentCurve = call.transcript?.sentimentCurve ? JSON.parse(call.transcript.sentimentCurve) : [];
  const isHero = call.lead?.company?.name === 'ABC Technologies';

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/calls"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
                AI Voice Session &bull; {call.lead?.company?.name}
              </h1>
              {isHero && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  HERO SESSION
                </span>
              )}
              <StatusBadge status={call.status} type="status" />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Prospect: {call.lead?.name} ({call.lead?.title}) &bull; Duration: {Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s
            </p>
          </div>
        </div>

        <Link href={`/opportunities/${call.lead?.id}`}>
          <Button variant="outline" className="text-xs font-mono border-slate-700 bg-slate-900 text-slate-200">
            Open Opportunity Record
          </Button>
        </Link>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Full Transcript */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100">
                CONVERSATION TRANSCRIPT & INTENT FLAGS
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Sub-second Turn Latency</span>
          </div>

          <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
            {dialogue.length > 0 ? (
              dialogue.map((turn: any, idx: number) => {
                const isAi = turn.speaker === 'AI';
                return (
                  <div
                    key={idx}
                    className={`flex gap-3 p-3.5 rounded-lg border ${
                      isAi
                        ? 'bg-slate-950/90 border-slate-800'
                        : 'bg-teal-950/20 border-teal-500/30'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {isAi ? (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
                          <Bot className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-mono font-bold">
                          {call.lead?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className={`font-semibold ${isAi ? 'text-teal-400' : 'text-slate-200'}`}>
                          {isAi ? 'Nova AI Voice Copilot' : call.lead?.name || 'Prospect'}
                        </span>
                        <div className="flex items-center gap-2">
                          {turn.intentFlag && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-teal-300 border border-slate-700">
                              {turn.intentFlag}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">{turn.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">{turn.text}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">No structured transcript logged.</p>
            )}
          </Card>
        </div>

        {/* Right Column: AI Analysis & Live Signals */}
        <div className="lg:col-span-4 space-y-6">
          {/* Executive Summary */}
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold font-mono uppercase tracking-wide">
                AI CALL SYNTHESIS
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{call.summary}</p>

            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Sentiment:</span>
                <span className="font-bold text-emerald-400">{call.sentiment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Interest Level:</span>
                <span className="font-bold text-teal-400">{call.interestLevel}</span>
              </div>
            </div>
          </Card>

          {/* Next Recommended Step */}
          <Card className="p-5 bg-teal-950/20 border-teal-500/30 space-y-3">
            <div className="flex items-center gap-2 text-teal-400">
              <CheckCircle className="w-4 h-4" />
              <h4 className="text-xs font-bold font-mono uppercase tracking-wide">
                ACTION COMMITTED ON CALL
              </h4>
            </div>
            <p className="text-xs font-medium text-slate-200">{call.nextStep || 'Follow up with proposal'}</p>
          </Card>

          {/* Sentiment Curve Timeline */}
          {sentimentCurve.length > 0 && (
            <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400">
                Call Sentiment Progression
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {sentimentCurve.map((point: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-500">{point.time}</span>
                    <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-teal-400 rounded-full"
                        style={{ width: `${point.score * 100}%` }}
                      />
                    </div>
                    <span className="text-teal-400 font-bold">{Math.round(point.score * 100)}%</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  User,
  CheckCircle2,
  Database,
  UserCheck,
  Activity,
  ArrowRight,
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
  const [crmPushing, setCrmPushing] = useState(false);
  const [crmSynced, setCrmSynced] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [handoffRequested, setHandoffRequested] = useState(false);

  const fetchCallDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/calls/${id}`);
      if (!res.ok) throw new Error('Call session record not found');
      const data = await res.json();
      setCall(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load call detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCallDetail();
    }
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePushToCRM = async () => {
    try {
      setCrmPushing(true);
      const res = await fetch(`/api/calls/${id}/crm-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: call?.leadId || call?.lead?.id }),
      });
      const data = await res.json();
      if (data.success) {
        setCrmSynced(true);
        showToast(`Synchronized to CRM successfully (${data.data.crmSyncId})!`);
        fetchCallDetail();
      }
    } catch (err: any) {
      showToast(`CRM error: ${err.message}`);
    } finally {
      setCrmPushing(false);
    }
  };

  const handleHumanHandoff = async () => {
    try {
      const res = await fetch(`/api/calls/${id}/handoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: call?.leadId || call?.lead?.id,
          reason: 'Prospect requested direct technical steering architect',
        }),
      });
      const data = await res.json();
      setHandoffRequested(true);
      showToast(data.message || 'Handoff requested. Transferring to human sales representative.');
      fetchCallDetail();
    } catch (err: any) {
      showToast(`Handoff error: ${err.message}`);
    }
  };

  if (loading) return <DetailLoadingSkeleton />;
  if (error || !call) return <ErrorState message={error || 'Call not found'} onRetry={fetchCallDetail} />;

  // Parse Transcript Dialogue
  let turns: any[] = [];
  try {
    if (call.transcript?.dialogue) {
      turns = JSON.parse(call.transcript.dialogue);
    }
  } catch {
    turns = [];
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-slate-900 border border-blue-500/50 text-blue-200 text-xs flex items-center justify-between shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-200 text-sm font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/calls"
            className="p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                Call Analysis &bull; {call.lead?.company?.name || 'Account'}
              </h1>
              <StatusBadge status={call.status} type="status" />
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                {call.sentiment || 'POSITIVE'} SENTIMENT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Prospect: <span className="text-slate-200 font-semibold">{call.lead?.name}</span> ({call.lead?.title}) &bull;{' '}
              Duration: <span className="text-slate-200">{call.durationSeconds} seconds</span> &bull; Recorded{' '}
              {new Date(call.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleHumanHandoff}
            variant="outline"
            size="sm"
            className="h-8 text-xs border-amber-500/40 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 flex items-center gap-1.5"
            data-testid="human-handoff"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{handoffRequested ? 'Handoff Requested ✓' : 'Human Handoff'}</span>
          </Button>

          <Button
            onClick={() => setShowCallbackModal(true)}
            variant="outline"
            size="sm"
            className="h-8 border-slate-800 bg-slate-900 text-slate-300 text-xs flex items-center gap-1.5"
            data-testid="schedule-callback-btn"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Schedule Callback</span>
          </Button>

          <Button
            onClick={handlePushToCRM}
            disabled={crmPushing || crmSynced}
            size="sm"
            className="h-8 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm"
            data-testid="push-crm-btn"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{crmSynced ? 'Synced to CRM ✓' : crmPushing ? 'Syncing...' : 'Push to CRM'}</span>
          </Button>

          <Link href={`/opportunities/${call.leadId}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-slate-100 flex items-center gap-1.5"
            >
              <span>View Opportunity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Conversation Intelligence, Insights & Next Best Action */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Summary */}
          <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                  Call Executive Summary
                </h3>
              </div>
              <span className="text-xs text-blue-400 font-medium">Autonomous Extraction</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {call.summary ||
                'Autonomous AI sales discovery session completed with verified positive sentiment. Prospect confirmed immediate procurement timeline and requested technical discussion.'}
            </p>
          </Card>

          {/* NEXT BEST ACTION CARD */}
          <Card className="p-5 bg-slate-900/90 border-blue-500/30 space-y-4">
            <div className="flex items-center justify-between text-blue-400 border-b border-blue-500/20 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Next Best Action Recommendation</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-semibold">
                HIGH PRIORITY
              </span>
            </div>

            <div>
              <h4 className="text-base font-semibold text-slate-100">
                {call.nextStep || 'Schedule a technical discovery meeting within 48 hours.'}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Prospect explicitly agreed to an architectural briefing on legacy migration accelerators and zero-downtime cutover.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">&bull;</span>
                <span>Confirmed Decision Maker: {call.lead?.name} ({call.lead?.title})</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">&bull;</span>
                <span>Active 30-Day vendor evaluation and shortlisting mandate</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">&bull;</span>
                <span>Core pain point: Legacy migration from on-premise servers with zero downtime</span>
              </div>
            </div>
          </Card>

          {/* Pain Points & Objections */}
          <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide border-b border-slate-800 pb-2">
              Confirmed Pain Points & Objections
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-rose-400 uppercase text-[11px] font-semibold block">
                  Identified Pain Points
                </span>
                <ul className="space-y-1 text-slate-300">
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">&bull;</span>
                    <span>Legacy SharePoint 2016 server end-of-life vulnerabilities</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">&bull;</span>
                    <span>Custom PowerApps/SPFx workflow form refactoring</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">&bull;</span>
                    <span>User training and change management for 750 employees</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="text-amber-400 uppercase text-[11px] font-semibold block">
                  Anticipated Objections
                </span>
                <ul className="space-y-1 text-slate-300">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">&bull;</span>
                    <span>Concerns over cutover downtime and operational disruption</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">&bull;</span>
                    <span>SLA guarantees for 24/7 post-go-live hypercare support</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT: Full Transcript & Sentiment Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* BANT Qualification Card */}
          <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs uppercase font-semibold text-slate-300">
                Post-Call Qualification
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                HOT QUALIFIED (92%)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-semibold">NEED FIT</span>
                <span className="font-bold text-blue-400">96%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-semibold">AUTHORITY</span>
                <span className="font-bold text-blue-400">95%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-semibold">TIMING</span>
                <span className="font-bold text-blue-400">92%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-semibold">INTEREST</span>
                <span className="font-bold text-emerald-400">HIGH</span>
              </div>
            </div>
          </Card>

          {/* Full Transcript Stream */}
          <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-slate-200 uppercase">
                  Full Dialogue Transcript ({turns.length} Turns)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Speaker Timestamps</span>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar" data-testid="transcript">
              {turns.length > 0 ? (
                turns.map((turn: any, i: number) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      turn.speaker === 'AI'
                        ? 'bg-slate-950 border-slate-800 text-slate-200'
                        : 'bg-blue-950/20 border-blue-500/20 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={`font-semibold flex items-center gap-1.5 ${
                          turn.speaker === 'AI' ? 'text-blue-400' : 'text-emerald-400'
                        }`}
                      >
                        {turn.speaker === 'AI' ? (
                          <>
                            <Sparkles className="w-3 h-3" />
                            IntentOS AI Agent
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            {call.lead?.name || 'Prospect'}
                          </>
                        )}
                      </span>
                      <span className="text-slate-500 text-[10px]">{turn.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{turn.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">
                  {call.transcript?.rawText || 'Call completed with positive engagement.'}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* SCHEDULE CALLBACK MODAL */}
      {showCallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <Card className="p-5 bg-slate-900 border border-slate-800 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase">Schedule Follow-Up Callback</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Prospect</label>
                <input
                  type="text"
                  disabled
                  value={`${call?.lead?.name || 'Marcus Vance'} (${call?.lead?.company?.name || 'ABC Technologies'})`}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    defaultValue="2026-09-02"
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Time</label>
                  <input
                    type="text"
                    defaultValue="14:00 EST"
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Reason</label>
                <input
                  type="text"
                  defaultValue="Technical architecture discovery follow-up"
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={() => setShowCallbackModal(false)}
                variant="outline"
                size="sm"
                className="border-slate-800 bg-slate-950 text-slate-400 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await fetch('/api/calls/callback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      leadId: call?.leadId || call?.lead?.id,
                      leadName: call?.lead?.name || 'Marcus Vance',
                      companyName: call?.lead?.company?.name || 'ABC Technologies',
                      scheduledDate: '2026-09-02',
                      scheduledTime: '14:00 EST',
                      reason: 'Technical architecture discovery follow-up',
                    }),
                  });
                  setShowCallbackModal(false);
                  showToast('Callback scheduled for September 2, 2026 at 14:00 EST.');
                }}
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
              >
                Confirm Callback
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}


'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  UserCheck,
  Activity,
  ArrowRight,
  PhoneCall,
  PhoneOff,
  History,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { getVoiceProvider } from '@/lib/voice';

export default function CallDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [call, setCall] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [handoffRequested, setHandoffRequested] = useState(false);
  
  const [isCalling, setIsCalling] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  
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

  const handleHumanHandoff = async () => {
    setHandoffRequested(true);
    showToast('Human Handoff Requested. A sales rep will take over shortly.');
    // In real app, trigger backend handoff logic
  };

  const startDemoCall = async () => {
    setIsCalling(true);
    setLiveTranscript('Connecting to proxy...\nRinging...\nConnected.\n');
    const provider = getVoiceProvider();
    await provider.start();
    
    setLiveTranscript(prev => prev + 'AI: Hello, this is Alex from IntentOS. I noticed you were evaluating some modernization solutions. Is now a good time to speak?\n');
    
    await provider.speak("Hello, this is Alex from IntentOS. I noticed you were evaluating some modernization solutions. Is now a good time to speak?");
    
    setTimeout(() => {
      setLiveTranscript(prev => prev + 'Prospect: Yes, I have a few minutes.\n');
      setTimeout(() => {
        setLiveTranscript(prev => prev + 'AI: Great. I see you are looking into enterprise AI implementation. What are your main challenges right now?\n');
        provider.speak("Great. I see you are looking into enterprise AI implementation. What are your main challenges right now?");
      }, 1500);
    }, 2000);
  };
  
  const endCall = async () => {
    setIsCalling(false);
    const provider = getVoiceProvider();
    provider.stop();
    setLiveTranscript(prev => prev + '\nCall Ended.');
    showToast('Call ended.');
  };

  if (loading) return <DetailLoadingSkeleton />;
  if (error || !call) return <ErrorState message={error || 'Call not found'} onRetry={fetchCallDetail} />;

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
                Call Session &bull; {call.lead?.company?.name || 'Account'}
              </h1>
              <StatusBadge status={call.status} type="status" />
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                {call.sentiment || 'NEUTRAL'} SENTIMENT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Prospect: <span className="text-slate-200 font-semibold">{call.lead?.name}</span> ({call.lead?.title}) &bull;{' '}
              Timezone: <span className="text-slate-200">{call.timezone || 'UTC'}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {isCalling ? (
            <Button
              onClick={endCall}
              size="sm"
              className="h-8 bg-red-900/60 hover:bg-red-800 text-red-200 font-medium text-xs flex items-center gap-1.5 shadow-sm border border-red-500/30"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End Call</span>
            </Button>
          ) : (
            <Button
              onClick={startDemoCall}
              size="sm"
              className="h-8 bg-green-900/60 hover:bg-green-800 text-green-200 font-medium text-xs flex items-center gap-1.5 shadow-sm border border-green-500/30"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Simulate Call</span>
            </Button>
          )}

          <Button
            onClick={handleHumanHandoff}
            variant="outline"
            size="sm"
            className="h-8 text-xs border-amber-500/40 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{handoffRequested ? 'Handoff Requested ✓' : 'Human Handoff'}</span>
          </Button>

          <Button
            onClick={() => setShowCallbackModal(true)}
            variant="outline"
            size="sm"
            className="h-8 border-slate-800 bg-slate-900 text-slate-300 text-xs flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Schedule Callback</span>
          </Button>

          <Link href={`/opportunities/${call.leadId}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-slate-100 flex items-center gap-1.5"
            >
              <span>View Lead</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Transcript & Intelligence */}
        <div className="lg:col-span-8 space-y-6">
          
          <Card className="p-5 bg-slate-900/60 border-slate-800 flex flex-col min-h-[400px]">
             <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
               <div className="flex items-center gap-2">
                 <Activity className="w-4 h-4 text-blue-400" />
                 <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                   Live Transcript
                 </h3>
               </div>
               {isCalling && (
                 <span className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                   <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                   LIVE
                 </span>
               )}
             </div>

             <div className="flex-1 overflow-y-auto font-mono text-sm space-y-4">
               {liveTranscript ? (
                 <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                   {liveTranscript}
                 </div>
               ) : turns.length > 0 ? (
                 turns.map((turn, idx) => (
                   <div key={idx} className="flex gap-4">
                     <span className={`w-20 font-bold ${turn.speaker === 'AI' ? 'text-blue-400' : turn.speaker === 'Human' ? 'text-amber-400' : 'text-slate-300'}`}>
                       {turn.speaker}:
                     </span>
                     <span className="text-slate-300">{turn.text}</span>
                   </div>
                 ))
               ) : (
                 <div className="text-slate-500 italic text-center py-10">
                   Waiting for call to connect...
                 </div>
               )}
             </div>
          </Card>

          {/* AI Disclosure Info */}
          <Card className="p-4 bg-slate-900/40 border-slate-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">AI Identity Disclosure</h4>
              <p className="text-xs text-slate-400 mt-1">This agent complies with outbound AI regulations by explicitly identifying itself as an AI system at the beginning of the call.</p>
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: Disposition & Intelligence */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Call Intelligence
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Intent Score</span>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${call.lead?.intentScore || 50}%` }}></div>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Interest Level</span>
                <div className="text-sm font-semibold text-slate-200">{call.interestLevel || 'PENDING'}</div>
              </div>
              
              <div>
                <span className="text-xs text-slate-400 block mb-1">Next Step Recommended</span>
                <div className="text-sm text-slate-200">{call.nextStep || 'Collect more information to determine next action.'}</div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <History className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Retry & Attempt History
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Policy</span>
                <span className="text-slate-200">{call.maxAttempts} Max Attempts</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Opt-Out Status</span>
                <span className={call.optOut ? "text-red-400 font-semibold" : "text-green-400"}>
                  {call.optOut ? 'OPTED OUT' : 'OK TO CALL'}
                </span>
              </div>
              
              <div className="border-t border-slate-800 pt-3 mt-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2">Attempts ({call.attempts?.length || 0})</h4>
                {call.attempts?.length > 0 ? (
                  <div className="space-y-2">
                    {call.attempts.map((attempt: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{new Date(attempt.startTime).toLocaleTimeString()}</span>
                        <span className="text-slate-200 font-mono bg-slate-800 px-1.5 py-0.5 rounded">{attempt.disposition}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic">No previous attempts</div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Call Disposition
              </h3>
            </div>
            
            <div className="space-y-2">
               <Button className="w-full justify-start h-8 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200">
                 Mark as Qualified
               </Button>
               <Button className="w-full justify-start h-8 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200">
                 Log Voicemail Left
               </Button>
               <Button className="w-full justify-start h-8 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200">
                 Mark No Answer (Retry Later)
               </Button>
               <Button className="w-full justify-start h-8 text-xs border border-red-500/30 bg-red-900/20 hover:bg-red-900/40 text-red-300">
                 DNC / Opt-Out
               </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

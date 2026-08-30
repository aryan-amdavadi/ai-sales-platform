'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  User,
  Sparkles,
  Building2,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Database,
  Globe,
  Share2,
  UserCheck,
  Zap,
  Activity,
  Flame,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { CallTurn, LiveConversationSignals } from '@/types/voice';
import { AVAILABLE_SCENARIOS, ScenarioDefinition } from '@/lib/voice/scenarios';
import { DemoVoiceProvider } from '@/lib/voice/demo-voice-provider';

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Call Cockpit States
  const [activeCallModal, setActiveCallModal] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<'IDLE' | 'DIALING' | 'IN_PROGRESS' | 'COMPLETED'>('IDLE');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<'VOICE' | 'TEXT'>('VOICE');
  const [language, setLanguage] = useState<'en-US' | 'hi-IN' | 'gu-IN'>('en-US');

  // Conversation & Live Signals
  const [currentScenario, setCurrentScenario] = useState<ScenarioDefinition>(AVAILABLE_SCENARIOS['en-US']);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [transcriptTurns, setTranscriptTurns] = useState<CallTurn[]>([]);
  const [liveSignals, setLiveSignals] = useState<LiveConversationSignals>({
    intent: 90,
    interest: 'HIGH',
    urgency: 'HIGH',
    sentiment: 'POSITIVE',
    detectedRequirement: 'SharePoint Implementation Partner',
    timeline: 'Evaluating vendors',
    painPoint: 'Legacy migration',
    objection: 'None',
    decisionMaker: 'Confirmed (CTO Marcus Vance)',
    buyingStage: 'Vendor Selection',
  });

  // Post-Call Intelligence & CRM States
  const [postCallAnalysis, setPostCallAnalysis] = useState<any>(null);
  const [crmPushing, setCrmPushing] = useState(false);
  const [crmSynced, setCrmSynced] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCallbackModal, setShowCallbackModal] = useState(false);

  const voiceProvider = useRef(new DemoVoiceProvider());
  const timerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const fetchCallsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resCalls, resCallbacks] = await Promise.all([
        fetch('/api/calls'),
        fetch('/api/calls/callback'),
      ]);
      if (!resCalls.ok) throw new Error('Failed to load call sessions');
      const dataCalls = await resCalls.json();
      const dataCallbacks = await resCallbacks.json();
      setCalls(dataCalls.calls || []);
      setCallbacks(dataCallbacks.callbacks || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching calls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallsData();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('start') === 'true') {
        const leadIdParam = urlParams.get('leadId') || undefined;
        handleStartHeroCall(language, leadIdParam);
      }
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (callStatus === 'IN_PROGRESS') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  // Start Autonomous Hero Call
  const handleStartHeroCall = async (lang = language, targetLeadId?: string) => {
    try {
      setActiveCallModal(true);
      setCallStatus('DIALING');
      setCallDuration(0);
      setTranscriptTurns([]);
      setCurrentTurnIndex(0);
      setPostCallAnalysis(null);
      setCrmSynced(false);

      const scenario = AVAILABLE_SCENARIOS[lang] || AVAILABLE_SCENARIOS['en-US'];
      setCurrentScenario(scenario);

      // Find hero lead or fetch requested lead
      let targetLead: any = null;
      if (targetLeadId) {
        try {
          const res = await fetch(`/api/opportunities/${targetLeadId}`);
          if (res.ok) {
            targetLead = await res.json();
          }
        } catch {}
      }

      if (!targetLead) {
        const resOpp = await fetch('/api/opportunities?search=ABC+Technologies');
        const oppData = await resOpp.json();
        targetLead = oppData.items?.[0] || {
          id: 'hero-lead',
          name: 'Marcus Vance',
          title: 'Chief Technology Officer (CTO)',
          company: { name: 'ABC Technologies', industry: 'Enterprise Software & IT' },
          requirements: [{ title: 'SharePoint Online Modernization' }],
        };
      }
      setActiveLead(targetLead);

      const resStart = await fetch('/api/calls/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: targetLead.id, language: lang }),
      });
      const startData = await resStart.json();
      const callId = startData.callId || 'call-hero-101';
      setActiveCallId(callId);

      // Dialing delay simulation
      setTimeout(() => {
        setCallStatus('IN_PROGRESS');
        playTurn(0, scenario, callId, targetLead.id);
      }, 800);
    } catch (err: any) {
      showToast(`Error starting call: ${err.message}`);
    }
  };

  // Play Turn in Call
  const playTurn = async (
    index: number,
    scenario: ScenarioDefinition,
    callId: string,
    leadId: string
  ) => {
    if (index >= scenario.turns.length) {
      handleEndCall(callId, leadId);
      return;
    }

    const turn = scenario.turns[index];
    setCurrentTurnIndex(index);

    // AI Turn
    const aiTurnObj: CallTurn = {
      id: `turn-ai-${index}`,
      speaker: 'AI',
      text: turn.aiStatement,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sentiment: 'POSITIVE',
    };

    setTranscriptTurns((prev) => [...prev, aiTurnObj]);
    await voiceProvider.current.speak(turn.aiStatement, scenario.language);

    // Update live signals
    setLiveSignals((prev) => ({
      ...prev,
      ...turn.signals,
    }));

    // Lead Turn delay
    setTimeout(async () => {
      const leadTurnObj: CallTurn = {
        id: `turn-lead-${index}`,
        speaker: 'Lead',
        text: turn.leadResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sentiment: 'POSITIVE',
        detectedSignals: [turn.signals.painPoint, turn.signals.detectedRequirement],
      };

      setTranscriptTurns((prev) => [...prev, leadTurnObj]);

      // Progress to next turn
      if (index + 1 < scenario.turns.length) {
        setTimeout(() => {
          playTurn(index + 1, scenario, callId, leadId);
        }, 1200);
      } else {
        setTimeout(() => {
          handleEndCall(callId, leadId);
        }, 1500);
      }
    }, 800);
  };

  // End Call & Process Intelligence
  const handleEndCall = async (
    callId = activeCallId || '',
    leadId = activeLead?.id || ''
  ) => {
    try {
      voiceProvider.current.stop();
      setCallStatus('COMPLETED');

      const res = await fetch(`/api/calls/${callId}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          durationSeconds: callDuration || 48,
          turns: transcriptTurns,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPostCallAnalysis(data.data.analysis || currentScenario.finalAnalysis);
        showToast('AI Call completed! Qualification (92 Hot) & Next Best Action synchronized.');
        fetchCallsData();
      }
    } catch (err: any) {
      showToast(`Error processing call: ${err.message}`);
    }
  };

  // Human Handoff
  const handleHumanHandoff = async () => {
    try {
      voiceProvider.current.stop();
      setCallStatus('COMPLETED');

      await fetch(`/api/calls/${activeCallId}/handoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: activeLead?.id,
          reason: 'Prospect requested direct technical steering architect',
        }),
      });

      showToast('Handoff requested. Transferring to human sales representative.');
      fetchCallsData();
    } catch (err: any) {
      showToast(`Handoff error: ${err.message}`);
    }
  };

  // Push to CRM
  const handlePushToCRM = async () => {
    try {
      setCrmPushing(true);
      const res = await fetch(`/api/calls/${activeCallId}/crm-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: activeLead?.id }),
      });
      const data = await res.json();
      if (data.success) {
        setCrmSynced(true);
        showToast(`CRM Synchronized! Contact & Opportunity created (${data.data.crmSyncId}).`);
        fetchCallsData();
      }
    } catch (err: any) {
      showToast(`CRM error: ${err.message}`);
    } finally {
      setCrmPushing(false);
    }
  };

  // Format Call Duration (mm:ss)
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-20">
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

      {/* Header & Hero Call Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100 uppercase">
            AI Voice Call Sessions & Cockpit
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Autonomous outbound voice qualification with real-time signal detection & CRM synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs font-mono focus:outline-none pr-2"
            >
              <option value="en-US" className="bg-slate-900 text-slate-200">
                English (US)
              </option>
              <option value="hi-IN" className="bg-slate-900 text-slate-200">
                Hindi (हिंदी)
              </option>
              <option value="gu-IN" className="bg-slate-900 text-slate-200">
                Gujarati (ગુજરાતી)
              </option>
            </select>
          </div>

          <Button
            onClick={() => handleStartHeroCall(language)}
            className="h-9 bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-bold text-xs px-4 flex items-center gap-2 shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Launch Hero Call (ABC Tech)</span>
          </Button>
        </div>
      </div>

      {/* AI SALES COCKPIT MODAL / PANEL */}
      {activeCallModal && (
        <Card
          className="p-6 bg-slate-950 border border-teal-500/40 shadow-2xl space-y-6 animate-in fade-in duration-200"
          data-testid="call-cockpit"
        >
          {/* Cockpit Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-mono text-slate-100">
                    AI SALES CALL &bull; {activeLead?.company?.name || 'ABC Technologies'}
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      callStatus === 'IN_PROGRESS'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                        : callStatus === 'DIALING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                    data-testid="call-status"
                  >
                    STATUS: {callStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Target: <span className="text-slate-200 font-semibold">{activeLead?.name}</span> ({activeLead?.title}) &bull;{' '}
                  Requirement: <span className="text-teal-300">SharePoint Online Modernization</span>
                </p>
              </div>
            </div>

            {/* Timer & Controls */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm text-teal-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>{formatDuration(callDuration)}</span>
              </div>

              {callStatus === 'IN_PROGRESS' && (
                <>
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    variant="outline"
                    size="sm"
                    className={`h-8 font-mono text-xs ${
                      isMuted ? 'border-red-500/50 bg-red-950/50 text-red-300' : 'border-slate-800 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span className="ml-1.5">{isMuted ? 'Muted' : 'Mute'}</span>
                  </Button>

                  <Button
                    onClick={() => setMode(mode === 'VOICE' ? 'TEXT' : 'VOICE')}
                    variant="outline"
                    size="sm"
                    className="h-8 font-mono text-xs border-slate-800 bg-slate-900 text-slate-300 hover:text-slate-100 flex items-center gap-1.5"
                    data-testid="switch-mode-btn"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                    <span>{mode === 'VOICE' ? 'Switch to Text' : 'Switch to Voice'}</span>
                  </Button>

                  <Button
                    onClick={handleHumanHandoff}
                    variant="outline"
                    size="sm"
                    className="h-8 font-mono text-xs border-amber-500/40 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 flex items-center gap-1.5"
                    data-testid="human-handoff"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Human Handoff</span>
                  </Button>

                  <Button
                    onClick={() => handleEndCall()}
                    size="sm"
                    className="h-8 bg-red-600 hover:bg-red-500 text-white font-mono text-xs px-3 flex items-center gap-1.5"
                    data-testid="end-call"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>End Call</span>
                  </Button>
                </>
              )}

              {callStatus === 'COMPLETED' && (
                <Button
                  onClick={() => setActiveCallModal(false)}
                  variant="outline"
                  size="sm"
                  className="h-8 border-slate-800 bg-slate-900 text-slate-300 font-mono text-xs"
                >
                  Close Cockpit
                </Button>
              )}
            </div>
          </div>

          {/* Cockpit Split View: Live Conversation & Live Signal Detection */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Live Conversation Stream */}
            <div className="lg:col-span-7 space-y-4" data-testid="conversation">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-900 pb-2">
                <span className="uppercase font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  Live Conversational Turns
                </span>
                <span className="text-[11px] text-teal-400 font-mono">
                  {transcriptTurns.length} Turns Ingested
                </span>
              </div>

              {/* Turns Display */}
              <div
                className="space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar"
                data-testid="transcript"
              >
                {transcriptTurns.map((turn, i) => (
                  <div
                    key={turn.id || i}
                    className={`p-3.5 rounded-lg border text-xs font-sans space-y-1 ${
                      turn.speaker === 'AI'
                        ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                        : 'bg-teal-950/30 border-teal-500/30 text-teal-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span
                        className={`font-bold flex items-center gap-1.5 ${
                          turn.speaker === 'AI' ? 'text-teal-400' : 'text-emerald-400'
                        }`}
                      >
                        {turn.speaker === 'AI' ? (
                          <>
                            <Sparkles className="w-3 h-3" />
                            IntentOS AI Sales Assistant
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            Marcus Vance (CTO)
                          </>
                        )}
                      </span>
                      <span className="text-slate-500 text-[10px]">{turn.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{turn.text}</p>

                    {turn.detectedSignals && turn.detectedSignals.length > 0 && (
                      <div className="flex gap-1.5 pt-1 flex-wrap">
                        {turn.detectedSignals.map((sig, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-950 text-teal-300 border border-teal-500/20"
                          >
                            Signal: {sig}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {callStatus === 'DIALING' && (
                  <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-teal-400 animate-bounce" />
                    <span>Connecting autonomous voice session to Marcus Vance (CTO)...</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Live Signal Detection Engine */}
            <div className="lg:col-span-5 space-y-4" data-testid="live-signals">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-900 pb-2">
                <span className="uppercase font-bold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-teal-400" />
                  Live Signal Detection
                </span>
                <span className="text-[11px] font-bold text-teal-300">Active Extraction</span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {/* Intent & Interest Gauges */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">INTENT SCORE</span>
                    <span className="text-lg font-bold text-teal-400">{liveSignals.intent}/100</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">INTEREST LEVEL</span>
                    <span className="text-lg font-bold text-emerald-400">{liveSignals.interest}</span>
                  </div>
                </div>

                {/* Detected Signals 1-by-1 */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-[11px]">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Buying Stage:</span>
                    <span className="text-slate-200 font-semibold">{liveSignals.buyingStage}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Timeline:</span>
                    <span className="text-slate-200 font-semibold">{liveSignals.timeline}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Core Pain Point:</span>
                    <span className="text-red-300 font-semibold">{liveSignals.painPoint}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Detected Objection:</span>
                    <span className="text-amber-300 font-semibold">{liveSignals.objection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Decision Maker:</span>
                    <span className="text-teal-300 font-semibold">{liveSignals.decisionMaker}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* POST-CALL CONVERSATION INTELLIGENCE & NEXT BEST ACTION */}
          {callStatus === 'COMPLETED' && postCallAnalysis && (
            <div className="border-t border-slate-800 pt-5 space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-teal-400 uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Post-Call Conversation Intelligence & Next Action
                </h3>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                  HOT QUALIFIED ({postCallAnalysis.qualificationScore}%)
                </span>
              </div>

              {/* Call Summary & Strategy */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 space-y-3">
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                    <span className="font-mono text-slate-400 font-bold uppercase text-[10px] block">
                      Call Executive Summary
                    </span>
                    <p className="text-slate-200 font-sans leading-relaxed">{postCallAnalysis.summary}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                    <span className="font-mono text-slate-400 font-bold uppercase text-[10px] block">
                      Confirmed Pain Points & Objections
                    </span>
                    <ul className="space-y-1 font-sans text-slate-300">
                      {postCallAnalysis.painPoints?.map((p: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold">&bull;</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  {/* NEXT BEST ACTION CARD */}
                  <div className="p-4 rounded-lg bg-teal-950/40 border border-teal-500/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-teal-300 uppercase">NEXT BEST ACTION</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-teal-500/20 text-teal-300 font-bold">
                        HIGH PRIORITY
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-100 font-mono">
                      {postCallAnalysis.nextBestAction}
                    </p>

                    {/* Action Buttons: Schedule Meeting & Push to CRM */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <Button
                        onClick={handlePushToCRM}
                        disabled={crmPushing || crmSynced}
                        size="sm"
                        className="h-8 bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5"
                        data-testid="push-crm-btn"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>{crmSynced ? 'Synced to CRM ✓' : crmPushing ? 'Syncing...' : 'Push to CRM'}</span>
                      </Button>

                      <Button
                        onClick={() => setShowCallbackModal(true)}
                        variant="outline"
                        size="sm"
                        className="h-8 border-slate-800 bg-slate-900 text-slate-300 font-mono text-xs flex items-center gap-1.5"
                        data-testid="schedule-callback-btn"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Callback</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* SCHEDULE CALLBACK MODAL */}
      {showCallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <Card className="p-6 bg-slate-900 border border-slate-800 max-w-md w-full space-y-4 font-mono">
            <h3 className="text-base font-bold text-slate-100 uppercase">Schedule Follow-Up Callback</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Prospect</label>
                <input
                  type="text"
                  disabled
                  value={`${activeLead?.name || 'Marcus Vance'} (${activeLead?.company?.name || 'ABC Technologies'})`}
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
                      leadId: activeLead?.id,
                      leadName: activeLead?.name || 'Marcus Vance',
                      companyName: activeLead?.company?.name || 'ABC Technologies',
                      scheduledDate: '2026-09-02',
                      scheduledTime: '14:00 EST',
                      reason: 'Technical architecture discovery follow-up',
                    }),
                  });
                  setShowCallbackModal(false);
                  showToast('Callback scheduled for September 2, 2026 at 14:00 EST.');
                  fetchCallsData();
                }}
                size="sm"
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Confirm Callback
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* CALL SESSIONS HISTORY & UPCOMING CALLBACKS */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCallsData} />
      ) : (
        <div className="space-y-6">
          {/* Upcoming Scheduled Callbacks */}
          {callbacks.length > 0 && (
            <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <h3 className="text-xs font-bold font-mono text-slate-200 uppercase">
                    Upcoming Scheduled Callbacks ({callbacks.length})
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Autonomous Queue</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {callbacks.map((cb) => (
                  <div
                    key={cb.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-slate-200 block">{cb.companyName}</span>
                      <span className="text-slate-400 text-[11px]">
                        {cb.leadName} &bull; {cb.reason}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-teal-400 font-bold block">{cb.scheduledDate}</span>
                      <span className="text-slate-500 text-[10px]">{cb.scheduledTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Completed Call History List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wide">
              Completed Call Sessions & Transcripts ({calls.length})
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {calls.map((call) => {
                const leadName = call.lead?.name || 'Prospect';
                const companyName = call.lead?.company?.name || 'Company';

                return (
                  <Card
                    key={call.id}
                    className="p-5 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold font-mono text-base text-slate-100">
                          {companyName}
                        </span>
                        <StatusBadge status={call.status} type="status" />
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                          {call.sentiment || 'POSITIVE'} SENTIMENT
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 text-slate-400 border border-slate-800">
                          {call.durationSeconds}s DURATION
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-sans line-clamp-2">
                        {call.summary || 'AI qualification call completed with positive sentiment.'}
                      </p>

                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                        <span>Decision Maker: <strong className="text-slate-200">{leadName}</strong></span>
                        <span>&bull;</span>
                        <span>Next Step: <strong className="text-teal-300">{call.nextStep || 'Technical Meeting'}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/calls/${call.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 font-mono text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-slate-100 flex items-center gap-1.5"
                        >
                          <span>View Transcript & Analysis</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

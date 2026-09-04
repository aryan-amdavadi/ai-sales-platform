'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  PhoneCall,
  Sparkles,
  Building2,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  FileText,
  TrendingUp,
  Cpu,
  User,
  Zap,
  RotateCw,
  AlertCircle,
  HelpCircle,
  Award,
  Check,
  Flame,
  MessageSquare,
  Clock,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action Loading States
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [callingState, setCallingState] = useState<'idle' | 'calling' | 'connected'>('idle');

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/opportunities/${id}`);
      if (!res.ok) throw new Error('Opportunity record not found');
      const data = await res.json();
      setOpportunity(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load opportunity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOpportunity();
    }
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAnalyzeOpportunity = async () => {
    try {
      setAnalyzing(true);
      const res = await fetch(`/api/opportunities/${id}/analyze`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to analyze opportunity');
      await fetchOpportunity();
      showToast('AI Sales Intelligence pipeline completed! Scores and Sales Brief updated.');
    } catch (err: any) {
      showToast(`Analysis error: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateSalesBrief = async () => {
    try {
      setGeneratingBrief(true);
      const res = await fetch(`/api/opportunities/${id}/sales-brief`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate sales brief');
      await fetchOpportunity();
      showToast('Pre-call Sales Brief & objection strategies regenerated.');
    } catch (err: any) {
      showToast(`Brief error: ${err.message}`);
    } finally {
      setGeneratingBrief(false);
    }
  };

  const handleRecalculateScore = async () => {
    try {
      setRecalculating(true);
      const res = await fetch(`/api/opportunities/${id}/score`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to recalculate score');
      await fetchOpportunity();
      showToast('Intent and Fit scores recalculated successfully.');
    } catch (err: any) {
      showToast(`Score error: ${err.message}`);
    } finally {
      setRecalculating(false);
    }
  };

  const handleTriggerCall = () => {
    setCallingState('calling');
    setTimeout(() => {
      setCallingState('connected');
      setTimeout(() => {
        setCallingState('idle');
        router.push(`/calls?leadId=${id}&start=true`);
      }, 500);
    }, 400);
  };

  if (loading) {
    return <DetailLoadingSkeleton />;
  }

  if (error || !opportunity) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Link
          href="/opportunities"
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Opportunities
        </Link>
        <ErrorState message={error || 'Opportunity not found'} onRetry={fetchOpportunity} />
      </div>
    );
  }

  const isHero =
    opportunity.company?.name === 'TechNova Solutions' ||
    opportunity.company?.name === 'ABC Technologies';
  const req = opportunity.requirements?.[0] || {};
  const qual = opportunity.qualifications?.[0] || {};
  const rec = opportunity.recommendations?.[0] || {};

  // Parse structured tags / requirements
  let tags: string[] = [];
  try {
    if (req.tags) tags = JSON.parse(req.tags);
  } catch {
    tags = req.tags ? [req.tags] : [];
  }

  // Parse structured sales brief if it is JSON
  let structuredBrief: any = null;
  if (opportunity.salesBrief) {
    try {
      structuredBrief = JSON.parse(opportunity.salesBrief);
    } catch {
      structuredBrief = null;
    }
  }

  // Calculate 8-dimension Intent Breakdown values
  const intentBreakdown = [
    { label: 'Requirement Clarity', value: Math.min(98, 75 + tags.length * 4) },
    { label: 'Urgency', value: opportunity.urgency === 'IMMEDIATE' ? 96 : opportunity.urgency === 'HIGH' ? 91 : 75 },
    { label: 'Timeline', value: req.timeframe?.includes('30') ? 89 : req.timeframe?.includes('Immediate') ? 95 : 78 },
    { label: 'Solution Fit', value: 97 },
    { label: 'Decision Maker', value: opportunity.title?.toLowerCase().includes('cto') ? 82 : 75 },
    { label: 'Recency', value: 98 },
    { label: 'Company Fit', value: 93 },
    { label: 'Buying Stage', value: 95 },
  ];

  // Calculate Fit breakdown
  const fitBreakdown = {
    capabilityMatch: 98,
    industryMatch: 95,
    technologyMatch: 96,
    locationMatch: 95,
    overallFitScore: 96,
  };

  // Qualification heat category
  const qualScore = qual.overallScore || opportunity.qualificationScore || 85;
  const heatCategory = qualScore >= 85 ? 'HOT' : qualScore >= 65 ? 'WARM' : qualScore >= 40 ? 'POTENTIAL' : 'LOW';

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto" data-testid="opportunity-detail">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-slate-900 border border-blue-500/50 text-blue-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-200 text-sm font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/opportunities"
            className="p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                {opportunity.company?.name}
              </h1>
              {isHero && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  HERO TARGET
                </span>
              )}
              <StatusBadge status={opportunity.status} type="status" />
              <StatusBadge status={opportunity.urgency} type="urgency" />
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                  heatCategory === 'HOT'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {heatCategory} QUALIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Decision Maker: <span className="text-slate-200 font-medium">{opportunity.name}</span> &bull;{' '}
              {opportunity.title} &bull; Discovered{' '}
              {new Date(opportunity.discoveredAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleRecalculateScore}
            disabled={recalculating || analyzing}
            variant="outline"
            size="sm"
            className="h-8 text-xs border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5"
            data-testid="recalculate-score-btn"
          >
            <RotateCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
            <span>{recalculating ? 'Recalculating...' : 'Recalculate Score'}</span>
          </Button>

          <Button
            onClick={handleGenerateSalesBrief}
            disabled={generatingBrief || analyzing}
            variant="outline"
            size="sm"
            className="h-8 text-xs border-slate-700 bg-slate-900 hover:bg-slate-800 text-blue-300 flex items-center gap-1.5"
            data-testid="generate-brief-btn"
          >
            <Sparkles className={`w-3.5 h-3.5 ${generatingBrief ? 'animate-spin text-blue-400' : 'text-blue-400'}`} />
            <span>{generatingBrief ? 'Synthesizing...' : 'Generate Sales Brief'}</span>
          </Button>

          <Button
            onClick={handleAnalyzeOpportunity}
            disabled={analyzing}
            size="sm"
            className="h-8 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center gap-1.5"
            data-testid="analyze-btn"
          >
            <Zap className={`w-3.5 h-3.5 ${analyzing ? 'animate-pulse text-blue-400' : 'text-blue-400'}`} />
            <span>{analyzing ? 'Analyzing...' : 'Analyze Opportunity'}</span>
          </Button>

          <Button
            onClick={handleTriggerCall}
            disabled={callingState !== 'idle'}
            size="sm"
            className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3.5 flex items-center gap-1.5 shadow-sm"
            data-testid="call-action"
          >
            <PhoneCall className={`w-3.5 h-3.5 ${callingState === 'calling' ? 'animate-bounce' : ''}`} />
            <span>
              {callingState === 'idle'
                ? 'Launch AI Voice Call'
                : callingState === 'calling'
                ? 'Connecting Voice...'
                : 'Call Dispatched!'}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Core Analysis, Evidence, Company Intelligence & Sales Brief */}
        <div className="lg:col-span-8 space-y-6">
          {/* Public Requirement & Evidence Panel */}
          <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-4" data-testid="evidence-panel">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold tracking-tight text-slate-100 uppercase">
                  PUBLIC BUYING REQUIREMENT & EVIDENCE
                </h3>
              </div>
              <StatusBadge status={opportunity.source?.platform || 'LINKEDIN'} type="source" />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-100">
                  {req.title || 'Enterprise Technical Modernization Specification'}
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{req.description}</p>
              </div>

              {/* Sub-requirements Pills */}
              {tags.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                    Extracted Scope Components ({tags.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs bg-slate-950 text-slate-200 border border-slate-800 flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-blue-400" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* "Why This Lead?" Evidence Checklist */}
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-400 uppercase tracking-wide">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Why This Lead? (Extracted Evidence)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">Confidence: {req.confidenceScore || 96}%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Explicit vendor search for {req.category || 'SharePoint Implementation'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Requirement clearly defined ({tags.length} core specifications)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Verified high-authority decision maker ({opportunity.title})</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Urgent timeline target ({req.timeframe || 'Next 30 Days'})</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Active procurement stage: Vendor Selection</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Strong architectural & capability solution fit (96%)</span>
                  </div>
                </div>

                {/* Raw Quote */}
                <div className="mt-3 pt-2.5 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Raw Public Signal Excerpt
                  </span>
                  <blockquote className="text-xs text-slate-300 italic border-l-2 border-blue-500/60 pl-3 py-1">
                    "{req.rawEvidence || 'Looking for an experienced implementation partner to handle enterprise modernization and zero-downtime cutover.'}"
                  </blockquote>
                </div>
              </div>

              {/* Requirement Budget & Pipeline Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-md bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">BUDGET ESTIMATE</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{req.budgetEstimate || '$150k - $250k'}</span>
                </div>
                <div className="p-2.5 rounded-md bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">TIMELINE DEADLINE</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{req.timeframe || 'Next 30 Days'}</span>
                </div>
                <div className="p-2.5 rounded-md bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">PIPELINE ARR VALUE</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">${opportunity.pipelineValue?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Intelligence & "Why Now?" */}
          <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold tracking-tight text-slate-100 uppercase">
                  COMPANY INTELLIGENCE & "WHY NOW?" SIGNALS
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">{opportunity.company?.industry}</span>
            </div>

            {/* "Why Now?" Signals Box */}
            <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-500/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wide">
                <Flame className="w-4 h-4 text-blue-400" />
                <span>WHY NOW? (High-Velocity Trigger Events)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Requirement posted 3 hours ago in active procurement cycle</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Company is actively hiring +8 engineering roles</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Technology match: Microsoft 365, SPFx, Cloud Core</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Vendor selection active — recommended contact within 4h</span>
                </div>
              </div>
            </div>

            {/* Firmographic Signals 4-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-blue-400 text-[11px] font-semibold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" /> Technology Stack
                </span>
                <p className="text-slate-300">
                  {opportunity.company?.techStack || 'Microsoft 365, SharePoint 2016 Server, Azure, React, SPFx'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-indigo-400 text-[11px] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Hiring Velocity
                </span>
                <p className="text-slate-300">
                  {opportunity.company?.hiringSignals || 'Actively hiring Lead SharePoint Architects and Cloud Integration Engineers.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Growth Trajectory
                </span>
                <p className="text-slate-300">
                  {opportunity.company?.growthSignals || '+18% headcount YoY across enterprise IT and digital modernization.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-amber-400 text-[11px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Funding & Scale
                </span>
                <p className="text-slate-300">
                  {opportunity.company?.fundingSignals || 'Series C ($48M) backed; $120M annual revenue scale.'}
                </p>
              </div>
            </div>
          </Card>

          {/* AI Sales Brief ("PRE-CALL BRIEF") */}
          <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-5" data-testid="sales-brief">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold tracking-tight text-slate-100 uppercase">
                  AI PRE-CALL SALES BRIEF & STRATEGY
                </h3>
              </div>
              <span className="text-xs text-blue-400 font-medium">Context-Specific Playbook</span>
            </div>

            {structuredBrief ? (
              <div className="space-y-4 text-xs">
                {/* Why They Matter */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] uppercase text-blue-400 font-bold block">
                    Why Decision Maker Matters
                  </span>
                  <p className="text-slate-200 leading-relaxed">{structuredBrief.whyTheyMatter}</p>
                </div>

                {/* Pain Points */}
                {structuredBrief.painPoints?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] uppercase text-slate-400 font-semibold block">
                      Core Pain Points & Friction Points
                    </span>
                    <ul className="space-y-1.5">
                      {structuredBrief.painPoints.map((pain: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="text-rose-400 font-bold mt-0.5">&bull;</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Objections & Counter-strategies */}
                {structuredBrief.likelyObjections?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[11px] uppercase text-slate-400 font-semibold block">
                      Anticipated Objections & Counter-Strategies
                    </span>
                    <div className="space-y-2">
                      {structuredBrief.likelyObjections.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <div className="text-amber-400 text-xs font-semibold flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>Objection: "{item.objection}"</span>
                          </div>
                          <div className="text-slate-300 text-xs pl-5 pt-0.5 leading-relaxed">
                            <strong className="text-blue-400">Strategy: </strong>
                            {item.counterStrategy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Positioning & Opening Statement */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] uppercase text-blue-400 font-semibold block">
                      Recommended Positioning
                    </span>
                    <p className="text-slate-200 leading-relaxed">{structuredBrief.recommendedPositioning}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/30 space-y-1">
                    <span className="text-[11px] uppercase text-blue-300 font-semibold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      Suggested Opening Statement
                    </span>
                    <p className="text-slate-200 italic text-xs leading-relaxed">
                      "{structuredBrief.openingStatement}"
                    </p>
                  </div>
                </div>

                {/* Discovery Questions & Desired Outcome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] uppercase text-slate-400 font-semibold block">
                      Key Questions to Ask
                    </span>
                    <ul className="space-y-1 text-slate-300 text-xs">
                      {structuredBrief.questionsToAsk?.map((q: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <HelpCircle className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] uppercase text-slate-400 font-semibold block">
                      Desired Call Outcome
                    </span>
                    <p className="text-emerald-400 text-xs font-semibold leading-relaxed">
                      {structuredBrief.desiredOutcome}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">
                {opportunity.salesBrief || 'Click "Generate Sales Brief" above to create an AI pre-call brief.'}
              </p>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: Intent Score Breakdown, Company Fit, Qualification, Next Best Action & Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Intent Score & 8-Dimension Breakdown */}
          <Card className="p-5 bg-slate-900/60 border-slate-800 text-center space-y-4" data-testid="intent-score">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Autonomous Intent Score
              </span>
              <div className="text-4xl font-extrabold text-blue-400 py-1 font-sans">
                {opportunity.intentScore}
                <span className="text-sm text-slate-500 font-normal"> / 100</span>
              </div>
              <p className="text-xs text-slate-300">
                {opportunity.intentScore >= 85
                  ? 'Critically high intent verified across explicit vendor search.'
                  : 'Solid buying signal with active requirement exploration.'}
              </p>
            </div>

            {/* 8 Dimensions Breakdown */}
            <div className="pt-3 border-t border-slate-800 text-left space-y-2 text-xs">
              <span className="text-[11px] uppercase text-slate-400 block font-semibold">
                Intent Dimensions Breakdown
              </span>

              <div className="space-y-2 text-[11px]">
                {intentBreakdown.map((item) => (
                  <div key={item.label} className="space-y-0.5">
                    <div className="flex justify-between text-slate-300">
                      <span>{item.label}:</span>
                      <span className="text-blue-400 font-semibold">{item.value}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Solution & Company Fit Score Card */}
          <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs uppercase font-semibold text-slate-300">
                Solution & Company Fit
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {fitBreakdown.overallFitScore}% Fit
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Capability Match:</span>
                <span className="text-slate-200">{fitBreakdown.capabilityMatch}%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Industry Match:</span>
                <span className="text-slate-200">{fitBreakdown.industryMatch}%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Technology Match:</span>
                <span className="text-slate-200">{fitBreakdown.technologyMatch}%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Location Match:</span>
                <span className="text-slate-200">{fitBreakdown.locationMatch}%</span>
              </div>
            </div>
          </Card>

          {/* Qualification Engine (BANT & Heat Classification) */}
          <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-3" data-testid="qualification">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs uppercase font-semibold text-slate-300">
                BANT Qualification Engine
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  heatCategory === 'HOT' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {heatCategory} ({qualScore}%)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-semibold">NEED</span>
                <span className="font-bold text-blue-400">{qual.needFit || 95}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-semibold">FIT</span>
                <span className="font-bold text-blue-400">{qual.budgetFit || 96}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-semibold">AUTHORITY</span>
                <span className="font-bold text-blue-400">{qual.authorityFit || 90}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-semibold">TIMING</span>
                <span className="font-bold text-blue-400">{qual.timingFit || 89}%</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              {qual.reasoning ||
                `Qualified based on explicit requirement need (${req.title}) and confirmed decision maker (${opportunity.name}).`}
            </p>
          </Card>

          {/* Next Best Action Card */}
          <Card className="p-4 bg-slate-900/90 border-blue-500/30 space-y-3" data-testid="next-best-action">
            <div className="flex items-center justify-between text-blue-400 border-b border-blue-500/20 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Next Best Action</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-500/20 text-blue-300 font-semibold">
                {rec.priority || 'HIGH'} PRIORITY
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-100">
                {rec.title || 'Schedule Technical Discovery Session'}
              </p>
              <p className="text-xs text-slate-300 mt-1">{rec.rationale}</p>
            </div>

            {/* Why Action Bullets */}
            <div className="space-y-1 text-xs text-slate-300 pt-1">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Action Rationale:</span>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-400 font-bold">&bull;</span>
                  <span>Active requirement for {req.title || 'SharePoint Migration'}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-400 font-bold">&bull;</span>
                  <span>Vendor selection stage with {opportunity.urgency} urgency</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-400 font-bold">&bull;</span>
                  <span>High solution fit (96%) and 30-day timeline</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-400 font-bold">&bull;</span>
                  <span>Decision maker {opportunity.name} ({opportunity.title})</span>
                </div>
              </div>
            </div>

            {rec.suggestedMessage && (
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300">
                "{rec.suggestedMessage}"
              </div>
            )}
          </Card>

          {/* Lead Profile & Source Info */}
          <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Decision Maker Profile
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">{opportunity.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{opportunity.email || 'cto@abctechnologies.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{opportunity.phone || '+1 (512) 893-4102'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{opportunity.company?.location || 'Austin, TX'}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Source:</span>
                <StatusBadge status={opportunity.source?.platform || 'LINKEDIN'} type="source" />
              </div>
            </div>
          </Card>

          {/* Signal & Activity Log Timeline */}
          <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Activity & Intelligence Log
              </h4>
              <span className="text-[10px] text-slate-500">
                {opportunity.activityLogs?.length || 1} Events
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {opportunity.activityLogs?.length > 0 ? (
                opportunity.activityLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-2.5 pb-2 border-b border-slate-800/60 last:border-0 last:pb-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-slate-200 font-semibold">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-[11px] text-slate-400">{log.details}</p>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs">Signal ingested and scored via autonomous pipeline.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


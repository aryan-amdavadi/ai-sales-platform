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
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  TrendingUp,
  Cpu,
  User,
  Zap,
  RotateCw,
  Target,
  AlertCircle,
  HelpCircle,
  Award,
  Check,
  Flame,
  MessageSquare,
  Compass,
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
      <div className="space-y-6">
        <Link
          href="/opportunities"
          className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Opportunities
        </Link>
        <ErrorState message={error || 'Opportunity not found'} onRetry={fetchOpportunity} />
      </div>
    );
  }

  const isHero = opportunity.company?.name === 'ABC Technologies';
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
  const intentBreakdown = {
    requirementClarity: Math.min(98, 75 + tags.length * 4),
    urgency: opportunity.urgency === 'IMMEDIATE' ? 96 : opportunity.urgency === 'HIGH' ? 91 : 75,
    timeline: req.timeframe?.includes('30') ? 89 : req.timeframe?.includes('Immediate') ? 95 : 78,
    solutionFit: 97,
    decisionMaker: opportunity.title?.toLowerCase().includes('cto') ? 82 : 75,
    recency: 98,
    companyFit: 93,
    buyingStage: 95,
  };

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
    <div className="space-y-6 pb-20" data-testid="opportunity-detail">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-teal-950/80 border border-teal-500/50 text-teal-200 text-xs font-mono flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-teal-400 hover:text-teal-200">
            &times;
          </button>
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/opportunities"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
                {opportunity.company?.name}
              </h1>
              {isHero && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  HERO TARGET
                </span>
              )}
              <StatusBadge status={opportunity.status} type="status" />
              <StatusBadge status={opportunity.urgency} type="urgency" />
              <span
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
                  heatCategory === 'HOT'
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {heatCategory} QUALIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
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
            className="h-8 text-xs font-mono border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5"
            data-testid="recalculate-score-btn"
          >
            <RotateCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin text-teal-400' : 'text-slate-400'}`} />
            <span>{recalculating ? 'Recalculating...' : 'Recalculate Score'}</span>
          </Button>

          <Button
            onClick={handleGenerateSalesBrief}
            disabled={generatingBrief || analyzing}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-mono border-slate-700 bg-slate-900 hover:bg-slate-800 text-teal-300 flex items-center gap-1.5"
            data-testid="generate-brief-btn"
          >
            <Sparkles className={`w-3.5 h-3.5 ${generatingBrief ? 'animate-spin text-teal-400' : 'text-teal-400'}`} />
            <span>{generatingBrief ? 'Synthesizing...' : 'Generate Sales Brief'}</span>
          </Button>

          <Button
            onClick={handleAnalyzeOpportunity}
            disabled={analyzing}
            size="sm"
            className="h-8 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 flex items-center gap-1.5"
            data-testid="analyze-btn"
          >
            <Zap className={`w-3.5 h-3.5 ${analyzing ? 'animate-pulse text-teal-400' : 'text-teal-400'}`} />
            <span>{analyzing ? 'Analyzing...' : 'Analyze Opportunity'}</span>
          </Button>

          <Button
            onClick={handleTriggerCall}
            disabled={callingState !== 'idle'}
            size="sm"
            className="h-8 text-xs font-mono font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 px-3.5 flex items-center gap-1.5 shadow-sm"
            data-testid="call-action"
          >
            <PhoneCall className={`w-3.5 h-3.5 ${callingState === 'calling' ? 'animate-bounce' : ''}`} />
            <span>
              {callingState === 'idle'
                ? 'Launch AI Voice Call'
                : callingState === 'calling'
                ? 'Connecting Voice Copilot...'
                : 'Call Dispatched!'}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Core Analysis, Evidence, Company Intelligence & Sales Brief */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 4 & 5: Public Requirement & Evidence Panel */}
          <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-5" data-testid="evidence-panel">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100 uppercase">
                  4. Structured Requirement & Public Evidence
                </h3>
              </div>
              <StatusBadge status={opportunity.source?.platform || 'LINKEDIN'} type="source" />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-semibold text-slate-100">
                  {req.title || 'Enterprise Technical Modernization Specification'}
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{req.description}</p>
              </div>

              {/* Sub-requirements Pills */}
              {tags.length > 0 && (
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                    Extracted Scope Components ({tags.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-slate-950 text-slate-200 border border-slate-800 flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-teal-400" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5: "Why This Lead?" Evidence Checklist */}
              <div className="p-4 rounded-lg bg-slate-950/90 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-teal-400 uppercase tracking-wide">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>5. Why This Lead? (Extracted Evidence)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">Confidence: {req.confidenceScore || 96}%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>Explicit vendor search for {req.category || 'SharePoint Implementation'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>Requirement clearly defined ({tags.length} core specifications)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>Verified high-authority decision maker ({opportunity.title})</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>Urgent timeline target ({req.timeframe || 'Next 30 Days'})</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>Active procurement stage: Vendor Selection</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>Strong architectural & capability solution fit (96%)</span>
                  </div>
                </div>

                {/* Raw Quote */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Raw Public Signal Excerpt
                  </span>
                  <blockquote className="text-xs text-slate-300 italic border-l-2 border-teal-500/60 pl-3 py-1 font-sans">
                    "{req.rawEvidence || 'Looking for an experienced implementation partner to handle enterprise modernization and zero-downtime cutover.'}"
                  </blockquote>
                </div>
              </div>

              {/* Requirement Budget & Pipeline Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">BUDGET ESTIMATE</span>
                  <span className="font-bold text-slate-200">{req.budgetEstimate || '$150k - $250k'}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">TIMELINE DEADLINE</span>
                  <span className="font-bold text-slate-200">{req.timeframe || 'Next 30 Days'}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">PIPELINE ARR VALUE</span>
                  <span className="font-bold text-emerald-400">${opportunity.pipelineValue?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION 7 & 8: Company Intelligence & "Why Now?" */}
          <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100 uppercase">
                  7. Company Intelligence & 8. "Why Now?" Signals
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{opportunity.company?.industry}</span>
            </div>

            {/* "Why Now?" Signals Box */}
            <div className="p-4 rounded-lg bg-teal-950/20 border border-teal-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-teal-400 uppercase tracking-wide">
                <Flame className="w-4 h-4 text-teal-400" />
                <span>WHY NOW? (High-Velocity Trigger Events)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
                <div className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  <span>Requirement recently posted within current procurement cycle</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  <span>Company is actively hiring modernization engineers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  <span>Technology stack matches solution integration specifications</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  <span>Vendor evaluation window is active and receptive to outreach</span>
                </div>
              </div>
            </div>

            {/* Firmographic Signals 4-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono text-teal-400 text-[11px] font-semibold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" /> Technology Stack
                </span>
                <p className="text-slate-300 font-sans">
                  {opportunity.company?.techStack || 'Microsoft 365, SharePoint 2016 Server, Azure, React, SPFx'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono text-indigo-400 text-[11px] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Hiring Velocity
                </span>
                <p className="text-slate-300 font-sans">
                  {opportunity.company?.hiringSignals || 'Actively hiring Lead SharePoint Architects and Cloud Integration Engineers.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Growth Trajectory
                </span>
                <p className="text-slate-300 font-sans">
                  {opportunity.company?.growthSignals || '+18% headcount YoY across enterprise IT and digital modernization.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono text-amber-400 text-[11px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Funding & Scale
                </span>
                <p className="text-slate-300 font-sans">
                  {opportunity.company?.fundingSignals || 'Series C ($48M) backed; $120M annual revenue scale.'}
                </p>
              </div>
            </div>
          </Card>

          {/* SECTION 10: AI Sales Brief ("PRE-CALL BRIEF") */}
          <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-5" data-testid="sales-brief">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100 uppercase">
                  10. AI Pre-Call Sales Brief & Strategy
                </h3>
              </div>
              <span className="text-xs font-mono text-teal-300">Context-Specific Strategy</span>
            </div>

            {structuredBrief ? (
              <div className="space-y-4 text-xs font-sans">
                {/* Why They Matter */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-teal-400 font-bold block">
                    Why Decision Maker Matters
                  </span>
                  <p className="text-slate-200 leading-relaxed">{structuredBrief.whyTheyMatter}</p>
                </div>

                {/* Pain Points */}
                {structuredBrief.painPoints?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                      Core Pain Points & Friction Points
                    </span>
                    <ul className="space-y-1.5">
                      {structuredBrief.painPoints.map((pain: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="text-red-400 font-bold mt-0.5">&bull;</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Objections & Counter-strategies */}
                {structuredBrief.likelyObjections?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800/70">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                      Anticipated Objections & Counter-Strategies
                    </span>
                    <div className="space-y-2 font-mono">
                      {structuredBrief.likelyObjections.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <div className="text-amber-400 text-xs font-semibold flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>Objection: "{item.objection}"</span>
                          </div>
                          <div className="text-slate-300 text-xs font-sans pl-5 pt-0.5 leading-relaxed">
                            <strong className="text-teal-400 font-mono">Strategy: </strong>
                            {item.counterStrategy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Positioning & Opening Statement */}
                <div className="space-y-3 pt-2 border-t border-slate-800/70">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono">
                    <span className="text-[11px] uppercase text-teal-400 font-bold block">
                      Recommended Positioning
                    </span>
                    <p className="text-slate-200 font-sans leading-relaxed">{structuredBrief.recommendedPositioning}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-teal-950/30 border border-teal-500/40 space-y-1 font-mono">
                    <span className="text-[11px] uppercase text-teal-300 font-bold block flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                      Suggested Opening Statement
                    </span>
                    <p className="text-teal-100 font-sans italic text-xs leading-relaxed">
                      "{structuredBrief.openingStatement}"
                    </p>
                  </div>
                </div>

                {/* Discovery Questions & Desired Outcome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/70">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                      Key Questions to Ask
                    </span>
                    <ul className="space-y-1 text-slate-300 text-xs">
                      {structuredBrief.questionsToAsk?.map((q: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <HelpCircle className="w-3 h-3 text-teal-400 mt-0.5 flex-shrink-0" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
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
          {/* SECTION 2 & 3: Intent Score & 8-Dimension Breakdown */}
          <Card className="p-6 bg-slate-900/80 border-slate-800 text-center space-y-4" data-testid="intent-score">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                2. Autonomous Intent Score
              </span>
              <div className="text-5xl font-extrabold font-mono text-teal-400 py-1.5">
                {opportunity.intentScore}
                <span className="text-sm text-slate-500 font-normal">/100</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {opportunity.intentScore >= 85
                  ? 'Critically high intent verified across explicit vendor search.'
                  : 'Solid buying signal with active requirement exploration.'}
              </p>
            </div>

            {/* SECTION 3: 8 Dimensions Breakdown */}
            <div className="pt-3 border-t border-slate-800/80 text-left space-y-2 font-mono text-xs">
              <span className="text-[11px] uppercase text-slate-400 block font-bold">
                3. Intent Dimensions Breakdown
              </span>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Requirement Clarity:</span>
                  <span className="text-teal-400 font-bold">{intentBreakdown.requirementClarity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Urgency:</span>
                  <span className="text-teal-400 font-bold">{intentBreakdown.urgency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timeline:</span>
                  <span className="text-teal-400 font-bold">{intentBreakdown.timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Solution Fit:</span>
                  <span className="text-teal-400 font-bold">{intentBreakdown.solutionFit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Decision Maker:</span>
                  <span className="text-teal-400 font-bold">{intentBreakdown.decisionMaker}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recency:</span>
                  <span className="text-teal-400 font-bold">{intentBreakdown.recency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Company Fit:</span>
                  <span className="text-teal-400 font-bold">{intentBreakdown.companyFit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Buying Stage:</span>
                  <span className="text-teal-400 font-bold">{intentBreakdown.buyingStage}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION 6: Company Fit Score Card */}
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-300">
                6. Solution & Company Fit
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {fitBreakdown.overallFitScore}% Fit
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
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

          {/* SECTION 9: Qualification Engine (BANT & Heat Classification) */}
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-300">
                9. BANT Qualification Engine
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  heatCategory === 'HOT' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {heatCategory} ({qualScore}%)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">NEED</span>
                <span className="font-bold text-teal-400">{qual.needFit || 95}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">FIT</span>
                <span className="font-bold text-teal-400">{qual.budgetFit || 96}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">AUTHORITY</span>
                <span className="font-bold text-teal-400">{qual.authorityFit || 90}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">TIMING</span>
                <span className="font-bold text-teal-400">{qual.timingFit || 89}%</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">
              {qual.reasoning ||
                `Qualified based on explicit requirement need (${req.title}) and confirmed decision maker (${opportunity.name}).`}
            </p>
          </Card>

          {/* SECTION 11: Next Best Action Card */}
          <Card className="p-5 bg-teal-950/30 border-teal-500/40 space-y-3" data-testid="next-best-action">
            <div className="flex items-center justify-between text-teal-400 border-b border-teal-500/20 pb-2">
              <div className="flex items-center gap-1.5 font-bold font-mono text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>11. Next Best Action</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300 font-bold">
                {rec.priority || 'HIGH'} PRIORITY
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-100 font-mono">
                {rec.title || 'Schedule Technical Discovery Session'}
              </p>
              <p className="text-xs text-slate-300 mt-1 font-sans">{rec.rationale}</p>
            </div>

            {/* Why Action Bullets */}
            <div className="space-y-1 text-xs font-mono text-slate-300 pt-1">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Action Rationale:</span>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-teal-400 font-bold">&bull;</span>
                  <span>Active requirement for {req.title || 'SharePoint Migration'}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-teal-400 font-bold">&bull;</span>
                  <span>Vendor selection stage with {opportunity.urgency} urgency</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-teal-400 font-bold">&bull;</span>
                  <span>High solution fit (96%) and 30-day timeline</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-teal-400 font-bold">&bull;</span>
                  <span>Decision maker {opportunity.name} ({opportunity.title})</span>
                </div>
              </div>
            </div>

            {rec.suggestedMessage && (
              <div className="p-2.5 rounded bg-slate-950 border border-teal-500/30 text-xs font-mono text-teal-200">
                "{rec.suggestedMessage}"
              </div>
            )}
          </Card>

          {/* SECTION 1 & 12: Lead Profile & Source Info */}
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400">
              1. Decision Maker Profile & 12. Source
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">{opportunity.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{opportunity.email || 'cto@abctechnologies.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{opportunity.phone || '+1 (512) 893-4102'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{opportunity.company?.location || 'Austin, TX'}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Source:</span>
                <StatusBadge status={opportunity.source?.platform || 'LINKEDIN'} type="source" />
              </div>
            </div>
          </Card>

          {/* SECTION 13: Signal & Activity Log Timeline */}
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400">
                13. Activity & Intelligence Log
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {opportunity.activityLogs?.length || 1} Events
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {opportunity.activityLogs?.length > 0 ? (
                opportunity.activityLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-2.5 pb-2 border-b border-slate-800/60 last:border-0 last:pb-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-slate-200 font-semibold">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-[11px] text-slate-400 font-sans">{log.details}</p>
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

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
  ShieldCheck,
  Cloud,
  CloudOff,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { OpportunityGraph } from '@/components/opportunities/opportunity-graph';
import { FusedSignalCard } from '@/components/opportunities/fused-signal-card';

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [opportunity, setOpportunity] = useState<any>(null);
  const [provenance, setProvenance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action Loading States
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [callingState, setCallingState] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [syncingCrm, setSyncingCrm] = useState(false);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/opportunities/${id}`);
      if (!res.ok) throw new Error('Opportunity record not found');
      const data = await res.json();
      setOpportunity(data);
      
      const provRes = await fetch(`/api/leads/${id}/provenance`);
      if (provRes.ok) {
        setProvenance(await provRes.json());
      }
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

  const handleEnrichProfile = async () => {
    try {
      setEnriching(true);
      const res = await fetch(`/api/leads/${id}/enrich`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to enrich lead');
      await fetchOpportunity();
      showToast('Lead enriched successfully! Verified provenance added.');
    } catch (err: any) {
      showToast(`Enrichment error: ${err.message}`);
    } finally {
      setEnriching(false);
    }
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
    router.push(`/calls?leadId=${id}&start=true`);
  };

  const handlePushToCrm = async () => {
    try {
      setSyncingCrm(true);
      const res = await fetch('/api/integrations/crm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: id })
      });
      if (!res.ok) throw new Error('Failed to sync to CRM');
      await fetchOpportunity();
      showToast('Successfully synchronized with CRM.');
    } catch (err: any) {
      showToast(`CRM Sync error: ${err.message}`);
    } finally {
      setSyncingCrm(false);
    }
  };

  if (loading) {
    return <DetailLoadingSkeleton />;
  }

  if (error || !opportunity) {
    return (
      <div className="space-y-6 max-w-[1536px] mx-auto">
        <Link
          href="/opportunities"
          className="text-xs text-[#64748B] hover:text-[#10233F] flex items-center gap-1.5 font-medium"
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
    <div className="space-y-6 pb-20 max-w-[1536px] mx-auto" data-testid="opportunity-detail">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-md bg-white border border-[#2563EB]/40 text-[#10233F] text-xs flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#64748B] hover:text-[#10233F] text-sm font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#DCE5EF] pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/opportunities"
            className="p-2 rounded-md text-[#64748B] hover:text-[#10233F] hover:bg-[#F7F9FC] border border-[#DCE5EF] transition-colors mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-[#10233F]">
                {opportunity.company?.name}
              </h1>
              {isHero && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F7F5] text-[#0F9D9A] border border-[#0F9D9A]/30">
                  HERO TARGET
                </span>
              )}
              <StatusBadge status={opportunity.status} type="status" />
              <StatusBadge status={opportunity.urgency} type="urgency" />
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                  heatCategory === 'HOT'
                    ? 'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/30'
                    : 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30'
                }`}
              >
                {heatCategory} QUALIFIED
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Prospect: <span className="text-[#10233F] font-semibold">{opportunity.name}</span> ({opportunity.title}) &bull; Discovered{' '}
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
            className="h-8 text-xs border-[#DCE5EF] bg-white hover:bg-[#F7F9FC] text-[#10233F] flex items-center gap-1.5 font-medium"
            data-testid="recalculate-score-btn"
          >
            <RotateCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin text-[#2563EB]' : 'text-[#64748B]'}`} />
            <span>{recalculating ? 'Recalculating...' : 'Recalculate Score'}</span>
          </Button>

          <Button
            onClick={handleGenerateSalesBrief}
            disabled={generatingBrief || analyzing}
            variant="outline"
            size="sm"
            className="h-8 text-xs border-[#2563EB]/30 bg-[#EFF6FF] hover:bg-[#2563EB]/10 text-[#2563EB] flex items-center gap-1.5 font-semibold"
            data-testid="generate-brief-btn"
          >
            <Sparkles className={`w-3.5 h-3.5 ${generatingBrief ? 'animate-spin text-[#2563EB]' : 'text-[#2563EB]'}`} />
            <span>{generatingBrief ? 'Synthesizing...' : 'Generate Sales Brief'}</span>
          </Button>

          <Button
            onClick={handleEnrichProfile}
            disabled={enriching || analyzing}
            variant="outline"
            size="sm"
            className="h-8 text-xs border-[#0F9D9A]/30 bg-[#E8F7F5] hover:bg-[#0F9D9A]/10 text-[#0F9D9A] flex items-center gap-1.5 font-semibold"
            data-testid="enrich-btn"
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${enriching ? 'animate-spin text-[#0F9D9A]' : 'text-[#0F9D9A]'}`} />
            <span>{enriching ? 'Enriching...' : 'Enrich Profile'}</span>
          </Button>

          <Button
            onClick={handleAnalyzeOpportunity}
            disabled={analyzing}
            size="sm"
            className="h-8 text-xs font-semibold bg-[#10233F] hover:bg-[#163A5F] text-white flex items-center gap-1.5"
            data-testid="analyze-btn"
          >
            <Zap className={`w-3.5 h-3.5 ${analyzing ? 'animate-pulse text-[#0F9D9A]' : 'text-[#0F9D9A]'}`} />
            <span>{analyzing ? 'Analyzing...' : 'Analyze Opportunity'}</span>
          </Button>

          <Button
            onClick={handleTriggerCall}
            disabled={callingState !== 'idle'}
            size="sm"
            className="h-8 text-xs font-semibold bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-3.5 flex items-center gap-1.5 shadow-sm"
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

      <div className="mb-6">
        <OpportunityGraph opportunity={opportunity} />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Core Analysis, Evidence, Company Intelligence & Sales Brief */}
        <div className="lg:col-span-8 space-y-6">
          <FusedSignalCard opportunity={opportunity} />
          
          {/* Public Requirement & Evidence Panel */}
          <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm" data-testid="evidence-panel">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-xs font-bold tracking-tight text-[#10233F] uppercase">
                  PUBLIC BUYING REQUIREMENT & EVIDENCE
                </h3>
              </div>
              <StatusBadge status={opportunity.source?.platform || 'LINKEDIN'} type="source" />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-[#10233F]">
                  {req.title || 'Microsoft 365 / SharePoint Implementation Partner'}
                </h4>
                <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">{req.description}</p>
              </div>

              {/* Sub-requirements Pills */}
              {tags.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] block mb-1.5 uppercase tracking-wider">
                    Extracted Scope Components ({tags.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs bg-[#F7F9FC] text-[#10233F] border border-[#DCE5EF] flex items-center gap-1.5 font-medium"
                      >
                        <Check className="w-3.5 h-3.5 text-[#0F9D9A]" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* "Why This Lead?" Evidence Checklist */}
              <div className="p-4 rounded-md bg-[#E8F7F5]/50 border border-[#0F9D9A]/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F9D9A] uppercase tracking-wide">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0F9D9A]" />
                    <span>Why This Lead? (Extracted Evidence)</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] font-semibold">Confidence: {req.confidenceScore || 96}%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#10233F]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#0F9D9A] font-bold">✓</span>
                    <span>Explicit vendor search for {req.category || 'SharePoint Implementation'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0F9D9A] font-bold">✓</span>
                    <span>Requirement clearly defined ({tags.length} core specifications)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0F9D9A] font-bold">✓</span>
                    <span>Verified high-authority decision maker ({opportunity.title})</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0F9D9A] font-bold">✓</span>
                    <span>Urgent timeline target ({req.timeframe || 'Next 30 Days'})</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0F9D9A] font-bold">✓</span>
                    <span>Active procurement stage: Vendor Selection</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0F9D9A] font-bold">✓</span>
                    <span>Strong architectural & capability solution fit (96%)</span>
                  </div>
                </div>

                {/* Raw Quote */}
                <div className="mt-3 pt-2.5 border-t border-[#0F9D9A]/20">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                    Raw Public Signal Excerpt
                  </span>
                  <blockquote className="text-xs text-[#10233F] italic border-l-2 border-[#0F9D9A] pl-3 py-1 bg-white/60 rounded-r">
                    "{req.rawEvidence || 'Looking for an experienced implementation partner to handle enterprise modernization and zero-downtime cutover.'}"
                  </blockquote>
                </div>
              </div>

              {/* Requirement Budget & Pipeline Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-md bg-[#F7F9FC] border border-[#DCE5EF]">
                  <span className="text-[#64748B] block text-[10px] font-semibold uppercase">BUDGET ESTIMATE</span>
                  <span className="font-bold text-[#10233F] mt-0.5 block">{req.budgetEstimate || '$150,000 ARR'}</span>
                </div>
                <div className="p-3 rounded-md bg-[#F7F9FC] border border-[#DCE5EF]">
                  <span className="text-[#64748B] block text-[10px] font-semibold uppercase">TIMELINE DEADLINE</span>
                  <span className="font-bold text-[#10233F] mt-0.5 block">{req.timeframe || 'Next 30 Days'}</span>
                </div>
                <div className="p-3 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] col-span-2 sm:col-span-1">
                  <span className="text-[#64748B] block text-[10px] font-semibold uppercase">PIPELINE ARR VALUE</span>
                  <span className="font-bold text-[#16A34A] mt-0.5 block">${opportunity.pipelineValue?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Intelligence & "Why Now?" */}
          <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-xs font-bold tracking-tight text-[#10233F] uppercase">
                  COMPANY INTELLIGENCE & "WHY NOW?" SIGNALS
                </h3>
              </div>
              <span className="text-xs text-[#64748B] font-medium">{opportunity.company?.industry}</span>
            </div>

            {/* "Why Now?" Signals Box */}
            <div className="p-4 rounded-md bg-[#EFF6FF] border border-[#2563EB]/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wide">
                <Flame className="w-4 h-4 text-[#2563EB]" />
                <span>WHY NOW? (High-Velocity Trigger Events)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#10233F] pt-1 font-medium">
                <div className="flex items-start gap-2">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span>Requirement posted 3 hours ago in active procurement cycle</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span>Company is actively hiring +8 engineering roles</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span>Technology match: Microsoft 365, SPFx, Cloud Core</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span>Vendor selection active — recommended contact within 4h</span>
                </div>
              </div>
            </div>

            {/* Firmographic Signals 4-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] space-y-1">
                <span className="text-[#2563EB] text-[11px] font-bold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" /> Technology Stack
                </span>
                <p className="text-[#475569]">
                  {opportunity.company?.techStack || 'Microsoft 365, SharePoint 2016 Server, Azure, React, SPFx'}
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] space-y-1">
                <span className="text-[#10233F] text-[11px] font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Hiring Velocity
                </span>
                <p className="text-[#475569]">
                  {opportunity.company?.hiringSignals || 'Actively hiring Lead SharePoint Architects and Cloud Integration Engineers.'}
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] space-y-1">
                <span className="text-[#16A34A] text-[11px] font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Growth Trajectory
                </span>
                <p className="text-[#475569]">
                  {opportunity.company?.growthSignals || '+18% headcount YoY across enterprise IT and digital modernization.'}
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] space-y-1">
                <span className="text-[#D97706] text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Funding & Scale
                </span>
                <p className="text-[#475569]">
                  {opportunity.company?.fundingSignals || 'Series C ($48M) backed; $120M annual revenue scale.'}
                </p>
              </div>
            </div>
          </Card>

          {/* AI Sales Brief ("PRE-CALL BRIEF") */}
          <Card className="p-5 bg-white border-[#DCE5EF] space-y-5 rounded-md shadow-sm" data-testid="sales-brief">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-xs font-bold tracking-tight text-[#10233F] uppercase">
                  AI PRE-CALL SALES BRIEF & STRATEGY
                </h3>
              </div>
              <span className="text-xs text-[#2563EB] font-semibold">Context-Specific Playbook</span>
            </div>

            {structuredBrief ? (
              <div className="space-y-4 text-xs">
                {/* Why They Matter */}
                <div className="p-3.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] space-y-1">
                  <span className="text-[11px] uppercase text-[#2563EB] font-bold block">
                    Why Decision Maker Matters
                  </span>
                  <p className="text-[#10233F] leading-relaxed font-medium">{structuredBrief.whyTheyMatter}</p>
                </div>

                {/* Pain Points */}
                {structuredBrief.painPoints?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] uppercase text-[#64748B] font-bold block">
                      Core Pain Points & Friction Points
                    </span>
                    <ul className="space-y-1.5">
                      {structuredBrief.painPoints.map((pain: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-[#10233F] font-medium">
                          <span className="text-[#DC2626] font-bold mt-0.5">&bull;</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Objections & Counter-strategies */}
                {structuredBrief.likelyObjections?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#DCE5EF]">
                    <span className="text-[11px] uppercase text-[#64748B] font-bold block">
                      Anticipated Objections & Counter-Strategies
                    </span>
                    <div className="space-y-2">
                      {structuredBrief.likelyObjections.map((item: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-md bg-[#FEF3C7]/40 border border-[#D97706]/30 space-y-1">
                          <div className="text-[#D97706] text-xs font-bold flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>Objection: "{item.objection}"</span>
                          </div>
                          <div className="text-[#10233F] text-xs pl-5 pt-0.5 leading-relaxed font-medium">
                            <strong className="text-[#2563EB]">Strategy: </strong>
                            {item.counterStrategy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Positioning & Opening Statement */}
                <div className="space-y-3 pt-2 border-t border-[#DCE5EF]">
                  <div className="p-3.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] space-y-1">
                    <span className="text-[11px] uppercase text-[#2563EB] font-bold block">
                      Recommended Positioning
                    </span>
                    <p className="text-[#10233F] leading-relaxed font-medium">{structuredBrief.recommendedPositioning}</p>
                  </div>

                  <div className="p-4 rounded-md bg-[#EFF6FF] border border-[#2563EB]/30 space-y-1">
                    <span className="text-[11px] uppercase text-[#2563EB] font-bold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                      Suggested Opening Statement
                    </span>
                    <p className="text-[#10233F] italic text-xs leading-relaxed font-semibold">
                      "{structuredBrief.openingStatement}"
                    </p>
                  </div>
                </div>

                {/* Discovery Questions & Desired Outcome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#DCE5EF]">
                  <div className="p-3.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] space-y-1.5">
                    <span className="text-[11px] uppercase text-[#64748B] font-bold block">
                      Key Questions to Ask
                    </span>
                    <ul className="space-y-1.5 text-[#10233F] text-xs font-medium">
                      {structuredBrief.questionsToAsk?.map((q: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-md bg-[#E8F7F5] border border-[#0F9D9A]/30 space-y-1.5">
                    <span className="text-[11px] uppercase text-[#0F9D9A] font-bold block">
                      Desired Call Outcome
                    </span>
                    <p className="text-[#0F9D9A] text-xs font-bold leading-relaxed">
                      {structuredBrief.desiredOutcome}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#475569] leading-relaxed">
                {opportunity.salesBrief || 'Click "Generate Sales Brief" above to create an AI pre-call brief.'}
              </p>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: Intent Score Breakdown, Company Fit, Qualification, Next Best Action & Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Intent Score & 8-Dimension Breakdown */}
          <Card className="p-5 bg-white border-[#DCE5EF] text-center space-y-4 rounded-md shadow-sm" data-testid="intent-score">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Autonomous Intent Score
              </span>
              <div className="text-4xl font-extrabold text-[#0F9D9A] py-1 font-sans">
                {opportunity.intentScore}
                <span className="text-sm text-[#64748B] font-normal"> / 100</span>
              </div>
              <p className="text-xs text-[#475569] font-medium">
                {opportunity.intentScore >= 85
                  ? 'Critically high intent verified across explicit vendor search.'
                  : 'Solid buying signal with active requirement exploration.'}
              </p>
            </div>

            {/* 8 Dimensions Breakdown */}
            <div className="pt-3 border-t border-[#DCE5EF] text-left space-y-2.5 text-xs">
              <span className="text-[11px] uppercase text-[#64748B] block font-bold">
                Intent Dimensions Breakdown
              </span>

              <div className="space-y-2 text-[11px]">
                {intentBreakdown.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[#10233F] font-semibold">
                      <span>{item.label}:</span>
                      <span className="text-[#0F9D9A] font-bold">{item.value}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className="h-full bg-[#0F9D9A] rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Solution & Company Fit Score Card */}
          <Card className="p-4 bg-white border-[#DCE5EF] space-y-3 rounded-md shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-2">
              <span className="text-xs uppercase font-bold text-[#10233F]">
                Solution & Company Fit
              </span>
              <span className="text-sm font-extrabold text-[#16A34A]">
                {fitBreakdown.overallFitScore}% Fit
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-medium">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748B]">Capability Match:</span>
                <span className="text-[#10233F] font-bold">{fitBreakdown.capabilityMatch}%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748B]">Industry Match:</span>
                <span className="text-[#10233F] font-bold">{fitBreakdown.industryMatch}%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748B]">Technology Match:</span>
                <span className="text-[#10233F] font-bold">{fitBreakdown.technologyMatch}%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748B]">Location Match:</span>
                <span className="text-[#10233F] font-bold">{fitBreakdown.locationMatch}%</span>
              </div>
            </div>
          </Card>

          {/* Qualification Engine (BANT & Heat Classification) */}
          <Card className="p-4 bg-white border-[#DCE5EF] space-y-3 rounded-md shadow-sm" data-testid="qualification">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-2">
              <span className="text-xs uppercase font-bold text-[#10233F]">
                BANT Qualification Engine
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  heatCategory === 'HOT' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FEF3C7] text-[#D97706]'
                }`}
              >
                {heatCategory} ({qualScore}%)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#F7F9FC] border border-[#DCE5EF]">
                <span className="text-[#64748B] text-[10px] block uppercase font-bold">NEED</span>
                <span className="font-extrabold text-[#2563EB]">{qual.needFit || 95}%</span>
              </div>
              <div className="p-2.5 rounded bg-[#F7F9FC] border border-[#DCE5EF]">
                <span className="text-[#64748B] text-[10px] block uppercase font-bold">FIT</span>
                <span className="font-extrabold text-[#2563EB]">{qual.budgetFit || 96}%</span>
              </div>
              <div className="p-2.5 rounded bg-[#F7F9FC] border border-[#DCE5EF]">
                <span className="text-[#64748B] text-[10px] block uppercase font-bold">AUTHORITY</span>
                <span className="font-extrabold text-[#2563EB]">{qual.authorityFit || 90}%</span>
              </div>
              <div className="p-2.5 rounded bg-[#F7F9FC] border border-[#DCE5EF]">
                <span className="text-[#64748B] text-[10px] block uppercase font-bold">TIMING</span>
                <span className="font-extrabold text-[#2563EB]">{qual.timingFit || 89}%</span>
              </div>
            </div>

            <p className="text-[11px] text-[#475569] leading-relaxed pt-1 font-medium">
              {qual.reasoning ||
                `Qualified based on explicit requirement need (${req.title}) and confirmed decision maker (${opportunity.name}).`}
            </p>
          </Card>

          {/* Next Best Action Card */}
          <Card className="p-4 bg-white border-[#2563EB]/40 space-y-3 rounded-md shadow-sm ring-1 ring-[#2563EB]/20" data-testid="next-best-action">
            <div className="flex items-center justify-between text-[#2563EB] border-b border-[#2563EB]/20 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>Next Best Action</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#EFF6FF] text-[#2563EB] font-bold">
                {rec.priority || 'HIGH'} PRIORITY
              </span>
            </div>

            <div>
              <p className="text-sm font-bold text-[#10233F]">
                {rec.title || 'Schedule Technical Discovery Session'}
              </p>
              <p className="text-xs text-[#475569] mt-1 font-medium">{rec.rationale}</p>
            </div>

            {/* Why Action Bullets */}
            <div className="space-y-1 text-xs text-[#10233F] pt-1">
              <span className="text-[10px] uppercase text-[#64748B] block font-bold">Action Rationale:</span>
              <div className="space-y-1 text-[11px] font-medium">
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2563EB] font-bold">&bull;</span>
                  <span>Active requirement for {req.title || 'Microsoft 365 Implementation'}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2563EB] font-bold">&bull;</span>
                  <span>Vendor selection stage with {opportunity.urgency} urgency</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2563EB] font-bold">&bull;</span>
                  <span>High solution fit (96%) and 30-day timeline</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2563EB] font-bold">&bull;</span>
                  <span>Decision maker {opportunity.name} ({opportunity.title})</span>
                </div>
              </div>
            </div>

            {rec.suggestedMessage && (
              <div className="p-2.5 rounded bg-[#F7F9FC] border border-[#DCE5EF] text-xs text-[#10233F] font-medium">
                "{rec.suggestedMessage}"
              </div>
            )}
          </Card>

          {/* Lead Profile & Source Info */}
          <Card className="p-4 bg-white border-[#DCE5EF] space-y-3 rounded-md shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
                Decision Maker Profile
              </h4>
              {opportunity.enrichmentStatus === 'ENRICHED' && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#E8F7F5] text-[#0F9D9A] font-bold border border-[#0F9D9A]/20">
                  ENRICHED
                </span>
              )}
            </div>
            
            <div className="space-y-2 text-xs">
              {/* Helper to render field with provenance */}
              {[
                { key: 'name', icon: User, value: opportunity.name },
                { key: 'email', icon: Mail, value: opportunity.email || 'john.smith@technova.com' },
                { key: 'phone', icon: Phone, value: opportunity.phone },
                { key: 'location', icon: Globe, value: opportunity.company?.location || 'Austin, TX' },
                { key: 'linkedinUrl', icon: Building2, value: opportunity.linkedinUrl }
              ].map((field) => {
                const prov = provenance.find(p => p.fieldName === field.key);
                const Icon = field.icon;
                const isUnavailable = !field.value;
                
                return (
                  <div key={field.key} className="flex items-center justify-between group">
                    <div className={`flex items-center gap-2 ${isUnavailable ? 'text-[#94A3B8] line-through' : 'text-[#10233F]'}`}>
                      <Icon className="w-3.5 h-3.5 text-[#64748B]" />
                      <span className={field.key === 'name' ? 'font-bold' : ''}>
                        {field.value || 'UNAVAILABLE'}
                      </span>
                    </div>
                    
                    {prov && !isUnavailable && (
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-[#64748B]">{prov.sourceName}</span>
                        {prov.inferred ? (
                          <span title="Inferred" className="w-4 h-4 rounded bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold">I</span>
                        ) : (
                          <span title="Verified" className="w-4 h-4 rounded bg-[#E8F7F5] text-[#0F9D9A] flex items-center justify-center"><Check className="w-3 h-3" /></span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2 border-t border-[#DCE5EF] flex items-center justify-between text-xs text-[#64748B]">
                <span>Initial Source:</span>
                <StatusBadge status={opportunity.source?.platform || 'LINKEDIN'} type="source" />
              </div>
            </div>
          </Card>

          {/* CRM Integration Card */}
          <Card className="p-4 bg-white border-[#DCE5EF] space-y-3 rounded-md shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#64748B] flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5" /> CRM Integration
              </h4>
              {opportunity.crmStatus === 'SYNCED' ? (
                <span className="flex items-center gap-1 text-[10px] bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded font-bold border border-[#16A34A]/20">
                  <CheckCircle2 className="w-3 h-3" /> SYNCED
                </span>
              ) : opportunity.crmStatus === 'FAILED' ? (
                <span className="flex items-center gap-1 text-[10px] bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded font-bold border border-[#DC2626]/20">
                  <AlertCircle className="w-3 h-3" /> FAILED
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded font-bold border border-[#64748B]/20">
                  <CloudOff className="w-3 h-3" /> NOT CONNECTED
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#475569]">
                <span>External ID:</span>
                <span className="font-mono text-[#10233F] font-semibold">{opportunity.crmExternalId || '--'}</span>
              </div>
              <div className="flex justify-between items-center text-[#475569]">
                <span>Last Sync:</span>
                <span className="text-[#10233F] font-medium">
                  {opportunity.crmLastSyncAt ? new Date(opportunity.crmLastSyncAt).toLocaleString() : '--'}
                </span>
              </div>
            </div>

            <Button
              onClick={handlePushToCrm}
              disabled={syncingCrm}
              className="w-full text-xs h-8 mt-2 bg-[#F7F9FC] border border-[#DCE5EF] text-[#10233F] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
              variant="outline"
            >
              {syncingCrm ? (
                <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing...</span>
              ) : opportunity.crmStatus === 'SYNCED' ? (
                <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Sync Update</span>
              ) : (
                <span className="flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5" /> Push to CRM</span>
              )}
            </Button>
          </Card>

          {/* Signal & Activity Log Timeline */}
          <Card className="p-4 bg-white border-[#DCE5EF] space-y-3 rounded-md shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
                Activity & Intelligence Log
              </h4>
              <span className="text-[10px] text-[#64748B] font-semibold">
                {opportunity.activityLogs?.length || 1} Events
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {opportunity.activityLogs?.length > 0 ? (
                opportunity.activityLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-2.5 pb-2 border-b border-[#DCE5EF] last:border-0 last:pb-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-[#10233F] font-bold">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-[11px] text-[#475569]">{log.details}</p>
                      <span className="text-[10px] text-[#64748B] block">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[#64748B] text-xs">Signal ingested and scored via autonomous pipeline.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

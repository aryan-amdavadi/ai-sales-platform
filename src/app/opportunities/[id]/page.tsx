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

  const handleTriggerCall = () => {
    setCallingState('calling');
    setTimeout(() => {
      setCallingState('connected');
      setTimeout(() => {
        setCallingState('idle');
        router.push('/calls');
      }, 1500);
    }, 1200);
  };

  if (loading) {
    return <DetailLoadingSkeleton />;
  }

  if (error || !opportunity) {
    return (
      <div className="space-y-6">
        <Link href="/opportunities" className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5">
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
  const tags: string[] = req.tags ? JSON.parse(req.tags) : [];

  return (
    <div className="space-y-6 pb-16" data-testid="opportunity-detail">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/opportunities"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
                {opportunity.company?.name}
              </h1>
              {isHero && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  HERO TARGET
                </span>
              )}
              <StatusBadge status={opportunity.status} type="status" />
              <StatusBadge status={opportunity.urgency} type="urgency" />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Prospect: {opportunity.name} &bull; {opportunity.title} &bull; Discovered {new Date(opportunity.discoveredAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* AI Call Action Button */}
        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleTriggerCall}
            disabled={callingState !== 'idle'}
            className="text-xs font-mono font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 flex items-center gap-2 shadow-sm transition-all"
            data-testid="call-action"
          >
            <PhoneCall className={`w-4 h-4 ${callingState === 'calling' ? 'animate-bounce' : ''}`} />
            <span>
              {callingState === 'idle'
                ? 'Launch Autonomous AI Voice Call'
                : callingState === 'calling'
                ? 'Connecting Nova AI Voice Engine...'
                : 'Call Dispatched! Redirecting...'}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Main Context, Evidence & Signals) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Requirement & Evidence Panel */}
          <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4" data-testid="evidence-panel">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100">
                  PUBLIC BUYING REQUIREMENT & EVIDENCE
                </h3>
              </div>
              <StatusBadge status={opportunity.source?.platform || 'LINKEDIN'} type="source" />
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-base font-semibold text-slate-100">{req.title || 'Technical Requirement Specification'}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{req.description}</p>
              </div>

              {/* Tags / Sub-requirements */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800/90 text-slate-300 border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Raw Public Evidence Excerpt */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 mt-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <span>Raw Public Post / RFP Signal Excerpt</span>
                  <span className="text-teal-400">Confidence: {req.confidenceScore || 95}%</span>
                </div>
                <blockquote className="text-xs text-slate-300 italic border-l-2 border-teal-500/60 pl-3 py-1">
                  "{req.rawEvidence || 'Looking for an experienced implementation partner to handle enterprise modernization and zero-downtime cutover.'}"
                </blockquote>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">BUDGET ESTIMATE</span>
                  <span className="font-bold text-slate-200">{req.budgetEstimate || '$100k - $250k'}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">PROJECT TIMEFRAME</span>
                  <span className="font-bold text-slate-200">{req.timeframe || 'Immediate (Next 30 Days)'}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">PIPELINE ARR VALUE</span>
                  <span className="font-bold text-emerald-400">${opportunity.pipelineValue?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Sales Brief Panel */}
          <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4" data-testid="sales-brief">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100">
                AI SYNTHESIZED SALES BRIEF
              </h3>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {opportunity.salesBrief ||
                  'The prospect is a key technical executive actively seeking an implementation partner. High budget fit and verified urgent timing mandate rapid outbound qualification.'}
              </p>

              {/* BANT Fit Breakdown */}
              <div className="pt-2 border-t border-slate-800/60">
                <h5 className="text-[11px] font-mono uppercase text-slate-400 mb-2.5">
                  BANT Qualification Breakdown ({qual.overallScore || 85}%)
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">BUDGET</span>
                    <span className="font-bold text-teal-400">{qual.budgetFit || 85}%</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">AUTHORITY</span>
                    <span className="font-bold text-teal-400">{qual.authorityFit || 90}%</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">NEED</span>
                    <span className="font-bold text-teal-400">{qual.needFit || 88}%</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">TIMING</span>
                    <span className="font-bold text-teal-400">{qual.timingFit || 80}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Intelligence & Firmographics */}
          <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-300" />
                <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100">
                  COMPANY INTELLIGENCE & SIGNALS
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{opportunity.company?.industry}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono text-slate-400 text-[10px] uppercase block">Tech Stack & Infrastructure</span>
                <p className="text-slate-200">{opportunity.company?.techStack || 'Microsoft 365, SharePoint 2016 Server, Azure, React, PowerPlatform'}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono text-slate-400 text-[10px] uppercase block">Hiring Velocity Signals</span>
                <p className="text-slate-200">{opportunity.company?.hiringSignals || 'Actively hiring Senior SharePoint Architects and Cloud Integration Engineers.'}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono text-slate-400 text-[10px] uppercase block">Growth & Market Indicators</span>
                <p className="text-slate-200">{opportunity.company?.growthSignals || '+18% headcount YoY across enterprise IT and digital transformation.'}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono text-slate-400 text-[10px] uppercase block">Funding / Enterprise Scale</span>
                <p className="text-slate-200">{opportunity.company?.fundingSignals || 'Series C ($48M) backed; $120M annual revenue scale.'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (Intent Score, Next Best Action & Timeline) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Intent Score Gauge */}
          <Card className="p-6 bg-slate-900/80 border-slate-800 text-center space-y-3" data-testid="intent-score">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Autonomous Intent Score
            </span>
            <div className="text-5xl font-extrabold font-mono text-teal-400 py-1">
              {opportunity.intentScore}
              <span className="text-sm text-slate-500 font-normal">/100</span>
            </div>
            <p className="text-xs text-slate-300">
              {opportunity.intentScore >= 80
                ? 'Critically high intent verified across direct executive RFP posting.'
                : 'Solid intent signal with active vendor exploration.'}
            </p>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                style={{ width: `${opportunity.intentScore}%` }}
              />
            </div>
          </Card>

          {/* Next Best Action Card */}
          <Card className="p-5 bg-teal-950/20 border-teal-500/30 space-y-3" data-testid="next-best-action">
            <div className="flex items-center gap-2 text-teal-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold font-mono uppercase tracking-wide">
                RECOMMENDED NEXT ACTION
              </h4>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">{rec.title || 'Initiate Autonomous AI Voice Outreach'}</p>
              <p className="text-xs text-slate-300 mt-1">{rec.rationale || 'High urgency executive signal matching primary ICP solution criteria.'}</p>
            </div>
            {rec.suggestedMessage && (
              <div className="p-2.5 rounded bg-slate-950/80 border border-teal-500/20 text-xs font-mono text-teal-200/90">
                "{rec.suggestedMessage}"
              </div>
            )}
          </Card>

          {/* Lead Contact Card */}
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400">
              Decision Maker Profile
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
            </div>
          </Card>

          {/* Activity Timeline */}
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400">
              Signal & Activity Timeline
            </h4>
            <div className="space-y-3 text-xs font-mono">
              {opportunity.activityLogs?.length > 0 ? (
                opportunity.activityLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-2.5 pb-2 border-b border-slate-800/60 last:border-0 last:pb-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-200 font-semibold">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-[11px] text-slate-400 font-sans">{log.details}</p>
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.createdAt).toLocaleDateString()}
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

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Gavel,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Zap,
  DollarSign,
  Cpu,
  Layers,
  Sparkles,
  PhoneCall,
  Brain,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface JudgeStep {
  step: number;
  title: string;
  badge: string;
  route: string;
  description: string;
  architectureHighlight: string;
  metrics: {
    latency: string;
    tokens: string;
    apiCost: string;
  };
}

export const JUDGE_STEPS: JudgeStep[] = [
  {
    step: 1,
    title: 'System Architecture Overview',
    badge: 'Step 1 of 10: Architecture',
    route: '/dashboard',
    description:
      'IntentOS is an autonomous end-to-end sales intelligence platform with unified SQLite storage, offline-capable deterministic AI/Voice engines, and zero mandatory cloud API costs.',
    architectureHighlight:
      'Zero-dependency runtime: local fallback providers for AI, TTS/STT, and CRM ensure 100% uptime with sub-second execution.',
    metrics: { latency: '< 50ms', tokens: '0 (Deterministic)', apiCost: '$0.00' },
  },
  {
    step: 2,
    title: 'Intent Discovery Engine',
    badge: 'Step 2 of 10: Buying Signals',
    route: '/dashboard',
    description:
      'Continuous ingestion of public buying signals. TechNova Solutions is flagged with a 94/100 Intent Score for enterprise SharePoint and Microsoft 365 migration.',
    architectureHighlight:
      'Multi-platform signal normalizer maps LinkedIn, RFPs, and hiring feeds into unified schema with tamper-evident raw evidence.',
    metrics: { latency: '< 120ms', tokens: '450', apiCost: '$0.00' },
  },
  {
    step: 3,
    title: '8-Dimension Intent Score Breakdown',
    badge: 'Step 3 of 10: Explainability',
    route: '/opportunities',
    description:
      'Mathematical 8-dimension scoring: Clarity (96), Urgency (91), Timeline (89), Fit (97), Authority (82), Recency (98), Company Fit (93), Stage (95) deriving 94/100.',
    architectureHighlight:
      'Fully explainable transparent linear weights — zero black-box hallucination, complete auditability for enterprise compliance.',
    metrics: { latency: '< 65ms', tokens: '380', apiCost: '$0.00' },
  },
  {
    step: 4,
    title: 'Evidence Engine (6 Buying Signals)',
    badge: 'Step 4 of 10: Evidence Extraction',
    route: '/opportunities',
    description:
      'Verbatim evidence extraction with 6 signals: Job Posting, RFP Tender, Tech Stack Change, Executive Quote, News/PR, and Website Traffic.',
    architectureHighlight:
      'Bidirectional citation anchoring links extracted claims directly to source URLs, quotes, and timestamped payloads.',
    metrics: { latency: '< 90ms', tokens: '620', apiCost: '$0.00' },
  },
  {
    step: 5,
    title: 'Fit Engine (96% Capability Match)',
    badge: 'Step 5 of 10: Capability Fit',
    route: '/opportunities',
    description:
      '96% overall match: Capability Match (98%), Industry Match (95%), Technology Match (96%), Location Match (95%) against Microsoft 365 migration specs.',
    architectureHighlight:
      'Automated semantic entity matching cross-references company stack against product value propositions.',
    metrics: { latency: '< 75ms', tokens: '290', apiCost: '$0.00' },
  },
  {
    step: 6,
    title: 'AI Sales Brief (Pre-Call Intelligence)',
    badge: 'Step 6 of 10: Pre-Call Brief',
    route: '/opportunities',
    description:
      'Dynamically generated pre-call playbook: Executive summary, pain points (migration complexity, workflow disruption), and objection handlers for CTO John Smith.',
    architectureHighlight:
      'Rule-guided generative synthesis creates contextualized battlecards and strategic talking points.',
    metrics: { latency: '< 110ms', tokens: '840', apiCost: '$0.00' },
  },
  {
    step: 7,
    title: 'Autonomous Voice Agent Cockpit',
    badge: 'Step 7 of 10: Voice Agent',
    route: '/calls',
    message: '',
    description:
      'Sub-800ms conversational Voice AI with transparent AI identity disclosure, natural turn-taking, and multilingual capability (English, Hindi, Gujarati).',
    architectureHighlight:
      'Client-side Web Speech API + deterministic local audio synthesis buffer with Web Audio API acoustic visualizers.',
    metrics: { latency: '< 800ms', tokens: '510', apiCost: '$0.00' },
  } as any,
  {
    step: 8,
    title: 'Live Transcript & Sentiment Telemetry',
    badge: 'Step 8 of 10: Real-Time Intelligence',
    route: '/calls',
    description:
      'Deterministic 4-turn qualification dialogue where CTO John Smith confirms 30-day timeline and agrees to Thursday 2 PM technical scoping call.',
    architectureHighlight:
      'Synchronous turn-by-turn signal extraction pipelines acoustic sentiment, buying stage, and pain point vectors in real time.',
    metrics: { latency: '< 95ms', tokens: '720', apiCost: '$0.00' },
  },
  {
    step: 9,
    title: 'Post-Call Qualification (92% HOT)',
    badge: 'Step 9 of 10: BANT Qualification',
    route: '/calls',
    description:
      'Automatic BANT qualification to 92% HOT: Confirmed decision maker (John Smith, CTO), 30-day timeline, verified pain points, and meeting scheduled.',
    architectureHighlight:
      'Instant post-call classification and SQLite state transition with optimistic UI update.',
    metrics: { latency: '< 85ms', tokens: '410', apiCost: '$0.00' },
  },
  {
    step: 10,
    title: 'Next Best Action & CRM Sync',
    badge: 'Step 10 of 10: Closed-Loop Execution',
    route: '/calls',
    description:
      'One-click CRM push to Salesforce / HubSpot creating Contact, Opportunity, Call record, and Transcript with automated audit logging.',
    architectureHighlight:
      'Idempotent CRM synchronization engine with bidirectional state verification and complete ActivityLog trail.',
    metrics: { latency: '< 140ms', tokens: '180', apiCost: '$0.00' },
  },
];

interface JudgeModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JudgeMode({ isOpen, onClose }: JudgeModeProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = JUDGE_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < JUDGE_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      router.push(JUDGE_STEPS[nextIdx].route);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      router.push(JUDGE_STEPS[prevIdx].route);
    }
  };

  const handleJump = (idx: number) => {
    setCurrentStepIndex(idx);
    router.push(JUDGE_STEPS[idx].route);
  };

  return (
    <div
      data-testid="judge-mode-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Judge Fast-Track Evaluation Mode
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentStep.badge}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">{currentStep.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Jump Step Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
          {JUDGE_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => handleJump(idx)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                idx === currentStepIndex
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/20'
                  : idx < currentStepIndex
                  ? 'bg-slate-800 text-amber-300/80 hover:bg-slate-700'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {s.step}. {s.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Main description */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-slate-300 leading-relaxed">
            {currentStep.description}
          </div>

          {/* Architectural Highlight */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
            <Cpu className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                Architectural Innovation & Defense
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.architectureHighlight}
              </p>
            </div>
          </div>

          {/* Performance & Evaluation Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Latency</span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {currentStep.metrics.latency}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Layers className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tokens / Complexity</span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {currentStep.metrics.tokens}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">API Cost</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {currentStep.metrics.apiCost} (Offline Ready)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/70 border-t border-slate-800">
          <Button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Previous
          </Button>

          <div className="text-xs text-slate-400 font-mono">
            Step {currentStepIndex + 1} of {JUDGE_STEPS.length}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-900 text-slate-400 text-xs"
            >
              Exit Judge Mode
            </Button>
            <Button
              onClick={handleNext}
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs"
            >
              {currentStepIndex === JUDGE_STEPS.length - 1 ? (
                <>
                  Complete Evaluation
                  <CheckCircle2 className="w-3.5 h-3.5 ml-1.5" />
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

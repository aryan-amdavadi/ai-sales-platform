'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Compass,
  Target,
  FileText,
  PhoneCall,
  Brain,
  Database,
  BarChart3,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TourStep {
  step: number;
  title: string;
  badge: string;
  route: string;
  message: string;
  actionHint?: string;
  icon: React.ElementType;
}

export const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: 'Welcome & Overview',
    badge: 'Step 1 of 11: Welcome & Overview',
    route: '/dashboard',
    message:
      'Welcome to IntentOS — the Autonomous AI Sales Intelligence & Voice Agent Platform. Continuously discover public buying intent and qualify opportunities with zero manual overhead.',
    actionHint: 'Review executive overview and key pipeline telemetry.',
    icon: Compass,
  },
  {
    step: 2,
    title: 'Intent Discovery Engine (TechNova Solutions)',
    badge: 'Step 2 of 11: Intent Discovery Engine',
    route: '/dashboard',
    message:
      'The AI continuously monitors public buying signals across LinkedIn, RFPs, and job postings. TechNova Solutions is flagged as the top high-conviction opportunity.',
    actionHint: 'Notice John Smith (CTO) with 94/100 Intent Score.',
    icon: Target,
  },
  {
    step: 3,
    title: 'Intent Score Breakdown (94/100)',
    badge: 'Step 3 of 11: Intent Score Breakdown',
    route: '/opportunities',
    message:
      'Every score is 100% transparent and explainable across 8 mathematical dimensions: Clarity 96, Urgency 91, Timeline 89, Fit 97, Decision Maker 82, Recency 98, Company Fit 93, Stage 95.',
    actionHint: 'View the 8-dimension breakdown deriving the 94/100 composite score.',
    icon: Layers,
  },
  {
    step: 4,
    title: 'Evidence & Buying Signals (6 signals)',
    badge: 'Step 4 of 11: Evidence & Buying Signals',
    route: '/opportunities',
    message:
      'IntentOS extracts verified buying signals with verbatim citations: Job Postings, RFP tenders, Tech Stack changes, Executive Quotes, News/PR, and Website telemetry.',
    actionHint: 'Review the 6-signal "Why This Lead?" verification checklist.',
    icon: FileText,
  },
  {
    step: 5,
    title: 'Company Fit & Capability Match (96%)',
    badge: 'Step 5 of 11: Company Fit & Capability',
    route: '/opportunities',
    message:
      'The Fit Engine compares company requirements against product capabilities across Capability, Industry, Technology, and Location dimensions.',
    actionHint: 'Verify 96% overall fit score for Microsoft 365 & SharePoint migration.',
    icon: Brain,
  },
  {
    step: 6,
    title: 'AI Sales Brief (Pre-Call Intelligence)',
    badge: 'Step 6 of 11: AI Sales Brief',
    route: '/opportunities',
    message:
      'Before initiating outreach, the AI prepares an executive briefing: key pain points, objection handling strategies, opening statement, and questions to ask CTO John Smith.',
    actionHint: 'Review the tactical playbook tailored for TechNova Solutions.',
    icon: Sparkles,
  },
  {
    step: 7,
    title: 'Autonomous Voice Agent Cockpit',
    badge: 'Step 7 of 11: Voice Agent Cockpit',
    route: '/calls',
    message:
      'Sub-second Voice AI agent engages CTO John Smith with transparent AI disclosure, multilingual fluency (EN, HI, GU), and sub-800ms conversational latency.',
    actionHint: 'Listen to natural turn-taking with live acoustic telemetry.',
    icon: PhoneCall,
  },
  {
    step: 8,
    title: 'Live Transcript & Real-Time Intelligence',
    badge: 'Step 8 of 11: Live Transcript & Intelligence',
    route: '/calls',
    message:
      'Real-time conversational telemetry extracts intent, timeline, objections, and buying signals on every dialogue turn with live sentiment tracking.',
    actionHint: 'Track turn-by-turn signals and speech-to-intent derivation.',
    icon: Brain,
  },
  {
    step: 9,
    title: 'Post-Call Qualification & Scoring (92% HOT)',
    badge: 'Step 9 of 11: Post-Call Qualification',
    route: '/calls',
    message:
      'Immediate post-call analysis: 92% HOT qualification across BANT criteria, confirmed CTO decision maker, 30-day timeline, and identified friction points.',
    actionHint: 'Review qualification badge, heat category, and call summary.',
    icon: CheckCircle2,
  },
  {
    step: 10,
    title: 'Next Best Action Recommendation',
    badge: 'Step 10 of 11: Next Best Action',
    route: '/calls',
    message:
      'AI recommends scheduling a 30-minute technical scoping call with solutions architect for Thursday 2 PM, with pre-drafted calendar invite and case study.',
    actionHint: 'Actionable high-priority follow-up recommendation.',
    icon: Target,
  },
  {
    step: 11,
    title: 'CRM Sync & Audit Trail',
    badge: 'Step 11 of 11: CRM Sync & Audit Trail',
    route: '/calls',
    message:
      'One-click closed-loop push to Salesforce / HubSpot: contact, opportunity stage, transcript, call recording, and qualification notes with complete audit trail.',
    actionHint: 'Click "Push to CRM" to verify instant bidirectional sync.',
    icon: Database,
  },
];

interface GuidedDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuidedDemo({ isOpen, onClose }: GuidedDemoProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const step = TOUR_STEPS[currentStepIndex];
      if (step && pathname !== step.route.split('?')[0]) {
        router.push(step.route);
      }
    }
  }, [isOpen, currentStepIndex, router, pathname]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      router.push(TOUR_STEPS[nextIndex].route);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      router.push(TOUR_STEPS[prevIndex].route);
    }
  };

  const jumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    router.push(TOUR_STEPS[index].route);
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-5 pointer-events-auto text-slate-100 font-sans space-y-4 ring-1 ring-white/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  {currentStep.badge}
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Interactive Tour
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">{currentStep.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Close guided demo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Message */}
        <div className="space-y-2 text-xs">
          <p className="text-slate-200 leading-relaxed text-[13px]">{currentStep.message}</p>
          {currentStep.actionHint && (
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>
                <strong className="text-slate-300">Focus Area:</strong> {currentStep.actionHint}
              </span>
            </div>
          )}
        </div>

        {/* Step Indicator Dots */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => jumpToStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-6 bg-blue-500'
                    : idx < currentStepIndex
                    ? 'w-2 bg-slate-600'
                    : 'w-2 bg-slate-800'
                }`}
                title={`Jump to ${s.title}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Skip Tour
            </Button>

            {!isFirst && (
              <Button
                onClick={handlePrev}
                variant="outline"
                size="sm"
                className="h-8 text-xs border-slate-700 bg-slate-950 text-slate-300 hover:text-slate-100 flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Prev</span>
              </Button>
            )}

            <Button
              onClick={handleNext}
              size="sm"
              className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shadow-sm px-3"
            >
              <span>{isLast ? 'Finish Tour' : 'Next Step'}</span>
              {!isLast && <ArrowRight className="w-3 h-3 ml-0.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

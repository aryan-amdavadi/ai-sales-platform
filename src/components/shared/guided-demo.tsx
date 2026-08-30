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
    title: 'Executive Command Center',
    badge: 'Step 1 of 11: Dashboard',
    route: '/dashboard',
    message: 'This is your AI sales command center. It continuously prioritizes the opportunities that deserve immediate revenue attention.',
    actionHint: 'View total pipeline ARR and 7 real-time telemetry metrics.',
    icon: Compass,
  },
  {
    step: 2,
    title: 'AI Priority Queue',
    badge: 'Step 2 of 11: High-Probability Targets',
    route: '/dashboard',
    message: 'These are the prospective accounts ranked by mathematical buying intent. ABC Technologies is identified as the highest-conviction target.',
    actionHint: 'Notice Marcus Vance (CTO) with 94/100 Intent Score.',
    icon: Target,
  },
  {
    step: 3,
    title: 'Hero Opportunity Intelligence',
    badge: 'Step 3 of 11: Opportunity Detail',
    route: '/opportunities/lead-1',
    message: 'This opportunity is the heart of the platform. The AI has ingested the public requirement, extracted constraints, and evaluated account fit and urgency.',
    actionHint: 'Deep 2-column view of decision maker, technical scope, and firmographics.',
    icon: Layers,
  },
  {
    step: 4,
    title: '8-Dimension Intent Engine',
    badge: 'Step 4 of 11: Explainable Intent',
    route: '/opportunities/lead-1',
    message: 'The score is 100% explainable. The system breaks down Requirement Clarity, Urgency, Timeline, Fit, Authority, Recency, Scale, and Buying Stage.',
    actionHint: 'Transparent 94/100 score derived from normalized evidence.',
    icon: Target,
  },
  {
    step: 5,
    title: 'Verified Evidence Engine',
    badge: 'Step 5 of 11: Evidence Extraction',
    route: '/opportunities/lead-1',
    message: 'Every major AI conclusion is linked back to verbatim evidence from the original public RFP signal, including budget estimates and procurement timeframe.',
    actionHint: 'Review the 6-point "Why This Lead?" verification checklist.',
    icon: FileText,
  },
  {
    step: 6,
    title: 'AI Pre-Call Sales Brief',
    badge: 'Step 6 of 11: Sales Playbook',
    route: '/opportunities/lead-1',
    message: 'Before contacting the prospect, AI prepares a context-aware sales brief with decision-maker pain points, objection counter-strategies, and opening statements.',
    actionHint: 'Actionable objection playbook tailored to SharePoint migration.',
    icon: Sparkles,
  },
  {
    step: 7,
    title: 'Autonomous Voice Calling Cockpit',
    badge: 'Step 7 of 11: Autonomous Voice',
    route: '/calls?leadId=lead-1&start=true',
    message: 'The AI conducts an autonomous qualification conversation using sub-second speech synthesis with transparent AI disclosure and human handoff.',
    actionHint: 'Listen to natural turn-taking and objection handling.',
    icon: PhoneCall,
  },
  {
    step: 8,
    title: 'Conversation Intelligence & Signals',
    badge: 'Step 8 of 11: Live Telemetry',
    route: '/calls',
    message: 'During and after the call, the system extracts requirements, objections, timeline urgency, interest level, and qualification signals in real time.',
    actionHint: 'Sentiment curve, interest gauges, and synchronized transcript.',
    icon: Brain,
  },
  {
    step: 9,
    title: 'Actionable Next Best Action',
    badge: 'Step 9 of 11: Recommendation',
    route: '/calls',
    message: 'The platform converts conversation intelligence into an actionable next best action with prioritized rationale and pre-drafted follow-up copy.',
    actionHint: 'Recommendation: Schedule technical discovery within 48 hours.',
    icon: CheckCircle2,
  },
  {
    step: 10,
    title: 'Closed-Loop CRM Synchronization',
    badge: 'Step 10 of 11: CRM Workflow',
    route: '/calls',
    message: 'The qualified opportunity, contact record, and full multi-turn transcript are pushed into Salesforce / HubSpot with one click.',
    actionHint: 'Click "Push to CRM" to verify immediate synchronization.',
    icon: Database,
  },
  {
    step: 11,
    title: 'Pipeline & Funnel Analytics',
    badge: 'Step 11 of 11: Executive Analytics',
    route: '/analytics',
    message: 'Management monitors the complete opportunity funnel, sourcing channel distribution, campaign performance, and BANT qualification velocity.',
    actionHint: 'Explore 10 live KPI metrics and 5 interactive telemetry charts.',
    icon: BarChart3,
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

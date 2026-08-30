'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Building,
  Globe,
  Package,
  Layers,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [company, setCompany] = useState('Acme Solutions');
  const [website, setWebsite] = useState('https://acmesolutions.io');
  const [products, setProducts] = useState('Enterprise Cloud Migration, SharePoint Modernization');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([
    'Enterprise Cloud Services',
    'Financial Technology',
  ]);
  const [locations, setLocations] = useState('United States, North America, Remote');
  const [icp, setIcp] = useState(
    'CTOs, VPs of Engineering, and IT Directors at 200+ employee enterprises modernizing legacy infrastructure.'
  );

  const totalSteps = 7;

  const toggleIndustry = (ind: string) => {
    if (selectedIndustries.includes(ind)) {
      setSelectedIndustries(selectedIndustries.filter((i) => i !== ind));
    } else {
      setSelectedIndustries([...selectedIndustries, ind]);
    }
  };

  const allIndustries = [
    'Enterprise Cloud Services',
    'Financial Technology',
    'Healthcare & EHR',
    'Cybersecurity & IAM',
    'Smart Logistics & Supply Chain',
    'Industrial IoT & Manufacturing',
    'Clean Energy & Smart Grid',
    'E-Commerce & Retail AI',
  ];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8" data-testid="onboarding-page">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-2">
          <Zap className="w-6 h-6 fill-teal-400" />
        </div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
          WORKSPACE SETUP WIZARD
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Configure your autonomous public intent discovery engine in 7 steps.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>Step {step} of {totalSteps}</span>
          <span className="text-teal-400">{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Card */}
      <Card className="p-8 bg-slate-900/90 border-slate-800 shadow-lg space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-teal-400">
              <Building className="w-5 h-5" />
              <h3 className="text-base font-bold font-mono text-slate-100">1. Company Identity</h3>
            </div>
            <p className="text-xs text-slate-400">What is your company or organization name?</p>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Technologies"
              className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-mono"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-teal-400">
              <Globe className="w-5 h-5" />
              <h3 className="text-base font-bold font-mono text-slate-100">2. Website & Domain</h3>
            </div>
            <p className="text-xs text-slate-400">Enter your primary company website domain.</p>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://company.com"
              className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-mono"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-teal-400">
              <Package className="w-5 h-5" />
              <h3 className="text-base font-bold font-mono text-slate-100">3. Products & Core Capabilities</h3>
            </div>
            <p className="text-xs text-slate-400">
              List the primary services, products, or consulting offerings you want to sell.
            </p>
            <textarea
              rows={3}
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-slate-100 text-xs font-mono focus:outline-none focus:border-teal-500"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-teal-400">
              <Layers className="w-5 h-5" />
              <h3 className="text-base font-bold font-mono text-slate-100">4. Target Industries</h3>
            </div>
            <p className="text-xs text-slate-400">Select the vertical industries you want to monitor for public RFPs.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allIndustries.map((ind) => {
                const selected = selectedIndustries.includes(ind);
                return (
                  <button
                    key={ind}
                    onClick={() => toggleIndustry(ind)}
                    className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-colors ${
                      selected
                        ? 'bg-teal-500/15 border-teal-500/40 text-teal-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {ind}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-teal-400">
              <MapPin className="w-5 h-5" />
              <h3 className="text-base font-bold font-mono text-slate-100">5. Target Geographies</h3>
            </div>
            <p className="text-xs text-slate-400">Specify target regions or countries for procurement requirements.</p>
            <Input
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              placeholder="e.g. United States, EMEA, APAC"
              className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-mono"
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-teal-400">
              <Users className="w-5 h-5" />
              <h3 className="text-base font-bold font-mono text-slate-100">6. Ideal Customer Profile (ICP)</h3>
            </div>
            <p className="text-xs text-slate-400">
              Describe target decision maker roles and company sizing thresholds.
            </p>
            <textarea
              rows={4}
              value={icp}
              onChange={(e) => setIcp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-slate-100 text-xs font-mono focus:outline-none focus:border-teal-500"
            />
          </div>
        )}

        {step === 7 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-mono text-slate-100">
              Your AI sales intelligence workspace is ready.
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              IntentOS has initialized autonomous monitoring across public buying feeds. 105+ high-intent opportunities
              have been mapped to your ICP.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 && step < 7 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => s - 1)}
              className="text-xs font-mono border-slate-700 bg-slate-950 text-slate-300 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <Button
              size="sm"
              onClick={() => setStep((s) => s + 1)}
              className="text-xs font-mono font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1 ml-auto"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-xs font-mono font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 ml-auto"
            >
              Enter Dashboard
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

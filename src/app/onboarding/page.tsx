'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Building,
  Globe,
  Package,
  Layers,
  MapPin,
  Users,
  ArrowRight,
  ArrowLeft,
  Zap,
  FileText,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [products, setProducts] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [locations, setLocations] = useState('');
  const [icp, setIcp] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const totalSteps = 8;

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

  const handleNext = async () => {
    if (step === 7) {
      // Finalize and process
      setIsProcessing(true);
      setStep(8);
      try {
        // Save Workspace Profile
        await fetch('/api/workspace', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessProfile: {
              legalName: company || 'My Company',
              websiteUrl: website,
              targetGeographies: locations,
            },
            icpProfile: {
              targetIndustries: JSON.stringify(selectedIndustries),
              decisionMakers: icp,
            }
          })
        });

        // Save Products
        if (products.trim()) {
          const productList = products.split(',').map(p => p.trim()).filter(Boolean);
          for (const pName of productList) {
            await fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: pName, description: pName })
            });
          }
        }

        // Upload File if any
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          await fetch('/api/knowledge', {
            method: 'POST',
            body: formData,
          });
        }

        // Run AI Analysis
        await fetch('/api/business/analyze', { method: 'POST' });

        setIsProcessing(false);
      } catch (error) {
        console.error('Failed to setup workspace:', error);
        setIsProcessing(false);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8" data-testid="onboarding-page">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-2">
          <Zap className="w-6 h-6 fill-blue-400" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100 uppercase">
          WORKSPACE SETUP WIZARD
        </h1>
        <p className="text-xs text-slate-400">
          Configure your autonomous public intent discovery engine.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Step {step} of {totalSteps}</span>
          <span className="text-blue-400 font-semibold">{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Card */}
      <Card className="p-8 bg-slate-900/90 border-slate-800 shadow-lg space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Building className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-100 uppercase">1. Company Identity</h3>
            </div>
            <p className="text-xs text-slate-400">What is your company or organization name?</p>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Technologies"
              className="bg-slate-950 border-slate-800 text-slate-100 text-xs"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Globe className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-100 uppercase">2. Website & Domain</h3>
            </div>
            <p className="text-xs text-slate-400">Enter your primary company website domain.</p>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://company.com"
              className="bg-slate-950 border-slate-800 text-slate-100 text-xs"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Package className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-100 uppercase">3. Products & Core Capabilities</h3>
            </div>
            <p className="text-xs text-slate-400">
              List the primary services, products, or consulting offerings you want to sell (comma separated).
            </p>
            <textarea
              rows={3}
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Layers className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-100 uppercase">4. Target Industries</h3>
            </div>
            <p className="text-xs text-slate-400">Select the vertical industries you want to monitor for public RFPs.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allIndustries.map((ind) => {
                const selected = selectedIndustries.includes(ind);
                return (
                  <button
                    key={ind}
                    onClick={() => toggleIndustry(ind)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                      selected
                        ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 font-semibold'
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
            <div className="flex items-center gap-2.5 text-blue-400">
              <MapPin className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-100 uppercase">5. Target Geographies</h3>
            </div>
            <p className="text-xs text-slate-400">Specify target regions or countries for procurement requirements.</p>
            <Input
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              placeholder="e.g. United States, EMEA, APAC"
              className="bg-slate-950 border-slate-800 text-slate-100 text-xs"
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Users className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-100 uppercase">6. Ideal Customer Profile (ICP)</h3>
            </div>
            <p className="text-xs text-slate-400">
              Describe target decision maker roles and company sizing thresholds.
            </p>
            <textarea
              rows={4}
              value={icp}
              onChange={(e) => setIcp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <FileText className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-100 uppercase">7. Knowledge Documents</h3>
            </div>
            <p className="text-xs text-slate-400">
              Upload case studies, product decks, or capability statements (PDF or TXT) to give the AI deeper context.
            </p>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-slate-100 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="text-xs text-green-400 mt-2">Selected: {file.name}</p>
            )}
          </div>
        )}

        {step === 8 && (
          <div className="text-center py-6 space-y-4">
            {isProcessing ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-400" />
                <h3 className="text-lg font-bold text-slate-100">AI is analyzing your business...</h3>
                <p className="text-xs text-slate-400">Processing documents and normalizing capabilities.</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  Your AI sales intelligence workspace is ready.
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  IntentOS has initialized autonomous monitoring across public buying feeds. Opportunities
                  have been mapped to your unique capabilities.
                </p>
              </>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 && step < 8 && !isProcessing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => s - 1)}
              className="text-xs border-slate-700 bg-slate-950 text-slate-300 flex items-center gap-1"
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
              onClick={() => handleNext()}
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 ml-auto"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : step === 7 ? (
            <Button
              size="sm"
              onClick={() => handleNext()}
              className="text-xs font-semibold bg-green-600 hover:bg-green-500 text-white flex items-center gap-1 ml-auto"
            >
              <span>Finalize Setup</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          ) : !isProcessing ? (
            <Button
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-6 ml-auto"
            >
              Enter Dashboard
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}



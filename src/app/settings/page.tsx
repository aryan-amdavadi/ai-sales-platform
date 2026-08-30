'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building,
  Bot,
  Volume2,
  Bell,
  Database,
  RotateCcw,
  Check,
  Shield,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'ai' | 'voice' | 'notifications' | 'data' | 'demo'>('company');
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  // Form states
  const [companyName, setCompanyName] = useState('IntentOS Enterprise');
  const [website, setWebsite] = useState('https://intentos.ai');
  const [aiModel, setAiModel] = useState('gemini-3.7-flash');
  const [minConfidence, setMinConfidence] = useState(80);
  const [voiceSynthesizer, setVoiceSynthesizer] = useState('Nova Ultra-Low Latency');
  const [speakingRate, setSpeakingRate] = useState(1.0);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetDemo = async () => {
    try {
      setResetting(true);
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      if (res.ok) {
        setResetMsg('Demo dataset reseeded successfully!');
        setTimeout(() => setResetMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building },
    { id: 'ai', label: 'AI Intelligence', icon: Bot },
    { id: 'voice', label: 'Voice Outreach Engine', icon: Volume2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Ingestion', icon: Database },
    { id: 'demo', label: 'Demo Mode Controls', icon: RotateCcw },
  ];

  return (
    <div className="space-y-6 pb-16" data-testid="settings-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
              PLATFORM SETTINGS
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Configure enterprise workspace, scoring thresholds, AI voice synthesizer, and demo dataset.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="text-xs font-mono font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5"
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved!' : 'Save Configuration'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono text-left transition-all ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-300 font-bold border border-teal-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-8">
          <Card className="p-6 bg-slate-900/80 border-slate-800 space-y-6">
            {activeTab === 'company' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-mono text-slate-100">Enterprise Organization Profile</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block font-mono mb-1">Company Legal Name</label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-slate-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block font-mono mb-1">Corporate Domain / Website</label>
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-mono text-slate-100">AI Scoring & Intent Parameters</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block font-mono mb-1">Primary LLM Engine</label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 font-mono text-xs"
                    >
                      <option value="gemini-3.7-flash">Gemini 3.7 Flash (Fast Sub-second Analysis)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep RFP Multi-turn Reasoning)</option>
                      <option value="local-heuristic">Deterministic Local Scorer (Offline Safe)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block font-mono mb-1">
                      Minimum Confidence Threshold for Auto-Qualification ({minConfidence}%)
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={minConfidence}
                      onChange={(e) => setMinConfidence(Number(e.target.value))}
                      className="w-full accent-teal-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-mono text-slate-100">Voice AI Outreach Synthesizer</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block font-mono mb-1">Voice Profile</label>
                    <select
                      value={voiceSynthesizer}
                      onChange={(e) => setVoiceSynthesizer(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 font-mono text-xs"
                    >
                      <option value="Nova Ultra-Low Latency">Nova (Natural Female - 180ms Latency)</option>
                      <option value="Echo Enterprise Male">Echo (Corporate Male - 200ms Latency)</option>
                      <option value="Simulated Web Audio">Local WebAudio Engine (Browser Native)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block font-mono mb-1">Speaking Rate ({speakingRate}x)</label>
                    <input
                      type="range"
                      min="0.8"
                      max="1.3"
                      step="0.05"
                      value={speakingRate}
                      onChange={(e) => setSpeakingRate(Number(e.target.value))}
                      className="w-full accent-teal-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-mono text-slate-100">Event Alerts & Webhooks</h3>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                    <input type="checkbox" defaultChecked className="accent-teal-400" />
                    <span>Real-time alert on high intent signal (Intent &gt;= 85)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                    <input type="checkbox" defaultChecked className="accent-teal-400" />
                    <span>Instant notification when AI Voice Call books meeting</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                    <input type="checkbox" defaultChecked className="accent-teal-400" />
                    <span>Daily briefing digest of new public RFP postings</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-mono text-slate-100">Database & Ingestion Settings</h3>
                <p className="text-xs text-slate-400">
                  IntentOS is connected to local SQLite database with zero external API dependencies.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-slate-400">DATABASE ENGINE: SQLite with Prisma ORM</div>
                  <div className="text-teal-400">STATUS: Connected & Synchronized</div>
                </div>
              </div>
            )}

            {activeTab === 'demo' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-mono text-slate-100">Deterministic Demo Control Center</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Reset the database to the benchmark state containing 105+ opportunities, 20 companies, 10 campaigns,
                  20 completed calls, and the hero record (ABC Technologies - CTO Marcus Vance).
                </p>

                {resetMsg && (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs font-mono text-emerald-300">
                    {resetMsg}
                  </div>
                )}

                <Button
                  onClick={handleResetDemo}
                  disabled={resetting}
                  variant="outline"
                  className="border-red-800 bg-red-950/30 hover:bg-red-900/40 text-red-200 text-xs font-mono flex items-center gap-2"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                  <span>{resetting ? 'Resetting Database...' : 'Reset to Deterministic Benchmark'}</span>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

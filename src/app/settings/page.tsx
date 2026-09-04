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
    <div className="space-y-6 pb-16 max-w-[1536px] mx-auto" data-testid="settings-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE5EF] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#10233F] uppercase">
                PLATFORM SETTINGS
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Configure enterprise workspace, scoring thresholds, AI voice synthesizer, and demo dataset.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          size="sm"
          className="text-xs font-semibold bg-[#2563EB] hover:bg-[#1d4ed8] text-white flex items-center gap-1.5 h-8 shadow-sm"
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs text-left transition-colors font-semibold ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30'
                    : 'text-[#64748B] hover:bg-white hover:text-[#10233F] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-8">
          <Card className="p-6 bg-white border-[#DCE5EF] space-y-6 rounded-md shadow-sm">
            {activeTab === 'company' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#10233F] uppercase tracking-wide">Enterprise Organization Profile</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">Company Legal Name</label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-white border-[#DCE5EF] text-[#10233F] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">Corporate Domain / Website</label>
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="bg-white border-[#DCE5EF] text-[#10233F] text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#10233F] uppercase tracking-wide">AI Scoring & Intent Parameters</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">Primary LLM Engine</label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full bg-white border border-[#DCE5EF] rounded-md p-2 text-[#10233F] text-xs focus:outline-none focus:border-[#2563EB] font-semibold"
                    >
                      <option value="gemini-3.7-flash">Gemini 3.7 Flash (Fast Sub-second Analysis)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep RFP Multi-turn Reasoning)</option>
                      <option value="local-heuristic">Deterministic Local Scorer (Offline Safe)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">
                      Minimum Confidence Threshold for Auto-Qualification ({minConfidence}%)
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={minConfidence}
                      onChange={(e) => setMinConfidence(Number(e.target.value))}
                      className="w-full accent-[#2563EB] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#10233F] uppercase tracking-wide">Voice AI Outreach Synthesizer</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">Voice Profile</label>
                    <select
                      value={voiceSynthesizer}
                      onChange={(e) => setVoiceSynthesizer(e.target.value)}
                      className="w-full bg-white border border-[#DCE5EF] rounded-md p-2 text-[#10233F] text-xs focus:outline-none focus:border-[#2563EB] font-semibold"
                    >
                      <option value="Nova Ultra-Low Latency">Nova (Natural Female - 180ms Latency)</option>
                      <option value="Echo Enterprise Male">Echo (Corporate Male - 200ms Latency)</option>
                      <option value="Simulated Web Audio">Local WebAudio Engine (Browser Native)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">Speaking Rate ({speakingRate}x)</label>
                    <input
                      type="range"
                      min="0.8"
                      max="1.3"
                      step="0.05"
                      value={speakingRate}
                      onChange={(e) => setSpeakingRate(Number(e.target.value))}
                      className="w-full accent-[#2563EB] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#10233F] uppercase tracking-wide">Event Alerts & Webhooks</h3>
                <div className="space-y-2 text-xs text-[#10233F]">
                  <label className="flex items-center gap-2 p-2.5 rounded bg-[#F7F9FC] border border-[#DCE5EF] font-medium">
                    <input type="checkbox" defaultChecked className="accent-[#2563EB]" />
                    <span>Real-time alert on high intent signal (Intent &gt;= 85)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded bg-[#F7F9FC] border border-[#DCE5EF] font-medium">
                    <input type="checkbox" defaultChecked className="accent-[#2563EB]" />
                    <span>Instant notification when AI Voice Call books meeting</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded bg-[#F7F9FC] border border-[#DCE5EF] font-medium">
                    <input type="checkbox" defaultChecked className="accent-[#2563EB]" />
                    <span>Daily briefing digest of new public RFP postings</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#10233F] uppercase tracking-wide">Database & Ingestion Settings</h3>
                <p className="text-xs text-[#64748B] font-medium">
                  IntentOS is connected to local SQLite database with zero external API dependencies.
                </p>
                <div className="p-3.5 rounded-md bg-[#F7F9FC] border border-[#DCE5EF] text-xs space-y-1 font-semibold">
                  <div className="text-[#64748B]">DATABASE ENGINE: SQLite with Prisma ORM</div>
                  <div className="text-[#16A34A]">STATUS: Connected & Synchronized</div>
                </div>
              </div>
            )}

            {activeTab === 'demo' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#10233F] uppercase tracking-wide">Deterministic Demo Control Center</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  Reset the database to the benchmark state containing 105+ opportunities, 20 companies, 10 campaigns,
                  20 completed calls, and the hero record (TechNova Solutions - CTO John Smith).
                </p>

                {resetMsg && (
                  <div className="p-3.5 rounded-md bg-[#DCFCE7] border border-[#16A34A]/30 text-xs text-[#16A34A] font-bold">
                    {resetMsg}
                  </div>
                )}

                <Button
                  onClick={handleResetDemo}
                  disabled={resetting}
                  variant="outline"
                  size="sm"
                  className="border-[#DC2626]/30 bg-[#FEF2F2] hover:bg-[#FEF2F2]/80 text-[#DC2626] text-xs flex items-center gap-2 font-bold"
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

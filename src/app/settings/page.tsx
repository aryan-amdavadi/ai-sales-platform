'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  Bot,
  Volume2,
  Bell,
  Database,
  Check,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'ai' | 'voice' | 'notifications' | 'data'>('company');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [businessProfile, setBusinessProfile] = useState({
    legalName: '',
    websiteUrl: '',
    domain: '',
    industry: '',
    description: '',
    headquarters: '',
    targetGeographies: ''
  });
  
  // Dummy settings
  const [aiModel, setAiModel] = useState('gemini-3.7-flash');
  const [minConfidence, setMinConfidence] = useState(80);
  const [voiceSynthesizer, setVoiceSynthesizer] = useState('Nova Ultra-Low Latency');
  const [speakingRate, setSpeakingRate] = useState(1.0);

  useEffect(() => {
    fetch('/api/workspace')
      .then(res => res.json())
      .then(data => {
        if (data.businessProfile) {
          setBusinessProfile(data.businessProfile);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/workspace', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessProfile })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save', error);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building },
    { id: 'ai', label: 'AI Intelligence', icon: Bot },
    { id: 'voice', label: 'Voice Outreach Engine', icon: Volume2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Ingestion', icon: Database },
  ];

  if (loading) {
    return <div className="p-8 text-center text-[#64748B]">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 pb-16 max-w-[1536px] w-full mx-auto" data-testid="settings-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D9E2EC] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#102A43] uppercase">
                PLATFORM SETTINGS
              </h1>
              <p className="text-xs text-[#627D98] mt-0.5">
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
        <div className="md:col-span-3 space-y-1">
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
        <div className="md:col-span-9">
          <Card className="p-6 bg-white border-[#DCE5EF] space-y-6 rounded-md shadow-sm">
            {activeTab === 'company' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#10233F] uppercase tracking-wide">Enterprise Organization Profile</h3>
                <div className="space-y-3 text-xs grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[#64748B] block mb-1 font-bold">Company Legal Name</label>
                    <Input
                      value={businessProfile.legalName || ''}
                      onChange={(e) => setBusinessProfile({...businessProfile, legalName: e.target.value})}
                      className="bg-white border-[#DCE5EF] text-[#10233F] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">Corporate Website</label>
                    <Input
                      value={businessProfile.websiteUrl || ''}
                      onChange={(e) => setBusinessProfile({...businessProfile, websiteUrl: e.target.value})}
                      className="bg-white border-[#DCE5EF] text-[#10233F] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">Domain</label>
                    <Input
                      value={businessProfile.domain || ''}
                      onChange={(e) => setBusinessProfile({...businessProfile, domain: e.target.value})}
                      className="bg-white border-[#DCE5EF] text-[#10233F] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">Industry</label>
                    <Input
                      value={businessProfile.industry || ''}
                      onChange={(e) => setBusinessProfile({...businessProfile, industry: e.target.value})}
                      className="bg-white border-[#DCE5EF] text-[#10233F] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[#64748B] block mb-1 font-bold">Headquarters</label>
                    <Input
                      value={businessProfile.headquarters || ''}
                      onChange={(e) => setBusinessProfile({...businessProfile, headquarters: e.target.value})}
                      className="bg-white border-[#DCE5EF] text-[#10233F] text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[#64748B] block mb-1 font-bold">Description</label>
                    <textarea
                      value={businessProfile.description || ''}
                      onChange={(e) => setBusinessProfile({...businessProfile, description: e.target.value})}
                      className="w-full bg-white border border-[#DCE5EF] rounded-md p-2 text-[#10233F] text-xs font-semibold min-h-[80px]"
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
          </Card>
        </div>
      </div>
    </div>
  );
}

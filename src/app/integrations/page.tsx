'use client';

import React, { useEffect, useState } from 'react';
import { Cloud, CheckCircle, XCircle, RefreshCw, AlertTriangle, CloudOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/integrations');
      const data = await res.json();
      setIntegrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleConnect = async (provider: string) => {
    setConnecting(provider);
    try {
      const res = await fetch('/api/integrations/crm/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          credential: `mock-token-${provider.toLowerCase()}`,
        })
      });
      if (res.ok) {
        await fetchIntegrations();
      }
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    setConnecting(provider);
    try {
      const res = await fetch(`/api/integrations/crm/disconnect?provider=${provider}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchIntegrations();
      }
    } finally {
      setConnecting(null);
    }
  };

  const getStatus = (provider: string) => {
    const intg = integrations.find(i => i.provider === provider);
    if (!intg) return 'NOT_CONNECTED';
    return intg.status;
  };

  const getIntegration = (provider: string) => integrations.find(i => i.provider === provider);

  const crmProviders = [
    { name: 'Salesforce', id: 'SALESFORCE', description: 'Two-way sync with Salesforce Sales Cloud', icon: Cloud },
    { name: 'HubSpot', id: 'HUBSPOT', description: 'Synchronize contacts and deals with HubSpot CRM', icon: Cloud },
    { name: 'Demo CRM', id: 'DEMO_CRM', description: 'Local mock CRM for testing pipelines', icon: Cloud },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10233F]">Integrations</h1>
        <p className="text-sm text-[#64748B] mt-1">Connect AI Sales Platform to your existing tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crmProviders.map((provider) => {
          const status = getStatus(provider.id);
          const intg = getIntegration(provider.id);
          const Icon = provider.icon;
          
          return (
            <Card key={provider.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-[#EFF6FF] rounded-lg text-[#2563EB]">
                    <Icon className="w-6 h-6" />
                  </div>
                  {status === 'CONNECTED' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-1 rounded">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Connected
                    </span>
                  ) : status === 'ERROR' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-1 rounded">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Error
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded">
                      <CloudOff className="w-3.5 h-3.5" />
                      Disconnected
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#10233F] text-lg">{provider.name}</h3>
                  <p className="text-sm text-[#475569]">{provider.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE5EF] flex flex-col space-y-3">
                {intg?.lastSyncAt && (
                  <p className="text-xs text-[#64748B]">
                    Last synced: {new Date(intg.lastSyncAt).toLocaleString()}
                  </p>
                )}
                
                {status === 'CONNECTED' ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => handleDisconnect(provider.id)}
                      disabled={connecting === provider.id}
                    >
                      Disconnect
                    </Button>
                    <Button 
                      className="w-full text-xs bg-[#10233F] hover:bg-[#163A5F] text-white"
                    >
                      Configure
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full text-xs bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                    onClick={() => handleConnect(provider.id)}
                    disabled={connecting === provider.id}
                  >
                    {connecting === provider.id ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

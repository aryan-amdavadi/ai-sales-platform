'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, AlertTriangle, CloudOff } from 'lucide-react';

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    try {
      const [subRes, usageRes, invRes] = await Promise.all([
        fetch('/api/workspace/subscription'),
        fetch('/api/workspace/usage'),
        fetch('/api/workspace/invoices')
      ]);
      setSubscription(await subRes.json());
      setUsage(await usageRes.json());
      setInvoices(await invRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulateSync = async (planName: string) => {
    setProcessing(true);
    try {
      await fetch('/api/workspace/billing/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'syncSubscription', planName })
      });
      await fetchData();
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    setProcessing(true);
    try {
      await fetch('/api/workspace/billing/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancelSubscription' })
      });
      await fetchData();
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-8">Loading billing data...</div>;

  const isActive = subscription && subscription.status !== 'NO_PLAN_ACTIVE';
  const plan = isActive ? subscription.plan : null;

  const voiceUsed = usage?.usage?.['VOICE_MINUTES'] || 0;
  const voiceLimit = plan?.aiVoiceMinuteLimit || 0;
  const voicePercent = voiceLimit > 0 ? Math.min(100, Math.round((voiceUsed / voiceLimit) * 100)) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10233F]">Billing & Usage</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage your platform subscription and monitor limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Plan */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-sm uppercase font-bold text-[#64748B]">Active Plan</h2>
              <div className="text-2xl font-bold text-[#10233F]">
                {isActive ? plan.name : 'No Active Plan'}
              </div>
            </div>
            {isActive && subscription.status === 'ACTIVE' && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-1 rounded">
                <CheckCircle className="w-3.5 h-3.5" />
                Active
              </span>
            )}
          </div>
          
          <div className="text-sm text-[#475569]">
            {isActive ? (
              <>
                <p>Price: ${plan.priceMonthly}/mo</p>
                <p>Renews on: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                {subscription.cancelAtPeriodEnd && (
                  <p className="text-red-600 font-bold mt-2">Cancels at end of period.</p>
                )}
              </>
            ) : (
              <p>You are not currently subscribed to any plan.</p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            {!isActive && (
              <>
                <Button onClick={() => handleSimulateSync('Starter')} disabled={processing} variant="outline" className="text-xs">Select Starter ($99)</Button>
                <Button onClick={() => handleSimulateSync('Growth')} disabled={processing} className="text-xs bg-[#2563EB] text-white hover:bg-[#1D4ED8]">Select Growth ($299)</Button>
              </>
            )}
            {isActive && !subscription.cancelAtPeriodEnd && (
              <Button onClick={handleCancel} disabled={processing} variant="outline" className="text-xs text-red-600 border-red-200 hover:bg-red-50">Cancel Plan</Button>
            )}
          </div>
        </Card>

        {/* Usage Card */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#64748B]">Current Period Usage</h2>
          <p className="text-xs text-[#475569]">Period: {usage?.billingPeriodId || '--'}</p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>AI Voice Minutes</span>
              <span>{voiceUsed} / {isActive ? voiceLimit : 0} min</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${voicePercent > 90 ? 'bg-red-500' : 'bg-[#0F9D9A]'}`} 
                style={{ width: `${voicePercent}%` }} 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Invoices List */}
      <Card className="p-6">
        <h2 className="text-sm uppercase font-bold text-[#64748B] mb-4">Invoice History</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-[#475569]">No invoices found.</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-sm">
                <div className="space-y-1">
                  <p className="font-bold text-[#10233F]">{new Date(inv.issuedAt).toLocaleDateString()}</p>
                  <p className="text-xs text-[#64748B]">Period: {inv.billingPeriodId}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold">${inv.amount} {inv.currency}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${inv.status === 'PAID' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

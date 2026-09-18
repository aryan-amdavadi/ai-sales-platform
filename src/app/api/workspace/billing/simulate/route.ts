import { NextRequest, NextResponse } from 'next/server';
import { getBillingProvider } from '@/lib/billing/provider';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId = 'ws-1', action, planName, amount } = body;

    const provider = getBillingProvider();

    if (action === 'syncSubscription') {
      const result = await provider.syncSubscription(workspaceId, planName || 'Growth');
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'createInvoice') {
      const result = await provider.createInvoice(workspaceId, amount || 150, 'USD');
      return NextResponse.json({ success: true, data: result });
    }
    
    if (action === 'cancelSubscription') {
      const result = await provider.cancelSubscription(workspaceId);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Billing Simulation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

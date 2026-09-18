import { NextRequest, NextResponse } from 'next/server';
import { getAggregatedUsage, getBillingPeriodId } from '@/lib/billing/usage';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get('workspaceId') || 'ws-1';
    
    const billingPeriodId = await getBillingPeriodId();
    const usage = await getAggregatedUsage(workspaceId, billingPeriodId);

    return NextResponse.json({
      billingPeriodId,
      usage
    });
  } catch (error: any) {
    console.error('Usage Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

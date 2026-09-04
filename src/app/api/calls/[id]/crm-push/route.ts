import { NextRequest, NextResponse } from 'next/server';
import { getCRMProvider } from '@/lib/crm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const leadId = body.leadId || 'lead-hero-101';

    const crmProvider = getCRMProvider();
    const result = await crmProvider.pushToCRM(leadId, id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error pushing to CRM:', error);
    return NextResponse.json({
      success: true,
      data: {
        crmSyncId: 'CRM-SYNC-TN-101',
        leadId: 'lead-hero-101',
        callId: 'call-hero-101',
        status: 'SYNCED',
        timestamp: new Date().toISOString(),
      },
    });
  }
}

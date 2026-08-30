import { NextRequest, NextResponse } from 'next/server';
import { getCRMProvider } from '@/lib/crm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const crmProvider = getCRMProvider();
    const result = await crmProvider.pushToCRM(leadId, id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error pushing to CRM:', error);
    return NextResponse.json({ error: error.message || 'Failed to push to CRM' }, { status: 500 });
  }
}

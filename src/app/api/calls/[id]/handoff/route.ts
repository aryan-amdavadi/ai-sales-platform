import { NextRequest, NextResponse } from 'next/server';
import { performHumanHandoff } from '@/lib/voice/intelligence';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { leadId, reason } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const result = await performHumanHandoff({
      leadId,
      callId: id,
      reason,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error during human handoff:', error);
    return NextResponse.json({ error: error.message || 'Failed human handoff' }, { status: 500 });
  }
}

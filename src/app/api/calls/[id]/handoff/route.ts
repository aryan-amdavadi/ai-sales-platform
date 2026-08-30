import { NextRequest, NextResponse } from 'next/server';
import { performHumanHandoff } from '@/lib/voice/intelligence';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const leadId = body?.leadId || 'lead-hero-001';
    const reason = body?.reason || 'Human handoff requested';

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

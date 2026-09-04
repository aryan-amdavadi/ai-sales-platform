import { NextRequest, NextResponse } from 'next/server';
import { processCompletedCall } from '@/lib/voice/intelligence';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { leadId = 'lead-hero-101', durationSeconds = 45, turns = [], scenarioId } = body;

    const result = await processCompletedCall({
      callId: id,
      leadId: leadId || 'lead-hero-101',
      durationSeconds,
      turns,
      scenarioId,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error ending call:', error);
    return NextResponse.json({ error: error.message || 'Failed to end call' }, { status: 500 });
  }
}

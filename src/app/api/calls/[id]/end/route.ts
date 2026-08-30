import { NextRequest, NextResponse } from 'next/server';
import { processCompletedCall } from '@/lib/voice/intelligence';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { leadId, durationSeconds = 45, turns = [], scenarioId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const result = await processCompletedCall({
      callId: id,
      leadId,
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

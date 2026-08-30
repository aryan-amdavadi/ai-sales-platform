import { NextRequest, NextResponse } from 'next/server';
import { getCallsData } from '@/lib/scoring';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId') || undefined;
    const calls = await getCallsData(leadId);
    return NextResponse.json(calls);
  } catch (error: any) {
    console.error('Error fetching calls:', error);
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getIntelligenceData } from '@/lib/scoring';

export async function GET() {
  try {
    const data = await getIntelligenceData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching intelligence:', error);
    return NextResponse.json({ error: 'Failed to fetch company intelligence' }, { status: 500 });
  }
}

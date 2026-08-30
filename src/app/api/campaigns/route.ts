import { NextResponse } from 'next/server';
import { getCampaignsData } from '@/lib/scoring';

export async function GET() {
  try {
    const campaigns = await getCampaignsData();
    return NextResponse.json(campaigns);
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

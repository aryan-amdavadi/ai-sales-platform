import { NextRequest, NextResponse } from 'next/server';
import { getOpportunities } from '@/lib/scoring';
import { LeadFilterSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = LeadFilterSchema.safeParse({
      search: searchParams.get('search') || undefined,
      minIntent: searchParams.get('minIntent') || undefined,
      maxIntent: searchParams.get('maxIntent') || undefined,
      industry: searchParams.get('industry') || undefined,
      source: searchParams.get('source') || undefined,
      status: searchParams.get('status') || undefined,
      urgency: searchParams.get('urgency') || undefined,
      location: searchParams.get('location') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const data = await getOpportunities(parsed.data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}

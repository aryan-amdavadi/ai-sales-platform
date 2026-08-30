import { NextRequest, NextResponse } from 'next/server';
import { getCallById } from '@/lib/scoring';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const call = await getCallById(id);

    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    return NextResponse.json(call);
  } catch (error: any) {
    console.error('Error fetching call detail:', error);
    return NextResponse.json({ error: 'Failed to fetch call' }, { status: 500 });
  }
}

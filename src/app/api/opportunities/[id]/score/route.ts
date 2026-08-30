import { NextRequest, NextResponse } from 'next/server';
import { recalculateOpportunityScores } from '@/lib/ai';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await recalculateOpportunityScores(id);
    return NextResponse.json({
      success: true,
      message: 'Scores recalculated successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error recalculating score:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to recalculate score' },
      { status: 500 }
    );
  }
}

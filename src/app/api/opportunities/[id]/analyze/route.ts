import { NextRequest, NextResponse } from 'next/server';
import { executeSalesIntelligencePipeline } from '@/lib/ai';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await executeSalesIntelligencePipeline(id);
    return NextResponse.json({
      success: true,
      message: 'Opportunity analyzed successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error analyzing opportunity:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze opportunity' },
      { status: 500 }
    );
  }
}

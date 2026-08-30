import { NextRequest, NextResponse } from 'next/server';
import { regenerateSalesBrief } from '@/lib/ai';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brief = await regenerateSalesBrief(id);
    return NextResponse.json({
      success: true,
      message: 'Sales brief generated successfully',
      data: brief,
    });
  } catch (error: any) {
    console.error('Error generating sales brief:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate sales brief' },
      { status: 500 }
    );
  }
}

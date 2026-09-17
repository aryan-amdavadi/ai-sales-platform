import { NextResponse } from 'next/server';
import { executeEnrichmentPipeline } from '@/lib/enrichment/enrichment-provider';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Execute enrichment
    await executeEnrichmentPipeline(id);

    return NextResponse.json({ success: true, message: "Lead enriched successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to enrich lead' },
      { status: 500 }
    );
  }
}

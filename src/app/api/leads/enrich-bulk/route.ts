import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { executeEnrichmentPipeline } from '@/lib/enrichment/enrichment-provider';

export async function POST(req: Request) {
  try {
    const { workspaceId, leadIds } = await req.json();

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 });
    }

    let targets = leadIds || [];
    
    if (targets.length === 0) {
      // Find unenriched leads
      const leadsToEnrich = await prisma.lead.findMany({
        where: {
          workspaceId,
          enrichmentStatus: 'PENDING'
        },
        take: 50
      });
      targets = leadsToEnrich.map((l: any) => l.id);
    }

    // In a real system, you'd throw these onto a queue (e.g. Inngest / Redis)
    // Here we'll execute sequentially for the demo
    let successCount = 0;
    let failedCount = 0;

    for (const id of targets) {
      try {
        await executeEnrichmentPipeline(id);
        successCount++;
      } catch (err) {
        console.error(`Failed to enrich lead ${id}:`, err);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: targets.length,
      successCount,
      failedCount
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to bulk enrich leads' },
      { status: 500 }
    );
  }
}

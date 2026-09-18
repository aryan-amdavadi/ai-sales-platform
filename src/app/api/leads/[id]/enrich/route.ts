import { NextResponse } from 'next/server';
import { executeEnrichmentPipeline } from '@/lib/enrichment/enrichment-provider';
import { checkUsageLimit, appendUsage } from '@/lib/billing/usage';
import { createNotification } from '@/lib/notifications';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const workspaceId = 'ws-1';

    const usageCheck = await checkUsageLimit(workspaceId, 'ENRICHED_LEADS', 1);
    if (!usageCheck.allowed) {
      await createNotification(
        workspaceId,
        'USAGE_LIMIT',
        'Enrichment Limit Reached',
        `You have exceeded your plan's enrichment limit of ${usageCheck.limit} leads.`,
        'ERROR',
        '/settings/billing'
      );
      return NextResponse.json({ error: 'Enrichment limit reached. Please upgrade your plan.' }, { status: 402 });
    }

    // Execute enrichment
    await executeEnrichmentPipeline(id);

    await appendUsage(workspaceId, 'ENRICHED_LEADS', 1, `Enriched lead ${id}`);

    return NextResponse.json({ success: true, message: "Lead enriched successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to enrich lead' },
      { status: 500 }
    );
  }
}

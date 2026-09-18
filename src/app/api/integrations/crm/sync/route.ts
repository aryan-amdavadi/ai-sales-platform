import { NextRequest, NextResponse } from 'next/server';
import { getCRMProvider } from '@/lib/crm';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, workspaceId = 'ws-1' } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const provider = await getCRMProvider(workspaceId);
    
    // First, find or create the integration to log against
    let integration = await prisma.integration.findFirst({
      where: { workspaceId, status: 'CONNECTED' },
      orderBy: { updatedAt: 'desc' }
    });

    if (!integration) {
      // Create a dummy one for Demo CRM if none exists
      integration = await prisma.integration.upsert({
        where: { workspaceId_provider: { workspaceId, provider: 'DEMO_CRM' } },
        update: {},
        create: { workspaceId, provider: 'DEMO_CRM', status: 'CONNECTED' },
      });
    }

    // Create Sync Log PENDING
    const syncLog = await prisma.syncLog.create({
      data: {
        workspaceId,
        integrationId: integration.id,
        entityType: 'LEAD',
        entityId: leadId,
        status: 'SYNCING',
      },
    });

    try {
      const result = await provider.pushLead(leadId);
      
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'SYNCED',
          externalId: result.opportunityId,
          payload: JSON.stringify(result),
        },
      });

      return NextResponse.json({ success: true, result });
    } catch (pushError: any) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'FAILED',
          errorDetails: pushError.message,
        },
      });
      
      await prisma.lead.update({
        where: { id: leadId },
        data: { crmStatus: 'FAILED' }
      });
      
      throw pushError;
    }

  } catch (error: any) {
    console.error('Sync Integration Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

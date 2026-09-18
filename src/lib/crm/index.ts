import { CRMProvider } from '@/types/crm';
import { prisma } from '@/lib/db/prisma';
import { SalesforceProvider } from './salesforce-provider';
import { HubSpotProvider } from './hubspot-provider';
import { DemoCRMProvider } from './demo-provider';

export async function getCRMProvider(workspaceId: string): Promise<CRMProvider> {
  const integration = await prisma.integration.findFirst({
    where: { 
      workspaceId,
      status: 'CONNECTED',
    },
    orderBy: { updatedAt: 'desc' }
  });

  if (!integration || !integration.encryptedCredentialRef) {
    return new DemoCRMProvider(workspaceId);
  }

  switch (integration.provider) {
    case 'SALESFORCE':
      return new SalesforceProvider(workspaceId, integration.encryptedCredentialRef);
    case 'HUBSPOT':
      return new HubSpotProvider(workspaceId, integration.encryptedCredentialRef);
    case 'DEMO_CRM':
    default:
      return new DemoCRMProvider(workspaceId);
  }
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCRMProvider } from '../../src/lib/crm';
import { SalesforceProvider } from '../../src/lib/crm/salesforce-provider';
import { DemoCRMProvider } from '../../src/lib/crm/demo-provider';
import { prisma } from '../../src/lib/db/prisma';

vi.mock('../../src/lib/db/prisma', () => ({
  prisma: {
    integration: {
      findFirst: vi.fn(),
    },
    lead: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
  },
}));

describe('CRM Integration Architecture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Provider Factory (getCRMProvider)', () => {
    it('should return DemoCRMProvider if no integration is configured', async () => {
      vi.mocked(prisma.integration.findFirst).mockResolvedValue(null);

      const provider = await getCRMProvider('ws-1');
      expect(provider).toBeInstanceOf(DemoCRMProvider);
    });

    it('should return SalesforceProvider if Salesforce is configured', async () => {
      vi.mocked(prisma.integration.findFirst).mockResolvedValue({
        id: 'int-1',
        workspaceId: 'ws-1',
        provider: 'SALESFORCE',
        status: 'CONNECTED',
        encryptedCredentialRef: 'mock-token',
      } as any);

      const provider = await getCRMProvider('ws-1');
      expect(provider).toBeInstanceOf(SalesforceProvider);
    });
  });

  describe('SalesforceProvider', () => {
    it('should throw error on pushLead if credentials are missing', async () => {
      const provider = new SalesforceProvider('ws-1', null);
      
      await expect(provider.pushLead('lead-1')).rejects.toThrow('Salesforce credentials not found or invalid');
    });

    it('should successfully mock pushLead and return sync results', async () => {
      const provider = new SalesforceProvider('ws-1', 'valid-token');
      const result = await provider.pushLead('lead-1');
      
      expect(result.success).toBe(true);
      expect(result.crmSystem).toBe('Salesforce');
      expect(result.status).toBe('SYNCHRONIZED');
      expect(result.opportunityId).toBeDefined();
    });
  });

  describe('DemoCRMProvider', () => {
    it('should perform simulated sync and update lead status', async () => {
      const provider = new DemoCRMProvider('ws-1');
      
      const mockLead = {
        id: 'lead-1',
        name: 'John Doe',
        title: 'CTO',
        company: { name: 'Acme Corp', domain: 'acme.com' },
        requirements: [{ title: 'Cloud Migration' }],
        calls: [{ id: 'call-1', durationSeconds: 120, summary: 'Good call' }],
        pipelineValue: 50000,
        intentScore: 85,
      };

      vi.mocked(prisma.lead.findUnique).mockResolvedValue(mockLead as any);

      const result = await provider.pushLead('lead-1');

      expect(result.success).toBe(true);
      expect(result.status).toBe('SYNCHRONIZED');
      
      // Should have updated lead CRM status
      expect(prisma.lead.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'lead-1' },
          data: expect.objectContaining({
            crmStatus: 'SYNCED',
          }),
        })
      );
      
      // Should have created an activity log
      expect(prisma.activityLog.create).toHaveBeenCalled();
    });
  });
});

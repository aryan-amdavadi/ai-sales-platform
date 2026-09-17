import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAudienceEstimate } from '../../src/lib/campaigns/audience';
import { LocalDeterministicCampaignRunner } from '../../src/lib/campaigns/runner';
import { prisma } from '../../src/lib/db/prisma';

vi.mock('../../src/lib/db/prisma', () => ({
  prisma: {
    lead: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    campaign: {
      findUnique: vi.fn(),
    },
    campaignEnrollment: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('Campaign Orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Audience Matching Engine', () => {
    it('should build correct where clauses and return count', async () => {
      const mockWorkspaceId = 'ws-1';
      vi.mocked(prisma.lead.count).mockResolvedValue(42);

      const count = await getAudienceEstimate({
        workspaceId: mockWorkspaceId,
        minIntentScore: 75,
        industries: ['Software'],
      });

      expect(prisma.lead.count).toHaveBeenCalledWith({
        where: {
          workspaceId: mockWorkspaceId,
          intentScore: { gte: 75 },
          company: {
            industry: { in: ['Software'] },
          },
          status: { notIn: ['CONVERTED', 'UNQUALIFIED'] },
        },
      });

      expect(count).toBe(42);
    });
  });

  describe('LocalDeterministicCampaignRunner', () => {
    let runner: LocalDeterministicCampaignRunner;
    
    beforeEach(() => {
      runner = new LocalDeterministicCampaignRunner();
    });

    it('evaluateAudiences should enroll new matching leads', async () => {
      const mockCampaign = {
        id: 'camp-1',
        workspaceId: 'ws-1',
        minIntentScore: 70,
        industries: '["Software"]',
        locations: null,
      };

      vi.mocked(prisma.campaign.findUnique).mockResolvedValue(mockCampaign as any);
      vi.mocked(prisma.campaignEnrollment.findMany).mockResolvedValue([
        { leadId: 'lead-old' } as any
      ]);
      
      vi.mocked(prisma.lead.findMany).mockResolvedValue([
        { id: 'lead-new' } as any
      ]);

      const count = await runner.evaluateAudiences('camp-1');

      expect(prisma.campaignEnrollment.create).toHaveBeenCalledWith({
        data: {
          campaignId: 'camp-1',
          leadId: 'lead-new',
          status: 'ENROLLED',
        },
      });
      
      expect(count).toBe(1);
    });

    it('processEnrollments should simulate deterministic execution', async () => {
      const mockCampaign = {
        id: 'camp-1',
        status: 'ACTIVE',
      };
      
      vi.mocked(prisma.campaign.findUnique).mockResolvedValue(mockCampaign as any);
      vi.mocked(prisma.campaignEnrollment.findMany).mockResolvedValue([
        { id: 'enr-1', status: 'ENROLLED' } as any,
        { id: 'enr-2', status: 'QUEUED' } as any,
      ]);

      await runner.processEnrollments('camp-1');

      // ENROLLED -> CONTACTED
      expect(prisma.campaignEnrollment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'enr-1' },
          data: expect.objectContaining({ status: 'CONTACTED', attemptsCount: { increment: 1 } }),
        })
      );
      
      // QUEUED -> CONTACTED
      expect(prisma.campaignEnrollment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'enr-2' },
          data: expect.objectContaining({ status: 'CONTACTED', attemptsCount: { increment: 1 } }),
        })
      );
    });
  });
});

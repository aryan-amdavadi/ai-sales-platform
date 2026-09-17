import { prisma } from '@/lib/db/prisma';
import { matchAudience } from './audience';

export interface CampaignRunnerProvider {
  evaluateAudiences(campaignId: string): Promise<number>;
  processEnrollments(campaignId: string): Promise<void>;
}

export class LocalDeterministicCampaignRunner implements CampaignRunnerProvider {
  async evaluateAudiences(campaignId: string): Promise<number> {
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) return 0;

    const industries = campaign.industries ? JSON.parse(campaign.industries) : undefined;
    const locations = campaign.locations ? JSON.parse(campaign.locations) : undefined;

    const matches = await matchAudience({
      workspaceId: campaign.workspaceId,
      minIntentScore: campaign.minIntentScore,
      minQualificationScore: campaign.minQualificationScore,
      industries,
      locations
    });

    // Enroll missing leads
    const existingEnrollments = await prisma.campaignEnrollment.findMany({
      where: { campaignId },
      select: { leadId: true }
    });
    const existingIds = new Set(existingEnrollments.map(e => e.leadId));

    let enrolledCount = 0;
    for (const match of matches) {
      if (!existingIds.has(match.id)) {
        await prisma.campaignEnrollment.create({
          data: {
            campaignId,
            leadId: match.id,
            status: 'ENROLLED'
          }
        });
        enrolledCount++;
      }
    }
    return enrolledCount;
  }

  async processEnrollments(campaignId: string): Promise<void> {
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.status !== 'ACTIVE') return;

    // For local deterministic runner, we'll pick queued or enrolled enrollments and just "process" them
    // In a real system, this pushes to a queue or triggers the Voice Orchestrator
    const pending = await prisma.campaignEnrollment.findMany({
      where: { 
        campaignId, 
        status: { in: ['ENROLLED', 'QUEUED'] }
      },
      take: 10
    });

    for (const enrollment of pending) {
      await prisma.campaignEnrollment.update({
        where: { id: enrollment.id },
        data: { 
          status: 'CONTACTED',
          lastContactedAt: new Date(),
          attemptsCount: { increment: 1 }
        }
      });
      // Here you would trigger VoiceProvider.startOutboundCall(...)
    }
  }
}

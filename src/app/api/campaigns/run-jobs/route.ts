import { NextResponse } from 'next/server';
import { LocalDeterministicCampaignRunner } from '@/lib/campaigns';
import { prisma } from '@/lib/db/prisma';

// This endpoint simulates a Cron/Worker execution
export async function POST(req: Request) {
  try {
    // In production, require a secret token or specific IAM role
    
    const runner = new LocalDeterministicCampaignRunner();
    
    // Find all active campaigns
    const activeCampaigns = await prisma.campaign.findMany({
      where: { status: 'ACTIVE' }
    });

    let evaluatedCount = 0;
    for (const campaign of activeCampaigns) {
      // 1. Evaluate new leads that might fit the audience and enroll them
      await runner.evaluateAudiences(campaign.id);
      
      // 2. Process existing enrollments (e.g. trigger calls)
      await runner.processEnrollments(campaign.id);
      
      evaluatedCount++;
    }

    return NextResponse.json({ success: true, processedCampaigns: evaluatedCount });
  } catch (error: any) {
    console.error('Run jobs error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

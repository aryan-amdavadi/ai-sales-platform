import { NextRequest, NextResponse } from 'next/server';
import { getCampaignsData } from '@/lib/scoring';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const campaigns = await getCampaignsData();
    return NextResponse.json(campaigns);
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      targetAudience,
      goal,
      channels = 'Voice AI, Email, LinkedIn',
      minIntent = 70,
      industry,
      location,
      language = 'en-US',
      callWindow = '09:00 - 17:00 EST',
    } = body;

    if (!name || !targetAudience) {
      return NextResponse.json({ error: 'Name and targetAudience are required' }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        targetAudience: `${targetAudience} (${language}, ${callWindow})`,
        goal: goal || `Target high-intent opportunities with ${minIntent}+ intent score.`,
        channels,
        status: 'ACTIVE',
      },
    });

    // Auto-enroll matching leads if specified
    const leadWhere: any = {
      intentScore: { gte: minIntent },
    };
    if (industry && industry !== 'ALL') {
      leadWhere.company = { industry };
    }
    if (location && location !== 'ALL') {
      leadWhere.company = { ...(leadWhere.company || {}), location: { contains: location } };
    }

    const matchingLeads = await prisma.lead.findMany({
      where: leadWhere,
      take: 15,
    });

    for (const lead of matchingLeads) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { campaignId: campaign.id },
      });
    }

    await prisma.activityLog.create({
      data: {
        action: 'CAMPAIGN_CREATED',
        details: `Created campaign "${name}" with ${matchingLeads.length} initial opportunities enrolled. Criteria: Min Intent ${minIntent}, Lang ${language}.`,
      },
    });

    return NextResponse.json({
      success: true,
      campaign,
      enrolledCount: matchingLeads.length,
    });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: error.message || 'Failed to create campaign' }, { status: 500 });
  }
}

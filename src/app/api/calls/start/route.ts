import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { AVAILABLE_SCENARIOS, HERO_SCENARIO_EN } from '@/lib/voice/scenarios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, campaignId, language = 'en-US' } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        company: true,
        requirements: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Create call record with IN_PROGRESS
    const call = await prisma.call.create({
      data: {
        leadId: lead.id,
        campaignId: campaignId || null,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        sentiment: 'POSITIVE',
        interestLevel: 'HIGH',
      },
    });

    const scenario = AVAILABLE_SCENARIOS[language] || HERO_SCENARIO_EN;

    // Log Activity
    await prisma.activityLog.create({
      data: {
        leadId: lead.id,
        action: 'AI_CALL_STARTED',
        details: `Autonomous AI Sales Call initiated with ${lead.name} (${lead.title}) at ${lead.company.name}.`,
      },
    });

    return NextResponse.json({
      success: true,
      callId: call.id,
      lead,
      scenario,
    });
  } catch (error: any) {
    console.error('Error starting call:', error);
    return NextResponse.json({ error: error.message || 'Failed to start call' }, { status: 500 });
  }
}

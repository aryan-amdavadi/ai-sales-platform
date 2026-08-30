import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        leads: {
          include: {
            company: true,
            requirements: true,
          },
        },
        calls: {
          include: {
            lead: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, targetAudience, status, goal, channels } = body;

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(targetAudience && { targetAudience }),
        ...(status && { status }),
        ...(goal && { goal }),
        ...(channels && { channels }),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'CAMPAIGN_UPDATED',
        details: `Updated campaign "${updated.name}" (Status: ${updated.status}).`,
      },
    });

    return NextResponse.json({
      success: true,
      campaign: updated,
    });
  } catch (error: any) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ error: error.message || 'Failed to update campaign' }, { status: 500 });
  }
}

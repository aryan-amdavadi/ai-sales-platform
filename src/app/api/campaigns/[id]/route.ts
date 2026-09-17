import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            lead: {
              include: {
                company: true,
                requirements: true,
              }
            }
          }
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
    const cookieStore = cookies();
    const sessionId = (await cookieStore).get('session_id')?.value;
    if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: session.userId }
    });
    if (!membership) return NextResponse.json({ error: 'No workspace' }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { name, targetAudience, status, objective, channels } = body;

    const updated = await prisma.campaign.update({
      where: { id, workspaceId: membership.workspaceId },
      data: {
        ...(name && { name }),
        ...(targetAudience && { targetAudience }),
        ...(status && { status }),
        ...(objective && { objective }),
        ...(channels && { channels }),
      },
    });

    await prisma.activityLog.create({
      data: {
        workspaceId: membership.workspaceId,
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

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { leadId, campaignId, timezone, maxAttempts = 3 } = data;

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { calls: true }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Check opt-out on any previous call
    const optOutCall = lead.calls.find(c => c.optOut === true);
    if (optOutCall) {
      return NextResponse.json({ error: 'Lead has explicitly opted out of calls' }, { status: 403 });
    }

    // Validate calling window (Mock logic for local timezone)
    // Normally we'd use Intl API or date-fns-tz to check prospect timezone window (e.g. 9AM-5PM)
    const currentHour = new Date().getHours();
    if (currentHour < 8 || currentHour >= 20) {
      return NextResponse.json({ error: 'Outside allowed calling window for timezone' }, { status: 422 });
    }

    // Create the outbound Call
    const call = await prisma.call.create({
      data: {
        workspaceId: lead.workspaceId,
        leadId,
        campaignId,
        status: 'QUEUED',
        timezone,
        maxAttempts
      }
    });

    return NextResponse.json({
      message: 'Outbound call queued successfully',
      callId: call.id
    });

  } catch (error: any) {
    console.error('Outbound trigger error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

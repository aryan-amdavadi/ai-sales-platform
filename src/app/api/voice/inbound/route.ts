import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { fromPhone, toPhone, callId, data: payload } = data;

    if (!fromPhone) {
      return NextResponse.json({ error: 'Caller ID is required' }, { status: 400 });
    }

    // Attempt to resolve Lead by phone number
    let lead = await prisma.lead.findFirst({
      where: { phone: fromPhone }
    });

    if (!lead) {
      // In a real system, you might fallback to a default workspace or create a generic lead
      const defaultWorkspace = await prisma.workspace.findFirst();
      const defaultCompany = await prisma.company.findFirst();

      if (defaultWorkspace && defaultCompany) {
        lead = await prisma.lead.create({
          data: {
            name: 'Unknown Caller',
            phone: fromPhone,
            title: 'Unknown',
            workspaceId: defaultWorkspace.id,
            companyId: defaultCompany.id,
            status: 'DISCOVERED'
          }
        });
      } else {
        return NextResponse.json({ error: 'System unconfigured for inbound lead creation' }, { status: 500 });
      }
    }

    // Check opt-out state
    // We didn't add opt-out directly to Lead, but to Call, but we'll assume a lead opt-out check would go here.
    
    // Create Call Record
    const call = await prisma.call.create({
      data: {
        workspaceId: lead.workspaceId,
        leadId: lead.id,
        status: 'RINGING',
        startedAt: new Date()
      }
    });

    // Record CallAttempt
    await prisma.callAttempt.create({
      data: {
        callId: call.id,
        disposition: 'CONNECTED'
      }
    });

    return NextResponse.json({
      message: 'Inbound call registered',
      callId: call.id,
      leadId: lead.id,
      action: 'INITIATE_CONVERSATION'
    });

  } catch (error: any) {
    console.error('Inbound webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

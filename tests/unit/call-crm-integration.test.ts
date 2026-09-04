import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/db/prisma';
import { processCompletedCall, performHumanHandoff } from '@/lib/voice/intelligence';
import { getCRMProvider, DemoCRMProvider } from '@/lib/crm';
import { HERO_SCENARIO_EN } from '@/lib/voice/scenarios';

describe('Call Intelligence, Qualification Update & CRM Push Pipeline', () => {
  it('processes completed call, updates transcript, qualification score and next best action', async () => {
    // Create dedicated test company and lead for isolated test run
    const company = await prisma.company.create({
      data: {
        name: 'ABC Technologies Call Test Corp',
        industry: 'Enterprise Software & IT',
        size: '500-1000',
        location: 'Austin, TX',
      },
    });

    const lead = await prisma.lead.create({
      data: {
        name: 'Marcus Vance',
        title: 'Chief Technology Officer (CTO)',
        email: 'marcus.vance@abctech-test.com',
        companyId: company.id,
        status: 'DISCOVERED',
        intentScore: 90,
        pipelineValue: 150000,
      },
    });

    await prisma.requirement.create({
      data: {
        leadId: lead.id,
        title: 'SharePoint Online Modernization',
        description: 'Enterprise migration of legacy 2016 servers to SharePoint Online',
      },
    });

    // Create a new in-progress call
    const call = await prisma.call.create({
      data: {
        leadId: lead.id,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        sentiment: 'POSITIVE',
        interestLevel: 'HIGH',
      },
    });

    expect(call.id).toBeDefined();

    const sampleTurns = HERO_SCENARIO_EN.turns.map((t) => ({
      id: `turn-${t.turnIndex}`,
      speaker: (t.turnIndex % 2 === 1 ? 'AI' : 'Lead') as any,
      text: t.turnIndex % 2 === 1 ? t.aiStatement : t.leadResponse,
      timestamp: '12:00:00 PM',
      sentiment: 'POSITIVE' as any,
    }));

    // Process completed call
    const result = await processCompletedCall({
      callId: call.id,
      leadId: lead.id,
      durationSeconds: 52,
      turns: sampleTurns,
      scenarioId: 'HIGH_INTENT_SHAREPOINT_EN',
    });

    expect(result.call.status).toBe('COMPLETED');
    expect(result.call.durationSeconds).toBe(52);
    expect(result.analysis.qualificationScore).toBe(92);
    expect(result.analysis.nextBestAction).toContain('scoping call');

    // Verify database updates
    const updatedLead = await prisma.lead.findUnique({
      where: { id: lead.id },
      include: {
        qualifications: true,
        recommendations: true,
        calls: { where: { id: call.id }, include: { transcript: true } },
      },
    });

    expect(updatedLead?.qualificationScore).toBe(92);
    expect(updatedLead?.status).toBe('MEETING');
    expect(updatedLead?.calls[0]?.transcript?.dialogue).toBeDefined();

    const qual = updatedLead?.qualifications[0];
    expect(qual?.overallScore).toBe(92);
    expect(qual?.status).toBe('QUALIFIED');

    const rec = updatedLead?.recommendations.find(
      (r) => r.actionType === 'SCHEDULE_MEETING'
    );
    expect(rec).toBeDefined();
    expect(rec?.title).toContain('scoping call');
    expect(rec?.priority).toBe('HIGH');
  });

  it('CRM Provider successfully synchronizes contact, opportunity, and call attachments', async () => {
    const company = await prisma.company.create({
      data: {
        name: 'ABC Technologies CRM Sync Account',
        industry: 'Enterprise Software & IT',
        size: '500-1000',
        location: 'Austin, TX',
      },
    });

    const lead = await prisma.lead.create({
      data: {
        name: 'Marcus Vance',
        title: 'Chief Technology Officer (CTO)',
        email: 'marcus.vance@abctech-crm.com',
        companyId: company.id,
        status: 'QUALIFIED',
        intentScore: 92,
        pipelineValue: 150000,
      },
    });

    const call = await prisma.call.create({
      data: {
        leadId: lead.id,
        status: 'COMPLETED',
        summary: 'Completed technical qualification session with CTO.',
        durationSeconds: 65,
        sentiment: 'POSITIVE',
      },
    });

    const crmProvider = getCRMProvider();
    expect(crmProvider.name).toContain('CRMProvider');

    const pushResult = await crmProvider.pushToCRM(lead.id, call.id);

    expect(pushResult.success).toBe(true);
    expect(pushResult.status).toBe('SYNCHRONIZED');
    expect(pushResult.contactId).toContain('CRM-CONT-');
    expect(pushResult.opportunityId).toContain('CRM-OPP-');
    expect(pushResult.attachedCallId).toBe(call.id);

    // Verify activity log was persisted
    const activity = await prisma.activityLog.findFirst({
      where: {
        leadId: lead.id,
        action: 'CRM_PUSH_COMPLETED',
      },
      orderBy: { createdAt: 'desc' },
    });

    expect(activity).toBeDefined();
    expect(activity?.details).toContain('Synchronized opportunity to CRM');
  });

  it('performs human handoff cleanly and registers activity log', async () => {
    const company = await prisma.company.create({
      data: {
        name: 'ABC Technologies Handoff Account',
        industry: 'Enterprise Software & IT',
        size: '500-1000',
        location: 'Austin, TX',
      },
    });

    const lead = await prisma.lead.create({
      data: {
        name: 'Marcus Vance',
        title: 'Chief Technology Officer (CTO)',
        email: 'marcus.vance@abctech-handoff.com',
        companyId: company.id,
        status: 'HIGH_INTENT',
        intentScore: 90,
      },
    });

    const handoffRes = await performHumanHandoff({
      leadId: lead.id,
      reason: 'Lead requested direct conversation with solutions engineer',
    });

    expect(handoffRes.success).toBe(true);
    expect(handoffRes.message).toContain('Handoff requested');

    const activity = await prisma.activityLog.findFirst({
      where: {
        leadId: lead.id,
        action: 'HUMAN_HANDOFF_REQUESTED',
      },
      orderBy: { createdAt: 'desc' },
    });

    expect(activity).toBeDefined();
    expect(activity?.details).toContain('transferred to human sales engineer');
  });
});

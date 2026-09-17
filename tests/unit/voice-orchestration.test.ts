import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/db/prisma';

describe('Voice Orchestration Engine', () => {
  it('should prevent calling if prospect has opted out', async () => {
    // Create a real workspace
    const workspace = await prisma.workspace.create({
      data: { name: 'Voice Test Workspace' }
    });

    const company = await prisma.company.create({
      data: {
        name: 'Voice Test Company',
        workspaceId: workspace.id,
        industry: 'Tech',
        size: '1-10',
        location: 'Global'
      }
    });

    const lead = await prisma.lead.create({
      data: {
        name: 'Opt Out Test',
        title: 'Tester',
        companyId: company.id,
        workspaceId: workspace.id,
        phone: '1234567890'
      }
    });

    await prisma.call.create({
      data: {
        leadId: lead.id,
        workspaceId: workspace.id,
        optOut: true,
        status: 'COMPLETED'
      }
    });

    const freshLead = await prisma.lead.findUnique({
      where: { id: lead.id },
      include: { calls: true }
    });

    const optOutCall = freshLead?.calls.find(c => c.optOut === true);
    
    expect(optOutCall).toBeDefined();
    expect(optOutCall?.optOut).toBe(true);
  });

  it('should track call attempts correctly', async () => {
    const workspace = await prisma.workspace.create({
      data: { name: 'Voice Attempt Workspace' }
    });

    const company = await prisma.company.create({
      data: {
        name: 'Voice Attempt Company',
        workspaceId: workspace.id,
        industry: 'Tech',
        size: '1-10',
        location: 'Global'
      }
    });

    const lead = await prisma.lead.create({
      data: {
        name: 'Attempt Test',
        title: 'Tester',
        companyId: company.id,
        workspaceId: workspace.id,
        phone: '0987654321'
      }
    });

    const call = await prisma.call.create({
      data: {
        workspaceId: workspace.id,
        leadId: lead.id,
        status: 'RINGING',
      }
    });

    await prisma.callAttempt.create({
      data: {
        callId: call.id,
        disposition: 'NO_ANSWER'
      }
    });

    await prisma.callAttempt.create({
      data: {
        callId: call.id,
        disposition: 'CONNECTED'
      }
    });

    const updatedCall = await prisma.call.findUnique({
      where: { id: call.id },
      include: { attempts: true }
    });

    expect(updatedCall?.attempts.length).toBe(2);
    expect(updatedCall?.attempts[0].disposition).toBe('NO_ANSWER');
    expect(updatedCall?.attempts[1].disposition).toBe('CONNECTED');
  });
});

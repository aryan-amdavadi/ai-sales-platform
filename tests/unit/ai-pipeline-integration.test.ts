import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/db/prisma';
import { executeSalesIntelligencePipeline, recalculateOpportunityScores, regenerateSalesBrief } from '@/lib/ai';

describe('AI Sales Intelligence Pipeline Integration', () => {
  it('executes full pipeline on hero opportunity and persists results to database', async () => {
    // Locate the ABC Technologies hero lead
    const heroLead = await prisma.lead.findFirst({
      where: { company: { name: 'ABC Technologies' } },
      include: {
        company: true,
        requirements: true,
      },
    });

    expect(heroLead).toBeDefined();
    if (!heroLead) return;

    const { lead, analysisResult } = await executeSalesIntelligencePipeline(heroLead.id);

    // Verify derived scores
    expect(analysisResult.intent.overallScore).toBe(94);
    expect(analysisResult.fit.overallFitScore).toBe(96);
    expect(analysisResult.qualification.overallScore).toBe(92);
    expect(analysisResult.qualification.heatCategory).toBe('HOT');

    // Verify DB persistence
    const reloadedLead = await prisma.lead.findUnique({
      where: { id: heroLead.id },
      include: {
        requirements: true,
        qualifications: true,
        recommendations: true,
        activityLogs: true,
      },
    });

    expect(reloadedLead?.intentScore).toBe(94);
    expect(reloadedLead?.qualificationScore).toBe(92);
    expect(reloadedLead?.urgency).toBe('HIGH');
    expect(reloadedLead?.qualifications.length).toBeGreaterThan(0);
    expect(reloadedLead?.recommendations.length).toBeGreaterThan(0);

    // Verify ActivityLog was created
    const log = reloadedLead?.activityLogs.find((a) => a.action === 'OPPORTUNITY_ANALYZED');
    expect(log).toBeDefined();
    expect(log?.details).toContain('94/100');
  });

  it('regenerates sales brief and logs activity', async () => {
    const heroLead = await prisma.lead.findFirst({
      where: { company: { name: 'ABC Technologies' } },
    });
    if (!heroLead) return;

    const brief = await regenerateSalesBrief(heroLead.id);
    expect(brief.prospect).toBe('Marcus Vance');
    expect(brief.company).toBe('ABC Technologies');
    expect(brief.painPoints.length).toBeGreaterThan(0);
  });
});

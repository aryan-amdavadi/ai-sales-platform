import { describe, it, expect } from 'vitest';
import { LocalDemoAIProvider } from '@/lib/ai/local-demo-provider';
import { HERO_REQUIREMENT } from '@/data/demo/seed-data';

describe('AI Sales Intelligence Engine - Unit Tests', () => {
  const provider = new LocalDemoAIProvider();

  it('extracts problem, solution, technologies, and urgency from raw requirement', async () => {
    const rawText =
      'We are looking for an experienced SharePoint implementation partner to modernize our legacy 2016 server to SharePoint Online and Microsoft 365, develop custom SPFx applications, and deliver user training. Urgent requirement for next 30 days.';

    const analysis = await provider.analyzeRequirement(rawText, {
      companyName: 'ABC Technologies',
      industry: 'Enterprise Software & IT',
      location: 'Austin, TX',
      prospectTitle: 'Chief Technology Officer (CTO)',
    });

    expect(analysis.requestedSolution).toContain('SharePoint');
    expect(analysis.technologies).toContain('SharePoint Online');
    expect(analysis.technologies).toContain('Microsoft 365');
    expect(analysis.urgency).toBe('HIGH');
    expect(analysis.timeline).toContain('30 Days');
    expect(analysis.buyingStage).toBe('VENDOR_SELECTION');
    expect(analysis.decisionMakerProbability).toBeGreaterThanOrEqual(90);
    expect(analysis.requirements.length).toBeGreaterThanOrEqual(4);
  });

  it('computes 8-dimension transparent intent score correctly', async () => {
    const analysis = await provider.analyzeRequirement(HERO_REQUIREMENT.rawEvidence, {
      companyName: HERO_REQUIREMENT.companyName,
      industry: 'Enterprise Software & IT',
      prospectTitle: HERO_REQUIREMENT.contactTitle,
    });

    const intent = await provider.scoreIntent(analysis, {
      sourcePlatform: 'LINKEDIN',
      discoveryDate: new Date(),
    });

    expect(intent.requirementClarity).toBeGreaterThanOrEqual(90);
    expect(intent.urgency).toBe(91);
    expect(intent.timeline).toBe(89);
    expect(intent.solutionFit).toBe(97);
    expect(intent.decisionMaker).toBe(82);
    expect(intent.recency).toBe(98);
    expect(intent.companyFit).toBe(93);
    expect(intent.buyingStage).toBe(95);

    // Hero Intent Score derived deterministically to 94
    expect(intent.overallScore).toBe(94);
    expect(intent.rationale).toBeTruthy();
  });

  it('calculates company and solution fit score with breakdown', async () => {
    const analysis = await provider.analyzeRequirement(HERO_REQUIREMENT.rawEvidence, {
      companyName: HERO_REQUIREMENT.companyName,
      industry: 'Enterprise Software & IT',
    });

    const fit = await provider.calculateFit([], analysis, {
      industry: 'Enterprise Software & IT',
      techStack: 'SharePoint 2016, M365, Azure',
    });

    expect(fit.overallFitScore).toBe(96);
    expect(fit.capabilityMatch).toBe(98);
    expect(fit.industryMatch).toBe(95);
    expect(fit.technologyMatch).toBe(96);
    expect(fit.locationMatch).toBe(95);
    expect(fit.explanation).toContain('96% overall fit');
  });

  it('qualifies lead with BANT dimensions and heat category classification', async () => {
    const analysis = await provider.analyzeRequirement(HERO_REQUIREMENT.rawEvidence, {
      companyName: HERO_REQUIREMENT.companyName,
      industry: 'Enterprise Software & IT',
      prospectTitle: HERO_REQUIREMENT.contactTitle,
    });
    const intent = await provider.scoreIntent(analysis);
    const fit = await provider.calculateFit([], analysis, { industry: 'Enterprise Software & IT' });

    const qualification = await provider.qualifyLead(analysis, intent, fit, {
      prospectName: HERO_REQUIREMENT.contactName,
      prospectTitle: HERO_REQUIREMENT.contactTitle,
      companyName: HERO_REQUIREMENT.companyName,
    });

    expect(qualification.overallScore).toBe(92);
    expect(qualification.heatCategory).toBe('HOT');
    expect(qualification.need).toBe(95);
    expect(qualification.fit).toBe(96);
    expect(qualification.urgency).toBe(91);
    expect(qualification.authority).toBe(94);
    expect(qualification.reasoning).toContain('HOT Lead');
  });

  it('generates context-specific pre-call sales brief with objections', async () => {
    const analysis = await provider.analyzeRequirement(HERO_REQUIREMENT.rawEvidence, {
      companyName: HERO_REQUIREMENT.companyName,
      industry: 'Enterprise Software & IT',
      prospectTitle: HERO_REQUIREMENT.contactTitle,
    });
    const qual = {
      need: 95,
      fit: 96,
      urgency: 91,
      authority: 94,
      timeline: 89,
      engagement: 88,
      overallScore: 92,
      heatCategory: 'HOT' as const,
      reasoning: 'Hot lead',
    };

    const brief = await provider.generateSalesBrief(analysis, qual, {
      prospectName: HERO_REQUIREMENT.contactName,
      prospectTitle: HERO_REQUIREMENT.contactTitle,
      companyName: HERO_REQUIREMENT.companyName,
      industry: 'Enterprise Software & IT',
    });

    expect(brief.prospect).toBe('Marcus Vance');
    expect(brief.company).toBe('ABC Technologies');
    expect(brief.painPoints.length).toBeGreaterThanOrEqual(3);
    expect(brief.likelyObjections.length).toBeGreaterThanOrEqual(2);
    expect(brief.openingStatement).toContain('ABC Technologies');
    expect(brief.questionsToAsk.length).toBeGreaterThanOrEqual(2);
    expect(brief.desiredOutcome).toBeTruthy();
  });

  it('generates next best action with actionable reason bullets', async () => {
    const analysis = await provider.analyzeRequirement(HERO_REQUIREMENT.rawEvidence, {
      companyName: HERO_REQUIREMENT.companyName,
      prospectTitle: HERO_REQUIREMENT.contactTitle,
    });
    const intent = await provider.scoreIntent(analysis);
    const fit = await provider.calculateFit([], analysis, { industry: 'Enterprise Software & IT' });
    const qual = await provider.qualifyLead(analysis, intent, fit, {
      prospectName: HERO_REQUIREMENT.contactName,
      companyName: HERO_REQUIREMENT.companyName,
    });

    const nba = await provider.generateNextBestAction(analysis, intent, fit, qual, {
      prospectName: HERO_REQUIREMENT.contactName,
      companyName: HERO_REQUIREMENT.companyName,
    });

    expect(nba.action).toBe('SCHEDULE_MEETING');
    expect(nba.priority).toBe('HIGH');
    expect(nba.whyPoints.length).toBeGreaterThanOrEqual(3);
    expect(nba.suggestedChannel).toBe('Voice AI');
    expect(nba.suggestedMessage).toContain('Marcus');
  });
});

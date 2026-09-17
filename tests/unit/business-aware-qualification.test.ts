import { describe, it, expect } from 'vitest';
import { LocalDemoAIProvider } from '../../src/lib/ai/local-demo-provider';

describe('Business-Aware AI Qualification Engine', () => {
  it('should preserve the deterministic benchmark for the TechNova hero record', async () => {
    const provider = new LocalDemoAIProvider();
    const result = await provider.runFullPipeline({
      rawText: 'Looking for a certified partner to help us with a critical Microsoft 365 migration from on-premise SharePoint.',
      prospectName: 'John Smith',
      prospectTitle: 'CTO',
      companyName: 'TechNova',
      industry: 'Technology',
      location: 'Austin, TX',
      discoveryDate: new Date(),
    });

    // The hero record should score 94 intent, 97 fit, and 91 urgency
    expect(result.result.intent.overallScore).toBe(94);
    expect(result.result.intent.solutionFit).toBe(97);
    expect(result.result.intent.urgency).toBe(91);
    
    // Trace should be generated
    expect(result.traces.length).toBeGreaterThan(0);
    const intentTrace = result.traces.find(t => t.targetMetric === 'Intent Score');
    expect(intentTrace).toBeDefined();
    expect(intentTrace?.score).toBe(94);
  });

  it('should dynamically calculate scores based on the provided Business Profile', async () => {
    const provider = new LocalDemoAIProvider();
    
    // Same raw requirement
    const rawText = 'We need a new CRM implementation to replace Salesforce before our contract renews next month.';

    // Profile 1: Acme Corp (Manufacturing ERP, not a CRM provider)
    const acmeProfile = {
      name: 'Acme Corp',
      industry: 'Manufacturing',
      description: 'We provide heavy machinery ERP solutions.',
    };

    const acmeIcp = {
      targetIndustries: JSON.stringify(['Manufacturing', 'Industrial']),
    };

    // Profile 2: SalesSpark (CRM SaaS)
    const sparkProfile = {
      name: 'SalesSpark',
      industry: 'Technology',
      description: 'We provide modern CRM implementations and data migrations.',
    };

    const sparkIcp = {
      targetIndustries: JSON.stringify(['Technology', 'SaaS', 'Retail']),
    };
    
    const sparkProducts = [
      { name: 'SalesSpark CRM', description: 'CRM Platform' }
    ];

    const resultAcme = await provider.runFullPipeline({
      rawText,
      prospectName: 'Jane Doe',
      prospectTitle: 'VP of Sales',
      companyName: 'Retail Giant',
      industry: 'Retail',
      location: 'New York, NY',
      businessProfile: acmeProfile,
      icpProfile: acmeIcp,
      productOfferings: [],
    });

    const resultSpark = await provider.runFullPipeline({
      rawText,
      prospectName: 'Jane Doe',
      prospectTitle: 'VP of Sales',
      companyName: 'Retail Giant',
      industry: 'Retail',
      location: 'New York, NY',
      businessProfile: sparkProfile,
      icpProfile: sparkIcp,
      productOfferings: sparkProducts,
    });

    // They should have different Company Fit scores based on the ICP matches
    expect(resultSpark.result.fit.industryMatch).toBeGreaterThan(resultAcme.result.fit.industryMatch);

    // SalesSpark intent should be higher because of the ICP industry match boost (Retail is in Spark's ICP, not Acme's)
    expect(resultSpark.result.intent.overallScore).toBeGreaterThan(resultAcme.result.intent.overallScore);
    
    // Check traces
    const sparkTrace = resultSpark.traces.find(t => t.targetMetric === 'Intent Score');
    expect(sparkTrace?.contributingSignals).toContain('Matched against SalesSpark ICP');
    
    const acmeTrace = resultAcme.traces.find(t => t.targetMetric === 'Intent Score');
    expect(acmeTrace?.contributingSignals).toContain('Matched against Acme Corp ICP');
  });
});

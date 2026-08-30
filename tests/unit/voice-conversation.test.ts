import { describe, it, expect } from 'vitest';
import {
  HERO_SCENARIO_EN,
  HERO_SCENARIO_HI,
  HERO_SCENARIO_GU,
  AVAILABLE_SCENARIOS,
} from '@/lib/voice/scenarios';
import { DemoVoiceProvider } from '@/lib/voice/demo-voice-provider';
import { BrowserVoiceProvider } from '@/lib/voice/browser-voice-provider';
import { getVoiceProvider } from '@/lib/voice';

describe('Voice Providers & Fallback Engine', () => {
  it('DemoVoiceProvider is supported offline in any environment', () => {
    const demoVoice = new DemoVoiceProvider();
    expect(demoVoice.isSupported()).toBe(true);
    expect(demoVoice.name).toBe('DemoVoiceProvider');
  });

  it('BrowserVoiceProvider falls back cleanly when speech synthesis is unavailable', async () => {
    const browserVoice = new BrowserVoiceProvider();
    expect(typeof browserVoice.isSupported()).toBe('boolean');
    // Start and speak should resolve without throw
    await expect(browserVoice.start()).resolves.toBeUndefined();
    await expect(browserVoice.speak('Test speech message', 'en-US')).resolves.toBeUndefined();
    browserVoice.stop();
  });

  it('getVoiceProvider returns a valid voice provider instance', () => {
    const provider = getVoiceProvider();
    expect(provider).toBeDefined();
    expect(typeof provider.speak).toBe('function');
    expect(typeof provider.listen).toBe('function');
    expect(typeof provider.stop).toBe('function');
    expect(typeof provider.isSupported).toBe('function');
  });
});

describe('Multilingual Scenarios & Deterministic Hero Call', () => {
  it('supports English, Hindi, and Gujarati scenarios', () => {
    expect(AVAILABLE_SCENARIOS['en-US']).toBeDefined();
    expect(AVAILABLE_SCENARIOS['hi-IN']).toBeDefined();
    expect(AVAILABLE_SCENARIOS['gu-IN']).toBeDefined();
  });

  it('verifies deterministic English hero scenario dialogue and signals', () => {
    const hero = HERO_SCENARIO_EN;
    expect(hero.id).toBe('HIGH_INTENT_SHAREPOINT_EN');
    expect(hero.prospectName).toBe('Marcus Vance');
    expect(hero.prospectTitle).toContain('CTO');
    expect(hero.companyName).toBe('ABC Technologies');
    expect(hero.turns.length).toBe(4);

    // AI Disclosure check
    expect(hero.turns[0].aiStatement).toContain("I'm the AI sales assistant from IntentOS");
    expect(hero.turns[0].aiStatement).toContain('SharePoint implementation requirement');

    // Turn 1
    expect(hero.turns[0].leadResponse).toContain('currently evaluating implementation partners');
    expect(hero.turns[0].signals.interest).toBe('HIGH');
    expect(hero.turns[0].signals.buyingStage).toBe('Vendor Selection');

    // Turn 2: Objection & Pain point
    expect(hero.turns[1].aiStatement).toContain('biggest challenge');
    expect(hero.turns[1].leadResponse).toContain('legacy migration is the biggest concern');
    expect(hero.turns[1].signals.painPoint).toContain('Legacy SharePoint 2016');

    // Turn 3: Timeline
    expect(hero.turns[2].aiStatement).toContain('What timeline are you working with');
    expect(hero.turns[2].leadResponse).toContain('within 30 days');
    expect(hero.turns[2].signals.timeline).toContain('30 Days');

    // Turn 4: Next Action Agreement
    expect(hero.turns[3].aiStatement).toContain('technical discussion with an implementation specialist');
    expect(hero.turns[3].leadResponse).toContain("we'd be interested in that");
    expect(hero.turns[3].signals.interest).toBe('EXTREME');
  });

  it('verifies Hindi and Gujarati scenarios match the qualification structure', () => {
    const hi = HERO_SCENARIO_HI;
    expect(hi.turns.length).toBe(4);
    expect(hi.turns[0].aiStatement).toContain('IntentOS का AI सेल्स असिस्टेंट');

    const gu = HERO_SCENARIO_GU;
    expect(gu.turns.length).toBe(4);
    expect(gu.turns[0].aiStatement).toContain('IntentOS નો AI સેલ્સ આસિસ્ટન્ટ');
  });
});

describe('Conversation Intelligence & Signals Extraction', () => {
  it('extracts hot qualification score, pain points, objections, and next best action', () => {
    const analysis = HERO_SCENARIO_EN.finalAnalysis;
    expect(analysis.qualificationScore).toBe(92);
    expect(analysis.interestLevel).toBe('HIGH');
    expect(analysis.timeline).toBe('30 days');
    expect(analysis.decisionMaker).toContain('CTO Marcus Vance');
    expect(analysis.painPoints.length).toBeGreaterThanOrEqual(1);
    expect(analysis.painPoints.some((p) => p.includes('SharePoint 2016'))).toBe(true);
    expect(analysis.objections.some((o) => o.includes('downtime'))).toBe(true);
    expect(analysis.nextBestAction).toBe('Schedule a technical discovery meeting within 48 hours.');
    expect(analysis.actionPriority).toBe('HIGH');
  });
});

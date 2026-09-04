import { describe, it, expect } from 'vitest';
import {
  SEED_COMPANIES,
  HERO_REQUIREMENT,
  RAW_SAMPLE_REQUIREMENTS,
} from '@/data/demo/seed-data';

describe('Seed Data Verification', () => {
  it('contains at least 20 seed companies across at least 10 industries', () => {
    expect(SEED_COMPANIES.length).toBeGreaterThanOrEqual(20);
    const industries = new Set(SEED_COMPANIES.map((c) => c.industry));
    expect(industries.size).toBeGreaterThanOrEqual(10);
  });

  it('contains the mandatory Hero Record: TechNova Solutions (CTO John Smith)', () => {
    const heroCompany = SEED_COMPANIES.find((c) => c.name === 'TechNova Solutions');
    expect(heroCompany).toBeDefined();
    expect(heroCompany?.name).toBe('TechNova Solutions');

    expect(HERO_REQUIREMENT.contactName).toBe('John Smith');
    expect(HERO_REQUIREMENT.contactTitle).toBe('Chief Technology Officer (CTO)');
    expect(HERO_REQUIREMENT.intentScore).toBe(94);
    expect(HERO_REQUIREMENT.requirementTitle).toContain('SharePoint');

    // Requirements list verification
    expect(HERO_REQUIREMENT.tags).toEqual(
      expect.arrayContaining([
        'SharePoint Online',
        'Microsoft 365',
        'legacy migration',
        'custom application development',
        'user training',
        'post-go-live support',
      ])
    );
  });

  it('contains rich sample public requirements', () => {
    expect(RAW_SAMPLE_REQUIREMENTS.length).toBeGreaterThanOrEqual(9);
    for (const req of RAW_SAMPLE_REQUIREMENTS) {
      expect(req.companyName).toBeTruthy();
      expect(req.contactName).toBeTruthy();
      expect(req.requirementTitle).toBeTruthy();
      expect(req.intentScore).toBeGreaterThanOrEqual(50);
      expect(req.rawEvidence).toBeTruthy();
    }
  });
});

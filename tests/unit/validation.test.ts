import { describe, it, expect } from 'vitest';
import { LeadFilterSchema, OnboardingSchema, CreateCampaignSchema } from '@/lib/validation';

describe('Validation Schemas', () => {
  it('validates default lead filter parameters correctly', () => {
    const parsed = LeadFilterSchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.sortBy).toBe('intent');
      expect(parsed.data.sortOrder).toBe('desc');
      expect(parsed.data.limit).toBe(50);
      expect(parsed.data.offset).toBe(0);
    }
  });

  it('validates custom filter values', () => {
    const parsed = LeadFilterSchema.safeParse({
      search: 'SharePoint',
      minIntent: 75,
      industry: 'Enterprise Cloud Services',
      sortBy: 'newest',
      sortOrder: 'asc',
      limit: 100,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.search).toBe('SharePoint');
      expect(parsed.data.minIntent).toBe(75);
      expect(parsed.data.industry).toBe('Enterprise Cloud Services');
      expect(parsed.data.sortBy).toBe('newest');
      expect(parsed.data.sortOrder).toBe('asc');
    }
  });

  it('validates onboarding schema correctly', () => {
    const validOnboarding = {
      companyName: 'IntentOS Labs',
      website: 'https://intentos.ai',
      products: ['AI Sales Copilot', 'Voice Ingestion'],
      targetIndustries: ['Enterprise Cloud Services'],
      targetLocations: ['United States'],
      idealCustomerProfile: 'VP of Engineering at mid-to-large enterprises.',
    };
    const parsed = OnboardingSchema.safeParse(validOnboarding);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid onboarding payloads with missing fields', () => {
    const invalidOnboarding = {
      companyName: '',
      website: 'not-a-url',
      products: [],
      targetIndustries: [],
      targetLocations: [],
      idealCustomerProfile: 'Too short',
    };
    const parsed = OnboardingSchema.safeParse(invalidOnboarding);
    expect(parsed.success).toBe(false);
  });

  it('validates campaign creation schema', () => {
    const validCampaign = {
      name: 'M365 Migration Outbound',
      targetAudience: 'CTOs in Cloud Services',
      channels: 'Voice AI, Email',
    };
    const parsed = CreateCampaignSchema.safeParse(validCampaign);
    expect(parsed.success).toBe(true);
  });
});

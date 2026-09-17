import { describe, it, expect, vi } from 'vitest';
import { executeEnrichmentPipeline, MockClearbitProvider } from '../../src/lib/enrichment/enrichment-provider';
import { prisma } from '../../src/lib/db/prisma';

// Mock Prisma
vi.mock('../../src/lib/db/prisma', () => ({
  prisma: {
    lead: {
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    company: {
      update: vi.fn(),
    },
    leadFieldProvenance: {
      upsert: vi.fn(),
    }
  }
}));

describe('Enrichment Provider', () => {
  it('should not overwrite high-confidence fields with low-confidence fields', async () => {
    // Setup existing high-confidence data
    (prisma.lead.findUnique as any).mockResolvedValue({
      id: 'lead-1',
      workspaceId: 'ws-1',
      name: 'John Doe',
      email: 'john@acmecorp.com',
      companyId: 'comp-1',
      company: {
        id: 'comp-1',
        domain: 'acmecorp.com',
        industry: 'Defense', // User verified
      },
      provenance: [
        { fieldName: 'industry', sourceName: 'User Input', confidence: 100, inferred: false }
      ]
    });

    (prisma.lead.findMany as any).mockResolvedValue([]); // No duplicates

    const provider = new MockClearbitProvider();
    await executeEnrichmentPipeline('lead-1', provider);

    // Verify upsert was NOT called for 'industry' because existing confidence (100) > new confidence (95)
    const upsertCalls = (prisma.leadFieldProvenance.upsert as any).mock.calls;
    const industryUpsert = upsertCalls.find((call: any) => call[0].where.leadId_fieldName.fieldName === 'industry');
    
    expect(industryUpsert).toBeUndefined();
  });

  it('should detect duplicates by email', async () => {
    (prisma.lead.findUnique as any).mockResolvedValue({
      id: 'lead-new',
      workspaceId: 'ws-1',
      name: 'Duplicate John',
      email: 'john@acmecorp.com',
      companyId: 'comp-1',
      company: { id: 'comp-1', domain: 'acmecorp.com' },
      provenance: []
    });

    // Mock existing duplicate
    (prisma.lead.findMany as any).mockResolvedValue([
      { id: 'lead-old', email: 'john@acmecorp.com' }
    ]);

    const provider = new MockClearbitProvider();
    await executeEnrichmentPipeline('lead-new', provider);

    // Expect the lead to be flagged with duplicateScore
    const updateCalls = (prisma.lead.update as any).mock.calls;
    const dupFlagCall = updateCalls.find((call: any) => call[0].data.duplicateScore === 100);
    
    expect(dupFlagCall).toBeDefined();
  });
});

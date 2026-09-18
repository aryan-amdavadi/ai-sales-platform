import DashboardPage from '@/app/dashboard/page';
import { prisma } from '@/lib/db/prisma';
import { safeDecode } from 'better-auth';
import { addAbortListener } from 'events';
import { addAbortSignal } from 'stream';
import { ad } from 'vitest/dist/chunks/reporters.d.BuRON0I0.js';

export interface EnrichmentResult {
  fieldName: string;
  value: string;
  sourceName: string;
  sourceUrl?: string;
  confidence: number;
  inferred: boolean;
}

export interface EnrichmentProvider {
  enrichLead(leadId: string, leadData: any, companyData: any): Promise<EnrichmentResult[]>;
}

export class MockClearbitProvider implements EnrichmentProvider {
  async enrichLead(leadId: string, leadData: any, companyData: any): Promise<EnrichmentResult[]> {
    const results: EnrichmentResult[] = [];

    // Mock enrichment logic based on the domain or email
    const emailDomain = leadData.email?.split('@')[1] || companyData.domain;

    if (!leadData.linkedinUrl) {
      results.push({
        fieldName: 'linkedinUrl',
        value: `https://linkedin.com/in/${leadData.name.toLowerCase().replace(/\s+/g, '-')}`,
        sourceName: 'Clearbit',
        confidence: 90,
        inferred: true
      });
    }

    if (!companyData.industry || companyData.industry === 'Unknown') {
      results.push({
        fieldName: 'industry',
        value: emailDomain === 'acmecorp.com' ? 'Manufacturing' : 'Software',
        sourceName: 'Clearbit',
        confidence: 95,
        inferred: false
      });
    }

    if (!companyData.size || companyData.size === 'Unknown') {
      results.push({
        fieldName: 'size',
        value: '50-200',
        sourceName: 'Clearbit',
        confidence: 85,
        inferred: false
      });
    }

    if (!companyData.location || companyData.location === 'Unknown') {
      results.push({
        fieldName: 'location',
        value: 'San Francisco, CA',
        sourceName: 'Clearbit',
        confidence: 95,
        inferred: false
      });
    }

    if (!companyData.domain && emailDomain) {
      results.push({
        fieldName: 'domain',
        value: emailDomain,
        sourceName: 'Inferred from Email',
        confidence: 99,
        inferred: true
      });
    }

    if (!companyData.techStack) {
      results.push({
        fieldName: 'techStack',
        value: 'React, Node.js, AWS, Postgres',
        sourceName: 'Wappalyzer (Mock)',
        confidence: 80,
        inferred: true
      });
    }

    return results;
  }
}

/**
 * Normalizes, enriches, deduplicates, and saves a lead.
 */
export async function executeEnrichmentPipeline(leadId: string, provider: EnrichmentProvider = new MockClearbitProvider()) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      company: true,
      provenance: true
    }
  });

  if (!lead) throw new Error("Lead not found");

  // NORMALIZE
  const normalizedName = lead.name.trim();
  const normalizedEmail = lead.email?.trim().toLowerCase() || null;

  if (lead.name !== normalizedName || lead.email !== normalizedEmail) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { name: normalizedName, email: normalizedEmail }
    });
  }

  // DEDUPLICATE Check (Simulated for pipeline execution)
  // Check for duplicate emails in the same workspace
  if (normalizedEmail) {
    const duplicates = await prisma.lead.findMany({
      where: {
        workspaceId: lead.workspaceId,
        email: normalizedEmail,
        id: { not: lead.id }
      }
    });

    if (duplicates.length > 0) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { duplicateScore: 100 }
      });
    }
  }

  // ENRICH
  const enrichmentData = await provider.enrichLead(leadId, lead, lead.company);

  const leadUpdateData: any = { enrichmentStatus: 'ENRICHED', isVerified: true };
  const companyUpdateData: any = {};

  for (const field of enrichmentData) {
    // Only update if we don't already have high confidence data for this field
    const existingProvenance = lead.provenance.find(p => p.fieldName === field.fieldName);

    if (!existingProvenance || existingProvenance.confidence <= field.confidence) {
      // Upsert provenance
      await prisma.leadFieldProvenance.upsert({
        where: {
          leadId_fieldName: {
            leadId: lead.id,
            fieldName: field.fieldName
          }
        },
        create: {
          leadId: lead.id,
          fieldName: field.fieldName,
          sourceName: field.sourceName,
          sourceUrl: field.sourceUrl,
          confidence: field.confidence,
          inferred: field.inferred
        },
        update: {
          sourceName: field.sourceName,
          sourceUrl: field.sourceUrl,
          confidence: field.confidence,
          inferred: field.inferred
        }
      });

      // Update actual data model
      if (['linkedinUrl', 'email', 'phone', 'title', 'name'].includes(field.fieldName)) {
        leadUpdateData[field.fieldName] = field.value;
      } else if (['industry', 'size', 'location', 'domain', 'techStack', 'hiringSignals', 'fundingSignals', 'growthSignals'].includes(field.fieldName)) {
        companyUpdateData[field.fieldName] = field.value;
      }
    }
  }

  // Save enriched data back
  if (Object.keys(companyUpdateData).length > 0) {
    await prisma.company.update({
      where: { id: lead.companyId },
      data: companyUpdateData
    });
  }

  await prisma.lead.update({
    where: { id: lead.id },
    data: leadUpdateData
  });

  return { success: true };
}

import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

export interface AudienceCriteria {
  workspaceId: string;
  minIntentScore?: number;
  minQualificationScore?: number;
  industries?: string[];
  locations?: string[];
}

export async function matchAudience(criteria: AudienceCriteria) {
  const where: Prisma.LeadWhereInput = {
    workspaceId: criteria.workspaceId,
  };

  if (criteria.minIntentScore !== undefined) {
    where.intentScore = { gte: criteria.minIntentScore };
  }

  if (criteria.minQualificationScore !== undefined) {
    where.qualificationScore = { gte: criteria.minQualificationScore };
  }

  // If industries or locations are provided, we filter based on the related Company
  if ((criteria.industries && criteria.industries.length > 0) || (criteria.locations && criteria.locations.length > 0)) {
    const companyWhere: Prisma.CompanyWhereInput = {};
    if (criteria.industries && criteria.industries.length > 0) {
      companyWhere.industry = { in: criteria.industries };
    }
    if (criteria.locations && criteria.locations.length > 0) {
      companyWhere.location = { in: criteria.locations };
    }
    where.company = companyWhere;
  }

  return prisma.lead.findMany({
    where,
    select: { id: true }
  });
}

export async function getAudienceEstimate(criteria: AudienceCriteria): Promise<number> {
  const where: Prisma.LeadWhereInput = {
    workspaceId: criteria.workspaceId,
    status: { notIn: ['CONVERTED', 'UNQUALIFIED'] },
  };

  if (criteria.minIntentScore !== undefined) {
    where.intentScore = { gte: criteria.minIntentScore };
  }

  if (criteria.minQualificationScore !== undefined) {
    where.qualificationScore = { gte: criteria.minQualificationScore };
  }

  if ((criteria.industries && criteria.industries.length > 0) || (criteria.locations && criteria.locations.length > 0)) {
    const companyWhere: Prisma.CompanyWhereInput = {};
    if (criteria.industries && criteria.industries.length > 0) {
      companyWhere.industry = { in: criteria.industries };
    }
    if (criteria.locations && criteria.locations.length > 0) {
      companyWhere.location = { in: criteria.locations };
    }
    where.company = companyWhere;
  }

  return prisma.lead.count({ where });
}

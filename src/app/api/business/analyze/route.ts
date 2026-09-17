import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { analyzeBusinessContext, BusinessContextPayload } from '@/lib/ai/business-understanding';

export async function POST() {
  try {
    const workspace = await prisma.workspace.findFirst({
      include: {
        businessProfile: true,
        products: true,
        icpProfile: true,
        knowledgeDocuments: true,
      }
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const payload: BusinessContextPayload = {
      businessProfile: workspace.businessProfile,
      products: workspace.products,
      icpProfile: workspace.icpProfile,
      knowledgeDocuments: workspace.knowledgeDocuments,
    };

    const capabilities = await analyzeBusinessContext(payload);

    const businessCapability = await prisma.businessCapability.upsert({
      where: { workspaceId: workspace.id },
      update: {
        normalizedCapabilities: JSON.stringify(capabilities.normalizedCapabilities),
        targetIndustries: JSON.stringify(capabilities.targetIndustries),
        targetRoles: JSON.stringify(capabilities.targetRoles),
        keywords: JSON.stringify(capabilities.keywords),
        negativeKeywords: JSON.stringify(capabilities.negativeKeywords),
        qualificationCriteria: JSON.stringify(capabilities.qualificationCriteria),
      },
      create: {
        workspaceId: workspace.id,
        normalizedCapabilities: JSON.stringify(capabilities.normalizedCapabilities),
        targetIndustries: JSON.stringify(capabilities.targetIndustries),
        targetRoles: JSON.stringify(capabilities.targetRoles),
        keywords: JSON.stringify(capabilities.keywords),
        negativeKeywords: JSON.stringify(capabilities.negativeKeywords),
        qualificationCriteria: JSON.stringify(capabilities.qualificationCriteria),
      }
    });

    return NextResponse.json(businessCapability);
  } catch (error) {
    console.error('Failed to analyze business:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

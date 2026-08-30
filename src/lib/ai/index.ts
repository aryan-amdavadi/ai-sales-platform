import { prisma } from '@/lib/db/prisma';
import { AIProvider } from './provider';
import { LocalDemoAIProvider } from './local-demo-provider';
import { OllamaProvider } from './ollama-provider';
import { FullAnalysisResult, SalesBrief } from '@/types/ai';

export * from './provider';
export * from './local-demo-provider';
export * from './ollama-provider';

export function getAIProvider(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || 'demo').toLowerCase();
  if (providerType === 'ollama') {
    return new OllamaProvider();
  }
  return new LocalDemoAIProvider();
}

export async function executeSalesIntelligencePipeline(leadId: string): Promise<{
  lead: any;
  analysisResult: FullAnalysisResult;
}> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      company: {
        include: {
          insights: true,
        },
      },
      source: true,
      requirements: true,
      qualifications: true,
      recommendations: true,
    },
  });

  if (!lead) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }

  const provider = getAIProvider();
  const rawRequirementText =
    lead.requirements[0]?.rawEvidence ||
    lead.requirements[0]?.description ||
    lead.requirements[0]?.title ||
    `${lead.company.name} is looking for enterprise partners to implement modern cloud and data architectures.`;

  // Run full intelligence pipeline
  const analysisResult = await provider.runFullPipeline({
    rawText: rawRequirementText,
    prospectName: lead.name,
    prospectTitle: lead.title,
    companyName: lead.company.name,
    industry: lead.company.industry,
    location: lead.company.location,
    techStack: lead.company.techStack || undefined,
    hiringSignals: lead.company.hiringSignals || undefined,
    fundingSignals: lead.company.fundingSignals || undefined,
    growthSignals: lead.company.growthSignals || undefined,
    sourcePlatform: lead.source?.platform || undefined,
    sourceUrl: lead.source?.sourceUrl || undefined,
    discoveryDate: lead.discoveredAt,
    pipelineValue: lead.pipelineValue,
  });

  // 1. Update Lead
  const salesBriefFormatted = typeof analysisResult.salesBrief === 'string'
    ? analysisResult.salesBrief
    : JSON.stringify(analysisResult.salesBrief);

  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      intentScore: analysisResult.intent.overallScore,
      qualificationScore: analysisResult.qualification.overallScore,
      urgency: analysisResult.analysis.urgency,
      salesBrief: salesBriefFormatted,
      status: analysisResult.intent.overallScore >= 80 && lead.status === 'DISCOVERED' ? 'HIGH_INTENT' : lead.status,
    },
  });

  // 2. Update Primary Requirement
  if (lead.requirements.length > 0) {
    await prisma.requirement.update({
      where: { id: lead.requirements[0].id },
      data: {
        category: analysisResult.analysis.requestedSolution,
        tags: JSON.stringify(analysisResult.analysis.requirements),
        timeframe: analysisResult.analysis.timeline,
        budgetEstimate: analysisResult.analysis.budget,
        confidenceScore: analysisResult.evidence.confidence,
      },
    });
  }

  // 3. Upsert Qualification
  if (lead.qualifications.length > 0) {
    await prisma.qualification.update({
      where: { id: lead.qualifications[0].id },
      data: {
        budgetFit: analysisResult.qualification.need,
        authorityFit: analysisResult.qualification.authority,
        needFit: analysisResult.qualification.need,
        timingFit: analysisResult.qualification.timeline,
        overallScore: analysisResult.qualification.overallScore,
        reasoning: analysisResult.qualification.reasoning,
        summary: analysisResult.fit.explanation,
        status: analysisResult.qualification.heatCategory === 'HOT' ? 'QUALIFIED' : 'QUALIFIED',
      },
    });
  } else {
    await prisma.qualification.create({
      data: {
        leadId: lead.id,
        budgetFit: analysisResult.qualification.need,
        authorityFit: analysisResult.qualification.authority,
        needFit: analysisResult.qualification.need,
        timingFit: analysisResult.qualification.timeline,
        overallScore: analysisResult.qualification.overallScore,
        reasoning: analysisResult.qualification.reasoning,
        summary: analysisResult.fit.explanation,
        status: 'QUALIFIED',
      },
    });
  }

  // 4. Upsert Recommendation (Next Best Action)
  if (lead.recommendations.length > 0) {
    await prisma.recommendation.update({
      where: { id: lead.recommendations[0].id },
      data: {
        actionType: analysisResult.nextBestAction.action,
        title: analysisResult.nextBestAction.title,
        rationale: analysisResult.nextBestAction.rationale,
        priority: analysisResult.nextBestAction.priority,
        suggestedChannel: analysisResult.nextBestAction.suggestedChannel,
        suggestedMessage: analysisResult.nextBestAction.suggestedMessage,
      },
    });
  } else {
    await prisma.recommendation.create({
      data: {
        leadId: lead.id,
        actionType: analysisResult.nextBestAction.action,
        title: analysisResult.nextBestAction.title,
        rationale: analysisResult.nextBestAction.rationale,
        priority: analysisResult.nextBestAction.priority,
        suggestedChannel: analysisResult.nextBestAction.suggestedChannel,
        suggestedMessage: analysisResult.nextBestAction.suggestedMessage,
      },
    });
  }

  // 5. Create ActivityLog
  await prisma.activityLog.create({
    data: {
      leadId: lead.id,
      action: 'OPPORTUNITY_ANALYZED',
      details: `AI Intelligence completed: Intent Score ${analysisResult.intent.overallScore}/100, Fit ${analysisResult.fit.overallFitScore}%, Qualification ${analysisResult.qualification.overallScore}% (${analysisResult.qualification.heatCategory}).`,
      metadata: JSON.stringify({
        intent: analysisResult.intent,
        fit: analysisResult.fit,
        qualification: analysisResult.qualification,
        nextAction: analysisResult.nextBestAction,
      }),
    },
  });

  return {
    lead: updatedLead,
    analysisResult,
  };
}

export async function recalculateOpportunityScores(leadId: string): Promise<FullAnalysisResult> {
  const result = await executeSalesIntelligencePipeline(leadId);
  return result.analysisResult;
}

export async function regenerateSalesBrief(leadId: string): Promise<SalesBrief> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      company: true,
      requirements: true,
      qualifications: true,
    },
  });

  if (!lead) throw new Error('Lead not found');

  const provider = getAIProvider();
  const rawText = lead.requirements[0]?.rawEvidence || lead.requirements[0]?.description || lead.requirements[0]?.title || '';

  const analysis = await provider.analyzeRequirement(rawText, {
    companyName: lead.company.name,
    industry: lead.company.industry,
    location: lead.company.location,
    prospectTitle: lead.title,
  });

  const qualResult = {
    need: 95,
    fit: 96,
    urgency: 91,
    authority: 90,
    timeline: 89,
    engagement: 88,
    overallScore: lead.qualificationScore,
    heatCategory: (lead.qualificationScore >= 85 ? 'HOT' : 'WARM') as any,
    reasoning: 'Updated qualification',
  };

  const brief = await provider.generateSalesBrief(analysis, qualResult, {
    prospectName: lead.name,
    prospectTitle: lead.title,
    companyName: lead.company.name,
    industry: lead.company.industry,
    techStack: lead.company.techStack || undefined,
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      salesBrief: JSON.stringify(brief),
    },
  });

  await prisma.activityLog.create({
    data: {
      leadId: lead.id,
      action: 'SALES_BRIEF_GENERATED',
      details: `Generated contextual pre-call sales brief and objection strategies for ${lead.name} at ${lead.company.name}.`,
    },
  });

  return brief;
}

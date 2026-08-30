import {
  RequirementAnalysis,
  IntentScoreBreakdown,
  EvidenceAnalysis,
  CompanyFitAnalysis,
  QualificationResult,
  SalesBrief,
  NextBestAction,
  FullAnalysisResult,
} from '@/types/ai';

export interface AIProvider {
  name: string;

  analyzeRequirement(
    rawText: string,
    context?: {
      companyName?: string;
      industry?: string;
      location?: string;
      prospectTitle?: string;
    }
  ): Promise<RequirementAnalysis>;

  scoreIntent(
    analysis: RequirementAnalysis,
    context?: {
      sourcePlatform?: string;
      discoveryDate?: Date | string;
      companySize?: string;
    }
  ): Promise<IntentScoreBreakdown>;

  generateEvidence(
    analysis: RequirementAnalysis,
    intent: IntentScoreBreakdown,
    context?: {
      sourcePlatform?: string;
      sourceUrl?: string;
      discoveryDate?: Date | string;
      hiringSignals?: string;
      techStack?: string;
    }
  ): Promise<EvidenceAnalysis>;

  calculateFit(
    productOfferings: Array<{ name: string; description: string; valueProps?: string }>,
    analysis: RequirementAnalysis,
    companyContext: {
      industry?: string;
      techStack?: string;
      location?: string;
    }
  ): Promise<CompanyFitAnalysis>;

  qualifyLead(
    analysis: RequirementAnalysis,
    intent: IntentScoreBreakdown,
    fit: CompanyFitAnalysis,
    context: {
      prospectName?: string;
      prospectTitle?: string;
      companyName?: string;
      pipelineValue?: number;
    }
  ): Promise<QualificationResult>;

  generateSalesBrief(
    analysis: RequirementAnalysis,
    qualification: QualificationResult,
    context: {
      prospectName: string;
      prospectTitle: string;
      companyName: string;
      industry: string;
      techStack?: string;
    }
  ): Promise<SalesBrief>;

  generateNextBestAction(
    analysis: RequirementAnalysis,
    intent: IntentScoreBreakdown,
    fit: CompanyFitAnalysis,
    qualification: QualificationResult,
    context: {
      prospectName: string;
      companyName: string;
    }
  ): Promise<NextBestAction>;

  runFullPipeline(params: {
    rawText: string;
    prospectName: string;
    prospectTitle: string;
    companyName: string;
    industry: string;
    location: string;
    techStack?: string;
    hiringSignals?: string;
    fundingSignals?: string;
    growthSignals?: string;
    sourcePlatform?: string;
    sourceUrl?: string;
    discoveryDate?: Date | string;
    pipelineValue?: number;
    productOfferings?: Array<{ name: string; description: string; valueProps?: string }>;
  }): Promise<FullAnalysisResult>;
}

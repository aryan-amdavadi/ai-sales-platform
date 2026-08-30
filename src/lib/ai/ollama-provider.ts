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
import { AIProvider } from './provider';
import { LocalDemoAIProvider } from './local-demo-provider';

export class OllamaProvider implements AIProvider {
  name = 'OllamaProvider';
  private fallbackProvider = new LocalDemoAIProvider();
  private host: string;
  private model: string;

  constructor(host = process.env.OLLAMA_HOST || 'http://localhost:11434', model = process.env.OLLAMA_MODEL || 'llama3') {
    this.host = host;
    this.model = model;
  }

  private async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.host}/api/tags`, {
        signal: AbortSignal.timeout(1000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async analyzeRequirement(
    rawText: string,
    context?: { companyName?: string; industry?: string; location?: string; prospectTitle?: string }
  ): Promise<RequirementAnalysis> {
    const available = await this.isAvailable();
    if (!available) {
      return this.fallbackProvider.analyzeRequirement(rawText, context);
    }
    // If Ollama is available, we could call Ollama /api/generate; for zero-failure resilience fallback to structured local engine
    return this.fallbackProvider.analyzeRequirement(rawText, context);
  }

  async scoreIntent(
    analysis: RequirementAnalysis,
    context?: { sourcePlatform?: string; discoveryDate?: Date | string; companySize?: string }
  ): Promise<IntentScoreBreakdown> {
    return this.fallbackProvider.scoreIntent(analysis, context);
  }

  async generateEvidence(
    analysis: RequirementAnalysis,
    intent: IntentScoreBreakdown,
    context?: {
      sourcePlatform?: string;
      sourceUrl?: string;
      discoveryDate?: Date | string;
      hiringSignals?: string;
      techStack?: string;
    }
  ): Promise<EvidenceAnalysis> {
    return this.fallbackProvider.generateEvidence(analysis, intent, context);
  }

  async calculateFit(
    productOfferings: Array<{ name: string; description: string; valueProps?: string }>,
    analysis: RequirementAnalysis,
    companyContext: { industry?: string; techStack?: string; location?: string }
  ): Promise<CompanyFitAnalysis> {
    return this.fallbackProvider.calculateFit(productOfferings, analysis, companyContext);
  }

  async qualifyLead(
    analysis: RequirementAnalysis,
    intent: IntentScoreBreakdown,
    fit: CompanyFitAnalysis,
    context: { prospectName?: string; prospectTitle?: string; companyName?: string; pipelineValue?: number }
  ): Promise<QualificationResult> {
    return this.fallbackProvider.qualifyLead(analysis, intent, fit, context);
  }

  async generateSalesBrief(
    analysis: RequirementAnalysis,
    qualification: QualificationResult,
    context: { prospectName: string; prospectTitle: string; companyName: string; industry: string; techStack?: string }
  ): Promise<SalesBrief> {
    return this.fallbackProvider.generateSalesBrief(analysis, qualification, context);
  }

  async generateNextBestAction(
    analysis: RequirementAnalysis,
    intent: IntentScoreBreakdown,
    fit: CompanyFitAnalysis,
    qualification: QualificationResult,
    context: { prospectName: string; companyName: string }
  ): Promise<NextBestAction> {
    return this.fallbackProvider.generateNextBestAction(analysis, intent, fit, qualification, context);
  }

  async runFullPipeline(params: any): Promise<FullAnalysisResult> {
    return this.fallbackProvider.runFullPipeline(params);
  }
}

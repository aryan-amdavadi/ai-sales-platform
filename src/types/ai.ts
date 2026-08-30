export interface RequirementAnalysis {
  problem: string;
  requestedSolution: string;
  requirements: string[];
  technologies: string[];
  industry: string;
  location: string;
  budget: string;
  timeline: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';
  buyingStage: 'PROBLEM_AWARE' | 'EVALUATION' | 'VENDOR_SELECTION' | 'RFP_ISSUED' | 'DECISION';
  decisionMakerProbability: number;
}

export interface IntentScoreBreakdown {
  requirementClarity: number;
  urgency: number;
  timeline: number;
  solutionFit: number;
  decisionMaker: number;
  recency: number;
  companyFit: number;
  buyingStage: number;
  overallScore: number;
  rationale: string;
}

export interface EvidenceAnalysis {
  keyPoints: string[];
  whyNowSignals: string[];
  rawEvidenceSnippet: string;
  source: string;
  sourceUrl?: string;
  discoveryDate: string;
  confidence: number;
}

export interface CompanyFitAnalysis {
  capabilityMatch: number;
  industryMatch: number;
  technologyMatch: number;
  locationMatch: number;
  overallFitScore: number;
  explanation: string;
}

export interface QualificationResult {
  need: number;
  fit: number;
  urgency: number;
  authority: number;
  timeline: number;
  engagement: number;
  overallScore: number;
  heatCategory: 'HOT' | 'WARM' | 'POTENTIAL' | 'LOW';
  reasoning: string;
}

export interface SalesBrief {
  prospect: string;
  role: string;
  company: string;
  whyTheyMatter: string;
  painPoints: string[];
  likelyObjections: Array<{
    objection: string;
    counterStrategy: string;
  }>;
  recommendedPositioning: string;
  openingStatement: string;
  questionsToAsk: string[];
  desiredOutcome: string;
}

export interface NextBestAction {
  action:
    | 'SCHEDULE_MEETING'
    | 'CALL_IMMEDIATELY'
    | 'SEND_PROPOSAL'
    | 'REQUEST_REQUIREMENTS'
    | 'FOLLOW_UP_LATER'
    | 'HUMAN_HANDOFF'
    | 'DO_NOT_CONTACT';
  title: string;
  whyPoints: string[];
  rationale: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedChannel: string;
  suggestedMessage: string;
}

export interface FullAnalysisResult {
  analysis: RequirementAnalysis;
  intent: IntentScoreBreakdown;
  evidence: EvidenceAnalysis;
  fit: CompanyFitAnalysis;
  qualification: QualificationResult;
  salesBrief: SalesBrief;
  nextBestAction: NextBestAction;
}

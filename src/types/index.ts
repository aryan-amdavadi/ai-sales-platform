export type LeadStatus =
  | 'DISCOVERED'
  | 'RELEVANT'
  | 'HIGH_INTENT'
  | 'QUALIFIED'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'MEETING'
  | 'CONVERTED'
  | 'ARCHIVED';

export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';

export type SourcePlatform =
  | 'LINKEDIN'
  | 'X'
  | 'WEBSITE'
  | 'PUBLIC_DIRECTORY'
  | 'FREELANCE_PLATFORM';

export type CallStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'MISSED';

export type InterestLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface LeadFilterParams {
  search?: string;
  minIntent?: number;
  maxIntent?: number;
  industry?: string;
  source?: string;
  status?: string;
  urgency?: string;
  location?: string;
  sortBy?: 'intent' | 'newest' | 'qualification' | 'company';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface OpportunityItem {
  id: string;
  name: string;
  title: string;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  status: string;
  intentScore: number;
  urgency: string;
  qualificationScore: number;
  pipelineValue: number;
  salesBrief: string | null;
  discoveredAt: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    domain: string | null;
    industry: string;
    size: string;
    location: string;
    techStack: string | null;
    hiringSignals: string | null;
    fundingSignals: string | null;
    growthSignals: string | null;
  };
  source: {
    id: string;
    name: string;
    platform: string;
    confidence: number;
    sourceUrl: string | null;
  } | null;
  requirements: Array<{
    id: string;
    title: string;
    description: string;
    category: string | null;
    tags: string | null;
    budgetEstimate: string | null;
    timeframe: string | null;
    rawEvidence: string | null;
    confidenceScore: number;
  }>;
  qualifications: Array<{
    id: string;
    budgetFit: number;
    authorityFit: number;
    needFit: number;
    timingFit: number;
    overallScore: number;
    reasoning: string | null;
    status: string;
  }>;
  recommendations: Array<{
    id: string;
    actionType: string;
    title: string;
    rationale: string;
    priority: string;
    suggestedChannel: string;
    suggestedMessage: string | null;
    executed: boolean;
  }>;
  calls: Array<{
    id: string;
    status: string;
    scheduledAt: string | null;
    startedAt: string | null;
    durationSeconds: number;
    summary: string | null;
    sentiment: string | null;
    interestLevel: string | null;
    nextStep: string | null;
  }>;
  activityLogs: Array<{
    id: string;
    action: string;
    details: string | null;
    createdAt: string;
  }>;
}

export interface DashboardMetrics {
  totalOpportunities: number;
  highIntentCount: number;
  readyToContactCount: number;
  aiCallsCount: number;
  interestedCount: number;
  meetingsCount: number;
  totalPipelineValue: number;
  funnelData: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
  priorityQueue: Array<{
    id: string;
    companyName: string;
    contactName: string;
    contactTitle: string;
    intentScore: number;
    urgency: string;
    status: string;
    pipelineValue: number;
    topRequirement: string;
    primarySource: string;
  }>;
}

export type SpeakerType = 'AI' | 'Lead' | 'Human';

export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'HIGHLY_INTERESTED';

export type InterestType = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export interface CallTurn {
  id: string;
  speaker: SpeakerType;
  text: string;
  timestamp: string;
  sentiment?: SentimentType;
  detectedSignals?: string[];
}

export interface LiveConversationSignals {
  intent: number;
  interest: InterestType;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';
  sentiment: SentimentType;
  detectedRequirement: string;
  timeline: string;
  painPoint: string;
  objection: string;
  decisionMaker: string;
  buyingStage: string;
}

export interface ConversationAnalysis {
  callSummary: string;
  summary?: string;
  qualificationScore: number;
  interestLevel: InterestType;
  timeline: string;
  decisionMaker: string;
  budget: string;
  painPoints: string[];
  objections: string[];
  buyingStage: string;
  nextBestAction: string;
  actionPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedPositioning: string;
}

export interface CallbackRecord {
  id: string;
  leadId: string;
  leadName: string;
  companyName: string;
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface VoiceProvider {
  name: string;
  isSupported(): boolean;
  start(): Promise<void>;
  speak(text: string, lang?: string, onEnd?: () => void): Promise<void>;
  listen(onResult: (text: string) => void, onError?: (err: any) => void): Promise<void>;
  stop(): void;
}

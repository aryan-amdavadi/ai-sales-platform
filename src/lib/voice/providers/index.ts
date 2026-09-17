import { Call, Lead } from '@prisma/client';

export interface CallConfig {
  language?: string; // 'en', 'hi', 'gu'
  optOutMessage?: string;
  voicemailMessage?: string;
  aiDisclosure?: string; // Explicit AI disclosure message
  maxAttempts?: number;
  retryDelay?: number;
  timezone?: string;
}

export interface TelephonyProvider {
  name: string;
  initiateOutboundCall(phoneNumber: string, config: CallConfig): Promise<{ callId: string; status: string }>;
  endCall(callId: string): Promise<boolean>;
  playAudio(callId: string, audioUrl: string): Promise<void>;
  detectVoicemail(callId: string): Promise<boolean>;
}

export interface SpeechRecognitionProvider {
  name: string;
  transcribeStream(audioStream: any, language: string): AsyncGenerator<string>;
}

export interface TextToSpeechProvider {
  name: string;
  synthesize(text: string, language: string, voice?: string): Promise<Buffer | string>;
}

export interface ConversationProvider {
  name: string;
  generateResponse(context: any, input: string): Promise<string>;
  extractIntent(transcript: string): Promise<any>;
}

export interface VoiceProvider {
  name: string;
  isFallback: boolean;
  startOutboundCall(call: Call & { lead: Lead }, config?: CallConfig): Promise<void>;
  handleInboundCall(phoneNumber: string, data: any): Promise<void>;
  handleVoicemail(callId: string): Promise<void>;
  endCall(callId: string, reason?: string): Promise<void>;
}

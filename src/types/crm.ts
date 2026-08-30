export interface CRMContactParams {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  companyName: string;
}

export interface CRMOpportunityParams {
  name: string;
  companyName: string;
  stage: string;
  amount: number;
  closeDate: string;
  intentScore: number;
}

export interface CRMCallAttachmentParams {
  leadId: string;
  callId: string;
  durationSeconds: number;
  summary: string;
  sentiment: string;
  nextStep: string;
  transcriptSnippet?: string;
}

export interface CRMPushResult {
  success: boolean;
  crmSyncId: string;
  crmSystem: string;
  contactId: string;
  opportunityId: string;
  attachedCallId: string;
  syncTimestamp: string;
  status: 'SYNCHRONIZED' | 'PENDING';
  message: string;
}

export interface CRMProvider {
  name: string;
  createContact(params: CRMContactParams): Promise<{ contactId: string }>;
  createOpportunity(params: CRMOpportunityParams): Promise<{ opportunityId: string }>;
  attachCall(params: CRMCallAttachmentParams): Promise<{ attached: boolean }>;
  updateLead(leadId: string, data: any): Promise<any>;
  pushToCRM(leadId: string, callId: string): Promise<CRMPushResult>;
}

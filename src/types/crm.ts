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

export interface CRMCompanyParams {
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export interface CRMProvider {
  name: string;
  createContact(params: CRMContactParams): Promise<{ contactId: string }>;
  updateContact(contactId: string, params: Partial<CRMContactParams>): Promise<{ contactId: string }>;
  
  createCompany(params: CRMCompanyParams): Promise<{ companyId: string }>;
  updateCompany(companyId: string, params: Partial<CRMCompanyParams>): Promise<{ companyId: string }>;
  
  createOpportunity(params: CRMOpportunityParams): Promise<{ opportunityId: string }>;
  updateOpportunity(opportunityId: string, params: Partial<CRMOpportunityParams>): Promise<{ opportunityId: string }>;
  
  attachCall(params: CRMCallAttachmentParams): Promise<{ attached: boolean }>;
  attachTranscript(leadId: string, transcript: string): Promise<{ attached: boolean }>;
  attachQualification(leadId: string, data: any): Promise<{ attached: boolean }>;
  attachNextBestAction(leadId: string, action: any): Promise<{ attached: boolean }>;
  
  pushLead(leadId: string): Promise<CRMPushResult>;
  pullContacts(): Promise<any[]>;
  validateConnection(): Promise<{ valid: boolean; error?: string }>;
}

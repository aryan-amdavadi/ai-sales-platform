import { prisma } from '@/lib/db/prisma';
import {
  CRMProvider,
  CRMContactParams,
  CRMCompanyParams,
  CRMOpportunityParams,
  CRMCallAttachmentParams,
  CRMPushResult,
} from '@/types/crm';

export class DemoCRMProvider implements CRMProvider {
  name = 'DemoCRMProvider (Salesforce / HubSpot Adapter)';
  
  constructor(private workspaceId: string) {}

  async createContact(params: CRMContactParams): Promise<{ contactId: string }> {
    const contactId = `CRM-CONT-${Math.floor(10000 + Math.random() * 90000)}`;
    return { contactId };
  }

  async updateContact(contactId: string, params: Partial<CRMContactParams>): Promise<{ contactId: string }> {
    return { contactId };
  }

  async createCompany(params: CRMCompanyParams): Promise<{ companyId: string }> {
    const companyId = `CRM-COMP-${Math.floor(10000 + Math.random() * 90000)}`;
    return { companyId };
  }

  async updateCompany(companyId: string, params: Partial<CRMCompanyParams>): Promise<{ companyId: string }> {
    return { companyId };
  }

  async createOpportunity(params: CRMOpportunityParams): Promise<{ opportunityId: string }> {
    const opportunityId = `CRM-OPP-${Math.floor(10000 + Math.random() * 90000)}`;
    return { opportunityId };
  }

  async updateOpportunity(opportunityId: string, params: Partial<CRMOpportunityParams>): Promise<{ opportunityId: string }> {
    return { opportunityId };
  }

  async attachCall(params: CRMCallAttachmentParams): Promise<{ attached: boolean }> {
    return { attached: true };
  }

  async attachTranscript(leadId: string, transcript: string): Promise<{ attached: boolean }> {
    return { attached: true };
  }

  async attachQualification(leadId: string, data: any): Promise<{ attached: boolean }> {
    return { attached: true };
  }

  async attachNextBestAction(leadId: string, action: any): Promise<{ attached: boolean }> {
    return { attached: true };
  }

  async pushLead(leadId: string): Promise<CRMPushResult> {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        company: true,
        requirements: true,
        calls: true,
        recommendations: true,
      },
    });

    if (!lead) {
      throw new Error(`Lead ${leadId} not found for CRM sync`);
    }

    const contactRes = await this.createContact({
      name: lead.name,
      title: lead.title,
      email: lead.email || `contact@${lead.company.domain || 'enterprise.com'}`,
      phone: lead.phone || '+1 555-0192',
      companyName: lead.company.name,
    });

    const oppRes = await this.createOpportunity({
      name: `${lead.company.name} - ${lead.requirements[0]?.title || 'Cloud Modernization'}`,
      companyName: lead.company.name,
      stage: 'Discovery Meeting Scheduled',
      amount: lead.pipelineValue,
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      intentScore: lead.intentScore,
    });

    const callObj = lead.calls[0];
    if (callObj) {
      await this.attachCall({
        leadId,
        callId: callObj.id,
        durationSeconds: callObj.durationSeconds || 65,
        summary: callObj.summary || 'Completed autonomous discovery call with decision maker.',
        sentiment: callObj.sentiment || 'POSITIVE',
        nextStep: callObj.nextStep || 'Technical architecture discovery session',
      });
    }

    // Update lead status to SYNCED implicitly
    await prisma.lead.update({
      where: { id: leadId },
      data: { 
        crmStatus: 'SYNCED',
        crmExternalId: oppRes.opportunityId,
        crmLastSyncAt: new Date(),
      },
    });

    const crmSyncId = `CRM-SYNC-${Math.floor(100000 + Math.random() * 900000)}`;
    const syncTimestamp = new Date().toISOString();

    // Log Activity
    await prisma.activityLog.create({
      data: { 
        workspaceId: this.workspaceId, 
        leadId,
        action: 'CRM_PUSH_COMPLETED',
        details: `Synchronized opportunity to CRM (ID: ${oppRes.opportunityId}, Contact: ${contactRes.contactId}).`,
        metadata: JSON.stringify({
          crmSyncId,
          contactId: contactRes.contactId,
          opportunityId: oppRes.opportunityId,
          syncTimestamp,
        }),
      },
    });

    return {
      success: true,
      crmSyncId,
      crmSystem: 'Enterprise Salesforce / HubSpot (Demo)',
      contactId: contactRes.contactId,
      opportunityId: oppRes.opportunityId,
      attachedCallId: callObj?.id || 'none',
      syncTimestamp,
      status: 'SYNCHRONIZED',
      message: `Successfully synchronized ${lead.company.name} opportunity and AI call notes to CRM.`,
    };
  }

  async pullContacts(): Promise<any[]> {
    return [];
  }

  async validateConnection(): Promise<{ valid: boolean; error?: string }> {
    return { valid: true };
  }
}

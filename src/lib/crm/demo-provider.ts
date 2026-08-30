import { prisma } from '@/lib/db/prisma';
import {
  CRMProvider,
  CRMContactParams,
  CRMOpportunityParams,
  CRMCallAttachmentParams,
  CRMPushResult,
} from '@/types/crm';

export class DemoCRMProvider implements CRMProvider {
  name = 'DemoCRMProvider (Salesforce / HubSpot Adapter)';

  async createContact(params: CRMContactParams): Promise<{ contactId: string }> {
    const contactId = `CRM-CONT-${Math.floor(10000 + Math.random() * 90000)}`;
    return { contactId };
  }

  async createOpportunity(params: CRMOpportunityParams): Promise<{ opportunityId: string }> {
    const opportunityId = `CRM-OPP-${Math.floor(10000 + Math.random() * 90000)}`;
    return { opportunityId };
  }

  async attachCall(params: CRMCallAttachmentParams): Promise<{ attached: boolean }> {
    return { attached: true };
  }

  async updateLead(leadId: string, data: any): Promise<any> {
    return prisma.lead.update({
      where: { id: leadId },
      data,
    });
  }

  async pushToCRM(leadId: string, callId: string): Promise<CRMPushResult> {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        company: true,
        requirements: true,
        calls: { where: { id: callId } },
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
    await this.attachCall({
      leadId,
      callId,
      durationSeconds: callObj?.durationSeconds || 65,
      summary: callObj?.summary || 'Completed autonomous discovery call with decision maker.',
      sentiment: callObj?.sentiment || 'POSITIVE',
      nextStep: callObj?.nextStep || 'Technical architecture discovery session',
    });

    // Update lead status to MEETING / QUALIFIED
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'MEETING',
      },
    });

    const crmSyncId = `CRM-SYNC-${Math.floor(100000 + Math.random() * 900000)}`;
    const syncTimestamp = new Date().toISOString();

    // Log Activity
    await prisma.activityLog.create({
      data: {
        leadId,
        action: 'CRM_PUSH_COMPLETED',
        details: `Synchronized opportunity to CRM (ID: ${oppRes.opportunityId}, Contact: ${contactRes.contactId}). Next action scheduled.`,
        metadata: JSON.stringify({
          crmSyncId,
          contactId: contactRes.contactId,
          opportunityId: oppRes.opportunityId,
          callId,
          syncTimestamp,
        }),
      },
    });

    return {
      success: true,
      crmSyncId,
      crmSystem: 'Enterprise Salesforce / HubSpot',
      contactId: contactRes.contactId,
      opportunityId: oppRes.opportunityId,
      attachedCallId: callId,
      syncTimestamp,
      status: 'SYNCHRONIZED',
      message: `Successfully synchronized ${lead.company.name} opportunity and AI call notes to CRM.`,
    };
  }
}

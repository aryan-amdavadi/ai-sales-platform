// CRM Provider Abstractions
import { prisma } from '@/lib/db/prisma';

export interface CRMContact {
  id: string;
  name: string;
  email: string;
  title: string;
  companyName: string;
  phone?: string;
  linkedinUrl?: string;
}

export interface CRMCompany {
  id: string;
  name: string;
  domain: string;
  industry: string;
  location: string;
}

export interface CRMImportProvider {
  validateConnection(): Promise<boolean>;
  importCompanies(): Promise<CRMCompany[]>;
  importContacts(): Promise<CRMContact[]>;
}

export class DemoCRMProvider implements CRMImportProvider {
  async validateConnection(): Promise<boolean> {
    return true; // Always succeeds for demo
  }

  async importCompanies(): Promise<CRMCompany[]> {
    return [
      {
        id: "crm-comp-1",
        name: "Acme Corp",
        domain: "acmecorp.com",
        industry: "Manufacturing",
        location: "Chicago, IL"
      },
      {
        id: "crm-comp-2",
        name: "Stark Industries",
        domain: "stark.com",
        industry: "Defense",
        location: "New York, NY"
      }
    ];
  }

  async importContacts(): Promise<CRMContact[]> {
    return [
      {
        id: "crm-cont-1",
        name: "Wile E. Coyote",
        email: "wile@acmecorp.com",
        title: "Chief Engineer",
        companyName: "Acme Corp"
      },
      {
        id: "crm-cont-2",
        name: "Tony Stark",
        email: "tony@stark.com",
        title: "CEO",
        companyName: "Stark Industries"
      }
    ];
  }
}

/**
 * Utility to execute a CRM sync job and save records to the workspace
 */
export async function syncCRMToWorkspace(provider: CRMImportProvider, workspaceId: string, userId?: string) {
  // Validate
  const isValid = await provider.validateConnection();
  if (!isValid) throw new Error("CRM Connection Invalid");

  // Create import job for tracking
  const importJob = await prisma.leadImport.create({
    data: {
      workspaceId,
      userId,
      source: "CRM_SYNC",
      status: "PROCESSING",
      mappingConfig: "CRM_AUTOMAPPING"
    }
  });

  try {
    const companies = await provider.importCompanies();
    const contacts = await provider.importContacts();

    let successCount = 0;
    let failedCount = 0;

    for (const contact of contacts) {
      try {
        const crmCompany = companies.find(c => c.name === contact.companyName);

        let company = await prisma.company.findFirst({
          where: { workspaceId, name: contact.companyName }
        });

        if (!company) {
          company = await prisma.company.create({
            data: {
              workspaceId,
              name: contact.companyName,
              domain: crmCompany?.domain || "",
              industry: crmCompany?.industry || "Unknown",
              size: "Unknown",
              location: crmCompany?.location || "Unknown",
            }
          });
        }

        let lead = await prisma.lead.findFirst({
          where: { workspaceId, email: contact.email }
        });

        if (!lead) {
          lead = await prisma.lead.create({
            data: {
              workspaceId,
              companyId: company.id,
              name: contact.name,
              email: contact.email,
              title: contact.title,
              phone: contact.phone || null,
              linkedinUrl: contact.linkedinUrl || null,
              status: "DISCOVERED",
              intentScore: 60
            }
          });
        }

        await prisma.leadImportRow.create({
          data: {
            importId: importJob.id,
            rawData: JSON.stringify(contact),
            status: "SUCCESS",
            leadId: lead.id
          }
        });
        successCount++;
      } catch (e: any) {
        await prisma.leadImportRow.create({
          data: {
            importId: importJob.id,
            rawData: JSON.stringify(contact),
            status: "FAILED",
            errorReason: e.message
          }
        });
        failedCount++;
      }
    }

    await prisma.leadImport.update({
      where: { id: importJob.id },
      data: {
        status: "COMPLETED",
        totalRows: contacts.length,
        importedRows: successCount,
        failedRows: failedCount
      }
    });

  } catch (err) {
    await prisma.leadImport.update({
      where: { id: importJob.id },
      data: { status: "FAILED" }
    });
    throw err;
  }
}

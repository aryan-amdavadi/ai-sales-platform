import { prisma } from '@/lib/db/prisma';

export interface ImportFieldMapping {
  csvHeader: string;
  targetField: string; // name, email, phone, title, company, website, linkedinUrl, location, industry, notes
}

export interface ImportPayload {
  workspaceId: string;
  userId?: string;
  source: string; // CSV, XLSX
  mapping: ImportFieldMapping[];
  rows: Record<string, string>[];
}

export class ImportProvider {
  /**
   * Initializes an import job in the database.
   */
  async initializeImport(payload: ImportPayload) {
    const importJob = await prisma.leadImport.create({
      data: {
        workspaceId: payload.workspaceId,
        userId: payload.userId,
        source: payload.source,
        status: "PROCESSING",
        totalRows: payload.rows.length,
        mappingConfig: JSON.stringify(payload.mapping)
      }
    });

    // In a real production system, this would queue a background job
    // We will process it synchronously or asynchronously in this MVP
    this.processImport(importJob.id, payload).catch(console.error);

    return importJob;
  }

  /**
   * Processes the rows according to the mapping.
   */
  async processImport(importId: string, payload: ImportPayload) {
    let successCount = 0;
    let failedCount = 0;

    for (const row of payload.rows) {
      try {
        const mappedData: any = {};
        for (const map of payload.mapping) {
          if (row[map.csvHeader]) {
            mappedData[map.targetField] = row[map.csvHeader];
          }
        }

        // Minimal validation
        if (!mappedData.company || (!mappedData.name && !mappedData.email)) {
          throw new Error("Missing required fields: company and (name or email)");
        }

        // Deduplication & Company lookup
        let company = await prisma.company.findFirst({
          where: {
            workspaceId: payload.workspaceId,
            name: { equals: mappedData.company }
          }
        });

        if (!company) {
          company = await prisma.company.create({
            data: {
              workspaceId: payload.workspaceId,
              name: mappedData.company,
              industry: mappedData.industry || "Unknown",
              size: "Unknown",
              location: mappedData.location || "Unknown",
              websiteUrl: mappedData.website || null,
            }
          });
        }

        // Check for duplicate lead
        let lead;
        if (mappedData.email) {
          lead = await prisma.lead.findFirst({
            where: { workspaceId: payload.workspaceId, email: mappedData.email }
          });
        }

        if (!lead) {
          lead = await prisma.lead.create({
            data: {
              workspaceId: payload.workspaceId,
              companyId: company.id,
              name: mappedData.name || "Unknown Contact",
              email: mappedData.email || null,
              phone: mappedData.phone || null,
              title: mappedData.title || "Unknown Title",
              linkedinUrl: mappedData.linkedinUrl || null,
              status: "DISCOVERED",
              intentScore: 50
            }
          });
        }

        await prisma.leadImportRow.create({
          data: {
            importId,
            rawData: JSON.stringify(row),
            status: "SUCCESS",
            leadId: lead.id
          }
        });
        successCount++;
      } catch (err: any) {
        await prisma.leadImportRow.create({
          data: {
            importId,
            rawData: JSON.stringify(row),
            status: "FAILED",
            errorReason: err.message
          }
        });
        failedCount++;
      }
    }

    await prisma.leadImport.update({
      where: { id: importId },
      data: {
        status: "COMPLETED",
        importedRows: successCount,
        failedRows: failedCount
      }
    });
  }

  async getImportStatus(importId: string) {
    return prisma.leadImport.findUnique({
      where: { id: importId },
      include: {
        rows: { take: 10, orderBy: { createdAt: 'desc' } }
      }
    });
  }
}

export const importProvider = new ImportProvider();

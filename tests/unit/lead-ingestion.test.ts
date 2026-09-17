import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImportProvider } from '../../src/lib/ingestion/import-provider';
import { prisma } from '../../src/lib/db/prisma';

// Mock Prisma
vi.mock('../../src/lib/db/prisma', () => ({
  prisma: {
    leadImport: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    leadImportRow: {
      create: vi.fn(),
    },
    company: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    lead: {
      findFirst: vi.fn(),
      create: vi.fn(),
    }
  }
}));

describe('ImportProvider', () => {
  let provider: ImportProvider;

  beforeEach(() => {
    provider = new ImportProvider();
    vi.clearAllMocks();
  });

  it('should process import and deduplicate leads based on email', async () => {
    // Mock data setup
    const importId = "import-123";
    const workspaceId = "ws-1";
    
    const payload = {
      workspaceId,
      source: "CSV",
      mapping: [
        { csvHeader: "Name", targetField: "name" },
        { csvHeader: "Email", targetField: "email" },
        { csvHeader: "Company", targetField: "company" }
      ],
      rows: [
        { "Name": "Alice", "Email": "alice@test.com", "Company": "Test Corp" },
        { "Name": "Bob", "Email": "bob@test.com", "Company": "Test Corp" }, // Same company
      ]
    };

    // Mocks for DB
    (prisma.company.findFirst as any)
      .mockResolvedValueOnce(null) // First time: Company not found
      .mockResolvedValueOnce({ id: "comp-1", name: "Test Corp" }); // Second time: found

    (prisma.company.create as any).mockResolvedValue({ id: "comp-1", name: "Test Corp" });
    
    (prisma.lead.findFirst as any)
      .mockResolvedValueOnce(null) // Alice not found
      .mockResolvedValueOnce({ id: "lead-bob" }); // Bob already exists!

    (prisma.lead.create as any).mockResolvedValue({ id: "lead-alice" });

    // Execute
    await provider.processImport(importId, payload);

    // Assertions
    // Only one company should be created
    expect(prisma.company.create).toHaveBeenCalledTimes(1);
    
    // Only Alice should be created (Bob was deduplicated)
    expect(prisma.lead.create).toHaveBeenCalledTimes(1);
    expect(prisma.lead.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ email: "alice@test.com" })
    }));

    // Import rows should both be success, but map to different leads
    expect(prisma.leadImportRow.create).toHaveBeenCalledTimes(2);
    
    // Job status updated
    expect(prisma.leadImport.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: importId },
      data: expect.objectContaining({
        status: "COMPLETED",
        importedRows: 2,
        failedRows: 0
      })
    }));
  });

  it('should fail row if required fields are missing', async () => {
    const importId = "import-456";
    const payload = {
      workspaceId: "ws-1",
      source: "CSV",
      mapping: [
        { csvHeader: "Name", targetField: "name" },
      ],
      rows: [
        { "Name": "No Company Dude" },
      ]
    };

    await provider.processImport(importId, payload);

    // Should not create anything
    expect(prisma.company.create).not.toHaveBeenCalled();
    expect(prisma.lead.create).not.toHaveBeenCalled();

    // Should create a FAILED row
    expect(prisma.leadImportRow.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: "FAILED",
        errorReason: "Missing required fields: company and (name or email)"
      })
    }));

    expect(prisma.leadImport.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        failedRows: 1,
        importedRows: 0
      })
    }));
  });
});

import { prisma } from '@/lib/db/prisma';

export interface DiscoverySignal {
  sourceName: string;
  sourceUrl?: string;
  rawData: any;
  confidence: number;
}

export interface DiscoveryProvider {
  /**
   * Primary entry point for discovering leads on a platform.
   * Returns a list of signals found.
   */
  discover(keywords: string[], negativeKeywords: string[], location?: string): Promise<DiscoverySignal[]>;
  
  /**
   * Check if a source URL or identifier is valid for this provider.
   */
  validateSource(url: string): boolean;
}

/**
 * Deterministic Mock Provider for LinkedIn-like discovery.
 */
export class MockLinkedInDiscoveryProvider implements DiscoveryProvider {
  validateSource(url: string): boolean {
    return url.includes('linkedin.com');
  }

  async discover(keywords: string[], negativeKeywords: string[], location?: string): Promise<DiscoverySignal[]> {
    // In a real app, this would use a scraping API like Phantombuster or apify.
    // Here we generate deterministic mock data based on keywords.
    const isCloud = keywords.some(k => k.toLowerCase().includes('cloud') || k.toLowerCase().includes('aws'));
    
    if (isCloud) {
      return [
        {
          sourceName: "LinkedIn Jobs",
          sourceUrl: "https://linkedin.com/jobs/view/123",
          confidence: 90,
          rawData: {
            title: "VP of Engineering",
            company: "TechNova Solutions",
            description: "Looking for an experienced leader to migrate our on-premise infrastructure to AWS/GCP.",
            location: location || "San Francisco, CA",
            contact: { name: "Alice Johnson", email: "alice.j@technovasolutions.com" }
          }
        },
        {
          sourceName: "LinkedIn Posts",
          sourceUrl: "https://linkedin.com/posts/xyz",
          confidence: 85,
          rawData: {
            title: "CTO",
            company: "Globex Corp",
            description: "We are actively exploring cloud optimization partners. Reach out if you have expertise in Kubernetes.",
            location: "New York, NY",
            contact: { name: "Bob Smith", email: "bob@globex.com" }
          }
        }
      ];
    }

    return [];
  }
}

/**
 * Handles generating search parameters based on workspace profile.
 */
export async function generateDiscoveryKeywords(workspaceId: string): Promise<{ keywords: string[], negativeKeywords: string[] }> {
  // Try to load business capabilities and ICP
  const capability = await prisma.businessCapability.findUnique({ where: { workspaceId } });
  const icp = await prisma.icpProfile.findUnique({ where: { workspaceId } });

  let keywords: string[] = ["RFP", "Vendor Search", "Looking for software"];
  let negativeKeywords: string[] = ["Recruiter", "Agency", "Intern"];

  if (capability?.keywords) {
    try {
      const parsed = JSON.parse(capability.keywords);
      if (Array.isArray(parsed)) keywords = [...keywords, ...parsed];
    } catch (e) {}
  }
  
  if (capability?.negativeKeywords) {
    try {
      const parsed = JSON.parse(capability.negativeKeywords);
      if (Array.isArray(parsed)) negativeKeywords = [...negativeKeywords, ...parsed];
    } catch (e) {}
  }

  return { keywords, negativeKeywords };
}

/**
 * Main execution flow for a discovery job.
 */
export async function runDiscoveryJob(jobId: string) {
  const job = await prisma.discoveryJob.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job not found");

  await prisma.discoveryJob.update({
    where: { id: jobId },
    data: { status: "RUNNING" }
  });

  try {
    const { keywords, negativeKeywords } = await generateDiscoveryKeywords(job.workspaceId);
    
    // Update job with actual keywords used
    await prisma.discoveryJob.update({
      where: { id: jobId },
      data: {
        keywords: JSON.stringify({ keywords, negativeKeywords })
      }
    });

    const providers: DiscoveryProvider[] = [
      new MockLinkedInDiscoveryProvider()
    ];

    let totalDiscovered = 0;

    for (const provider of providers) {
      const signals = await provider.discover(keywords, negativeKeywords);
      
      for (const signal of signals) {
        // Save the signal for human review (or automatic qualification depending on intent threshold)
        await prisma.discoveryResult.create({
          data: {
            jobId: job.id,
            sourceName: signal.sourceName,
            sourceUrl: signal.sourceUrl,
            rawData: JSON.stringify(signal.rawData),
            confidence: signal.confidence,
            status: "PENDING_REVIEW"
          }
        });
        totalDiscovered++;
      }
    }

    await prisma.discoveryJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        totalDiscovered
      }
    });

  } catch (error: any) {
    console.error("Discovery Job Failed:", error);
    await prisma.discoveryJob.update({
      where: { id: jobId },
      data: { status: "FAILED" }
    });
  }
}

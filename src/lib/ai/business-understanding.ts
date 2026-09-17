export interface BusinessContextPayload {
  businessProfile: any;
  products: any[];
  icpProfile: any;
  knowledgeDocuments: any[];
}

export interface NormalizedBusinessCapability {
  normalizedCapabilities: string[];
  targetIndustries: string[];
  targetRoles: string[];
  keywords: string[];
  negativeKeywords: string[];
  qualificationCriteria: string[];
}

export async function analyzeBusinessContext(context: BusinessContextPayload): Promise<NormalizedBusinessCapability> {
  // In a real implementation, this would call an LLM (e.g. OpenAI or Anthropic)
  // passing the context and requesting a structured JSON output.
  // For IntentOS demo purposes, we will return a deterministic fallback
  // based on the provided inputs to ensure consistent, testable behavior.

  const capabilities = new Set<string>();
  const industries = new Set<string>();
  const roles = new Set<string>();
  const keywords = new Set<string>();

  // Extract from Products
  context.products.forEach(p => {
    capabilities.add(p.name);
    if (p.valueProps) {
      p.valueProps.split(',').map((v: string) => v.trim()).forEach((v: string) => capabilities.add(v));
    }
    if (p.targetAudience) {
      roles.add(p.targetAudience);
    }
  });

  // Extract from ICP
  if (context.icpProfile?.targetIndustries) {
    try {
      const parsed = JSON.parse(context.icpProfile.targetIndustries);
      if (Array.isArray(parsed)) parsed.forEach(i => industries.add(i));
    } catch {
      context.icpProfile.targetIndustries.split(',').forEach((i: string) => industries.add(i.trim()));
    }
  }

  if (context.icpProfile?.decisionMakers) {
    context.icpProfile.decisionMakers.split(',').forEach((r: string) => roles.add(r.trim()));
  }

  // Extract from Profile
  if (context.businessProfile?.industry) {
    industries.add(context.businessProfile.industry);
  }

  // Generate some generic keywords based on capabilities
  capabilities.forEach(c => {
    c.split(' ').forEach(word => {
      if (word.length > 4) keywords.add(word.toLowerCase());
    });
  });

  return {
    normalizedCapabilities: Array.from(capabilities).filter(Boolean),
    targetIndustries: Array.from(industries).filter(Boolean),
    targetRoles: Array.from(roles).filter(Boolean),
    keywords: Array.from(keywords).filter(Boolean),
    negativeKeywords: ['consumer', 'b2c', 'cheap', 'free tier'],
    qualificationCriteria: [
      `Budget matches product pricing`,
      `Role is in: ${Array.from(roles).join(', ')}`,
      `Industry is in: ${Array.from(industries).join(', ')}`
    ]
  };
}

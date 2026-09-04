import {
  RequirementAnalysis,
  IntentScoreBreakdown,
  EvidenceAnalysis,
  CompanyFitAnalysis,
  QualificationResult,
  SalesBrief,
  NextBestAction,
  FullAnalysisResult,
} from '@/types/ai';
import { AIProvider } from './provider';

export class LocalDemoAIProvider implements AIProvider {
  name = 'LocalDemoAIProvider';

  // 1. Requirement Understanding
  async analyzeRequirement(
    rawText: string,
    context?: {
      companyName?: string;
      industry?: string;
      location?: string;
      prospectTitle?: string;
    }
  ): Promise<RequirementAnalysis> {
    const text = rawText.toLowerCase();

    // 1.1 Problem & Solution Detection
    let problem = 'Legacy infrastructure and operational friction requiring modernization.';
    let requestedSolution = 'Enterprise Cloud Modernization & Integration';

    if (text.includes('sharepoint') || text.includes('m365') || text.includes('microsoft 365')) {
      problem = 'Legacy on-premise SharePoint 2016 server reaching end-of-life with custom workflow dependencies.';
      requestedSolution = 'SharePoint Online & Microsoft 365 Migration';
    } else if (text.includes('soc2') || text.includes('fedramp') || text.includes('compliance')) {
      problem = 'Manual compliance audits and lack of continuous infrastructure security evidence collection.';
      requestedSolution = 'Automated SOC2 & FedRAMP Cloud Compliance';
    } else if (text.includes('fhir') || text.includes('healthcare') || text.includes('ehr')) {
      problem = 'Fragmented legacy patient data silos failing HL7/FHIR interoperability standards.';
      requestedSolution = 'Healthcare FHIR Interoperability & API Integration';
    } else if (text.includes('latency') || text.includes('broker') || text.includes('fintech') || text.includes('settlement')) {
      problem = 'High latency messaging bottlenecks in real-time transaction processing.';
      requestedSolution = 'Low-Latency Financial Settlement Message Broker';
    } else if (text.includes('telemetry') || text.includes('iot') || text.includes('cold-chain')) {
      problem = 'Lack of real-time sensor ingestion and proactive route deviation alerting.';
      requestedSolution = 'Industrial IoT Real-Time Telemetry Rollout';
    } else if (text.includes('identity') || text.includes('iam') || text.includes('zero-trust')) {
      problem = 'Fragmented employee directory access and legacy perimeter security vulnerabilities.';
      requestedSolution = 'Zero-Trust Identity & Access Management (IAM)';
    }

    // 1.2 Technology Extraction
    const technologies: string[] = [];
    const techCatalog: Record<string, string[]> = {
      'SharePoint Online': ['sharepoint', 'spfx', 'sharepoint online'],
      'Microsoft 365': ['m365', 'microsoft 365', 'office 365'],
      'Azure': ['azure', 'microsoft cloud'],
      'AWS': ['aws', 'amazon web services'],
      'Kubernetes': ['kubernetes', 'k8s', 'container'],
      'eBPF': ['ebpf', 'kernel telemetry'],
      'FHIR API': ['fhir', 'hl7', 'epic', 'cerner'],
      'Kafka / Flink': ['kafka', 'flink', 'streaming', 'message broker'],
      'TypeScript / React': ['react', 'typescript', 'frontend'],
      'Python / PyTorch': ['python', 'pytorch', 'ml pipeline', 'ai'],
    };

    for (const [techName, keywords] of Object.entries(techCatalog)) {
      if (keywords.some((k) => text.includes(k))) {
        technologies.push(techName);
      }
    }
    if (technologies.length === 0) {
      technologies.push('Enterprise Cloud APIs', 'SQL Database', 'REST Services');
    }

    // 1.3 Requirements Sub-components
    const requirements: string[] = [];
    if (text.includes('sharepoint') || text.includes('m365')) {
      requirements.push(
        'SharePoint Online',
        'Microsoft 365',
        'Legacy migration from SharePoint 2016',
        'Custom application development (SPFx)',
        'User training & change management',
        'Post-go-live managed support'
      );
    } else if (text.includes('soc2') || text.includes('compliance')) {
      requirements.push(
        'Agentless cloud evidence collectors',
        'Automated SOC2 Type II controls mapping',
        'AWS & Kubernetes cluster telemetry',
        'Continuous drift detection'
      );
    } else {
      requirements.push(
        `${requestedSolution} architecture design`,
        'Zero-downtime cutover & legacy integration',
        'Enterprise security & IAM configuration',
        'Executive documentation & staff enablement'
      );
    }

    // 1.4 Urgency & Timeline
    let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE' = 'MEDIUM';
    let timeline = 'Q3/Q4 2026 (Next 90 days)';

    if (
      text.includes('immediate') ||
      text.includes('critical') ||
      text.includes('asap')
    ) {
      urgency = 'HIGH';
      timeline = 'Immediate (Next 30 Days)';
    } else if (
      text.includes('urgent') ||
      text.includes('30 days') ||
      text.includes('this month') ||
      text.includes('active rfp') ||
      text.includes('rfp') ||
      text.includes('priority') ||
      text.includes('opening an rfp')
    ) {
      urgency = 'HIGH';
      timeline = 'Next 30 Days (Active RFP Deadline)';
    }

    // 1.5 Buying Stage
    let buyingStage: 'PROBLEM_AWARE' | 'EVALUATION' | 'VENDOR_SELECTION' | 'RFP_ISSUED' | 'DECISION' =
      'EVALUATION';
    if (text.includes('partner') || text.includes('vendor') || text.includes('rfp') || text.includes('looking for')) {
      buyingStage = 'VENDOR_SELECTION';
    } else if (text.includes('deciding') || text.includes('finalist')) {
      buyingStage = 'DECISION';
    } else if (text.includes('issued rfp') || text.includes('procurement')) {
      buyingStage = 'RFP_ISSUED';
    }

    // 1.6 Decision Maker Probability
    const title = (context?.prospectTitle || '').toLowerCase();
    let decisionMakerProbability = 70;
    if (title.includes('cto') || title.includes('chief') || title.includes('cio')) {
      decisionMakerProbability = 95;
    } else if (title.includes('vp') || title.includes('vice president')) {
      decisionMakerProbability = 90;
    } else if (title.includes('director') || title.includes('head')) {
      decisionMakerProbability = 82;
    } else if (title.includes('lead') || title.includes('architect')) {
      decisionMakerProbability = 75;
    }

    return {
      problem,
      requestedSolution,
      requirements,
      technologies,
      industry: context?.industry || 'Enterprise Technology',
      location: context?.location || 'North America',
      budget: urgency === 'HIGH' ? '$150,000 - $250,000' : '$75,000 - $150,000',
      timeline,
      urgency,
      buyingStage,
      decisionMakerProbability,
    };
  }

  // 2. Intent Engine (Transparent 8-dimension Scoring)
  async scoreIntent(
    analysis: RequirementAnalysis,
    context?: {
      sourcePlatform?: string;
      discoveryDate?: Date | string;
      companySize?: string;
    }
  ): Promise<IntentScoreBreakdown> {
    // 1. Requirement Clarity (0-100)
    const requirementClarity = Math.min(
      98,
      75 + (analysis.requirements.length >= 4 ? 15 : analysis.requirements.length * 3) + (analysis.technologies.length >= 2 ? 6 : 2)
    );

    // 2. Urgency Score (0-100)
    let urgencyScore = 65;
    if (analysis.urgency === 'IMMEDIATE') urgencyScore = 96;
    else if (analysis.urgency === 'HIGH') urgencyScore = 91;
    else if (analysis.urgency === 'MEDIUM') urgencyScore = 75;
    else urgencyScore = 55;

    // 3. Timeline Score (0-100)
    let timelineScore = 70;
    if (analysis.timeline.includes('14 Days')) timelineScore = 95;
    else if (analysis.timeline.includes('30 Days') || analysis.timeline.includes('30 days') || analysis.timeline.includes('Next 30 Days')) timelineScore = 89;
    else if (analysis.timeline.includes('Immediate')) timelineScore = 95;
    else if (analysis.timeline.includes('90 days') || analysis.timeline.includes('Q3')) timelineScore = 78;

    // 4. Solution Fit (0-100)
    const solutionFit = 97;

    // 5. Decision Maker (0-100)
    const decisionMaker = analysis.decisionMakerProbability >= 90 ? 82 : 75;
    const decisionMakerCalc = analysis.decisionMakerProbability >= 90 ? 95 : 75;

    // 6. Recency (0-100)
    const recency = 98; // Seed signals are newly discovered

    // 7. Company Fit (0-100)
    const companyFit = 93;

    // 8. Buying Stage (0-100)
    let buyingStageScore = 70;
    if (analysis.buyingStage === 'VENDOR_SELECTION') buyingStageScore = 95;
    else if (analysis.buyingStage === 'RFP_ISSUED') buyingStageScore = 92;
    else if (analysis.buyingStage === 'DECISION') buyingStageScore = 98;
    else buyingStageScore = 75;

    // Weighted Overall Intent Score Normalization (Target: 94 for Hero Record)
    const overallScore = Math.round(
      requirementClarity * 0.15 +
      urgencyScore * 0.15 +
      timelineScore * 0.15 +
      solutionFit * 0.15 +
      decisionMakerCalc * 0.10 +
      recency * 0.10 +
      companyFit * 0.10 +
      buyingStageScore * 0.10
    );

    const rationale = `Intent scored at ${overallScore}/100 based on explicit vendor search in ${analysis.buyingStage.replace(/_/g, ' ')}, ${analysis.urgency} urgency, and ${analysis.timeline}.`;

    return {
      requirementClarity,
      urgency: urgencyScore,
      timeline: timelineScore,
      solutionFit,
      decisionMaker,
      recency,
      companyFit,
      buyingStage: buyingStageScore,
      overallScore,
      rationale,
    };
  }

  // 3. Evidence Engine ("Why This Lead?" & "Why Now?")
  async generateEvidence(
    analysis: RequirementAnalysis,
    intent: IntentScoreBreakdown,
    context?: {
      sourcePlatform?: string;
      sourceUrl?: string;
      discoveryDate?: Date | string;
      hiringSignals?: string;
      techStack?: string;
    }
  ): Promise<EvidenceAnalysis> {
    const keyPoints = [
      `Explicit vendor search for ${analysis.requestedSolution}`,
      `Requirement clearly defined with ${analysis.requirements.length} core technical deliverables`,
      `Verified high-authority decision maker involvement (${analysis.decisionMakerProbability}% confidence)`,
      `Active buying stage: ${analysis.buyingStage.replace(/_/g, ' ')}`,
      `Urgent timeline target: ${analysis.timeline}`,
      `Strong alignment with verified enterprise modernization capabilities`,
    ];

    const isHero =
      analysis.requestedSolution.toLowerCase().includes('sharepoint') ||
      analysis.requestedSolution.toLowerCase().includes('microsoft 365') ||
      analysis.problem.toLowerCase().includes('sharepoint');

    const whyNowSignals = isHero
      ? [
          'Job Posting: Senior SharePoint Migration Architect',
          'RFP / Tender: M365 Security & Compliance Overhaul',
          'Tech Stack Change: Migrating from on-prem Exchange',
          'Executive Quote: "Accelerating our cloud collaboration roadmap this quarter"',
          'News / PR: TechNova announces remote-first digital workplace',
          'Website Activity: 14 visits to migration & consulting pages',
        ]
      : [
          'Public RFP requirement posted within the current procurement window',
          'Active hiring signals for lead architects & technical modernizers',
          'Legacy system end-of-life and migration deadline approaching',
          'Executive sponsor actively evaluating certified deployment partners',
        ];

    return {
      keyPoints,
      whyNowSignals,
      rawEvidenceSnippet: `Public signal detected on ${context?.sourcePlatform || 'LinkedIn'}: "Looking for an experienced implementation partner for ${analysis.requestedSolution} with verified delivery capability."`,
      source: context?.sourcePlatform || 'LINKEDIN',
      sourceUrl: context?.sourceUrl || 'https://linkedin.com/feed/update/urn:li:activity:hero',
      discoveryDate: context?.discoveryDate ? new Date(context.discoveryDate).toISOString() : new Date().toISOString(),
      confidence: 96,
    };
  }

  // 4. Fit Engine
  async calculateFit(
    productOfferings: Array<{ name: string; description: string; valueProps?: string }>,
    analysis: RequirementAnalysis,
    companyContext: {
      industry?: string;
      techStack?: string;
      location?: string;
    }
  ): Promise<CompanyFitAnalysis> {
    const capabilityMatch = 98;
    const industryMatch = 95;
    const technologyMatch = 96;
    const locationMatch = 95;

    const overallFitScore = Math.round(
      capabilityMatch * 0.35 + industryMatch * 0.25 + technologyMatch * 0.25 + locationMatch * 0.15
    );

    const explanation = `96% overall fit: Complete architectural support for ${analysis.requestedSolution}, deep vertical experience in ${companyContext.industry || 'Enterprise Tech'}, and certified technical competencies in ${analysis.technologies.slice(0, 3).join(', ')}.`;

    return {
      capabilityMatch,
      industryMatch,
      technologyMatch,
      locationMatch,
      overallFitScore,
      explanation,
    };
  }

  // 5. Qualification Engine (BANT + Heat Category)
  async qualifyLead(
    analysis: RequirementAnalysis,
    intent: IntentScoreBreakdown,
    fit: CompanyFitAnalysis,
    context: {
      prospectName?: string;
      prospectTitle?: string;
      companyName?: string;
      pipelineValue?: number;
    }
  ): Promise<QualificationResult> {
    const need = 95;
    const fitScore = fit.overallFitScore || 96;
    const urgency = intent.urgency || 91;
    const authority = analysis.decisionMakerProbability >= 90 ? 94 : 85;
    const timeline = intent.timeline || 89;
    const engagement = 80;

    const overallScore = Math.round(
      need * 0.25 + fitScore * 0.25 + urgency * 0.15 + authority * 0.15 + timeline * 0.10 + engagement * 0.10
    );

    let heatCategory: 'HOT' | 'WARM' | 'POTENTIAL' | 'LOW' = 'WARM';
    if (overallScore >= 85) heatCategory = 'HOT';
    else if (overallScore >= 65) heatCategory = 'WARM';
    else if (overallScore >= 40) heatCategory = 'POTENTIAL';
    else heatCategory = 'LOW';

    const reasoning = `${heatCategory} Lead (${overallScore}%): ${context.prospectName || 'The prospect'} holds direct technical & budgetary authority (${context.prospectTitle || 'Executive'}) with an active 30-day timeline requirement for ${analysis.requestedSolution}.`;

    return {
      need,
      fit: fitScore,
      urgency,
      authority,
      timeline,
      engagement,
      overallScore,
      heatCategory,
      reasoning,
    };
  }

  // 6. AI Sales Brief ("Pre-Call Brief")
  async generateSalesBrief(
    analysis: RequirementAnalysis,
    qualification: QualificationResult,
    context: {
      prospectName: string;
      prospectTitle: string;
      companyName: string;
      industry: string;
      techStack?: string;
    }
  ): Promise<SalesBrief> {
    const isSharePoint =
      analysis.requestedSolution.toLowerCase().includes('sharepoint') ||
      analysis.problem.toLowerCase().includes('sharepoint');

    return {
      prospect: context.prospectName,
      role: context.prospectTitle,
      company: context.companyName,
      whyTheyMatter: `${context.prospectName} is the ultimate technical decision maker and project sponsor at ${context.companyName}, owning the modernization budget and vendor selection.`,
      painPoints: isSharePoint
        ? [
            'Legacy migration complexity: Retiring on-premise infrastructure without business disruption.',
            'Workflow interruption: Ensuring business continuity for active operational workflows during cutover.',
            'Security & governance compliance: Enforcing permissions, DLP, and compliance policies across Microsoft 365.',
            'User adoption hurdles across distributed teams requiring structured change management and training.',
          ]
        : [
            `Operational inefficiency and technical debt in legacy ${analysis.industry} workflows.`,
            'Lack of automated tooling leading to high manual engineering overhead.',
            'Tight quarter-end compliance and deployment timeline pressures.',
          ],
      likelyObjections: [
        {
          objection: 'Migration downtime: We are concerned about downtime and disruption to our daily business operations during cutover.',
          counterStrategy:
            'Zero-downtime phased migration strategy: Highlight our proven phased delta-migration methodology, shadow cutovers, and zero-downtime track record on enterprise engagements.',
        },
        {
          objection: 'Data security during transit: Ensuring compliance and zero data leakage while migrating sensitive corporate records.',
          counterStrategy:
            'Security compliance: Reference end-to-end TLS encryption, tenant-isolated pipelines, and automated SOC2-grade verification audits at every stage.',
        },
        {
          objection: 'User adoption resistance: Teams may struggle adopting new SharePoint Online modern web parts and SPFx workflows.',
          counterStrategy:
            'Structured change management: Provide role-based interactive training workshops and standard 60-day post-go-live hypercare SLA.',
        },
      ],
      recommendedPositioning: `Position IntentOS as the specialized, certified enterprise implementation partner with zero-downtime modernization accelerators tailored for ${context.companyName}.`,
      openingStatement: `Hi ${context.prospectName.split(' ')[0]}, I saw that ${context.companyName} is actively evaluating partners for the ${analysis.requestedSolution}. We specialize in turnkey enterprise modernizations and custom workflow migrations with zero business disruption.`,
      questionsToAsk: [
        `What is the hard cutover deadline for retiring your legacy ${analysis.technologies[0] || 'on-premise'} servers?`,
        'How many custom workflow forms and integration endpoints will require automated refactoring?',
        'Who on your technical steering team will be involved in the architectural sign-off this week?',
      ],
      desiredOutcome: `Secure a 30-minute technical architectural discovery session with ${context.prospectName} and deliver our custom migration scope brief.`,
    };
  }

  // 7. Next Best Action Engine
  async generateNextBestAction(
    analysis: RequirementAnalysis,
    intent: IntentScoreBreakdown,
    fit: CompanyFitAnalysis,
    qualification: QualificationResult,
    context: {
      prospectName: string;
      companyName: string;
    }
  ): Promise<NextBestAction> {
    const isHot = qualification.heatCategory === 'HOT' || intent.overallScore >= 85;

    const action = isHot ? 'SCHEDULE_MEETING' : 'SEND_PROPOSAL';
    const title = isHot
      ? `Schedule Technical Discovery Session with ${context.prospectName}`
      : `Deliver Solution Proposal & Case Study to ${context.prospectName}`;

    const whyPoints = [
      `Active requirement for ${analysis.requestedSolution} identified via public buying signals`,
      `Vendor selection stage verified with ${analysis.urgency} urgency`,
      `High product capability and architectural fit score (${fit.overallFitScore}%)`,
      `${analysis.timeline} delivery timeline mandate`,
      `Prospect ${context.prospectName} verified as key decision maker`,
    ];

    const rationale = `With an intent score of ${intent.overallScore} and ${qualification.heatCategory} qualification (${qualification.overallScore}%), immediate outbound outreach via Voice AI is recommended to lock in vendor selection.`;

    const suggestedMessage = `Hello ${context.prospectName.split(' ')[0]}, following up on ${context.companyName}'s active search for a certified partner for ${analysis.requestedSolution}. Would love to share our technical framework and schedule 20 minutes with our lead architect.`;

    return {
      action,
      title,
      whyPoints,
      rationale,
      priority: isHot ? 'HIGH' : 'MEDIUM',
      suggestedChannel: isHot ? 'Voice AI' : 'Email',
      suggestedMessage,
    };
  }

  // Full Pipeline Execution
  async runFullPipeline(params: {
    rawText: string;
    prospectName: string;
    prospectTitle: string;
    companyName: string;
    industry: string;
    location: string;
    techStack?: string;
    hiringSignals?: string;
    fundingSignals?: string;
    growthSignals?: string;
    sourcePlatform?: string;
    sourceUrl?: string;
    discoveryDate?: Date | string;
    pipelineValue?: number;
    productOfferings?: Array<{ name: string; description: string; valueProps?: string }>;
  }): Promise<FullAnalysisResult> {
    const analysis = await this.analyzeRequirement(params.rawText, {
      companyName: params.companyName,
      industry: params.industry,
      location: params.location,
      prospectTitle: params.prospectTitle,
    });

    const intent = await this.scoreIntent(analysis, {
      sourcePlatform: params.sourcePlatform,
      discoveryDate: params.discoveryDate,
    });

    const evidence = await this.generateEvidence(analysis, intent, {
      sourcePlatform: params.sourcePlatform,
      sourceUrl: params.sourceUrl,
      discoveryDate: params.discoveryDate,
      hiringSignals: params.hiringSignals,
      techStack: params.techStack,
    });

    const fit = await this.calculateFit(params.productOfferings || [], analysis, {
      industry: params.industry,
      techStack: params.techStack,
      location: params.location,
    });

    const qualification = await this.qualifyLead(analysis, intent, fit, {
      prospectName: params.prospectName,
      prospectTitle: params.prospectTitle,
      companyName: params.companyName,
      pipelineValue: params.pipelineValue,
    });

    const salesBrief = await this.generateSalesBrief(analysis, qualification, {
      prospectName: params.prospectName,
      prospectTitle: params.prospectTitle,
      companyName: params.companyName,
      industry: params.industry,
      techStack: params.techStack,
    });

    const nextBestAction = await this.generateNextBestAction(analysis, intent, fit, qualification, {
      prospectName: params.prospectName,
      companyName: params.companyName,
    });

    return {
      analysis,
      intent,
      evidence,
      fit,
      qualification,
      salesBrief,
      nextBestAction,
    };
  }
}

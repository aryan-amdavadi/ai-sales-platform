import { PrismaClient } from '@prisma/client';
import {
  SEED_COMPANIES,
  HERO_REQUIREMENT,
  RAW_SAMPLE_REQUIREMENTS,
} from '../src/data/demo/seed-data';

const prisma = new PrismaClient();

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Chris', 'Pat', 'Casey', 'Riley', 'Avery',
  'Logan', 'Cameron', 'Dakota', 'Reese', 'Skyler', 'Kendall', 'Harper', 'Peyton', 'Quinn', 'Rowan',
  'Devon', 'Finley', 'Hayden', 'Emerson', 'Sawyer', 'Adrian', 'Elliott', 'Sydney', 'Jesse', 'Kai'
];

const LAST_NAMES = [
  'Chen', 'Patel', 'Smith', 'Vance', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark'
];

const TECH_CATEGORIES = [
  'Cloud Infrastructure Modernization',
  'Cybersecurity & Zero Trust',
  'Enterprise Data Integration & ETL',
  'AI & Machine Learning Pipelines',
  'Legacy System Migration',
  'SaaS & API Orchestration',
  'Customer Experience & Voice Automation',
  'Compliance & Risk Analytics',
  'Industrial IoT & Telemetry',
  'DevSecOps & Kubernetes Orchestration'
];

const PLATFORMS = [
  { platform: 'LINKEDIN', name: 'LinkedIn Executive Network', url: 'https://linkedin.com' },
  { platform: 'X', name: 'X / Twitter Buying Signals', url: 'https://x.com' },
  { platform: 'WEBSITE', name: 'Corporate Career & RFP Portals', url: 'https://company.com' },
  { platform: 'PUBLIC_DIRECTORY', name: 'Public Procurement Registers', url: 'https://procurement.gov' },
  { platform: 'FREELANCE_PLATFORM', name: 'Enterprise Contract RFP Boards', url: 'https://upwork.com/enterprise' },
];

export async function runSeed() {
  console.log('🌱 Starting IntentOS deterministic seed...');

  // Clean previous data
  await prisma.transcript.deleteMany();
  await prisma.call.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.qualification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.companyInsight.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.leadSource.deleteMany();
  await prisma.company.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Default Users
  const user = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'alex.morgan@intentos.ai',
      role: 'HEAD_OF_SALES',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const voiceAgentUser = await prisma.user.create({
    data: {
      name: 'Nova AI Voice Agent',
      email: 'nova.voice@intentos.ai',
      role: 'AI_AGENT',
    },
  });

  // 2. Create Products
  await prisma.product.createMany({
    data: [
      {
        name: 'IntentOS Intelligence Suite',
        description: 'Autonomous public buying intent discovery and AI-guided qualification engine.',
        targetAudience: 'Enterprise B2B Sales & Revenue Teams',
        priceRange: '$24,000 - $120,000/yr',
        valueProps: 'Automated intent discovery, real-time public RFP enrichment, Voice AI qualification.',
      },
      {
        name: 'IntentOS Voice Outreach Copilot',
        description: 'Sub-second conversational voice agent for outbound requirement validation.',
        targetAudience: 'Inside Sales & SDR Teams',
        priceRange: '$12,000 - $60,000/yr',
        valueProps: 'Zero-latency voice qualification, automated CRM sync, live sentiment extraction.',
      },
    ],
  });

  // 3. Create LeadSources
  const createdSources: Record<string, any> = {};
  for (const src of PLATFORMS) {
    const sourceRecord = await prisma.leadSource.create({
      data: {
        name: src.name,
        platform: src.platform,
        sourceUrl: src.url,
        confidence: 88 + (src.platform.length % 10),
      },
    });
    createdSources[src.platform] = sourceRecord;
  }

  // 4. Create Companies & Insights
  const companyMap = new Map<string, any>();
  for (const compData of SEED_COMPANIES) {
    const comp = await prisma.company.create({
      data: {
        name: compData.name,
        domain: compData.domain,
        industry: compData.industry,
        size: compData.size,
        location: compData.location,
        description: compData.description,
        techStack: compData.techStack,
        hiringSignals: compData.hiringSignals,
        fundingSignals: compData.fundingSignals,
        growthSignals: compData.growthSignals,
      },
    });
    companyMap.set(comp.name, comp);

    // Add company insights
    await prisma.companyInsight.createMany({
      data: [
        {
          companyId: comp.id,
          insightType: 'HIRING',
          headline: `Aggressive hiring in engineering & modernization`,
          details: compData.hiringSignals,
          confidence: 92,
        },
        {
          companyId: comp.id,
          insightType: 'TECH_STACK',
          headline: `Primary Tech Infrastructure Stack`,
          details: compData.techStack,
          confidence: 95,
        },
        {
          companyId: comp.id,
          insightType: 'GROWTH',
          headline: `Market Expansion & Signals`,
          details: compData.growthSignals,
          confidence: 89,
        },
      ],
    });
  }

  // 5. Create 10 Campaigns
  const campaignNames = [
    'Enterprise SharePoint & M365 Migration',
    'SOC2 & FedRAMP Cloud Compliance',
    'Healthcare FHIR Interoperability Q3',
    'FinTech Low-Latency Settlement Brokers',
    'IoT Cold-Chain Telemetry Rollout',
    'Zero-Trust Federal IAM Modernization',
    'Renewable Grid Forecast AI Pipeline',
    'Vector Search E-Commerce Personalization',
    'K-12 EdTech Mastery Analytics Grant',
    'Global Port EDI & Terminal Automation',
  ];

  const createdCampaigns: any[] = [];
  for (let i = 0; i < campaignNames.length; i++) {
    const camp = await prisma.campaign.create({
      data: {
        name: campaignNames[i],
        targetAudience: `CTOs, VP Engineering & Procurement Leads in ${SEED_COMPANIES[i % SEED_COMPANIES.length].industry}`,
        status: i < 7 ? 'ACTIVE' : i === 7 ? 'PAUSED' : 'COMPLETED',
        goal: `Qualify and book executive discovery meetings for $${(100 + i * 25)}k+ opportunities.`,
        channels: 'Voice AI, Targeted Email, LinkedIn Executive Outreach',
      },
    });
    createdCampaigns.push(camp);
  }

  // 6. Create Hero Opportunity (ABC Technologies - Marcus Vance)
  const abcCompany = companyMap.get('ABC Technologies')!;
  const linkedinSource = createdSources['LINKEDIN'];

  const heroLead = await prisma.lead.create({
    data: {
      name: HERO_REQUIREMENT.contactName,
      title: HERO_REQUIREMENT.contactTitle,
      email: 'marcus.vance@abctechnologies.com',
      phone: '+1 (512) 893-4102',
      linkedinUrl: 'https://linkedin.com/in/marcus-vance-cto',
      companyId: abcCompany.id,
      sourceId: linkedinSource.id,
      campaignId: createdCampaigns[0].id,
      status: HERO_REQUIREMENT.status,
      intentScore: HERO_REQUIREMENT.intentScore,
      urgency: HERO_REQUIREMENT.urgency,
      qualificationScore: HERO_REQUIREMENT.qualificationScore,
      pipelineValue: HERO_REQUIREMENT.pipelineValue,
      salesBrief: HERO_REQUIREMENT.salesBrief,
      discoveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.requirement.create({
    data: {
      leadId: heroLead.id,
      sourceId: linkedinSource.id,
      title: HERO_REQUIREMENT.requirementTitle,
      description: HERO_REQUIREMENT.description,
      category: HERO_REQUIREMENT.category,
      tags: JSON.stringify(HERO_REQUIREMENT.tags),
      budgetEstimate: HERO_REQUIREMENT.budgetEstimate,
      timeframe: HERO_REQUIREMENT.timeframe,
      rawEvidence: HERO_REQUIREMENT.rawEvidence,
      confidenceScore: 96,
    },
  });

  await prisma.qualification.create({
    data: {
      leadId: heroLead.id,
      budgetFit: HERO_REQUIREMENT.budgetFit,
      authorityFit: HERO_REQUIREMENT.authorityFit,
      needFit: HERO_REQUIREMENT.needFit,
      timingFit: HERO_REQUIREMENT.timingFit,
      overallScore: HERO_REQUIREMENT.qualificationScore,
      reasoning: 'Marcus Vance is the ultimate technical decision maker with direct budgetary authority over the M365 modernization project.',
      summary: 'High fit score across BANT criteria. Urgent timeline to retire legacy 2016 server.',
      status: 'QUALIFIED',
    },
  });

  await prisma.recommendation.create({
    data: {
      leadId: heroLead.id,
      actionType: HERO_REQUIREMENT.recommendationAction,
      title: HERO_REQUIREMENT.recommendationTitle,
      rationale: HERO_REQUIREMENT.recommendationRationale,
      priority: 'HIGH',
      suggestedChannel: 'Voice AI',
      suggestedMessage:
        'Hi Marcus, following up on your search for a certified Microsoft partner for the SharePoint Online migration and SPFx workflows at ABC Technologies.',
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      leadId: heroLead.id,
      action: 'HERO_OPPORTUNITY_DISCOVERED',
      details: 'IntentOS discovered LinkedIn executive RFP post by CTO Marcus Vance.',
    },
  });

  // 7. Create Curated Sample Requirements
  for (let i = 0; i < RAW_SAMPLE_REQUIREMENTS.length; i++) {
    const rawReq = RAW_SAMPLE_REQUIREMENTS[i];
    const comp = companyMap.get(rawReq.companyName) || SEED_COMPANIES[i % SEED_COMPANIES.length];
    const src = createdSources[rawReq.platform] || createdSources['LINKEDIN'];
    const camp = createdCampaigns[(i + 1) % createdCampaigns.length];

    const lead = await prisma.lead.create({
      data: {
        name: rawReq.contactName,
        title: rawReq.contactTitle,
        email: `${rawReq.contactName.toLowerCase().replace(/[^a-z]/g, '.')}@${comp.domain || 'example.com'}`,
        phone: `+1 (555) ${100 + i * 7}-${2000 + i * 13}`,
        linkedinUrl: `https://linkedin.com/in/${rawReq.contactName.toLowerCase().replace(/[^a-z]/g, '-')}`,
        companyId: comp.id,
        sourceId: src.id,
        campaignId: camp.id,
        status: rawReq.status,
        intentScore: rawReq.intentScore,
        urgency: rawReq.urgency,
        qualificationScore: rawReq.qualificationScore,
        pipelineValue: rawReq.pipelineValue,
        salesBrief: rawReq.salesBrief,
        discoveredAt: new Date(Date.now() - (i + 1) * 36 * 60 * 60 * 1000),
      },
    });

    await prisma.requirement.create({
      data: {
        leadId: lead.id,
        sourceId: src.id,
        title: rawReq.requirementTitle,
        description: rawReq.description,
        category: rawReq.category,
        tags: JSON.stringify(rawReq.tags),
        budgetEstimate: rawReq.budgetEstimate,
        timeframe: rawReq.timeframe,
        rawEvidence: rawReq.rawEvidence,
        confidenceScore: 88 + (i % 8),
      },
    });

    await prisma.qualification.create({
      data: {
        leadId: lead.id,
        budgetFit: rawReq.budgetFit,
        authorityFit: rawReq.authorityFit,
        needFit: rawReq.needFit,
        timingFit: rawReq.timingFit,
        overallScore: rawReq.qualificationScore,
        reasoning: `Verified public intent requirement matching ${rawReq.category}. Clear decision maker engagement.`,
        summary: `Qualified via public intent analysis.`,
        status: 'QUALIFIED',
      },
    });

    await prisma.recommendation.create({
      data: {
        leadId: lead.id,
        actionType: rawReq.recommendationAction,
        title: rawReq.recommendationTitle,
        rationale: rawReq.recommendationRationale,
        priority: rawReq.intentScore >= 85 ? 'HIGH' : 'MEDIUM',
        suggestedChannel: 'Voice AI',
        suggestedMessage: `Hello ${lead.name.split(' ')[0]}, reaching out regarding your requirement for ${rawReq.requirementTitle}.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        leadId: lead.id,
        action: 'REQUIREMENT_INGESTED',
        details: `Discovered from ${rawReq.sourceName} with ${rawReq.intentScore} intent score.`,
      },
    });
  }

  // 8. Generate remaining opportunities to reach 105+ total opportunities across all 20 companies
  const companyList = Array.from(companyMap.values());
  const statuses: ('DISCOVERED' | 'RELEVANT' | 'HIGH_INTENT' | 'QUALIFIED' | 'CONTACTED' | 'INTERESTED' | 'MEETING')[] = [
    'DISCOVERED', 'RELEVANT', 'HIGH_INTENT', 'QUALIFIED', 'CONTACTED', 'INTERESTED', 'MEETING'
  ];
  const urgencies: ('LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE')[] = ['LOW', 'MEDIUM', 'HIGH', 'IMMEDIATE'];
  const platformKeys = Object.keys(createdSources);

  const neededCount = 105 - (1 + RAW_SAMPLE_REQUIREMENTS.length);
  console.log(`Generating ${neededCount} deterministic additional opportunities...`);

  for (let i = 0; i < neededCount; i++) {
    const comp = companyList[i % companyList.length];
    const firstName = FIRST_NAMES[(i * 3 + 7) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 5 + 11) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const titleRoles = ['VP of Engineering', 'Director of IT', 'Head of Infrastructure', 'Chief Information Officer', 'Director of Cloud Operations', 'VP of Digital Transformation', 'Procurement Lead', 'Enterprise Architect'];
    const title = titleRoles[i % titleRoles.length];

    const platformKey = platformKeys[i % platformKeys.length];
    const src = createdSources[platformKey];
    const camp = createdCampaigns[i % createdCampaigns.length];

    // Intent distribution: range from 45 to 88
    const intentScore = 45 + ((i * 17) % 44);
    const urgency = intentScore > 80 ? 'HIGH' : intentScore > 65 ? 'MEDIUM' : 'LOW';
    const status = statuses[i % statuses.length];
    const pipelineVal = 20000 + ((i * 13500) % 180000);
    const category = TECH_CATEGORIES[i % TECH_CATEGORIES.length];

    const lead = await prisma.lead.create({
      data: {
        name: fullName,
        title: title,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${comp.domain || 'example.com'}`,
        phone: `+1 (555) ${200 + (i % 800)}-${3000 + (i % 6000)}`,
        linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        companyId: comp.id,
        sourceId: src.id,
        campaignId: camp.id,
        status: status,
        intentScore: intentScore,
        urgency: urgency,
        qualificationScore: Math.max(40, intentScore - 5 + (i % 10)),
        pipelineValue: pipelineVal,
        salesBrief: `${fullName} at ${comp.name} is evaluating vendors for ${category}. Identified via public signals.`,
        discoveredAt: new Date(Date.now() - (i + 3) * 18 * 60 * 60 * 1000),
      },
    });

    const tags = [category, comp.industry, `${comp.name} Project`];
    await prisma.requirement.create({
      data: {
        leadId: lead.id,
        sourceId: src.id,
        title: `${category} RFP & Implementation`,
        description: `${comp.name} is looking to procure and implement solutions for ${category} to support regional expansion.`,
        category: category,
        tags: JSON.stringify(tags),
        budgetEstimate: `$${Math.round(pipelineVal * 0.8 / 1000)}k - $${Math.round(pipelineVal * 1.2 / 1000)}k`,
        timeframe: urgency === 'HIGH' ? 'Next 30 Days' : 'Q3/Q4 2026',
        rawEvidence: `Public sourcing signal detected on ${src.name}: Looking for specialized partners with verified enterprise delivery in ${category}.`,
        confidenceScore: 75 + (i % 22),
      },
    });

    await prisma.qualification.create({
      data: {
        leadId: lead.id,
        budgetFit: 70 + (i % 25),
        authorityFit: 75 + (i % 20),
        needFit: 70 + (i % 25),
        timingFit: 65 + (i % 30),
        overallScore: lead.qualificationScore,
        reasoning: `Matched against ICP criteria for ${comp.industry}. Verified title authority: ${title}.`,
        summary: `Automated baseline qualification completed.`,
        status: lead.qualificationScore >= 70 ? 'QUALIFIED' : 'PENDING',
      },
    });

    await prisma.recommendation.create({
      data: {
        leadId: lead.id,
        actionType: intentScore > 75 ? 'CALL_NOW' : intentScore > 60 ? 'SCHEDULE_DEMO' : 'SEND_PROPOSAL',
        title: intentScore > 75 ? `Autonomous AI Voice Call to ${fullName}` : `Deliver ${category} Solution Brief`,
        rationale: `Intent score of ${intentScore} with ${urgency} urgency based on public signals.`,
        priority: intentScore > 75 ? 'HIGH' : 'MEDIUM',
        suggestedChannel: intentScore > 75 ? 'Voice AI' : 'Email',
        suggestedMessage: `Hi ${firstName}, saw ${comp.name}'s public search for ${category} partners. Would love to share our technical framework.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        leadId: lead.id,
        action: 'SIGNAL_INGESTED',
        details: `Discovered opportunity for ${fullName} at ${comp.name}.`,
      },
    });
  }

  // 9. Generate 20 Calls with realistic dialogue transcripts
  console.log('Generating 20 realistic AI voice calls and transcripts...');
  const allLeads = await prisma.lead.findMany({ take: 25, include: { company: true, requirements: true } });

  const sampleConversations = [
    {
      summary: 'CTO confirmed SharePoint migration timeline and requested SPFx custom component case studies.',
      sentiment: 'HIGHLY_INTERESTED',
      interestLevel: 'EXTREME',
      nextStep: 'Send custom SPFx case study & schedule technical architect meeting with CTO on Thursday 2 PM.',
      dialogue: [
        { speaker: 'AI', text: 'Hi Marcus, this is Nova from IntentOS calling regarding your search for a SharePoint Online implementation partner at ABC Technologies.', timestamp: '00:02', intentFlag: 'GREETING' },
        { speaker: 'Lead', text: 'Yes, hi Nova. We did put out an RFP recently for our 2016 migration. Are you a certified Microsoft partner?', timestamp: '00:08', intentFlag: 'QUALIFYING_QUESTION' },
        { speaker: 'AI', text: 'Yes Marcus. We specialize in zero-downtime legacy migrations to SharePoint Online and Microsoft 365, including custom SPFx workflow development and user training.', timestamp: '00:16', intentFlag: 'VALUE_PROPOSITION' },
        { speaker: 'Lead', text: 'That is exactly what we need. We have about 750 users and several legacy forms that need custom SPFx replacement. Can you send over a case study and book 30 minutes with your lead architect?', timestamp: '00:27', intentFlag: 'BUYING_SIGNAL' },
        { speaker: 'AI', text: 'Absolutely Marcus. I have sent our Enterprise SharePoint Modernization brief to your email and scheduled our senior architect for Thursday at 2 PM CT.', timestamp: '00:39', intentFlag: 'CLOSING' },
        { speaker: 'Lead', text: 'Perfect. Looking forward to it.', timestamp: '00:43', intentFlag: 'CONFIRMATION' },
      ],
    },
    {
      summary: 'VP of Infosec discussed SOC2 Type II automated evidence collectors for AWS and K8s.',
      sentiment: 'POSITIVE',
      interestLevel: 'HIGH',
      nextStep: 'Deliver SOC2 AWS connector specifications and schedule live console demo.',
      dialogue: [
        { speaker: 'AI', text: 'Hello Elena, Nova from IntentOS here. I saw Nova Systems is evaluating compliance automation platforms for SOC2 Type II and FedRAMP.', timestamp: '00:03', intentFlag: 'CONTEXT_HOOK' },
        { speaker: 'Lead', text: 'Hi. Yes, we are actively looking. Does your platform support continuous K8s cluster telemetry without agent bloat?', timestamp: '00:10', intentFlag: 'TECHNICAL_REQUIREMENT' },
        { speaker: 'AI', text: 'Yes Elena, our agentless eBPF collectors map directly to NIST 800-53 and SOC2 Trust Services Criteria in real-time.', timestamp: '00:20', intentFlag: 'PRODUCT_CAPABILITY' },
        { speaker: 'Lead', text: 'That sounds promising. Let us set up a live demo next Tuesday morning.', timestamp: '00:28', intentFlag: 'DEMO_REQUEST' },
      ],
    },
  ];

  for (let i = 0; i < 20; i++) {
    const lead = allLeads[i % allLeads.length];
    const isHero = lead.id === heroLead.id;
    const convoTemplate = isHero ? sampleConversations[0] : sampleConversations[i % sampleConversations.length];
    const duration = 90 + ((i * 37) % 210);

    const callRecord = await prisma.call.create({
      data: {
        leadId: lead.id,
        campaignId: lead.campaignId,
        userId: voiceAgentUser.id,
        status: 'COMPLETED',
        scheduledAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        endedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000 + duration * 1000),
        durationSeconds: duration,
        summary: isHero ? convoTemplate.summary : `Autonomous voice discovery call with ${lead.name} regarding ${lead.requirements[0]?.title || 'technical requirements'}. Verified timeline and project scope.`,
        sentiment: isHero ? 'HIGHLY_INTERESTED' : (i % 3 === 0 ? 'HIGHLY_INTERESTED' : i % 3 === 1 ? 'POSITIVE' : 'NEUTRAL'),
        interestLevel: isHero ? 'EXTREME' : (i % 2 === 0 ? 'HIGH' : 'MEDIUM'),
        nextStep: isHero ? convoTemplate.nextStep : `Follow up with tailored solution proposal for ${lead.company.name}.`,
        recordingUrl: `https://storage.intentos.ai/recordings/call_${lead.id}_${i}.mp3`,
      },
    });

    const dialogueData = isHero ? convoTemplate.dialogue : [
      { speaker: 'AI', text: `Hello ${lead.name}, I am Nova from IntentOS calling regarding ${lead.company.name}'s initiative around ${lead.requirements[0]?.category || 'system modernization'}.`, timestamp: '00:02', intentFlag: 'GREETING' },
      { speaker: 'Lead', text: `Hi Nova, yes we are actively reviewing options for this quarter. What specific solutions do you provide?`, timestamp: '00:09', intentFlag: 'INTEREST' },
      { speaker: 'AI', text: `We provide automated discovery and enterprise-grade deployment frameworks tailored for ${lead.company.industry}.`, timestamp: '00:19', intentFlag: 'VALUE_PROPOSITION' },
      { speaker: 'Lead', text: `Great, please send your technical overview and let us book time with our procurement lead.`, timestamp: '00:28', intentFlag: 'NEXT_STEP' },
    ];

    await prisma.transcript.create({
      data: {
        callId: callRecord.id,
        dialogue: JSON.stringify(dialogueData),
        rawText: dialogueData.map(d => `${d.speaker} (${d.timestamp}): ${d.text}`).join('\n'),
        speakerTimeline: JSON.stringify({ aiDurationSeconds: Math.round(duration * 0.45), leadDurationSeconds: Math.round(duration * 0.55) }),
        sentimentCurve: JSON.stringify([
          { time: '00:00', score: 0.6 },
          { time: '00:15', score: 0.75 },
          { time: '00:30', score: 0.9 },
          { time: '00:45', score: 0.95 },
        ]),
      },
    });
  }

  const totalLeads = await prisma.lead.count();
  const totalCalls = await prisma.call.count();
  const totalCompanies = await prisma.company.count();
  const totalCampaigns = await prisma.campaign.count();
  const totalRequirements = await prisma.requirement.count();

  console.log(`✅ Seed finished successfully!`);
  console.log(`📊 Summary:`);
  console.log(`   - Companies: ${totalCompanies}`);
  console.log(`   - Leads / Opportunities: ${totalLeads}`);
  console.log(`   - Requirements: ${totalRequirements}`);
  console.log(`   - Campaigns: ${totalCampaigns}`);
  console.log(`   - Calls & Transcripts: ${totalCalls}`);
  console.log(`   - Hero Opportunity: ABC Technologies (CTO Marcus Vance, Intent: 94)`);
}

if (process.argv[1]?.includes('seed')) {
  runSeed()
    .catch((e) => {
      console.error('Error during seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

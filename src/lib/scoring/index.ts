import { prisma } from '@/lib/db/prisma';
import { DashboardMetrics, LeadFilterParams } from '@/types';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [
    totalOpportunities,
    highIntentCount,
    readyToContactCount,
    aiCallsCount,
    interestedCount,
    meetingsCount,
    pipelineAgg,
    allLeads,
    priorityLeads,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { intentScore: { gte: 80 } } }),
    prisma.lead.count({ where: { status: { in: ['HIGH_INTENT', 'QUALIFIED'] } } }),
    prisma.call.count(),
    prisma.lead.count({ where: { status: 'INTERESTED' } }),
    prisma.lead.count({ where: { status: 'MEETING' } }),
    prisma.lead.aggregate({ _sum: { pipelineValue: true } }),
    prisma.lead.findMany({ select: { status: true } }),
    prisma.lead.findMany({
      where: { intentScore: { gte: 75 } },
      orderBy: { intentScore: 'desc' },
      take: 5,
      include: {
        company: true,
        source: true,
        requirements: { take: 1 },
      },
    }),
  ]);

  const stages = [
    'DISCOVERED',
    'RELEVANT',
    'HIGH_INTENT',
    'QUALIFIED',
    'CONTACTED',
    'INTERESTED',
    'MEETING',
  ];

  const stageCounts: Record<string, number> = {};
  for (const s of stages) stageCounts[s] = 0;

  for (const lead of allLeads) {
    if (stageCounts[lead.status] !== undefined) {
      stageCounts[lead.status]++;
    }
  }

  const funnelData = stages.map((stage) => ({
    stage,
    count: stageCounts[stage],
    percentage: totalOpportunities > 0 ? Math.round((stageCounts[stage] / totalOpportunities) * 100) : 0,
  }));

  const priorityQueue = priorityLeads.map((l) => ({
    id: l.id,
    companyName: l.company.name,
    contactName: l.name,
    contactTitle: l.title,
    intentScore: l.intentScore,
    urgency: l.urgency,
    status: l.status,
    pipelineValue: l.pipelineValue,
    topRequirement: l.requirements[0]?.title || 'System Modernization',
    primarySource: l.source?.platform || 'LINKEDIN',
  }));

  return {
    totalOpportunities,
    highIntentCount,
    readyToContactCount,
    aiCallsCount,
    interestedCount,
    meetingsCount,
    totalPipelineValue: pipelineAgg._sum.pipelineValue || 0,
    funnelData,
    priorityQueue,
  };
}

export async function getOpportunities(params: LeadFilterParams) {
  const where: any = {};

  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim();
    where.OR = [
      { name: { contains: term } },
      { title: { contains: term } },
      { salesBrief: { contains: term } },
      { company: { name: { contains: term } } },
      { company: { industry: { contains: term } } },
      { company: { techStack: { contains: term } } },
      { company: { hiringSignals: { contains: term } } },
      { requirements: { some: { title: { contains: term } } } },
      { requirements: { some: { tags: { contains: term } } } },
      { requirements: { some: { description: { contains: term } } } },
      { requirements: { some: { rawEvidence: { contains: term } } } },
    ];
  }

  if (params.minIntent !== undefined) {
    where.intentScore = { ...(where.intentScore || {}), gte: params.minIntent };
  }

  if (params.maxIntent !== undefined) {
    where.intentScore = { ...(where.intentScore || {}), lte: params.maxIntent };
  }

  if (params.industry && params.industry !== 'ALL') {
    where.company = { ...(where.company || {}), industry: params.industry };
  }

  if (params.source && params.source !== 'ALL') {
    where.source = { platform: params.source };
  }

  if (params.status && params.status !== 'ALL') {
    where.status = params.status;
  }

  if (params.urgency && params.urgency !== 'ALL') {
    where.urgency = params.urgency;
  }

  if (params.location && params.location !== 'ALL') {
    where.company = { ...(where.company || {}), location: { contains: params.location } };
  }

  let orderBy: any = { intentScore: 'desc' };
  if (params.sortBy === 'newest') {
    orderBy = { discoveredAt: 'desc' };
  } else if (params.sortBy === 'qualification') {
    orderBy = { qualificationScore: 'desc' };
  } else if (params.sortBy === 'company') {
    orderBy = { company: { name: params.sortOrder || 'asc' } };
  } else if (params.sortBy === 'intent') {
    orderBy = { intentScore: params.sortOrder || 'desc' };
  }

  const [total, items] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy,
      take: params.limit || 50,
      skip: params.offset || 0,
      include: {
        company: true,
        source: true,
        requirements: true,
        qualifications: true,
        recommendations: true,
        calls: true,
      },
    }),
  ]);

  return { total, items };
}

export async function getOpportunityById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      company: {
        include: {
          insights: true,
        },
      },
      source: true,
      requirements: true,
      qualifications: true,
      recommendations: true,
      calls: {
        include: {
          transcript: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      activityLogs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getCampaignsData() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      leads: {
        select: {
          id: true,
          status: true,
          intentScore: true,
          pipelineValue: true,
        },
      },
      calls: {
        select: {
          id: true,
          status: true,
          interestLevel: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return campaigns.map((c) => {
    const totalLeads = c.leads.length;
    const contacted = c.leads.filter((l) => ['CONTACTED', 'INTERESTED', 'MEETING', 'CONVERTED'].includes(l.status)).length;
    const interested = c.leads.filter((l) => ['INTERESTED', 'MEETING', 'CONVERTED'].includes(l.status)).length;
    const meetings = c.leads.filter((l) => ['MEETING', 'CONVERTED'].includes(l.status)).length;
    const totalPipeline = c.leads.reduce((sum, l) => sum + l.pipelineValue, 0);

    return {
      id: c.id,
      name: c.name,
      targetAudience: c.targetAudience,
      status: c.status,
      goal: c.goal,
      channels: c.channels,
      totalLeads,
      contacted,
      interested,
      meetings,
      totalPipeline,
      createdAt: c.createdAt,
    };
  });
}

export async function getCallsData(leadId?: string) {
  const where: any = leadId ? { leadId } : {};
  return prisma.call.findMany({
    where,
    include: {
      lead: {
        include: {
          company: true,
        },
      },
      transcript: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCallById(id: string) {
  return prisma.call.findUnique({
    where: { id },
    include: {
      lead: {
        include: {
          company: true,
          requirements: true,
          recommendations: true,
        },
      },
      transcript: true,
    },
  });
}

export async function getIntelligenceData() {
  const companies = await prisma.company.findMany({
    include: {
      insights: true,
      leads: {
        select: {
          id: true,
          name: true,
          title: true,
          intentScore: true,
          status: true,
          pipelineValue: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return companies.map((comp) => {
    const avgIntent = comp.leads.length > 0
      ? Math.round(comp.leads.reduce((sum, l) => sum + l.intentScore, 0) / comp.leads.length)
      : 0;
    const totalPipeline = comp.leads.reduce((sum, l) => sum + l.pipelineValue, 0);

    return {
      id: comp.id,
      name: comp.name,
      domain: comp.domain,
      industry: comp.industry,
      size: comp.size,
      location: comp.location,
      description: comp.description,
      techStack: comp.techStack,
      hiringSignals: comp.hiringSignals,
      fundingSignals: comp.fundingSignals,
      growthSignals: comp.growthSignals,
      insights: comp.insights,
      totalLeads: comp.leads.length,
      averageIntent: avgIntent,
      pipelineValue: totalPipeline,
    };
  });
}

export async function getAnalyticsData() {
  const [leads, calls, companies, campaigns] = await Promise.all([
    prisma.lead.findMany({
      include: {
        company: true,
        source: true,
      },
    }),
    prisma.call.findMany(),
    prisma.company.findMany(),
    prisma.campaign.findMany({
      include: {
        leads: true,
      },
    }),
  ]);

  // Funnel stages
  const stages = ['DISCOVERED', 'RELEVANT', 'HIGH_INTENT', 'QUALIFIED', 'CONTACTED', 'INTERESTED', 'MEETING'];
  const funnel = stages.map((stage) => ({
    stage,
    count: leads.filter((l) => l.status === stage).length,
  }));

  // Intent score distribution (ranges: 0-40, 41-60, 61-75, 76-85, 86-100)
  const intentBuckets = [
    { range: '0-40 (Low)', count: 0 },
    { range: '41-60 (Moderate)', count: 0 },
    { range: '61-75 (Medium)', count: 0 },
    { range: '76-85 (High)', count: 0 },
    { range: '86-100 (Very High)', count: 0 },
  ];

  leads.forEach((l) => {
    if (l.intentScore <= 40) intentBuckets[0].count++;
    else if (l.intentScore <= 60) intentBuckets[1].count++;
    else if (l.intentScore <= 75) intentBuckets[2].count++;
    else if (l.intentScore <= 85) intentBuckets[3].count++;
    else intentBuckets[4].count++;
  });

  // Source distribution
  const sourceMap: Record<string, number> = {};
  leads.forEach((l) => {
    const src = l.source?.platform || 'OTHER';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });
  const sourceDistribution = Object.entries(sourceMap).map(([source, count]) => ({
    source,
    count,
  }));

  // Industry distribution
  const industryMap: Record<string, number> = {};
  leads.forEach((l) => {
    const ind = l.company.industry || 'Unknown';
    industryMap[ind] = (industryMap[ind] || 0) + 1;
  });
  const industryDistribution = Object.entries(industryMap).map(([industry, count]) => ({
    industry,
    count,
  }));

  // Campaign performance
  const campaignPerformance = campaigns.map((c) => ({
    name: c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name,
    leads: c.leads.length,
    highIntent: c.leads.filter((l) => l.intentScore >= 75).length,
    meetings: c.leads.filter((l) => ['MEETING', 'CONVERTED'].includes(l.status)).length,
  }));

  return {
    funnel,
    intentBuckets,
    sourceDistribution,
    industryDistribution,
    campaignPerformance,
    totalOpportunities: leads.length,
    totalCalls: calls.length,
    totalCompanies: companies.length,
    totalCampaigns: campaigns.length,
  };
}

export async function getAdminData() {
  const [
    users,
    totalOpportunities,
    totalCalls,
    totalCampaigns,
    callsWithDuration,
    recentActivity,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.lead.count(),
    prisma.call.count(),
    prisma.campaign.count(),
    prisma.call.findMany({ select: { durationSeconds: true } }),
    prisma.activityLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        lead: {
          include: {
            company: true,
          },
        },
      },
    }),
  ]);

  const totalSeconds = callsWithDuration.reduce((sum, c) => sum + c.durationSeconds, 0);
  const totalVoiceMinutes = Math.round(totalSeconds / 60);

  return {
    users,
    totalOpportunities,
    totalCalls,
    totalCampaigns,
    totalVoiceMinutes,
    systemStatus: {
      database: 'HEALTHY (SQLite Local)',
      voiceEngine: 'READY (Nova AI Streamer)',
      aiScoring: 'ONLINE',
      uptime: '99.98%',
      latencyMs: 14,
    },
    recentActivity,
  };
}


import { prisma } from '@/lib/db/prisma';

export interface AnalyticsFilterParams {
  workspaceId: string;
  startDate?: Date;
  endDate?: Date;
  campaignId?: string;
  source?: string;
  industry?: string;
}

export async function getRevenueIntelligence(params: AnalyticsFilterParams) {
  const { workspaceId, startDate, endDate, campaignId, source, industry } = params;

  const leadWhere: any = { workspaceId };
  if (startDate || endDate) {
    leadWhere.discoveredAt = {};
    if (startDate) leadWhere.discoveredAt.gte = startDate;
    if (endDate) leadWhere.discoveredAt.lte = endDate;
  }
  if (source && source !== 'ALL') {
    leadWhere.source = { platform: source };
  }
  if (industry && industry !== 'ALL') {
    leadWhere.company = { industry };
  }
  if (campaignId && campaignId !== 'ALL') {
    leadWhere.enrollments = { some: { campaignId } };
  }

  const leads = await prisma.lead.findMany({
    where: leadWhere,
    include: {
      source: true,
      company: true,
      enrollments: true,
      calls: true,
    }
  });

  const callsWhere: any = { workspaceId };
  if (startDate || endDate) {
    callsWhere.startedAt = {};
    if (startDate) callsWhere.startedAt.gte = startDate;
    if (endDate) callsWhere.startedAt.lte = endDate;
  }
  const calls = await prisma.call.findMany({
    where: callsWhere,
    include: { lead: true }
  });

  const campaignsWhere: any = { workspaceId };
  if (campaignId && campaignId !== 'ALL') campaignsWhere.id = campaignId;
  const campaigns = await prisma.campaign.findMany({
    where: campaignsWhere,
    include: { enrollments: true }
  });

  const usageWhere: any = { workspaceId };
  if (startDate || endDate) {
    usageWhere.timestamp = {};
    if (startDate) usageWhere.timestamp.gte = startDate;
    if (endDate) usageWhere.timestamp.lte = endDate;
  }
  const usage = await prisma.usageLedger.findMany({
    where: usageWhere
  });

  // DISCOVERY
  const totalDiscovered = leads.length;
  const sourceDistribution: Record<string, number> = {};
  let totalDuplicates = 0; // Simulated for now if not tracked in DB
  leads.forEach(l => {
    const src = l.source?.platform || 'UNKNOWN';
    sourceDistribution[src] = (sourceDistribution[src] || 0) + 1;
    // Assuming enrichment completeness based on fields present
    if (!l.company?.domain) totalDuplicates += 0.05; // Mock metric
  });
  
  // QUALITY
  let totalIntent = 0;
  let totalQual = 0;
  let highIntentCount = 0;
  leads.forEach(l => {
    totalIntent += l.intentScore;
    totalQual += l.qualificationScore;
    if (l.intentScore >= 80) highIntentCount++;
  });
  const avgIntent = totalDiscovered ? Math.round(totalIntent / totalDiscovered) : 0;
  const avgQual = totalDiscovered ? Math.round(totalQual / totalDiscovered) : 0;
  const highIntentPercentage = totalDiscovered ? Math.round((highIntentCount / totalDiscovered) * 100) : 0;

  // VOICE
  const callsAttempted = calls.length;
  let connectedCalls = 0;
  let totalDuration = 0;
  let voicemails = 0;
  calls.forEach(c => {
    if (c.status === 'COMPLETED' || c.status === 'HANDED_OFF') connectedCalls++;
    if (c.status === 'VOICEMAIL') voicemails++;
    totalDuration += (c.durationSeconds || 0);
  });
  const answerRate = callsAttempted ? Math.round((connectedCalls / callsAttempted) * 100) : 0;
  const avgDuration = connectedCalls ? Math.round(totalDuration / connectedCalls) : 0;
  const voicemailRate = callsAttempted ? Math.round((voicemails / callsAttempted) * 100) : 0;

  // CAMPAIGN
  let enrolled = 0;
  let contacted = 0;
  let interested = 0;
  let meeting = 0;
  campaigns.forEach(c => {
    enrolled += c.enrollments.length;
    c.enrollments.forEach(e => {
      if (['CONTACTED', 'CONNECTED', 'QUALIFIED', 'INTERESTED', 'MEETING'].includes(e.status)) contacted++;
      if (['INTERESTED', 'MEETING', 'QUALIFIED'].includes(e.status)) interested++;
      if (e.status === 'MEETING') meeting++;
    });
  });

  // REVENUE
  let pipelineValue = 0;
  let qualifiedPipeline = 0;
  let meetingValue = 0;
  leads.forEach(l => {
    pipelineValue += l.pipelineValue;
    if (['QUALIFIED', 'INTERESTED', 'MEETING', 'CONVERTED'].includes(l.status)) {
      qualifiedPipeline += l.pipelineValue;
    }
    if (['MEETING', 'CONVERTED'].includes(l.status)) {
      meetingValue += l.pipelineValue;
    }
  });

  // OPERATIONS
  let voiceMinutes = 0;
  let enrichedLeads = 0;
  let crmSyncs = 0;
  usage.forEach(u => {
    if (u.type === 'VOICE_MINUTES') voiceMinutes += u.amount;
    if (u.type === 'ENRICHED_LEADS') enrichedLeads += u.amount;
    if (u.type === 'CRM_SYNC') crmSyncs += u.amount;
  });

  // Trend data for charts (by date)
  const trendMap: Record<string, any> = {};
  leads.forEach(l => {
    const date = new Date(l.discoveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!trendMap[date]) trendMap[date] = { date, pipeline: 0, intent: 0, leads: 0 };
    trendMap[date].pipeline += l.pipelineValue;
    trendMap[date].intent += l.intentScore;
    trendMap[date].leads += 1;
  });
  const trendData = Object.values(trendMap).map((d: any) => ({
    ...d,
    avgIntent: Math.round(d.intent / d.leads)
  })).slice(-14);

  return {
    metrics: {
      discovery: {
        opportunities: totalDiscovered,
        sourceDistribution: Object.entries(sourceDistribution).map(([name, value]) => ({ name, value })),
      },
      quality: {
        averageIntent: avgIntent,
        averageQualification: avgQual,
        highIntentPercentage,
      },
      voice: {
        callsAttempted,
        connectedCalls,
        answerRate,
        averageDuration: avgDuration,
        voicemailRate,
      },
      campaign: {
        enrolled,
        contacted,
        interested,
        meeting,
      },
      revenue: {
        pipelineValue,
        qualifiedPipeline,
        meetingValue,
      },
      operations: {
        voiceMinutes,
        enrichedLeads,
        crmSyncs,
      }
    },
    trendData,
  };
}

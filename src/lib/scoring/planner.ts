import { prisma } from '@/lib/db/prisma';

export async function generateFollowUpPlan(params: {
  callId: string;
  leadId: string;
  analysis: any;
}) {
  const { callId, leadId, analysis } = params;

  let action = 'RETRY_CALL';
  let reason = 'Default action based on unclassified call outcome';
  let expectedOutcome = 'Re-establish contact';
  let scheduledFor = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow by default
  let owner = 'AI_AGENT';
  let channel = 'VOICE';

  const interest = analysis.interestLevel || 'LOW';
  const summaryLower = (analysis.callSummary || '').toLowerCase();
  const objections = analysis.objections || [];
  
  if (interest === 'HIGH' || interest === 'EXTREME') {
    action = 'SCHEDULE_MEETING';
    reason = 'Prospect demonstrated high interest';
    expectedOutcome = 'Discovery call or demo completion';
    scheduledFor = new Date(); // Immediately route
    channel = 'CALENDAR';
    owner = 'SALES_REP';
  } else if (summaryLower.includes('callback') || summaryLower.includes('call back')) {
    action = 'CALLBACK';
    reason = 'Prospect explicitly requested a callback';
    expectedOutcome = 'Reconnect at a better time';
    channel = 'VOICE';
  } else if (objections.length > 0 && interest !== 'LOW') {
    action = 'SEND_CONTENT';
    reason = `Prospect had objections: ${objections[0]}`;
    expectedOutcome = 'Address concerns with targeted collateral';
    channel = 'EMAIL';
    scheduledFor = new Date();
  } else if (analysis.qualificationScore && analysis.qualificationScore >= 80) {
    action = 'ROUTE_TO_SALES';
    reason = 'Prospect is highly qualified';
    expectedOutcome = 'Human AE takes over account';
    owner = 'SALES_REP';
    channel = 'CRM';
    scheduledFor = new Date();
  } else if (summaryLower.includes('voicemail') || summaryLower.includes('no answer')) {
    action = 'RETRY_CALL';
    reason = 'No contact was made on previous attempt';
    expectedOutcome = 'Successfully connect with prospect';
    channel = 'VOICE';
  } else if (summaryLower.includes('not interested') || summaryLower.includes('opt out') || summaryLower.includes('unsubscribe') || summaryLower.includes('stop')) {
    action = 'SUPPRESS_OUTREACH';
    reason = 'Prospect requested to be removed from lists';
    expectedOutcome = 'Permanent exclusion from future campaigns';
    owner = 'SYSTEM';
    channel = 'NONE';
    scheduledFor = new Date(); // Immediate
  } else if (analysis.qualificationScore && analysis.qualificationScore < 50) {
    action = 'STOP_CAMPAIGN';
    reason = 'Prospect did not meet qualification criteria';
    expectedOutcome = 'Halt active sequences';
    owner = 'SYSTEM';
    channel = 'NONE';
    scheduledFor = new Date();
  }

  const plan = await prisma.followUpPlan.create({
    data: {
      leadId,
      callId,
      action,
      scheduledFor,
      reason,
      channel,
      owner,
      expectedOutcome,
      status: 'PENDING',
    },
  });

  return plan;
}

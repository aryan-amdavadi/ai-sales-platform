import { prisma } from '@/lib/db/prisma';

export async function getBillingPeriodId(): Promise<string> {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export async function appendUsage(workspaceId: string, type: string, amount: number, description?: string) {
  const billingPeriodId = await getBillingPeriodId();
  
  return prisma.usageLedger.create({
    data: {
      workspaceId,
      billingPeriodId,
      type,
      amount,
      description,
    },
  });
}

export async function getAggregatedUsage(workspaceId: string, billingPeriodId: string) {
  const usage = await prisma.usageLedger.groupBy({
    by: ['type'],
    where: {
      workspaceId,
      billingPeriodId,
    },
    _sum: {
      amount: true,
    },
  });

  return usage.reduce((acc, curr) => {
    acc[curr.type] = curr._sum.amount || 0;
    return acc;
  }, {} as Record<string, number>);
}

export async function checkUsageLimit(workspaceId: string, type: string, requestedAmount: number = 1): Promise<{ allowed: boolean, remaining: number, limit: number }> {
  const billingPeriodId = await getBillingPeriodId();

  const subscription = await prisma.workspaceSubscription.findUnique({
    where: { workspaceId },
    include: { plan: true },
  });

  if (!subscription || subscription.status !== 'ACTIVE') {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const usage = await getAggregatedUsage(workspaceId, billingPeriodId);
  const currentUsage = usage[type] || 0;

  let limit = 0;
  switch (type) {
    case 'VOICE_MINUTES':
      limit = subscription.plan.aiVoiceMinuteLimit;
      break;
    case 'DISCOVERED_LEADS':
      limit = subscription.plan.discoveryLimit;
      break;
    case 'CAMPAIGNS':
      limit = subscription.plan.campaignLimit;
      break;
    case 'ENRICHED_LEADS':
    case 'AI_ANALYSIS':
    case 'IMPORTS':
    case 'CRM_SYNC':
      // For simplicity in this implementation, we might not have explicit caps on these in the prompt beyond plan contact limits.
      // But let's assume they might tie to contactLimit or are unlimited for now if not explicitly mapped.
      limit = subscription.plan.contactLimit; // Fallback mapping for demo purposes
      break;
    default:
      limit = 999999;
  }

  const remaining = limit - currentUsage;
  const allowed = remaining >= requestedAmount;

  return { allowed, remaining, limit };
}

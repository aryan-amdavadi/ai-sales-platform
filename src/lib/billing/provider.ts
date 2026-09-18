import { prisma } from '@/lib/db/prisma';
import { getBillingPeriodId, getAggregatedUsage } from './usage';

export interface BillingProvider {
  createInvoice(workspaceId: string, amount: number, currency: string): Promise<any>;
  syncSubscription(workspaceId: string, planName: string): Promise<any>;
  cancelSubscription(workspaceId: string): Promise<any>;
}

export class InternalSimulatorProvider implements BillingProvider {
  async createInvoice(workspaceId: string, amount: number, currency: string = 'USD') {
    const billingPeriodId = await getBillingPeriodId();
    const usageSnapshot = await getAggregatedUsage(workspaceId, billingPeriodId);

    const invoice = await prisma.invoice.create({
      data: {
        workspaceId,
        billingPeriodId,
        amount,
        currency,
        status: 'DRAFT',
        usageSummary: JSON.stringify(usageSnapshot),
      },
    });

    return invoice;
  }

  async syncSubscription(workspaceId: string, planName: string) {
    let plan = await prisma.subscriptionPlan.findUnique({ where: { name: planName } });
    if (!plan) {
      // Auto-create plan if it doesn't exist for hackathon demo
      plan = await prisma.subscriptionPlan.create({
        data: {
          name: planName,
          priceMonthly: planName === 'Enterprise' ? 999 : planName === 'Growth' ? 299 : 99,
          contactLimit: planName === 'Enterprise' ? 100000 : planName === 'Growth' ? 10000 : 1000,
          aiVoiceMinuteLimit: planName === 'Enterprise' ? 5000 : planName === 'Growth' ? 1000 : 100,
          discoveryLimit: planName === 'Enterprise' ? 50000 : planName === 'Growth' ? 5000 : 500,
          campaignLimit: planName === 'Enterprise' ? 100 : planName === 'Growth' ? 20 : 5,
          teamMemberLimit: planName === 'Enterprise' ? 50 : planName === 'Growth' ? 10 : 2,
          integrationLimit: planName === 'Enterprise' ? 20 : planName === 'Growth' ? 5 : 2,
          exportLimit: planName === 'Enterprise' ? 100000 : planName === 'Growth' ? 10000 : 1000,
        }
      });
    }

    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const subscription = await prisma.workspaceSubscription.upsert({
      where: { workspaceId },
      update: {
        planId: plan.id,
        status: 'ACTIVE',
        currentPeriodEnd,
      },
      create: {
        workspaceId,
        planId: plan.id,
        status: 'ACTIVE',
        currentPeriodEnd,
      }
    });

    return subscription;
  }

  async cancelSubscription(workspaceId: string) {
    return prisma.workspaceSubscription.update({
      where: { workspaceId },
      data: { cancelAtPeriodEnd: true },
    });
  }
}

export class StripeProvider implements BillingProvider {
  // Placeholder for real Stripe integration
  async createInvoice(workspaceId: string, amount: number, currency: string) {
    throw new Error('Stripe is not configured.');
  }

  async syncSubscription(workspaceId: string, planName: string) {
    throw new Error('Stripe is not configured.');
  }

  async cancelSubscription(workspaceId: string) {
    throw new Error('Stripe is not configured.');
  }
}

// Factory
export function getBillingProvider(): BillingProvider {
  if (process.env.STRIPE_SECRET_KEY) {
    return new StripeProvider();
  }
  return new InternalSimulatorProvider();
}

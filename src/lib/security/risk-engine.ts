import { prisma } from '@/lib/db/prisma';

/**
 * Deterministic Risk Engine
 * Analyzes workspace behavior and triggers fraud signals.
 */
export class RiskEngine {
  
  static async evaluateWorkspace(workspaceId: string) {
    const signals: any[] = [];
    
    // Check 1: Abnormal Call Volume (e.g., > 1000 calls in the last 24h)
    const recentCalls = await prisma.call.count({
      where: {
        workspaceId,
        startedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    if (recentCalls > 1000) {
      signals.push({
        type: 'ABNORMAL_CALL_VOLUME',
        riskLevel: 'CRITICAL',
        description: `Workspace initiated ${recentCalls} calls in 24h, exceeding threshold.`,
      });
    } else if (recentCalls > 500) {
      signals.push({
        type: 'HIGH_CALL_VOLUME',
        riskLevel: 'HIGH',
        description: `Workspace initiated ${recentCalls} calls in 24h.`,
      });
    }

    // Check 2: Repeated CRM failures (e.g. > 50 sync failures)
    const recentFailures = await prisma.syncLog.count({
      where: {
        integration: {
          workspaceId,
        },
        status: 'FAILED',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    if (recentFailures > 50) {
      signals.push({
        type: 'REPEATED_API_FAILURES',
        riskLevel: 'HIGH',
        description: `Workspace experienced ${recentFailures} CRM sync failures in 24h.`,
      });
    }

    // Persist Signals
    for (const signal of signals) {
      await prisma.fraudSignal.create({
        data: {
          workspaceId,
          type: signal.type,
          riskLevel: signal.riskLevel,
          description: signal.description,
          metadata: JSON.stringify({ recentCalls, recentFailures }),
        }
      });
    }

    return signals;
  }
}

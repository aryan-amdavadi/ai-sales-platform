import { describe, it, expect } from 'vitest';
import { getDashboardMetrics, getOpportunities, getOpportunityById } from '@/lib/scoring';

describe('Scoring & Opportunity Queries', () => {
  it('returns valid dashboard metrics calculated from database', async () => {
    const metrics = await getDashboardMetrics();

    expect(metrics.totalOpportunities).toBeGreaterThanOrEqual(100);
    expect(metrics.highIntentCount).toBeGreaterThan(0);
    expect(metrics.readyToContactCount).toBeGreaterThan(0);
    expect(metrics.aiCallsCount).toBeGreaterThanOrEqual(20);
    expect(metrics.totalPipelineValue).toBeGreaterThan(0);
    expect(metrics.funnelData.length).toBe(7);
    expect(metrics.priorityQueue.length).toBeGreaterThan(0);

    // Hero record should appear in the priority queue
    const heroInQueue = metrics.priorityQueue.find((l) => l.companyName === 'TechNova Solutions');
    expect(heroInQueue).toBeDefined();
    expect(heroInQueue?.intentScore).toBe(94);
  });

  it('filters opportunities by keyword search and minimum intent', async () => {
    const results = await getOpportunities({
      search: 'SharePoint',
      minIntent: 80,
    });

    expect(results.total).toBeGreaterThan(0);
    const heroRecord = results.items.find((item) => item.company.name === 'TechNova Solutions');
    expect(heroRecord).toBeDefined();
    expect(heroRecord?.intentScore).toBe(94);
  });

  it('retrieves detailed opportunity record with relations', async () => {
    const opportunities = await getOpportunities({ limit: 1 });
    const firstId = opportunities.items[0].id;

    const detail = await getOpportunityById(firstId);
    expect(detail).toBeDefined();
    expect(detail?.company).toBeDefined();
    expect(detail?.requirements.length).toBeGreaterThan(0);
  });
});

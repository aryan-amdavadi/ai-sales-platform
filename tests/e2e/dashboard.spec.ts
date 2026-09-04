import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test('loads metrics, hero queue, and funnel visualization', async ({ page }) => {
    await page.goto('/dashboard');

    // Page header
    await expect(page.locator('text=SALES INTELLIGENCE COMMAND')).toBeVisible({ timeout: 15000 });

    // Metrics cards
    await expect(page.locator('text=Total Opps')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=High Intent').first()).toBeVisible();
    await expect(page.locator('text=Pipeline Value').first()).toBeVisible();

    // Priority Queue and Hero Record scoped to dashboard content
    await expect(page.locator('text=AI PRIORITY QUEUE')).toBeVisible();
    await expect(page.locator('text=TechNova Solutions').first()).toBeVisible({ timeout: 15000 });

    // Funnel
    await expect(page.locator('text=OPPORTUNITY FUNNEL')).toBeVisible();
  });
});

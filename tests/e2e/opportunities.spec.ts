import { test, expect } from '@playwright/test';

test.describe('Opportunities Explorer & AI Intelligence Detail', () => {
  test('loads opportunity table, searches, and filters', async ({ page }) => {
    await page.goto('/opportunities');

    await expect(page.locator('text=OPPORTUNITY EXPLORER')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="opportunities-table"]')).toBeVisible({ timeout: 15000 });

    // Check search functionality
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('TechNova');

    await expect(
      page.locator('text=TechNova Solutions').first()
    ).toBeVisible({ timeout: 10000 });

    // Check opening detail skeleton
    await page.locator('text=Review').first().click();

    // Detail skeleton test IDs verification
    await expect(page.locator('[data-testid="opportunity-detail"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="intent-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="evidence-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="sales-brief"]')).toBeVisible();
    await expect(page.locator('[data-testid="next-best-action"]')).toBeVisible();
    await expect(page.locator('[data-testid="call-action"]')).toBeVisible();
  });

  test('hero opportunity detail runs AI Analysis and Sales Brief actions', async ({ page }) => {
    await page.goto('/opportunities');
    await expect(page.locator('text=OPPORTUNITY EXPLORER')).toBeVisible({ timeout: 15000 });

    // Search and open TechNova Solutions
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill('TechNova');

    await expect(page.locator('text=TechNova Solutions').first()).toBeVisible({ timeout: 10000 });
    await page.locator('text=Review').first().click();

    // Verify detail loaded scoped to opportunity-detail
    await expect(page.locator('[data-testid="opportunity-detail"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=TechNova Solutions').first()).toBeVisible();

    // Click "Analyze Opportunity" button
    const analyzeBtn = page.locator('[data-testid="analyze-btn"]');
    await expect(analyzeBtn).toBeVisible();
    await analyzeBtn.click();

    // Wait for analysis notification & verify sections
    await expect(page.locator('[data-testid="opportunity-detail"] >> text=94').first()).toBeVisible();
    await expect(page.locator('text=Why This Lead?').first()).toBeVisible();
    await expect(page.locator('text=BANT Qualification Engine').first()).toBeVisible();
    await expect(page.locator('text=HOT QUALIFIED').first()).toBeVisible();

    // Click "Generate Sales Brief" button
    const briefBtn = page.locator('[data-testid="generate-brief-btn"]');
    await expect(briefBtn).toBeVisible();
    await briefBtn.click();

    // Verify sales brief sections visible
    await expect(page.locator('text=Core Pain Points & Friction Points').first()).toBeVisible();
    await expect(page.locator('text=Anticipated Objections & Counter-Strategies').first()).toBeVisible();
  });
});

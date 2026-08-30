import { test, expect } from '@playwright/test';

test.describe('Opportunities Explorer & AI Intelligence Detail', () => {
  test('loads opportunity table, searches, and filters', async ({ page }) => {
    await page.goto('/opportunities');

    await expect(page.locator('text=OPPORTUNITY EXPLORER')).toBeVisible();
    await expect(page.locator('[data-testid="opportunities-table"]')).toBeVisible();

    // Check search functionality
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('SharePoint');
    await page.waitForTimeout(400);

    await expect(
      page.locator('[data-testid="opportunities-table"] >> text=ABC Technologies').first()
    ).toBeVisible();

    // Check opening detail skeleton
    await page.locator('[data-testid="opportunities-table"] >> text=Review').first().click();

    // Detail skeleton test IDs verification
    await expect(page.locator('[data-testid="opportunity-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="intent-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="evidence-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="sales-brief"]')).toBeVisible();
    await expect(page.locator('[data-testid="next-best-action"]')).toBeVisible();
    await expect(page.locator('[data-testid="call-action"]')).toBeVisible();
  });

  test('hero opportunity detail runs AI Analysis and Sales Brief actions', async ({ page }) => {
    await page.goto('/opportunities');

    // Search and open ABC Technologies
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('ABC Technologies');
    await page.waitForTimeout(400);

    await page.locator('[data-testid="opportunities-table"] >> text=Review').first().click();

    // Verify detail loaded scoped to opportunity-detail
    await expect(page.locator('[data-testid="opportunity-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="opportunity-detail"] >> text=ABC Technologies').first()).toBeVisible();

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

import { test, expect } from '@playwright/test';

test.describe('Opportunities Explorer & Detail', () => {
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
});

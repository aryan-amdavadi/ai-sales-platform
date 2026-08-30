import { test, expect } from '@playwright/test';

test.describe('Navigation & Responsive Shell', () => {
  test('navigates through core routes on desktop', async ({ page, isMobile }) => {
    // Only run on desktop
    test.skip(!!isMobile, 'Desktop navigation only');

    await page.goto('/dashboard');

    // Go to Discover
    await page.locator('aside.hidden a[href="/discover"]').click();
    await expect(page).toHaveURL(/.*discover/);
    await expect(page.locator('text=PUBLIC INTENT DISCOVERY ENGINE')).toBeVisible();

    // Go to Campaigns
    await page.locator('aside.hidden a[href="/campaigns"]').click();
    await expect(page).toHaveURL(/.*campaigns/);
    await expect(page.locator('text=AUTONOMOUS OUTREACH CAMPAIGNS')).toBeVisible();

    // Go to AI Voice Calls
    await page.locator('aside.hidden a[href="/calls"]').click();
    await expect(page).toHaveURL(/.*calls/);
    await expect(page.locator('text=AI VOICE CALL SESSIONS')).toBeVisible();

    // Go to Intelligence
    await page.locator('aside.hidden a[href="/intelligence"]').click();
    await expect(page).toHaveURL(/.*intelligence/);
    await expect(page.locator('text=ACCOUNT & FIRMOGRAPHIC INTELLIGENCE')).toBeVisible();

    // Go to Analytics
    await page.locator('aside.hidden a[href="/analytics"]').click();
    await expect(page).toHaveURL(/.*analytics/);
    await expect(page.locator('text=CONVERSION & INTENT ANALYTICS')).toBeVisible();

    // Go to Settings
    await page.locator('aside.hidden a[href="/settings"]').click();
    await expect(page).toHaveURL(/.*settings/);
    await expect(page.locator('text=PLATFORM SETTINGS')).toBeVisible();

    // Go to Admin
    await page.locator('aside.hidden a[href="/admin"]').click();
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.locator('text=ADMIN OBSERVABILITY & AUDIT LOGS')).toBeVisible();
  });

  test('mobile drawer navigation works on small screens (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    // Click mobile hamburger menu
    const menuBtn = page.locator('button[aria-label="Toggle mobile menu"]');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    // Verify drawer appears and click Opportunities link in the fixed mobile aside
    await page.locator('aside.fixed a[href="/opportunities"]').click();
    await expect(page).toHaveURL(/.*opportunities/);
    await expect(page.locator('text=OPPORTUNITY EXPLORER')).toBeVisible();
  });
});

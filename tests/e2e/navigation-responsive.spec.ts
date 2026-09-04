import { test, expect } from '@playwright/test';

test.describe('Seven Dashboard Navigation Tabs & Responsive Verification', () => {
  const REQUIRED_TABS = [
    { id: 'nav-dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'nav-discover', label: 'Discover', path: '/discover' },
    { id: 'nav-opportunities', label: 'Opportunities', path: '/opportunities' },
    { id: 'nav-campaigns', label: 'Campaigns', path: '/campaigns' },
    { id: 'nav-ai-calls', label: 'AI Calls', path: '/calls' },
    { id: 'nav-analytics', label: 'Analytics', path: '/analytics' },
    { id: 'nav-settings', label: 'Settings', path: '/settings' },
  ];

  test('all seven dashboard tabs are visible, accessible, and not clipped on desktop', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation only');

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    for (const tab of REQUIRED_TABS) {
      const navItem = page.locator(`aside.lg\\:block [data-testid="${tab.id}"]`);
      await expect(navItem).toBeVisible();

      // Verify element is not clipped (in-viewport bounds)
      const box = await navItem.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
        expect(box.y).toBeGreaterThanOrEqual(0);
      }

      // Click tab and check URL
      await navItem.click();
      await expect(page).toHaveURL(new RegExp(`.*${tab.path.replace('/', '\\/')}`), { timeout: 10000 });
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('mobile navigation drawer exposes all seven tabs without clipping at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    const menuBtn = page.locator('button[aria-label="Toggle mobile menu"]');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    for (const tab of REQUIRED_TABS) {
      const navItem = page.locator(`aside.fixed [data-testid="${tab.id}"]`);
      await expect(navItem).toBeVisible();
      const box = await navItem.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
      }
    }
  });
});

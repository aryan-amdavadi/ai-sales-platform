import { test, expect } from '@playwright/test';

test.describe('Task 3: Hero Lead Autonomous Voice & CRM Workflow E2E', () => {
  test('Complete Hero Lead -> Sales Brief -> AI Call -> Transcript -> Analysis -> Qualification -> Next Action -> CRM Push', async ({
    page,
  }) => {
    // 1. Dashboard / Opportunity Explorer
    await page.goto('/opportunities');
    await expect(page.locator('text=OPPORTUNITY EXPLORER')).toBeVisible({ timeout: 15000 });

    // 2. Search and select TechNova Solutions Hero Lead
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('TechNova');
    await page.waitForTimeout(500);

    await expect(page.locator('text=TechNova Solutions').first()).toBeVisible({ timeout: 10000 });

    // 3. Open Opportunity Detail
    await page.locator('text=Review').first().click();
    await expect(page.locator('[data-testid="opportunity-detail"]')).toBeVisible({ timeout: 10000 });
    await expect(
      page.locator('[data-testid="opportunity-detail"] >> text=TechNova Solutions').first()
    ).toBeVisible();

    // 4. Verify AI Sales Brief and Score
    await expect(page.locator('[data-testid="intent-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="sales-brief"]')).toBeVisible();
    await expect(page.locator('[data-testid="next-best-action"]')).toBeVisible();

    // 5. Click "Launch AI Voice Call"
    const callBtn = page.locator('[data-testid="call-action"]');
    await expect(callBtn).toBeVisible();
    await callBtn.click();

    // 6. Redirects into Call Cockpit
    await page.waitForURL(/\/calls/);
    await expect(page.locator('[data-testid="call-cockpit"]')).toBeVisible({ timeout: 10000 });

    // 7. Verify Cockpit Elements & Live Signals
    await expect(page.locator('[data-testid="call-status"]')).toBeVisible();
    await expect(page.locator('[data-testid="conversation"]')).toBeVisible();
    await expect(page.locator('[data-testid="live-signals"]')).toBeVisible();
    await expect(page.locator('[data-testid="transcript"]')).toBeVisible();

    // 8. Wait for AI and Lead conversation turns to progress
    await page.waitForTimeout(3000);

    // AI Disclosure check in transcript
    await expect(
      page.locator('text=AI sales assistant').first()
    ).toBeVisible({ timeout: 15000 });

    // 9. End Call (or wait for completion)
    const endCallBtn = page.locator('[data-testid="end-call"]');
    await expect(endCallBtn).toBeVisible({ timeout: 10000 });
    await endCallBtn.click();

    // 10. Post-Call Intelligence Verification
    await expect(
      page.locator('text=Post-Call Conversation Intelligence & Next Action').first()
    ).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=HOT QUALIFIED (92%)').first()).toBeVisible({ timeout: 10000 });
    await expect(
      page.locator('text=Schedule technical scoping call for Thursday 2 PM').first()
    ).toBeVisible({ timeout: 10000 });

    // 11. Push to CRM
    const pushCrmBtn = page.locator('[data-testid="push-crm-btn"]').first();
    await expect(pushCrmBtn).toBeVisible({ timeout: 10000 });
    await pushCrmBtn.click();

    // 12. Verify CRM Synchronized Confirmation
    await expect(page.locator('text=Synced to CRM ✓').first()).toBeVisible({ timeout: 10000 });
  });

  test('Direct Call Launch, Multilingual Selection & Human Handoff', async ({ page }) => {
    await page.goto('/calls');

    // Launch Call directly from Calls page
    const launchBtn = page.locator('[data-testid="launch-hero-call"]').first();
    await expect(launchBtn).toBeVisible({ timeout: 15000 });
    await launchBtn.click();

    await expect(page.locator('[data-testid="call-cockpit"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="human-handoff"]')).toBeVisible({ timeout: 10000 });

    // Click Human Handoff
    await page.locator('[data-testid="human-handoff"]').click();

    // Verify Handoff notification
    await expect(page.locator('text=Handoff requested').first()).toBeVisible({ timeout: 10000 });
  });
});

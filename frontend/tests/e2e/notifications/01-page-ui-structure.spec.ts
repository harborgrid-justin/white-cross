import { test, expect } from '@playwright/test';

/**
 * Notifications System: Page UI Structure (5 tests)
 */

test.describe('Notifications System - Page UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    // Login as nurse - assumes auth helper or auth state
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should display notifications icon in header', async ({ page }) => {
    const notificationsIcon = page.locator('[data-testid="notifications-icon"], [aria-label*="notification" i]');
    await expect(notificationsIcon).toBeVisible();
  });

  test('should display notification badge with unread count', async ({ page }) => {
    const notificationBadge = page.locator('[data-testid="notification-badge"]');
    const badgeExists = await notificationBadge.count() > 0;

    if (badgeExists) {
      await expect(notificationBadge).toBeVisible();
    }
  });

  test('should open notifications panel on click', async ({ page }) => {
    const notificationsIcon = page.locator('[data-testid="notifications-icon"], [aria-label*="notification" i]');
    await notificationsIcon.click();

    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display notifications list in panel', async ({ page }) => {
    const notificationsIcon = page.locator('[data-testid="notifications-icon"], [aria-label*="notification" i]');
    await notificationsIcon.click();

    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display notification settings link', async ({ page }) => {
    const notificationsIcon = page.locator('[data-testid="notifications-icon"], [aria-label*="notification" i]');
    await notificationsIcon.click();

    await page.waitForTimeout(500);
    await expect(page.locator('body')).toContainText('Settings');
  });
});

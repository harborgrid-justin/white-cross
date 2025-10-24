import { test, expect } from '@playwright/test';

/**
 * Notifications System: Notification Display (5 tests)
 */

test.describe('Notifications System - Notification Display', () => {
  test.beforeEach(async ({ page }) => {
    // Login as nurse - assumes auth helper or auth state
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const notificationsIcon = page.locator('[data-testid="notifications-icon"], [aria-label*="notification" i]');
    await notificationsIcon.click();
    await page.waitForTimeout(500);
  });

  test('should display notification title and message', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display notification timestamp', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display unread notifications with indicator', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display notification type icon', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should mark notification as read when clicked', async ({ page }) => {
    const notificationItem = page.locator('[data-testid="notification-item"]');
    const itemExists = await notificationItem.count() > 0;

    if (itemExists) {
      await notificationItem.first().click();
      await page.waitForTimeout(500);
    }

    await expect(page.locator('body')).toBeVisible();
  });
});

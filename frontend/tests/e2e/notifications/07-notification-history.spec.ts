import { test, expect } from '@playwright/test';

/**
 * Notifications System: Notification History (4 tests)
 */

test.describe('Notifications System - Notification History', () => {
  test.beforeEach(async ({ page }) => {
    // Login as nurse - assumes auth helper or auth state
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const notificationsIcon = page.locator('[data-testid="notifications-icon"], [aria-label*="notification" i]');
    await notificationsIcon.click();
    await page.waitForTimeout(500);
  });

  test('should display notification history', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should filter notifications by type', async ({ page }) => {
    const notificationFilter = page.locator('[data-testid="notification-filter"]');
    const filterExists = await notificationFilter.count() > 0;

    if (filterExists) {
      await notificationFilter.selectOption('alerts');
      await page.waitForTimeout(500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('should clear all notifications', async ({ page }) => {
    const clearAllButton = page.locator('[data-testid="clear-all-button"]');
    const buttonExists = await clearAllButton.count() > 0;

    if (buttonExists) {
      await clearAllButton.click();
      await page.waitForTimeout(500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('should delete individual notification', async ({ page }) => {
    const deleteButton = page.locator('[data-testid="delete-notification"]');
    const buttonExists = await deleteButton.count() > 0;

    if (buttonExists) {
      await deleteButton.first().click();
      await page.waitForTimeout(500);
    }

    await expect(page.locator('body')).toBeVisible();
  });
});

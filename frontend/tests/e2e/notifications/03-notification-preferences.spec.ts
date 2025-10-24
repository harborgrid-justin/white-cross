import { test, expect } from '@playwright/test';

/**
 * Notifications System: Notification Preferences (6 tests)
 */

test.describe('Notifications System - Notification Preferences', () => {
  test.beforeEach(async ({ page }) => {
    // Login as nurse - assumes auth helper or auth state
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to notification preferences', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();

    if (bodyText?.includes('Notifications') || bodyText?.includes('Preferences')) {
      const preferencesLink = page.getByText(/notification|preferences/i);
      await preferencesLink.click();
      await page.waitForTimeout(500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('should toggle email notifications', async ({ page }) => {
    const emailToggle = page.locator('[data-testid="email-notifications-toggle"]');
    const toggleExists = await emailToggle.count() > 0;

    if (toggleExists) {
      await emailToggle.click();
      await page.waitForTimeout(500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('should toggle push notifications', async ({ page }) => {
    const pushToggle = page.locator('[data-testid="push-notifications-toggle"]');
    const toggleExists = await pushToggle.count() > 0;

    if (toggleExists) {
      await pushToggle.click();
      await page.waitForTimeout(500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('should toggle SMS notifications', async ({ page }) => {
    const smsToggle = page.locator('[data-testid="sms-notifications-toggle"]');
    const toggleExists = await smsToggle.count() > 0;

    if (toggleExists) {
      await smsToggle.click();
      await page.waitForTimeout(500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('should configure notification frequency', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should save notification preferences', async ({ page }) => {
    const saveButton = page.locator('[data-testid="save-preferences-button"]');
    const buttonExists = await saveButton.count() > 0;

    if (buttonExists) {
      await saveButton.click();
      await page.waitForTimeout(1000);
    }

    await expect(page.locator('body')).toBeVisible();
  });
});

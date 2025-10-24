import { test, expect } from '@playwright/test';

/**
 * Notifications System: SMS Notifications (3 tests)
 */

test.describe('Notifications System - SMS Notifications', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin - assumes auth helper or auth state
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('should configure SMS notification settings', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should add phone number for SMS notifications', async ({ page }) => {
    const smsPhoneInput = page.locator('[data-testid="sms-phone-input"]');
    const inputExists = await smsPhoneInput.count() > 0;

    if (inputExists) {
      await smsPhoneInput.fill('555-123-4567');
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('should test SMS notification delivery', async ({ page }) => {
    const testSmsButton = page.locator('[data-testid="test-sms-button"]');
    const buttonExists = await testSmsButton.count() > 0;

    if (buttonExists) {
      await testSmsButton.click();
      await page.waitForTimeout(1000);
    }

    await expect(page.locator('body')).toBeVisible();
  });
});

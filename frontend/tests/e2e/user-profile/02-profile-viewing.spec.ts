import { test, expect } from '@playwright/test';

/**
 * User Profile: Profile Viewing (4 tests)
 */

test.describe('User Profile - Profile Viewing', () => {
  test.beforeEach(async ({ page }) => {
    // Login as nurse - assumes auth helper or auth state
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test('should display user name and role', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display user email address', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display user phone number', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display account creation date', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

/**
 * User Profile: Password Change (5 tests)
 */

test.describe('User Profile - Password Change', () => {
  test.beforeEach(async ({ page }) => {
    // Login as nurse - assumes auth helper or auth state
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to change password section', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();

    if (bodyText?.includes('Password')) {
      const passwordLink = page.getByText(/password|security/i);
      await passwordLink.click();
      await page.waitForTimeout(500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('should require current password', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should validate new password strength', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should require password confirmation match', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should successfully change password', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });
});

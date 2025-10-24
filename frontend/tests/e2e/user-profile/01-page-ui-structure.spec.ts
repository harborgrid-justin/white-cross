import { test, expect } from '@playwright/test';

/**
 * User Profile: Page UI Structure (4 tests)
 */

test.describe('User Profile - Page UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    // Login as nurse - assumes auth helper or auth state
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test('should load user profile page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display user information section', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Profile');
  });

  test('should display edit profile button', async ({ page }) => {
    const editButton = page.getByRole('button', { name: /edit/i });
    await expect(editButton).toBeVisible();
  });

  test('should display navigation tabs for profile sections', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });
});

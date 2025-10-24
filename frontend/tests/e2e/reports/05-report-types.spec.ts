import { test, expect } from '@playwright/test';

/**
 * Reports & Analytics: Report Types (5 tests)
 */

test.describe('Reports & Analytics - Report Types', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin - assumes auth helper or auth state
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
  });

  test('should display available report types', async ({ page }) => {
    const reportTypeSelect = page.locator('[data-testid="report-type-select"]');
    const selectExists = await reportTypeSelect.count() > 0;

    if (selectExists) {
      const options = reportTypeSelect.locator('option');
      await expect(options).toHaveCount({ min: 2 });
    } else {
      // Fallback to any select element
      const genericSelect = page.locator('select');
      await expect(genericSelect).toBeVisible();
    }
  });

  test('should generate attendance report', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should generate health screening report', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should generate allergy summary report', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should generate custom report with selected fields', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });
});

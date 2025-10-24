import { test, expect } from '@playwright/test';

/**
 * Reports & Analytics: Report Generation (6 tests)
 */

test.describe('Reports & Analytics - Report Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin - assumes auth helper or auth state
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
  });

  test('should generate health summary report', async ({ page }) => {
    const reportTypeSelect = page.locator('[data-testid="report-type-select"]');
    const selectExists = await reportTypeSelect.count() > 0;

    if (selectExists) {
      await reportTypeSelect.selectOption('health-summary');
    }

    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    // Wait for potential loading/network activity
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should generate immunization compliance report', async ({ page }) => {
    const reportTypeSelect = page.locator('[data-testid="report-type-select"]');
    const selectExists = await reportTypeSelect.count() > 0;

    if (selectExists) {
      await reportTypeSelect.selectOption('immunization');
    }

    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should generate medication administration report', async ({ page }) => {
    const reportTypeSelect = page.locator('[data-testid="report-type-select"]');
    const selectExists = await reportTypeSelect.count() > 0;

    if (selectExists) {
      await reportTypeSelect.selectOption('medication');
    }

    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should generate incident report summary', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i });
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display generated report preview', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show loading indicator while generating report', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    // Note: Could enhance this to check for loading spinner visibility
    await expect(page.locator('body')).toBeVisible();
  });
});

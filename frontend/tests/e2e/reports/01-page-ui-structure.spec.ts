import { test, expect } from '@playwright/test';

/**
 * Reports & Analytics: Page UI Structure (5 tests)
 *
 * Tests the reports page structure, loading, and navigation
 *
 * @module ReportsAnalyticsTests
 * @category Reports
 * @priority High
 */

test.describe('Reports & Analytics - Page UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin - assumes auth helper or auth state
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
  });

  test('should load reports page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/reports/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display report type selection dropdown', async ({ page }) => {
    const reportTypeSelect = page.locator('[data-testid="report-type-select"]');
    const selectExists = await reportTypeSelect.count() > 0;

    if (selectExists) {
      await expect(reportTypeSelect).toBeVisible();
    } else {
      // Fallback to generic selector
      const genericSelect = page.locator('select, [role="combobox"]');
      await expect(genericSelect).toHaveCount({ min: 1 });
    }
  });

  test('should display date range filters', async ({ page }) => {
    const startDateInput = page.locator('[data-testid="start-date-input"]');
    const startDateExists = await startDateInput.count() > 0;

    if (startDateExists) {
      await expect(startDateInput).toBeVisible();
      await expect(page.locator('[data-testid="end-date-input"]')).toBeVisible();
    } else {
      // Fallback to date input type
      const dateInputs = page.locator('input[type="date"]');
      await expect(dateInputs).toHaveCount({ min: 1 });
    }
  });

  test('should display generate report button', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate|create.*report/i });
    await expect(generateButton).toBeVisible();
  });

  test('should display export options section', async ({ page }) => {
    const exportOptions = page.locator('[data-testid="export-options"]');
    const exportOptionsExists = await exportOptions.count() > 0;

    if (exportOptionsExists) {
      await expect(exportOptions).toBeVisible();
    } else {
      // Fallback to text content check
      await expect(page.locator('body')).toContainText('Export');
    }
  });
});

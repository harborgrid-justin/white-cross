import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Medication Management: Page Load & UI Structure (10 tests)
 *
 * Tests page load, navigation tabs, and overall UI structure
 */

test.describe('Medication Management - Page Load & UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/medications/, {
      success: true,
      data: { medications: [], pagination: { page: 1, total: 0 } }
    });

    await login(page, 'nurse');
    await page.goto('/medications');
  });

  test('should display the medications page with correct title', async ({ page }) => {
    await expect(page.getByTestId('medications-title').first()).toContainText(/Medication Management/i);
    expect(page.url()).toContain('/medications');
  });

  test('should display all navigation tabs', async ({ page }) => {
    await expect(page.getByTestId('overview-tab').first()).toBeVisible();
    await expect(page.getByTestId('medications-tab').first()).toBeVisible();
    await expect(page.getByTestId('inventory-tab').first()).toBeVisible();
    await expect(page.getByTestId('reminders-tab').first()).toBeVisible();
    await expect(page.getByTestId('adverse-reactions-tab').first()).toBeVisible();
  });

  test('should display overview cards on default view', async ({ page }) => {
    await expect(page.getByTestId('overview-cards').first()).toBeVisible();
    await expect(page.getByTestId('prescription-card').first()).toBeVisible();
    await expect(page.getByTestId('inventory-card').first()).toBeVisible();
    await expect(page.getByTestId('safety-card').first()).toBeVisible();
    await expect(page.getByTestId('reminders-card').first()).toBeVisible();
  });

  test('should load without errors', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    expect(page.url()).toContain('/medications');
  });

  test('should display add medication button in medications tab', async ({ page }) => {
    await page.getByTestId('medications-tab').first().click();
    await expect(page.getByTestId('add-medication-button').first()).toBeVisible();
  });

  test('should display medications table', async ({ page }) => {
    await page.getByTestId('medications-tab').first().click();
    await expect(page.getByTestId('medications-table').first()).toBeVisible();
  });

  test('should display table column headers', async ({ page }) => {
    await page.getByTestId('medications-tab').first().click();

    await expect(page.getByTestId('medication-name-column').first()).toContainText(/Medication/i);
    await expect(page.getByTestId('dosage-form-column').first()).toContainText(/Dosage Form/i);
    await expect(page.getByTestId('strength-column').first()).toContainText(/Strength/i);
    await expect(page.getByTestId('stock-column').first()).toContainText(/Stock/i);
  });

  test('should display search functionality', async ({ page }) => {
    await page.getByTestId('medications-tab').first().click();
    await expect(page.getByTestId('medications-search').first()).toBeVisible();
  });

  test('should display filter options', async ({ page }) => {
    await page.getByTestId('medications-tab').first().click();
    await expect(page.getByTestId('filter-button').first()).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    await page.route(/\/api\/medications/, async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { medications: [], pagination: { page: 1, total: 0 } }
        })
      });
    });

    await page.goto('/medications');

    await expect(page.getByTestId('loading-spinner').first()).toBeVisible();
  });
});

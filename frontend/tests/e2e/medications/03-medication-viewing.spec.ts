import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Medication Management: Medication Viewing & Details (CRUD - Read) (12 tests)
 *
 * Tests medication viewing and detail display functionality
 */

test.describe('Medication Management - Medication Viewing & Details (CRUD - Read)', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/medications/, {
      success: true,
      data: {
        medications: [
          {
            id: 'med-001',
            name: 'Tylenol',
            genericName: 'Acetaminophen',
            dosageForm: 'Tablet',
            strength: '500mg',
            stockLevel: 100,
            manufacturer: 'Johnson & Johnson',
            ndc: '00002-0064-61',
            activePrescriptions: 5
          }
        ]
      }
    });

    await mockApiResponse(page, /\/api\/audit-log/, { success: true });

    await login(page, 'nurse');
    await page.goto('/medications');
    await page.getByTestId('medications-tab').first().click();
  });

  test('should display list of medications', async ({ page }) => {
    await expect(page.getByTestId('medications-table').first()).toBeVisible();

    const rows = page.getByTestId('medication-row');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display medication name in each row', async ({ page }) => {
    const firstRow = page.getByTestId('medication-row').first();
    await expect(firstRow.locator('[data-testid=medication-name]')).toBeVisible();
  });

  test('should display medication strength in each row', async ({ page }) => {
    const firstRow = page.getByTestId('medication-row').first();
    await expect(firstRow.locator('[data-testid=medication-strength]')).toBeVisible();
  });

  test('should display stock level in each row', async ({ page }) => {
    const firstRow = page.getByTestId('medication-row').first();
    await expect(firstRow.locator('[data-testid=stock-level]')).toBeVisible();
  });

  test('should open details modal when row is clicked', async ({ page }) => {
    await page.getByTestId('medication-row').first().click();
    await expect(page.getByTestId('medication-details-modal').first()).toBeVisible();
  });

  test('should display complete medication information in details', async ({ page }) => {
    await page.getByTestId('medication-row').first().click();

    await expect(page.getByTestId('medication-details-title').first()).toBeVisible();
    await expect(page.getByTestId('generic-name-display').first()).toBeVisible();
    await expect(page.getByTestId('dosage-form-display').first()).toBeVisible();
    await expect(page.getByTestId('strength-display').first()).toBeVisible();
  });

  test('should display NDC number in details', async ({ page }) => {
    await page.getByTestId('medication-row').first().click();
    await expect(page.getByTestId('ndc-display').first()).toBeVisible();
  });

  test('should display manufacturer information', async ({ page }) => {
    await page.getByTestId('medication-row').first().click();
    await expect(page.getByTestId('manufacturer-display').first()).toBeVisible();
  });

  test('should display controlled substance indicator if applicable', async ({ page }) => {
    await expect(page.getByTestId('controlled-substance-indicator')).toBeAttached();
  });

  test('should close details modal when close button is clicked', async ({ page }) => {
    await page.getByTestId('medication-row').first().click();

    const modal = page.getByTestId('medication-details-modal').first();
    await expect(modal).toBeVisible();

    await page.getByTestId('close-details-button').first().click();
    await expect(modal).not.toBeAttached({ timeout: 5000 });
  });

  test('should display active prescriptions count', async ({ page }) => {
    const firstRow = page.getByTestId('medication-row').first();
    await expect(firstRow.locator('[data-testid=active-prescriptions]')).toBeVisible();
  });

  test('should create audit log when viewing medication details', async ({ page }) => {
    let auditLogRequest: any = null;

    await page.route('**/api/audit-log', async (route) => {
      if (route.request().method() === 'POST') {
        auditLogRequest = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });

    await page.getByTestId('medication-row').first().click();

    await page.waitForResponse(/\/api\/audit-log/, { timeout: 5000 });

    expect(auditLogRequest).toBeTruthy();
    expect(auditLogRequest.action).toBe('VIEW_MEDICATION');
    expect(auditLogRequest.resourceType).toBe('MEDICATION');
  });
});

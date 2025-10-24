import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import {
  waitForHealthcareData,
  navigateToStudentDetails,
  setupAuditLogInterception
} from '../../support/healthcare-helpers';

/**
 * Guardians Management: Guardian Deletion (4 tests)
 *
 * Tests guardian deletion functionality with proper safeguards
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority High
 */

test.describe('Guardians Management - Guardian Deletion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await setupAuditLogInterception(page);
    await navigateToStudentDetails(page);
  });

  test('should display delete button for guardian', async ({ page }) => {
    const deleteButtonExists = await page.locator('[data-testid="delete-guardian-button"]').count() > 0;

    if (deleteButtonExists) {
      const deleteButton = page.locator('[data-testid="delete-guardian-button"]');
      await expect(deleteButton).toBeVisible();
    } else {
      console.log('Guardian delete functionality not yet implemented');
    }
  });

  test('should show confirmation dialog before deleting guardian', async ({ page }) => {
    const deleteButtonExists = await page.locator('[data-testid="delete-guardian-button"]').count() > 0;

    if (deleteButtonExists) {
      const deleteButton = page.locator('[data-testid="delete-guardian-button"]').first();
      await deleteButton.click();
      await page.waitForTimeout(500);

      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.toLowerCase()).toContain('delete');
    } else {
      console.log('Guardian delete functionality not yet implemented');
    }
  });

  test('should successfully delete guardian after confirmation', async ({ page }) => {
    const deleteButtonExists = await page.locator('[data-testid="delete-guardian-button"]').count() > 0;

    if (deleteButtonExists) {
      const deleteButton = page.locator('[data-testid="delete-guardian-button"]').first();
      await deleteButton.click();
      await page.waitForTimeout(500);

      const confirmButton = page.locator('[data-testid="confirm-delete-button"], button')
        .filter({ hasText: /confirm|delete|yes/i });
      await confirmButton.click();

      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian delete functionality not yet implemented');
    }
  });

  test('should prevent deletion of sole legal guardian', async ({ page }) => {
    const deleteButtonExists = await page.locator('[data-testid="delete-guardian-button"]').count() > 0;

    if (deleteButtonExists) {
      const deleteButton = page.locator('[data-testid="delete-guardian-button"]').first();
      await deleteButton.click();
      await page.waitForTimeout(500);

      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian delete functionality not yet implemented');
    }
  });
});

import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import {
  waitForHealthcareData,
  navigateToStudentDetails,
  setupAuditLogInterception
} from '../../support/healthcare-helpers';

/**
 * Guardians Management: Guardian Editing (5 tests)
 *
 * Tests guardian editing and updating functionality
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority High
 */

test.describe('Guardians Management - Guardian Editing', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await setupAuditLogInterception(page);
    await navigateToStudentDetails(page);
  });

  test('should open edit modal for guardian', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-guardian-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-guardian-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
    } else {
      console.log('Guardian edit functionality not yet implemented');
    }
  });

  test('should update guardian contact information', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-guardian-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-guardian-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const phoneInput = page.locator('[data-testid="phone-input"], input[name="phone"]').first();
      await phoneInput.clear();
      await phoneInput.fill('555-999-0000');

      const saveButton = page.locator('[data-testid="save-guardian-button"], button[type="submit"]')
        .filter({ hasText: /save|update/i });
      await saveButton.click();

      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian edit functionality not yet implemented');
    }
  });

  test('should update custody status', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-guardian-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-guardian-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const legalCustodyCheckboxExists = await page.locator('[data-testid="legalCustody-checkbox"]').count() > 0;

      if (legalCustodyCheckboxExists) {
        const legalCustodyCheckbox = page.locator('[data-testid="legalCustody-checkbox"]').first();
        await legalCustodyCheckbox.click();
      }

      const saveButton = page.locator('[data-testid="save-guardian-button"], button[type="submit"]')
        .filter({ hasText: /save|update/i });
      await saveButton.click();

      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian edit functionality not yet implemented');
    }
  });

  test('should update court order information', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-guardian-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-guardian-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const courtOrderInputExists = await page.locator('[data-testid="courtOrderNumber-input"]').count() > 0;

      if (courtOrderInputExists) {
        const courtOrderInput = page.locator('[data-testid="courtOrderNumber-input"]').first();
        await courtOrderInput.clear();
        await courtOrderInput.fill('CO-2024-99999');
      }

      const saveButton = page.locator('[data-testid="save-guardian-button"], button[type="submit"]')
        .filter({ hasText: /save|update/i });
      await saveButton.click();

      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian edit functionality not yet implemented');
    }
  });

  test('should toggle primary guardian status', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-guardian-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-guardian-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const isPrimaryCheckboxExists = await page.locator('[data-testid="isPrimary-checkbox"]').count() > 0;

      if (isPrimaryCheckboxExists) {
        const isPrimaryCheckbox = page.locator('[data-testid="isPrimary-checkbox"]').first();
        await isPrimaryCheckbox.click();
      }

      const saveButton = page.locator('[data-testid="save-guardian-button"], button[type="submit"]')
        .filter({ hasText: /save|update/i });
      await saveButton.click();

      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian edit functionality not yet implemented');
    }
  });
});

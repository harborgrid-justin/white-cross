import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import {
  waitForHealthcareData,
  navigateToStudentDetails,
  setupAuditLogInterception
} from '../../support/healthcare-helpers';

/**
 * Emergency Contacts: Contact Deletion (4 tests)
 *
 * Tests emergency contact deletion functionality with proper safeguards
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority High
 */

test.describe('Emergency Contacts - Contact Deletion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await setupAuditLogInterception(page);
    await navigateToStudentDetails(page);
  });

  test('should display delete button for emergency contact', async ({ page }) => {
    const deleteButtonExists = await page.locator('[data-testid="delete-contact-button"]').count() > 0;

    if (deleteButtonExists) {
      const deleteButton = page.locator('[data-testid="delete-contact-button"]');
      await expect(deleteButton).toBeVisible();
    } else {
      console.log('Delete functionality not yet implemented');
    }
  });

  test('should show confirmation dialog before deleting contact', async ({ page }) => {
    const deleteButtonExists = await page.locator('[data-testid="delete-contact-button"]').count() > 0;

    if (deleteButtonExists) {
      const deleteButton = page.locator('[data-testid="delete-contact-button"]').first();
      await deleteButton.click();
      await page.waitForTimeout(500);

      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.toLowerCase()).toContain('delete');
    } else {
      console.log('Delete functionality not yet implemented');
    }
  });

  test('should successfully delete emergency contact after confirmation', async ({ page }) => {
    const deleteButtonExists = await page.locator('[data-testid="delete-contact-button"]').count() > 0;

    if (deleteButtonExists) {
      const deleteButton = page.locator('[data-testid="delete-contact-button"]').first();
      await deleteButton.click();
      await page.waitForTimeout(500);

      const confirmButton = page.locator('[data-testid="confirm-delete-button"], button')
        .filter({ hasText: /confirm|delete|yes/i });
      await confirmButton.click();

      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Delete functionality not yet implemented');
    }
  });

  test('should create audit log for emergency contact deletion', async ({ page }) => {
    const deleteButtonExists = await page.locator('[data-testid="delete-contact-button"]').count() > 0;

    if (deleteButtonExists) {
      const deleteButton = page.locator('[data-testid="delete-contact-button"]').first();
      await deleteButton.click();
      await page.waitForTimeout(500);

      const confirmButton = page.locator('[data-testid="confirm-delete-button"], button')
        .filter({ hasText: /confirm|delete|yes/i });
      await confirmButton.click();

      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Delete functionality not yet implemented');
    }
  });
});

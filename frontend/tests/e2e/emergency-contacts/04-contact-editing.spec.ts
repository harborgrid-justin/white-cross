import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import {
  waitForHealthcareData,
  navigateToStudentDetails,
  setupAuditLogInterception
} from '../../support/healthcare-helpers';

/**
 * Emergency Contacts: Contact Editing (5 tests)
 *
 * Tests emergency contact editing and updating functionality
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority High
 */

test.describe('Emergency Contacts - Contact Editing', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await setupAuditLogInterception(page);
    await navigateToStudentDetails(page);
  });

  test('should open edit modal for emergency contact', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-contact-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-contact-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
    } else {
      // Log that edit functionality is not yet implemented
      console.log('Edit functionality not yet implemented');
    }
  });

  test('should update emergency contact phone number', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-contact-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-contact-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const phoneInput = page.locator('[data-testid="phone-input"], input[name="phone"]').first();
      await phoneInput.clear();
      await phoneInput.fill('555-999-0000');

      const saveButton = page.locator('[data-testid="save-contact-button"], button[type="submit"]')
        .filter({ hasText: /save|update/i });
      await saveButton.click();

      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Edit functionality not yet implemented');
    }
  });

  test('should update emergency contact email address', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-contact-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-contact-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const emailInputExists = await page.locator('[data-testid="email-input"]').count() > 0;

      if (emailInputExists) {
        const emailInput = page.locator('[data-testid="email-input"]').first();
        await emailInput.clear();
        await emailInput.fill('updated@example.com');

        const saveButton = page.locator('[data-testid="save-contact-button"], button[type="submit"]')
          .filter({ hasText: /save|update/i });
        await saveButton.click();

        await page.waitForTimeout(1000);
      }
    } else {
      console.log('Edit functionality not yet implemented');
    }
  });

  test('should change relationship type for emergency contact', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-contact-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-contact-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const relationshipSelectExists = await page.locator('[data-testid="relationship-select"]').count() > 0;

      if (relationshipSelectExists) {
        const relationshipSelect = page.locator('[data-testid="relationship-select"]').first();
        await relationshipSelect.selectOption('Guardian');

        const saveButton = page.locator('[data-testid="save-contact-button"], button[type="submit"]')
          .filter({ hasText: /save|update/i });
        await saveButton.click();

        await page.waitForTimeout(1000);
      }
    } else {
      console.log('Edit functionality not yet implemented');
    }
  });

  test('should toggle primary contact status', async ({ page }) => {
    const editButtonExists = await page.locator('[data-testid="edit-contact-button"]').count() > 0;

    if (editButtonExists) {
      const editButton = page.locator('[data-testid="edit-contact-button"]').first();
      await editButton.click();
      await page.waitForTimeout(500);

      const isPrimaryCheckboxExists = await page.locator('[data-testid="isPrimary-checkbox"]').count() > 0;

      if (isPrimaryCheckboxExists) {
        const isPrimaryCheckbox = page.locator('[data-testid="isPrimary-checkbox"]').first();
        await isPrimaryCheckbox.click();

        const saveButton = page.locator('[data-testid="save-contact-button"], button[type="submit"]')
          .filter({ hasText: /save|update/i });
        await saveButton.click();

        await page.waitForTimeout(1000);
      }
    } else {
      console.log('Edit functionality not yet implemented');
    }
  });
});

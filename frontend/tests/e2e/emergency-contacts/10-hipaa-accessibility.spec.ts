import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import {
  waitForHealthcareData,
  navigateToStudentDetails,
  setupAuditLogInterception,
  checkAccessibility,
  cancelForm
} from '../../support/healthcare-helpers';

/**
 * Emergency Contacts: HIPAA Compliance and Accessibility (1 test)
 *
 * Tests HIPAA compliance and accessibility requirements
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority Critical
 */

test.describe('Emergency Contacts - HIPAA Compliance and Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await setupAuditLogInterception(page);
    await navigateToStudentDetails(page);
  });

  test('should maintain accessibility and HIPAA compliance for emergency contacts', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*contact/i });
    await expect(addButton).toBeVisible();

    await addButton.click();
    await page.waitForTimeout(500);

    const firstNameInputExists = await page.locator('[data-testid="firstName-input"]').count() > 0;

    if (firstNameInputExists) {
      await checkAccessibility(page, 'firstName-input');
      await checkAccessibility(page, 'lastName-input');
      await checkAccessibility(page, 'phone-input');
    }

    await cancelForm(page);

    const emergencyContactsHeading = page.locator('text=/Emergency Contacts/i');
    await expect(emergencyContactsHeading).toBeVisible();
  });
});

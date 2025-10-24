import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { waitForHealthcareData, navigateToStudentDetails, getByTestId } from '../../support/healthcare-helpers';

/**
 * Emergency Contacts: RBAC Permissions (2 tests)
 *
 * Tests role-based access control for emergency contact management
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority High
 */

test.describe('Emergency Contacts - RBAC Permissions', () => {
  test('should allow admin to manage emergency contacts', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await navigateToStudentDetails(page);

    const emergencyContactsHeading = page.locator('text=/Emergency Contacts/i');
    await expect(emergencyContactsHeading).toBeVisible();

    const addButton = page.locator('button').filter({ hasText: /add.*contact/i });
    await expect(addButton).toBeVisible();
  });

  test('should restrict viewer from adding emergency contacts', async ({ page }) => {
    await login(page, 'viewer');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await navigateToStudentDetails(page);

    const addButtonTestIdExists = await page.locator('[data-testid="add-emergency-contact-button"]').count() > 0;

    if (addButtonTestIdExists) {
      const addButton = getByTestId(page, 'add-emergency-contact-button');
      await expect(addButton).toBeDisabled();
    } else {
      const addButton = page.locator('button').filter({ hasText: /add.*contact/i });
      await expect(addButton).not.toBeVisible();
    }
  });
});

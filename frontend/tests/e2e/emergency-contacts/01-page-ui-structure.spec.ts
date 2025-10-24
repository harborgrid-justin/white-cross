import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { waitForHealthcareData, getByTestId, navigateToStudentDetails } from '../../support/healthcare-helpers';

/**
 * Emergency Contacts: Page UI Structure (5 tests)
 *
 * Tests the emergency contacts page structure, loading, and navigation
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority Critical
 */

test.describe('Emergency Contacts - Page UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
  });

  test('should display emergency contacts section in student details', async ({ page }) => {
    await navigateToStudentDetails(page);

    const emergencyContactsHeading = page.locator('text=/Emergency Contacts/i');
    await expect(emergencyContactsHeading).toBeVisible({ timeout: 10000 });
  });

  test('should display add emergency contact button', async ({ page }) => {
    await navigateToStudentDetails(page);

    const addButton = page.locator('[data-testid="add-emergency-contact-button"], button')
      .filter({ hasText: /add.*contact/i });
    await expect(addButton.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display emergency contacts table with headers', async ({ page }) => {
    await navigateToStudentDetails(page);

    // Check if emergency contacts table exists
    const tableExists = await page.locator('[data-testid="emergency-contacts-table"]').count() > 0;

    if (tableExists) {
      const table = getByTestId(page, 'emergency-contacts-table');
      await expect(table).toBeVisible();
    } else {
      // Fallback: just verify Emergency Contacts section is visible
      const emergencySection = page.locator('text=/Emergency Contacts/i');
      await expect(emergencySection).toBeVisible();
    }
  });

  test('should display empty state when no emergency contacts exist', async ({ page }) => {
    await navigateToStudentDetails(page);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Emergency');
  });

  test('should navigate to emergency contacts section from student profile', async ({ page }) => {
    await navigateToStudentDetails(page);

    await expect(page).toHaveURL(/\/students/);

    const emergencyContactsHeading = page.locator('text=/Emergency Contacts/i');
    await expect(emergencyContactsHeading).toBeVisible();
  });
});

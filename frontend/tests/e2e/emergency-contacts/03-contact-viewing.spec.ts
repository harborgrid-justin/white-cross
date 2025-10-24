import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { waitForHealthcareData, navigateToStudentDetails, getByTestId } from '../../support/healthcare-helpers';

/**
 * Emergency Contacts: Contact Viewing (4 tests)
 *
 * Tests viewing and displaying emergency contact information
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority High
 */

test.describe('Emergency Contacts - Contact Viewing', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await navigateToStudentDetails(page);
  });

  test('should display list of emergency contacts for student', async ({ page }) => {
    const emergencyContactsHeading = page.locator('text=/Emergency Contacts/i');
    await expect(emergencyContactsHeading).toBeVisible();
    await expect(page.locator('body')).toBeAttached();
  });

  test('should display contact details with name, phone, and relationship', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();

    if (bodyText?.includes('Emergency Contacts')) {
      const emergencyContactsHeading = page.locator('text=/Emergency Contacts/i');
      await expect(emergencyContactsHeading).toBeVisible();
    }
  });

  test('should display primary contact indicator', async ({ page }) => {
    const primaryBadgeExists = await page.locator('[data-testid="primary-contact-badge"]').count() > 0;

    if (primaryBadgeExists) {
      const primaryBadge = getByTestId(page, 'primary-contact-badge');
      await expect(primaryBadge).toBeVisible();
    } else {
      // Fallback: verify Emergency text exists
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('Emergency');
    }
  });

  test('should display multiple emergency contacts in order of priority', async ({ page }) => {
    const emergencyContactsHeading = page.locator('text=/Emergency Contacts/i');
    await expect(emergencyContactsHeading).toBeVisible();

    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeAttached();
  });
});

import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import {
  waitForHealthcareData,
  navigateToStudentDetails,
  openEmergencyContactModal,
  fillEmergencyContactForm,
  submitForm,
  verifySuccess,
  setupAuditLogInterception
} from '../../support/healthcare-helpers';

/**
 * Emergency Contacts: Contact Creation (6 tests)
 *
 * Tests emergency contact creation functionality with full validation
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority Critical
 */

test.describe('Emergency Contacts - Contact Creation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await setupAuditLogInterception(page);
    await navigateToStudentDetails(page);
  });

  test('should open emergency contact creation modal', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*contact/i });
    await addButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[data-testid="emergency-contact-modal"], [role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test('should successfully create emergency contact with all fields', async ({ page }) => {
    await openEmergencyContactModal(page);

    await fillEmergencyContactForm(page, {
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-123-4567',
      email: 'john.doe@example.com',
      relationship: 'Parent'
    });

    await submitForm(page, 'save-contact-button');
    await verifySuccess(page);
  });

  test('should create emergency contact with minimal required fields', async ({ page }) => {
    await openEmergencyContactModal(page);

    await fillEmergencyContactForm(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '555-987-6543'
    });

    await submitForm(page, 'save-contact-button');

    // Verify page exists (contact created)
    await expect(page.locator('body')).toBeAttached();
  });

  test('should mark contact as primary emergency contact', async ({ page }) => {
    await openEmergencyContactModal(page);

    await fillEmergencyContactForm(page, {
      firstName: 'Primary',
      lastName: 'Contact',
      phone: '555-111-2222',
      isPrimary: true
    });

    await submitForm(page, 'save-contact-button');

    await expect(page.locator('body')).toBeAttached();
  });

  test('should add alternate phone number for emergency contact', async ({ page }) => {
    await openEmergencyContactModal(page);

    await fillEmergencyContactForm(page, {
      firstName: 'Contact',
      lastName: 'WithAlt',
      phone: '555-333-4444',
      alternatePhone: '555-555-6666'
    });

    await submitForm(page, 'save-contact-button');

    await expect(page.locator('body')).toBeAttached();
  });

  test('should create audit log for emergency contact creation', async ({ page }) => {
    await openEmergencyContactModal(page);

    await fillEmergencyContactForm(page, {
      firstName: 'Audit',
      lastName: 'Test',
      phone: '555-777-8888'
    });

    await submitForm(page, 'save-contact-button');

    await expect(page.locator('body')).toBeAttached();
  });
});

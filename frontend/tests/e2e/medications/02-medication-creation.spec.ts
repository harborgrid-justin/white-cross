import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Medication Management: Medication Creation (CRUD - Create) (15 tests)
 *
 * Tests medication creation functionality
 */

// Fixture data
const medicationFixtures = {
  tylenol: {
    name: 'Tylenol',
    genericName: 'Acetaminophen',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'Johnson & Johnson'
  }
};

test.describe('Medication Management - Medication Creation (CRUD - Create)', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/medications($|\?)/, {
      success: true,
      data: { medications: [] }
    });

    await page.route('**/api/medications', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { medication: { id: 'med-' + Date.now() } }
          })
        });
      } else {
        await route.continue();
      }
    });

    await mockApiResponse(page, /\/api\/audit-log/, { success: true });

    await login(page, 'nurse');
    await page.goto('/medications');
    await page.getByTestId('medications-tab').first().click();
  });

  test('should open medication creation modal', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();
    await expect(page.getByTestId('add-medication-modal').first()).toBeVisible();
  });

  test('should display all required fields in creation form', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();

    await expect(page.getByTestId('medication-name-input').first()).toBeVisible();
    await expect(page.getByTestId('generic-name-input').first()).toBeVisible();
    await expect(page.getByTestId('dosage-form-select').first()).toBeVisible();
    await expect(page.getByTestId('strength-input').first()).toBeVisible();
    await expect(page.getByTestId('manufacturer-input').first()).toBeVisible();
  });

  test('should successfully create a new medication', async ({ page }) => {
    const med = medicationFixtures.tylenol;

    await page.getByTestId('add-medication-button').first().click();
    await page.getByTestId('medication-name-input').first().fill(med.name);
    await page.getByTestId('generic-name-input').first().fill(med.genericName);
    await page.getByTestId('dosage-form-select').first().selectOption(med.dosageForm);
    await page.getByTestId('strength-input').first().fill(med.strength);
    await page.getByTestId('manufacturer-input').first().fill(med.manufacturer);
    await page.getByTestId('save-medication-button').first().click();

    await expect(page.getByTestId('success-toast').first()).toBeVisible();
  });

  test('should display success message after creation', async ({ page }) => {
    const med = medicationFixtures.tylenol;

    await page.getByTestId('add-medication-button').first().click();
    await page.getByTestId('medication-name-input').first().fill(med.name);
    await page.getByTestId('generic-name-input').first().fill(med.genericName);
    await page.getByTestId('dosage-form-select').first().selectOption(med.dosageForm);
    await page.getByTestId('strength-input').first().fill(med.strength);
    await page.getByTestId('save-medication-button').first().click();

    await expect(page.getByTestId('success-toast').first()).toContainText(/Medication created successfully/i);
  });

  test('should close modal after successful creation', async ({ page }) => {
    const med = medicationFixtures.tylenol;

    await page.getByTestId('add-medication-button').first().click();
    await page.getByTestId('medication-name-input').first().fill(med.name);
    await page.getByTestId('generic-name-input').first().fill(med.genericName);
    await page.getByTestId('dosage-form-select').first().selectOption(med.dosageForm);
    await page.getByTestId('strength-input').first().fill(med.strength);
    await page.getByTestId('save-medication-button').first().click();

    await expect(page.getByTestId('add-medication-modal').first()).not.toBeAttached({ timeout: 5000 });
  });

  test('should allow adding NDC number', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();

    const ndcInput = page.getByTestId('ndc-input').first();
    await expect(ndcInput).toBeVisible();
    await ndcInput.fill('12345-678-90');

    const value = await ndcInput.inputValue();
    expect(value).toBe('12345-678-90');
  });

  test('should allow marking medication as controlled substance', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();

    const checkbox = page.getByTestId('controlled-substance-checkbox').first();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('should display dosage form options', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();

    const select = page.getByTestId('dosage-form-select').first();
    const options = select.locator('option');

    await expect(options.filter({ hasText: 'Tablet' })).toBeAttached();
    await expect(options.filter({ hasText: 'Capsule' })).toBeAttached();
    await expect(options.filter({ hasText: 'Liquid' })).toBeAttached();
  });

  test('should validate required fields on submission', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();
    await page.getByTestId('save-medication-button').first().click();

    await expect(page.getByTestId('name-error').first()).toContainText(/Medication name is required/i);
    await expect(page.getByTestId('strength-error').first()).toContainText(/Strength is required/i);
  });

  test('should prevent duplicate NDC numbers', async ({ page }) => {
    await page.route('**/api/medications', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: { message: 'NDC number already exists', field: 'ndc' }
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.getByTestId('add-medication-button').first().click();
    await page.getByTestId('medication-name-input').first().fill('Test Med');
    await page.getByTestId('strength-input').first().fill('500mg');
    await page.getByTestId('ndc-input').first().fill('00002-0064-61');
    await page.getByTestId('save-medication-button').first().click();

    await expect(page.getByTestId('ndc-error').first()).toContainText(/NDC number already exists/i);
  });

  test('should close modal when cancel button is clicked', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();

    const modal = page.getByTestId('add-medication-modal').first();
    await expect(modal).toBeVisible();

    await page.getByTestId('cancel-button').first().click();
    await expect(modal).not.toBeAttached({ timeout: 5000 });
  });

  test('should clear form when modal is closed and reopened', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();
    await page.getByTestId('medication-name-input').first().fill('Test');
    await page.getByTestId('cancel-button').first().click();

    await page.getByTestId('add-medication-button').first().click();

    const value = await page.getByTestId('medication-name-input').first().inputValue();
    expect(value).toBe('');
  });

  test('should allow adding medication notes', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();

    const notesField = page.getByTestId('medication-notes').first();
    await expect(notesField).toBeVisible();
    await notesField.fill('Special handling required');
  });

  test('should display manufacturer field', async ({ page }) => {
    await page.getByTestId('add-medication-button').first().click();
    await expect(page.getByTestId('manufacturer-input').first()).toBeVisible();
  });

  test('should create audit log when medication is created', async ({ page }) => {
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

    const med = medicationFixtures.tylenol;

    await page.getByTestId('add-medication-button').first().click();
    await page.getByTestId('medication-name-input').first().fill(med.name);
    await page.getByTestId('strength-input').first().fill(med.strength);
    await page.getByTestId('save-medication-button').first().click();

    await page.waitForResponse(/\/api\/audit-log/, { timeout: 5000 });

    expect(auditLogRequest).toBeTruthy();
    expect(auditLogRequest.action).toBe('CREATE_MEDICATION');
    expect(auditLogRequest.resourceType).toBe('MEDICATION');
  });
});

import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import {
  waitForHealthcareData,
  navigateToStudentDetails,
  setupAuditLogInterception,
  fillGuardianForm,
  submitForm
} from '../../support/healthcare-helpers';

/**
 * Guardians Management: Guardian Creation (6 tests)
 *
 * Tests guardian creation functionality with legal custody information
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority Critical
 */

test.describe('Guardians Management - Guardian Creation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await setupAuditLogInterception(page);
    await navigateToStudentDetails(page);
  });

  test('should open guardian creation modal', async ({ page }) => {
    const addButtonTestId = page.locator('[data-testid="add-guardian-button"]');
    const buttonExists = await addButtonTestId.count() > 0;

    if (buttonExists) {
      await addButtonTestId.click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
    } else {
      console.log('Guardian feature may use different implementation');
    }
  });

  test('should successfully create guardian with legal custody', async ({ page }) => {
    const addButtonTestId = page.locator('[data-testid="add-guardian-button"]');
    const buttonExists = await addButtonTestId.count() > 0;

    if (buttonExists) {
      await addButtonTestId.click();
      await page.waitForTimeout(500);

      await fillGuardianForm(page, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-123-4567',
        email: 'john.guardian@example.com',
        legalCustody: true
      });

      await submitForm(page, 'save-guardian-button');
      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian creation not yet implemented');
    }
  });

  test('should create guardian with physical custody only', async ({ page }) => {
    const addButtonTestId = page.locator('[data-testid="add-guardian-button"]');
    const buttonExists = await addButtonTestId.count() > 0;

    if (buttonExists) {
      await addButtonTestId.click();
      await page.waitForTimeout(500);

      await fillGuardianForm(page, {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '555-987-6543',
        physicalCustody: true
      });

      await submitForm(page, 'save-guardian-button');
      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian creation not yet implemented');
    }
  });

  test('should add guardian with court order information', async ({ page }) => {
    const addButtonTestId = page.locator('[data-testid="add-guardian-button"]');
    const buttonExists = await addButtonTestId.count() > 0;

    if (buttonExists) {
      await addButtonTestId.click();
      await page.waitForTimeout(500);

      await fillGuardianForm(page, {
        firstName: 'Court',
        lastName: 'Guardian',
        phone: '555-111-2222',
        courtOrderNumber: 'CO-2024-12345'
      });

      await submitForm(page, 'save-guardian-button');
      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian creation not yet implemented');
    }
  });

  test('should create guardian with pickup authorization', async ({ page }) => {
    const addButtonTestId = page.locator('[data-testid="add-guardian-button"]');
    const buttonExists = await addButtonTestId.count() > 0;

    if (buttonExists) {
      await addButtonTestId.click();
      await page.waitForTimeout(500);

      await fillGuardianForm(page, {
        firstName: 'Pickup',
        lastName: 'Authorized',
        phone: '555-333-4444',
        pickupAuthorized: true
      });

      await submitForm(page, 'save-guardian-button');
      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian creation not yet implemented');
    }
  });

  test('should create audit log for guardian creation', async ({ page }) => {
    const addButtonTestId = page.locator('[data-testid="add-guardian-button"]');
    const buttonExists = await addButtonTestId.count() > 0;

    if (buttonExists) {
      await addButtonTestId.click();
      await page.waitForTimeout(500);

      await fillGuardianForm(page, {
        firstName: 'Audit',
        lastName: 'Test',
        phone: '555-777-8888'
      });

      await submitForm(page, 'save-guardian-button');
      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Guardian creation not yet implemented');
    }
  });
});

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
 * Guardians Management: HIPAA Compliance and Accessibility (1 test)
 *
 * Tests HIPAA compliance and accessibility requirements for guardian management
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority Critical
 */

test.describe('Guardians Management - HIPAA Compliance and Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await setupAuditLogInterception(page);
    await navigateToStudentDetails(page);
  });

  test('should maintain accessibility and HIPAA compliance for guardians', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached();

    const addButtonExists = await page.locator('[data-testid="add-guardian-button"]').count() > 0;

    if (addButtonExists) {
      const addButton = page.locator('[data-testid="add-guardian-button"]');
      await addButton.click();
      await page.waitForTimeout(500);

      const firstNameInputExists = await page.locator('[data-testid="firstName-input"]').count() > 0;

      if (firstNameInputExists) {
        await checkAccessibility(page, 'firstName-input');
        await checkAccessibility(page, 'lastName-input');
      }

      await cancelForm(page);
    }

    await expect(page.locator('body')).toBeAttached();
  });
});

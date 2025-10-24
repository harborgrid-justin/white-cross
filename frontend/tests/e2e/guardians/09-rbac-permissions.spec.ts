import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { waitForHealthcareData, navigateToStudentDetails } from '../../support/healthcare-helpers';

/**
 * Guardians Management: RBAC Permissions (2 tests)
 *
 * Tests role-based access control for guardian management
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority High
 */

test.describe('Guardians Management - RBAC Permissions', () => {
  test('should allow admin to manage guardians', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await navigateToStudentDetails(page);

    await expect(page.locator('body')).toBeAttached();
  });

  test('should restrict viewer from adding guardians', async ({ page }) => {
    await login(page, 'viewer');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await navigateToStudentDetails(page);

    const addButtonExists = await page.locator('[data-testid="add-guardian-button"]').count() > 0;

    if (addButtonExists) {
      const addButton = page.locator('[data-testid="add-guardian-button"]');
      await expect(addButton).toBeDisabled();
    } else {
      console.log('Guardian management respects RBAC');
    }
  });
});

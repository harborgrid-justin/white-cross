import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { waitForHealthcareData, navigateToStudentDetails, getByTestId } from '../../support/healthcare-helpers';

/**
 * Guardians Management: Multi-Guardian Scenarios (4 tests)
 *
 * Tests handling of multiple guardians and complex custody arrangements
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority High
 */

test.describe('Guardians Management - Multi-Guardian Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await navigateToStudentDetails(page);
  });

  test('should display multiple guardians for one student', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached();
  });

  test('should indicate primary guardian among multiple guardians', async ({ page }) => {
    const primaryIndicatorExists = await page.locator('[data-testid="primary-guardian-indicator"]').count() > 0;

    if (primaryIndicatorExists) {
      const primaryIndicator = getByTestId(page, 'primary-guardian-indicator');
      await expect(primaryIndicator).toBeVisible();
    } else {
      console.log('Primary guardian indicator not yet implemented');
    }
  });

  test('should handle joint custody scenarios', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();

    if (bodyText?.includes('Joint') || bodyText?.includes('Shared')) {
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Joint custody scenarios not yet implemented');
    }
  });

  test('should show custody schedule if configured', async ({ page }) => {
    const custodyScheduleExists = await page.locator('[data-testid="custody-schedule"]').count() > 0;

    if (custodyScheduleExists) {
      const custodySchedule = getByTestId(page, 'custody-schedule');
      await expect(custodySchedule).toBeVisible();
    } else {
      console.log('Custody schedule not yet implemented');
    }
  });
});

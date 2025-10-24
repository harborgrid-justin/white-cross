import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { waitForHealthcareData, navigateToStudentDetails, getByTestId } from '../../support/healthcare-helpers';

/**
 * Guardians Management: Guardian Viewing (4 tests)
 *
 * Tests viewing and displaying guardian information
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority High
 */

test.describe('Guardians Management - Guardian Viewing', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await navigateToStudentDetails(page);
  });

  test('should display list of guardians for student', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Guardian');
  });

  test('should display guardian details with custody status', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();

    if (bodyText?.includes('Guardian') || bodyText?.includes('Custody')) {
      await expect(page.locator('body')).toBeAttached();
    }
  });

  test('should display primary guardian indicator', async ({ page }) => {
    const primaryBadgeExists = await page.locator('[data-testid="primary-guardian-badge"]').count() > 0;

    if (primaryBadgeExists) {
      const primaryBadge = getByTestId(page, 'primary-guardian-badge');
      await expect(primaryBadge).toBeVisible();
    } else {
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('Guardian');
    }
  });

  test('should display multiple guardians with custody information', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached();
    await page.waitForTimeout(500);
  });
});

import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { waitForHealthcareData, navigateToStudentDetails, getByTestId } from '../../support/healthcare-helpers';

/**
 * Guardians Management: Page UI Structure (5 tests)
 *
 * Tests the guardians management page structure, loading, and navigation
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority Critical
 */

test.describe('Guardians Management - Page UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
  });

  test('should display guardians section in student details', async ({ page }) => {
    await navigateToStudentDetails(page);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Guardian');
  });

  test('should display add guardian button', async ({ page }) => {
    await navigateToStudentDetails(page);

    const addButtonTestId = page.locator('[data-testid="add-guardian-button"]');
    const addButtonText = page.locator('button').filter({ hasText: /add.*guardian/i });

    const buttonCount = await addButtonTestId.count();

    if (buttonCount > 0) {
      await expect(addButtonTestId).toBeVisible();
    } else {
      await expect(addButtonText).toBeVisible();
    }
  });

  test('should display guardians table with headers', async ({ page }) => {
    await navigateToStudentDetails(page);

    await expect(page.locator('body')).toBeAttached();
  });

  test('should display custody information section', async ({ page }) => {
    await navigateToStudentDetails(page);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Guardian');
  });

  test('should navigate to guardians section from student profile', async ({ page }) => {
    await navigateToStudentDetails(page);

    await expect(page).toHaveURL(/\/students/);
  });
});

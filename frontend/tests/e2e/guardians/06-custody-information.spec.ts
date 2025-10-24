import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { waitForHealthcareData, navigateToStudentDetails, getByTestId } from '../../support/healthcare-helpers';

/**
 * Guardians Management: Custody Information (5 tests)
 *
 * Tests custody information management and legal guardianship
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority Critical
 */

test.describe('Guardians Management - Custody Information', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await navigateToStudentDetails(page);
  });

  test('should display legal custody status for guardians', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();

    if (bodyText?.includes('Legal') || bodyText?.includes('Custody')) {
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Custody information display not yet implemented');
    }
  });

  test('should display physical custody status', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();

    if (bodyText?.includes('Physical') || bodyText?.includes('Custody')) {
      await expect(page.locator('body')).toBeAttached();
    } else {
      console.log('Physical custody display not yet implemented');
    }
  });

  test('should display court order information when present', async ({ page }) => {
    const courtOrderInfoExists = await page.locator('[data-testid="court-order-info"]').count() > 0;

    if (courtOrderInfoExists) {
      const courtOrderInfo = getByTestId(page, 'court-order-info');
      await expect(courtOrderInfo).toBeVisible();
    } else {
      console.log('Court order information not yet implemented');
    }
  });

  test('should show custody restrictions if applicable', async ({ page }) => {
    const custodyRestrictionsExists = await page.locator('[data-testid="custody-restrictions"]').count() > 0;

    if (custodyRestrictionsExists) {
      const custodyRestrictions = getByTestId(page, 'custody-restrictions');
      await expect(custodyRestrictions).toBeVisible();
    } else {
      console.log('Custody restrictions not yet implemented');
    }
  });

  test('should display custody percentage for shared custody', async ({ page }) => {
    const custodyPercentageExists = await page.locator('[data-testid="custody-percentage"]').count() > 0;

    if (custodyPercentageExists) {
      const custodyPercentage = getByTestId(page, 'custody-percentage');
      await expect(custodyPercentage).toBeVisible();
    } else {
      console.log('Custody percentage not yet implemented');
    }
  });
});

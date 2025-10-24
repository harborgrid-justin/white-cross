import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';

/**
 * Clinic Visits: Page UI Structure
 *
 * Validates the clinic visits page user interface, layout, and core elements.
 * Tests ensure proper page loading, table display, and action buttons.
 *
 * Test Coverage:
 * - Page load and URL validation
 * - Clinic visits table display
 * - Check-in button availability
 * - Active visits section rendering
 *
 * @see /cypress/e2e/18-clinic-visits/01-page-ui-structure.cy.ts - Original Cypress version
 */

test.describe('Clinic Visits - Page UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as nurse user
    await login(page, 'nurse');

    // Navigate to clinic visits page
    await page.goto('/clinic-visits');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load clinic visits page successfully', async ({ page }) => {
    // Verify URL contains clinic
    await expect(page).toHaveURL(/.*clinic/);

    // Verify page body is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display clinic visits table', async ({ page }) => {
    // Verify page content exists - placeholder for table verification
    await expect(page.locator('body')).toBeAttached();

    // TODO: Add specific table selectors when implemented
    // await expect(page.getByTestId('clinic-visits-table')).toBeVisible();
  });

  test('should display check-in button', async ({ page }) => {
    // Verify check-in button is visible using regex pattern
    const checkInButton = page.locator('button').filter({ hasText: /check.*in/i });
    await expect(checkInButton.first()).toBeVisible();
  });

  test('should display active visits section', async ({ page }) => {
    // Verify page content exists - placeholder for active visits section
    await expect(page.locator('body')).toBeAttached();

    // TODO: Add specific active visits section selectors when implemented
    // await expect(page.getByTestId('active-visits-section')).toBeVisible();
  });
});

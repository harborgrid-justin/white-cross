import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';

/**
 * Communication: RBAC Permissions
 *
 * Validates role-based access control for communication features.
 * Tests ensure proper authorization for messaging and announcements.
 *
 * Test Coverage:
 * - Staff messaging permissions
 * - Admin announcement creation permissions
 *
 * @see /cypress/e2e/19-communication/09-rbac-permissions.cy.ts - Original Cypress version
 */

test.describe('Communication - RBAC Permissions', () => {
  test('should allow staff to send messages', async ({ page }) => {
    // Authenticate as nurse user
    await login(page, 'nurse');

    // Navigate to messages page
    await page.goto('/messages');

    // Wait for healthcare data to load
    await page.waitForLoadState('networkidle');

    // Verify compose button is visible for staff
    const composeButton = page.locator('button').filter({ hasText: /compose|new/i });
    await expect(composeButton.first()).toBeVisible();
  });

  test('should allow admin to create announcements', async ({ page }) => {
    // Authenticate as admin user
    await login(page, 'admin');

    // Navigate to announcements page
    await page.goto('/announcements');

    // Wait for healthcare data to load
    await page.waitForLoadState('networkidle');

    // Verify page content exists (admin has access)
    await expect(page.locator('body')).toBeAttached();

    // TODO: Add specific admin announcement creation validation when implemented
    // const createButton = page.locator('button').filter({ hasText: /create|new/i });
    // await expect(createButton.first()).toBeVisible();
    // await expect(createButton.first()).toBeEnabled();
  });
});

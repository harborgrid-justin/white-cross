import { test as base, Page } from '@playwright/test';
import { login, setupAuthMocks, clearAuthState } from '../support/auth-helpers';
import { setupHealthcareMocks } from '../support/test-helpers';
import { setupCustomMatchers } from '../support/custom-matchers';
import { USERS, UserType } from '../support/fixtures';

/**
 * Base Test Setup for White Cross Healthcare Management System
 * Extends Playwright test with custom fixtures and healthcare-specific setup
 */

// Define custom fixtures type
type CustomFixtures = {
  authenticatedPage: Page;
  nursePage: Page;
  adminPage: Page;
  doctorPage: Page;
};

/**
 * Extended test with custom fixtures
 * 
 * Usage:
 * ```typescript
 * import { test, expect } from '../setup/base-test';
 * 
 * test('nurse can view students', async ({ nursePage }) => {
 *   await nursePage.goto('/students');
 *   // Test logic here
 * });
 * ```
 */
export const test = base.extend<CustomFixtures>({
  // Generic authenticated page (nurse by default)
  authenticatedPage: async ({ page, context }, use) => {
    // Setup API mocks
    await setupAuthMocks(page);
    await setupHealthcareMocks(page);

    // Login as nurse
    await login(page, 'nurse');

    // Use the page
    await use(page);

    // Cleanup
    await clearAuthState(page);
  },

  // Nurse-specific page
  nursePage: async ({ page, context }, use) => {
    await setupAuthMocks(page);
    await setupHealthcareMocks(page);
    await login(page, 'nurse');
    await use(page);
    await clearAuthState(page);
  },

  // Admin-specific page
  adminPage: async ({ page, context }, use) => {
    await setupAuthMocks(page);
    await setupHealthcareMocks(page);
    await login(page, 'admin');
    await use(page);
    await clearAuthState(page);
  },

  // Doctor-specific page
  doctorPage: async ({ page, context }, use) => {
    await setupAuthMocks(page);
    await setupHealthcareMocks(page);
    await login(page, 'doctor');
    await use(page);
    await clearAuthState(page);
  }
});

/**
 * Export expect from Playwright
 */
export { expect } from '@playwright/test';

/**
 * Setup function to run before all tests
 * Initialize custom matchers and any global setup
 */
export function setupTests() {
  setupCustomMatchers();
}

/**
 * Utility to create a test with a specific user role
 * 
 * @param userType - Type of user to authenticate as
 * @returns Test function with authenticated page
 */
export function testAs(userType: UserType) {
  return base.extend<{ page: Page }>({
    page: async ({ page, context }, use) => {
      await setupAuthMocks(page);
      await setupHealthcareMocks(page);
      await login(page, userType);
      await use(page);
      await clearAuthState(page);
    }
  });
}

/**
 * Test with no authentication (for testing login flows)
 * 
 * Usage:
 * ```typescript
 * import { unauthenticatedTest as test, expect } from '../setup/base-test';
 * 
 * test('user can login', async ({ page }) => {
 *   await page.goto('/login');
 *   // Test login flow
 * });
 * ```
 */
export const unauthenticatedTest = base.extend<{}>({
  page: async ({ page }, use) => {
    // Setup API mocks but don't authenticate
    await setupAuthMocks(page);
    await setupHealthcareMocks(page);
    await use(page);
  }
});

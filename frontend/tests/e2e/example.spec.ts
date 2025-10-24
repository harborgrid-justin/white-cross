import { test, expect } from '../setup/base-test';
import { ROUTES, ERROR_MESSAGES } from '../support/fixtures';
import { assertToastMessage, assertOnPage } from '../support/custom-matchers';

/**
 * Example Test Suite - Login Flow
 * Demonstrates migrated Cypress tests to Playwright
 */

test.describe('Login Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    // Check page elements
    await expect(page.locator('[data-cy=email-input]')).toBeVisible();
    await expect(page.locator('[data-cy=password-input]')).toBeVisible();
    await expect(page.locator('[data-cy=login-button]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    // Fill in invalid credentials
    await page.locator('[data-cy=email-input]').fill('invalid@example.com');
    await page.locator('[data-cy=password-input]').fill('wrongpassword');
    await page.locator('[data-cy=login-button]').click();
    
    // Check for error message
    await expect(page.locator('text=/invalid|error/i')).toBeVisible();
  });

  test('should login successfully as nurse', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    // Fill in valid credentials
    await page.locator('[data-cy=email-input]').fill('nurse@school.edu');
    await page.locator('[data-cy=password-input]').fill('NursePassword123!');
    await page.locator('[data-cy=login-button]').click();
    
    // Check redirect to dashboard
    await expect(page).toHaveURL(/dashboard|home/);
  });
});

/**
 * Example Test Suite - Authenticated User Actions
 * Demonstrates using custom fixtures
 */

test.describe('Dashboard Access', () => {
  test('nurse can access dashboard', async ({ nursePage }) => {
    await nursePage.goto(ROUTES.DASHBOARD);
    
    // Check dashboard elements
    await expect(nursePage.locator('h1, h2').first()).toBeVisible();
    await expect(nursePage).toHaveURL(/dashboard/);
  });

  test('admin can access admin features', async ({ adminPage }) => {
    await adminPage.goto(ROUTES.SETTINGS);
    
    // Admin should be able to access settings
    await expect(adminPage).toHaveURL(/settings/);
  });
});

/**
 * Example Test Suite - Form Interactions
 * Demonstrates form handling
 */

test.describe('Form Handling', () => {
  test('should handle form submission', async ({ nursePage }) => {
    await nursePage.goto(ROUTES.STUDENTS);
    
    // Click add button
    const addButton = nursePage.locator('button:has-text("Add"), [data-cy=add-button]');
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      
      // Check if form appears
      const form = nursePage.locator('form, [role="dialog"]');
      await expect(form.first()).toBeVisible();
    }
  });
});

/**
 * Example Test Suite - API Mocking
 * Demonstrates custom API mocking
 */

test.describe('API Mocking', () => {
  test('should mock student data', async ({ nursePage }) => {
    // Mock students endpoint
    await nursePage.route('**/api/students', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            students: [
              { id: '1', firstName: 'John', lastName: 'Doe', grade: '10' },
              { id: '2', firstName: 'Jane', lastName: 'Smith', grade: '11' }
            ]
          }
        })
      });
    });
    
    await nursePage.goto(ROUTES.STUDENTS);
    
    // Wait for data to load
    await nursePage.waitForLoadState('networkidle');
  });
});

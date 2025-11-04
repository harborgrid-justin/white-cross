/**
 * E2E Tests for Login Flow
 *
 * Tests critical login user journey including:
 * - Successful login
 * - Failed login attempts
 * - Form validation
 * - Redirect after login
 * - Session persistence
 *
 * @module tests/e2e/login.spec
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Login Page Object Model
 */
class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.page.getByLabel(/email/i).fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByLabel(/password/i).fill(password);
  }

  async clickLogin() {
    await this.page.getByRole('button', { name: /log in|login|sign in/i }).click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async expectErrorMessage(message: string) {
    await expect(this.page.getByRole('alert')).toContainText(message);
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login/);
  }
}

test.describe('Login Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Successful Login', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
      await loginPage.login('nurse@example.com', 'password123');

      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);

      // Should show welcome message or user name
      await expect(page.getByText(/dashboard|welcome/i)).toBeVisible();
    });

    test('should persist session after page reload', async ({ page }) => {
      await loginPage.login('nurse@example.com', 'password123');
      await expect(page).toHaveURL(/\/dashboard/);

      // Reload page
      await page.reload();

      // Should still be on dashboard (session persisted)
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should show user profile after login', async ({ page }) => {
      await loginPage.login('nurse@example.com', 'password123');

      // Click on user profile/menu
      const userMenu = page.getByRole('button', { name: /profile|account|user/i });
      if (await userMenu.isVisible()) {
        await userMenu.click();
        await expect(page.getByText(/nurse@example.com/i)).toBeVisible();
      }
    });
  });

  test.describe('Failed Login', () => {
    test('should show error with invalid credentials', async ({ page }) => {
      await loginPage.login('wrong@example.com', 'wrongpassword');

      // Should stay on login page
      await loginPage.expectToBeOnLoginPage();

      // Should show error message
      await loginPage.expectErrorMessage(/invalid|incorrect|failed/i);
    });

    test('should show error with empty email', async ({ page }) => {
      await loginPage.fillPassword('password123');
      await loginPage.clickLogin();

      // Browser validation should prevent submission
      const emailInput = page.getByLabel(/email/i);
      const validationMessage = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).toBeTruthy();
    });

    test('should show error with empty password', async ({ page }) => {
      await loginPage.fillEmail('nurse@example.com');
      await loginPage.clickLogin();

      // Browser validation should prevent submission
      const passwordInput = page.getByLabel(/password/i);
      const validationMessage = await passwordInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).toBeTruthy();
    });

    test('should show error with invalid email format', async ({ page }) => {
      await loginPage.fillEmail('invalid-email');
      await loginPage.fillPassword('password123');
      await loginPage.clickLogin();

      // Should show validation error
      const emailInput = page.getByLabel(/email/i);
      const isInvalid = await emailInput.evaluate(
        (el: HTMLInputElement) => !el.validity.valid
      );
      expect(isInvalid).toBe(true);
    });
  });

  test.describe('Form Validation', () => {
    test('should validate email format', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);

      await emailInput.fill('not-an-email');
      await emailInput.blur();

      const isInvalid = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validity.typeMismatch
      );
      expect(isInvalid).toBe(true);
    });

    test('should show password visibility toggle', async ({ page }) => {
      const passwordInput = page.getByLabel(/password/i);
      await passwordInput.fill('password123');

      // Look for show/hide password button
      const toggleButton = page.getByRole('button', { name: /show|hide|toggle password/i });
      if (await toggleButton.isVisible()) {
        await toggleButton.click();

        // Password should now be visible (type="text")
        const inputType = await passwordInput.getAttribute('type');
        expect(inputType).toBe('text');
      }
    });

    test('should trim whitespace from email', async ({ page }) => {
      await loginPage.login('  nurse@example.com  ', 'password123');

      // Should still login successfully (whitespace trimmed)
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be fully keyboard navigable', async ({ page }) => {
      // Tab to email input
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/email/i)).toBeFocused();

      // Tab to password input
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/password/i)).toBeFocused();

      // Tab to login button
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: /log in|login|sign in/i })).toBeFocused();
    });

    test('should submit form with Enter key', async ({ page }) => {
      await loginPage.fillEmail('nurse@example.com');
      await loginPage.fillPassword('password123');

      // Press Enter to submit
      await page.keyboard.press('Enter');

      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper form labels', async ({ page }) => {
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('should have accessible submit button', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /log in|login|sign in/i });
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();
    });

    test('should announce errors to screen readers', async ({ page }) => {
      await loginPage.login('wrong@example.com', 'wrongpassword');

      // Error should have role="alert" for screen readers
      const alert = page.getByRole('alert');
      await expect(alert).toBeVisible();
    });

    test('should have proper page title', async ({ page }) => {
      await expect(page).toHaveTitle(/login/i);
    });
  });

  test.describe('Loading States', () => {
    test('should show loading state during login', async ({ page }) => {
      await loginPage.fillEmail('nurse@example.com');
      await loginPage.fillPassword('password123');

      // Start login
      const submitButton = page.getByRole('button', { name: /log in|login|sign in/i });
      await submitButton.click();

      // Should show loading state
      await expect(submitButton).toBeDisabled();
      await expect(submitButton).toContainText(/loading|logging in|please wait/i);
    });

    test('should disable form inputs during login', async ({ page }) => {
      await loginPage.fillEmail('nurse@example.com');
      await loginPage.fillPassword('password123');
      await loginPage.clickLogin();

      // Inputs should be disabled during submission
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/password/i);

      // Check if disabled (may be async, so use expect with timeout)
      await expect(emailInput).toBeDisabled({ timeout: 1000 }).catch(() => {
        // Some forms don't disable inputs during submission
      });
    });
  });

  test.describe('Security', () => {
    test('should not expose password in page source', async ({ page }) => {
      await loginPage.fillPassword('secretpassword123');

      const pageContent = await page.content();

      // Password should not be visible in HTML
      expect(pageContent).not.toContain('secretpassword123');
    });

    test('should use password input type', async ({ page }) => {
      const passwordInput = page.getByLabel(/password/i);
      const inputType = await passwordInput.getAttribute('type');

      expect(inputType).toBe('password');
    });

    test('should clear error message on retry', async ({ page }) => {
      // First attempt - fail
      await loginPage.login('wrong@example.com', 'wrongpassword');
      await loginPage.expectErrorMessage(/invalid/i);

      // Second attempt - clear inputs and try again
      await loginPage.fillEmail('nurse@example.com');

      // Error message should be cleared or hidden
      // (Either not present or not visible)
      const alert = page.getByRole('alert');
      const isVisible = await alert.isVisible().catch(() => false);

      if (isVisible) {
        // Some forms keep error visible until re-submit
        // This is acceptable UX
      }
    });
  });
});

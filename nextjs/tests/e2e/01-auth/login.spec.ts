import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/White Cross/i);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Mock API response
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              email: 'nurse@school.edu',
              firstName: 'Jane',
              lastName: 'Doe',
              role: 'nurse',
            },
          },
        }),
      });
    });

    await page.getByLabel(/email/i).fill('nurse@school.edu');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid email or password',
        }),
      });
    });

    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByRole('alert')).toContainText(/invalid email or password/i);
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i);
    const toggleButton = page.getByRole('button', { name: /toggle password visibility/i });

    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              email: 'nurse@school.edu',
              firstName: 'Jane',
              lastName: 'Doe',
              role: 'nurse',
            },
          },
        }),
      });
    });

    await page.getByLabel(/email/i).fill('nurse@school.edu');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/dashboard');

    // Mock logout API
    await page.route('**/api/v1/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Logout
    await page.getByRole('button', { name: /user menu/i }).click();
    await page.getByRole('menuitem', { name: /logout/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should redirect to login if accessing protected route without auth', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/');
  });

  test('should remember me functionality', async ({ page }) => {
    const rememberCheckbox = page.getByLabel(/remember me/i);
    await expect(rememberCheckbox).toBeVisible();

    await rememberCheckbox.check();
    await expect(rememberCheckbox).toBeChecked();

    await page.getByLabel(/email/i).fill('nurse@school.edu');
    await page.getByLabel(/password/i).fill('password123');

    // Mock login
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              email: 'nurse@school.edu',
              firstName: 'Jane',
              lastName: 'Doe',
              role: 'nurse',
            },
          },
        }),
      });
    });

    await page.getByRole('button', { name: /sign in/i }).click();

    // Check localStorage for persistence
    const rememberMe = await page.evaluate(() => localStorage.getItem('rememberMe'));
    expect(rememberMe).toBeTruthy();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.abort('failed');
    });

    await page.getByLabel(/email/i).fill('nurse@school.edu');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByRole('alert')).toContainText(/network error/i);
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check for proper labels
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();

    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/password/i)).toBeFocused();

    // Fill form with keyboard
    await page.keyboard.type('nurse@school.edu');
    await page.keyboard.press('Tab');
    await page.keyboard.type('password123');

    // Submit with Enter
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              email: 'nurse@school.edu',
              firstName: 'Jane',
              lastName: 'Doe',
              role: 'nurse',
            },
          },
        }),
      });
    });

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/dashboard');
  });
});

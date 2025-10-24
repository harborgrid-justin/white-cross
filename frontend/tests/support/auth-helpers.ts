import { Page, BrowserContext } from '@playwright/test';
import { USERS } from './fixtures';

/**
 * Authentication Helper Functions for White Cross Healthcare Management System
 * Migrated from Cypress commands with Playwright best practices
 */

export interface LoginOptions {
  skipSession?: boolean;
  validateRole?: boolean;
  timeout?: number;
}

export interface User {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

/**
 * Login helper that authenticates a user and saves the authentication state
 * Uses Playwright's storageState for efficient session reuse across tests
 *
 * @param page - Playwright Page object
 * @param userType - Type of user to login as (nurse, admin, doctor, counselor, viewer)
 * @param options - Additional login options
 */
export async function login(
  page: Page,
  userType: keyof typeof USERS,
  options: LoginOptions = {}
): Promise<void> {
  const { validateRole = true, timeout = 30000 } = options;

  const user = USERS[userType];
  if (!user) {
    throw new Error(`User type "${userType}" not found in users fixture`);
  }

  // Navigate to login page
  await page.goto('/login', { timeout, waitUntil: 'networkidle' });

  // Wait for page to be ready
  await page.waitForLoadState('domcontentloaded');

  // Fill in credentials - try data-cy attributes first, then fallback to standard selectors
  const emailInput = page.locator('[data-cy=email-input], input[type="email"], input[name="email"]').first();
  const passwordInput = page.locator('[data-cy=password-input], input[type="password"], input[name="password"]').first();
  const loginButton = page.locator('[data-cy=login-button], button[type="submit"]').first();

  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);
  await loginButton.click();

  // Wait for successful authentication - check URL changes
  await page.waitForURL((url) => {
    const urlString = url.toString();
    return (
      urlString.includes('/dashboard') ||
      urlString.includes('/home') ||
      !urlString.includes('/login')
    );
  }, { timeout: timeout * 2 });

  // Validate authentication token exists in localStorage
  const token = await page.evaluate(() => {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('auth_data') ||
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('token')
    );
  });

  if (!token) {
    throw new Error('Authentication failed: No token found in storage');
  }

  // Verify role if requested
  if (validateRole) {
    await verifyUserRole(page, user.role);
  }
}

/**
 * Login and save authentication state for reuse across tests
 * This is more efficient than logging in for every test
 *
 * @param page - Playwright Page object
 * @param userType - Type of user to login as
 * @param storageStatePath - Path to save the authentication state
 */
export async function loginAndSaveState(
  page: Page,
  context: BrowserContext,
  userType: keyof typeof USERS,
  storageStatePath: string
): Promise<void> {
  await login(page, userType);

  // Save authentication state for reuse
  await context.storageState({ path: storageStatePath });
}

/**
 * Logout helper that clears authentication state
 *
 * @param page - Playwright Page object
 */
export async function logout(page: Page): Promise<void> {
  // Try to click logout button if it exists
  const logoutButton = page.locator('[data-cy=logout-button], button:has-text("Logout"), button:has-text("Sign out")');

  if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await logoutButton.click();
    await page.waitForURL('**/login', { timeout: 10000 });
  } else {
    // If no logout button, manually clear storage and navigate to login
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto('/login');
  }
}

/**
 * Verify user role from stored authentication data
 *
 * @param page - Playwright Page object
 * @param expectedRole - Expected user role
 */
export async function verifyUserRole(page: Page, expectedRole: string): Promise<void> {
  const userRole = await page.evaluate(() => {
    // Try to get role from various storage locations
    const authData = localStorage.getItem('auth_data');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed.user?.role || parsed.role;
      } catch {
        return null;
      }
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.role;
      } catch {
        return null;
      }
    }

    return null;
  });

  if (userRole !== expectedRole) {
    throw new Error(`Role verification failed: expected ${expectedRole}, got ${userRole}`);
  }
}

/**
 * Check if user is authenticated
 *
 * @param page - Playwright Page object
 * @returns True if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const token = await page.evaluate(() => {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('auth_data') ||
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('token')
    );
  });

  return !!token;
}

/**
 * Get current user information from storage
 *
 * @param page - Playwright Page object
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(page: Page): Promise<any> {
  return await page.evaluate(() => {
    const authData = localStorage.getItem('auth_data');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed.user;
      } catch {
        return null;
      }
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }

    return null;
  });
}

/**
 * Clear all authentication state
 *
 * @param page - Playwright Page object
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Clear cookies
  await page.context().clearCookies();
}

/**
 * Setup authentication intercepts for API mocking
 * Matches Cypress behavior for testing without backend
 *
 * @param page - Playwright Page object
 */
export async function setupAuthMocks(page: Page): Promise<void> {
  // Mock login endpoint
  await page.route('**/api/auth/login', async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    const validCredentials: Record<string, any> = {
      'admin@school.edu': {
        password: 'AdminPassword123!',
        role: 'ADMIN',
        firstName: 'Test',
        lastName: 'Administrator'
      },
      'nurse@school.edu': {
        password: 'NursePassword123!',
        role: 'NURSE',
        firstName: 'Test',
        lastName: 'Nurse'
      },
      'counselor@school.edu': {
        password: 'CounselorPassword123!',
        role: 'SCHOOL_ADMIN',
        firstName: 'Test',
        lastName: 'Counselor'
      },
      'doctor@school.edu': {
        password: 'DoctorPassword123!',
        role: 'DOCTOR',
        firstName: 'Test',
        lastName: 'Doctor'
      },
      'readonly@school.edu': {
        password: 'ReadOnlyPassword123!',
        role: 'NURSE',
        firstName: 'Test',
        lastName: 'ReadOnly'
      }
    };

    const user = validCredentials[postData.email?.toLowerCase()];

    if (user && postData.password === user.password) {
      // Valid credentials
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 'user-' + Date.now(),
              email: postData.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              displayName: `${user.firstName} ${user.lastName}`
            }
          }
        })
      });
    } else {
      // Invalid credentials
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: {
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS'
          }
        })
      });
    }
  });

  // Mock token verification
  await page.route('**/api/auth/verify', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { valid: true }
      })
    });
  });

  // Mock current user endpoint
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'NURSE'
          }
        }
      })
    });
  });

  // Mock token refresh
  await page.route('**/api/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          token: 'refreshed-mock-jwt-token-' + Date.now()
        }
      })
    });
  });

  // Mock logout endpoint
  await page.route('**/api/auth/logout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });
}

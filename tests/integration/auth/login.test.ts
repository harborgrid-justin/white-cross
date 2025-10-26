/**
 * Authentication Integration Tests
 * Tests login, logout, token management, and session handling
 */

import { test, expect } from '../helpers/test-client';
import { TEST_USERS } from '../helpers/test-data';

test.describe('Authentication Integration', () => {
  test.describe('Login', () => {
    test('should login with valid credentials', async ({ apiContext }) => {
      const response = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: TEST_USERS.nurse.email,
          password: TEST_USERS.nurse.password,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(TEST_USERS.nurse.email);
      expect(data.user.role).toBe(TEST_USERS.nurse.role);
    });

    test('should reject login with invalid email', async ({ apiContext }) => {
      const response = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(401);

      const data = await response.json();
      expect(data.message).toContain('Invalid');
    });

    test('should reject login with invalid password', async ({ apiContext }) => {
      const response = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: TEST_USERS.nurse.email,
          password: 'wrongpassword',
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(401);
    });

    test('should reject login with missing credentials', async ({ apiContext }) => {
      const response = await apiContext.post('/api/v1/auth/login', {
        data: {},
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should include user profile in login response', async ({ apiContext }) => {
      const response = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: TEST_USERS.nurse.email,
          password: TEST_USERS.nurse.password,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.user.id).toBeDefined();
      expect(data.user.email).toBeDefined();
      expect(data.user.firstName).toBeDefined();
      expect(data.user.lastName).toBeDefined();
      expect(data.user.role).toBeDefined();
    });

    test('should not expose sensitive data in login response', async ({ apiContext }) => {
      const response = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: TEST_USERS.nurse.email,
          password: TEST_USERS.nurse.password,
        },
      });

      const data = await response.json();

      // Should NOT include password hash
      expect(data.user.password).toBeUndefined();
      expect(data.user.passwordHash).toBeUndefined();
    });
  });

  test.describe('Token Management', () => {
    test('should refresh access token with valid refresh token', async ({ apiContext }) => {
      // Login to get tokens
      const loginResponse = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: TEST_USERS.nurse.email,
          password: TEST_USERS.nurse.password,
        },
      });
      const loginData = await loginResponse.json();

      // Refresh token
      const refreshResponse = await apiContext.post('/api/v1/auth/refresh', {
        data: {
          refreshToken: loginData.refreshToken,
        },
      });

      expect(refreshResponse.ok()).toBeTruthy();
      const refreshData = await refreshResponse.json();

      expect(refreshData.accessToken).toBeDefined();
      expect(refreshData.accessToken).not.toBe(loginData.accessToken);
    });

    test('should reject refresh with invalid token', async ({ apiContext }) => {
      const response = await apiContext.post('/api/v1/auth/refresh', {
        data: {
          refreshToken: 'invalid-token',
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(401);
    });

    test('should reject expired refresh token', async ({ apiContext }) => {
      // This would require a token that's actually expired
      // For now, test with invalid token format
      const response = await apiContext.post('/api/v1/auth/refresh', {
        data: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.token',
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(401);
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.post('/api/v1/auth/logout', {});

      expect(response.ok()).toBeTruthy();
    });

    test('should invalidate token after logout', async ({ apiContext }) => {
      // Login
      const loginResponse = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: TEST_USERS.nurse.email,
          password: TEST_USERS.nurse.password,
        },
      });
      const loginData = await loginResponse.json();

      // Create context with token
      const contextWithToken = await apiContext.fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`,
        },
      });

      expect(contextWithToken.ok()).toBeTruthy();

      // Try to use token after logout
      const protectedResponse = await apiContext.fetch('/api/v1/students', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`,
        },
      });

      expect(protectedResponse.ok()).toBeFalsy();
      expect(protectedResponse.status()).toBe(401);
    });
  });

  test.describe('Protected Routes', () => {
    test('should reject request without token', async ({ apiContext }) => {
      const response = await apiContext.get('/api/v1/students');

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(401);
    });

    test('should reject request with invalid token', async ({ apiContext }) => {
      const response = await apiContext.get('/api/v1/students', {
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(401);
    });

    test('should allow request with valid token', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/students');

      expect(response.ok()).toBeTruthy();
    });

    test('should reject expired token', async ({ apiContext }) => {
      // Use a known expired token (would need to be generated/mocked)
      const response = await apiContext.get('/api/v1/students', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid',
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(401);
    });
  });

  test.describe('Password Management', () => {
    test('should change password with valid current password', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.put('/api/v1/auth/change-password', {
        data: {
          currentPassword: TEST_USERS.nurse.password,
          newPassword: 'NewPassword123!',
        },
      });

      expect(response.ok()).toBeTruthy();

      // Change it back
      await authenticatedContext.put('/api/v1/auth/change-password', {
        data: {
          currentPassword: 'NewPassword123!',
          newPassword: TEST_USERS.nurse.password,
        },
      });
    });

    test('should reject password change with invalid current password', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.put('/api/v1/auth/change-password', {
        data: {
          currentPassword: 'wrongpassword',
          newPassword: 'NewPassword123!',
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject weak new password', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.put('/api/v1/auth/change-password', {
        data: {
          currentPassword: TEST_USERS.nurse.password,
          newPassword: 'weak',
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should initiate password reset', async ({ apiContext }) => {
      const response = await apiContext.post('/api/v1/auth/forgot-password', {
        data: {
          email: TEST_USERS.nurse.email,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.message).toContain('reset');
    });

    test('should not reveal if email exists during reset', async ({ apiContext }) => {
      const response = await apiContext.post('/api/v1/auth/forgot-password', {
        data: {
          email: 'nonexistent@example.com',
        },
      });

      // Should still return success to prevent email enumeration
      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe('Session Management', () => {
    test('should track active sessions', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/auth/sessions');

      expect(response.ok()).toBeTruthy();
      const sessions = await response.json();

      expect(Array.isArray(sessions)).toBeTruthy();
      expect(sessions.length).toBeGreaterThan(0);
    });

    test('should retrieve current session info', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/auth/me');

      expect(response.ok()).toBeTruthy();
      const user = await response.json();

      expect(user.id).toBeDefined();
      expect(user.email).toBe(TEST_USERS.nurse.email);
      expect(user.role).toBe(TEST_USERS.nurse.role);
    });

    test('should revoke session', async ({ apiContext }) => {
      // Login to create session
      const loginResponse = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: TEST_USERS.nurse.email,
          password: TEST_USERS.nurse.password,
        },
      });
      const loginData = await loginResponse.json();

      // Get session ID
      const sessionsResponse = await apiContext.fetch('/api/v1/auth/sessions', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`,
        },
      });
      const sessions = await sessionsResponse.json();

      if (sessions.length > 0) {
        const sessionId = sessions[0].id;

        // Revoke session
        const revokeResponse = await apiContext.fetch(`/api/v1/auth/sessions/${sessionId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${loginData.accessToken}`,
          },
        });

        expect(revokeResponse.ok()).toBeTruthy();
      }
    });
  });

  test.describe('Security', () => {
    test('should rate limit login attempts', async ({ apiContext }) => {
      // Make multiple failed login attempts
      for (let i = 0; i < 10; i++) {
        await apiContext.post('/api/v1/auth/login', {
          data: {
            email: TEST_USERS.nurse.email,
            password: 'wrongpassword',
          },
        });
      }

      // Next attempt should be rate limited
      const response = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: TEST_USERS.nurse.email,
          password: 'wrongpassword',
        },
      });

      expect(response.status()).toBe(429); // Too Many Requests
    });

    test('should log authentication attempts', async ({ authenticatedContext, apiContext }) => {
      // Login
      await apiContext.post('/api/v1/auth/login', {
        data: {
          email: TEST_USERS.nurse.email,
          password: TEST_USERS.nurse.password,
        },
      });

      // Check audit logs
      const response = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          action: 'login',
          limit: 1,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.logs.length).toBeGreaterThan(0);
      expect(data.logs[0].action).toBe('login');
    });
  });
});

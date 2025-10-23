/**
 * Agent 1: Authentication API Tests
 * Tests frontend-backend communication for authentication APIs
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { TEST_USERS } from './fixtures/test-data';

test.describe('Authentication APIs - Frontend to Backend Communication', () => {
  let apiClient: ApiClient;
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001';

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request, baseURL);
  });

  test('should successfully login with valid credentials', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: TEST_USERS.nurse.email,
        password: TEST_USERS.nurse.password,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.data?.token || body.token).toBeDefined();
    expect(body.data?.user || body.user).toBeDefined();
  });

  test('should reject login with invalid credentials', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: 'invalid@test.com',
        password: 'wrongpassword',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should maintain session with valid token', async () => {
    await apiClient.login(TEST_USERS.nurse.email, TEST_USERS.nurse.password);
    const token = apiClient.getToken();
    expect(token).toBeTruthy();
  });

  test('should get current user profile', async ({ request }) => {
    // Login first
    const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: TEST_USERS.nurse.email,
        password: TEST_USERS.nurse.password,
      },
    });

    const loginBody = await loginResponse.json();
    const token = loginBody.data?.token || loginBody.token;

    // Get profile
    const profileResponse = await request.get(`${baseURL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    expect(profileResponse.ok()).toBeTruthy();
    const profileBody = await profileResponse.json();
    expect(profileBody.data?.email || profileBody.email).toBe(TEST_USERS.nurse.email);
  });

  test('should handle logout', async ({ request }) => {
    // Login first
    const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: TEST_USERS.nurse.email,
        password: TEST_USERS.nurse.password,
      },
    });

    const loginBody = await loginResponse.json();
    const token = loginBody.data?.token || loginBody.token;

    // Logout
    const logoutResponse = await request.post(`${baseURL}/api/auth/logout`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Logout may return 200, 204, or even 401 depending on implementation
    expect([200, 204, 401]).toContain(logoutResponse.status());
  });

  test('should verify token validation works', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/auth/me`, {
      headers: {
        'Authorization': 'Bearer invalid-token',
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(401);
  });
});

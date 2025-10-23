/**
 * Health Check Test - Verifies Backend is Available
 * This test should run first to ensure backend is accessible
 */

import { test, expect } from '@playwright/test';

test.describe('Backend Health Check', () => {
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001';

  test('should be able to reach backend health endpoint', async ({ request }) => {
    test.setTimeout(60000); // 60 second timeout for this test
    
    try {
      const response = await request.get(`${baseURL}/health`);
      
      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.status).toBe('OK');
      expect(body.environment).toBeDefined();
    } catch (error) {
      console.error('Backend health check failed:', error);
      console.log('Make sure the backend server is running: npm run dev:backend');
      throw error;
    }
  });

  test('should verify backend API is responding', async ({ request }) => {
    try {
      const response = await request.get(`${baseURL}/api/auth/login`, {
        failOnStatusCode: false,
      });
      
      // We expect a 400 or 401 for GET on login endpoint (should be POST)
      // But we just want to verify the API responds
      expect([400, 401, 405]).toContain(response.status());
    } catch (error) {
      console.error('Backend API check failed:', error);
      throw error;
    }
  });
});

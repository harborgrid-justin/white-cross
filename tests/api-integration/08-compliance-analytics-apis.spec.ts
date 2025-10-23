/**
 * Agent 8: Compliance & Analytics API Tests
 * Tests frontend-backend communication for compliance and analytics APIs
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { TEST_USERS } from './fixtures/test-data';

test.describe('Compliance & Analytics APIs - Frontend to Backend Communication', () => {
  let apiClient: ApiClient;
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001';

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request, baseURL);
    await apiClient.login(TEST_USERS.nurse.email, TEST_USERS.nurse.password);
  });

  test('should fetch audit logs', async () => {
    const response = await apiClient.get('/api/audit-logs');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch audit logs with pagination', async () => {
    const response = await apiClient.get('/api/audit-logs?page=1&limit=10');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch audit logs by date range', async () => {
    const startDate = new Date(Date.now() - 7 * 86400000).toISOString(); // 7 days ago
    const endDate = new Date().toISOString();
    
    const response = await apiClient.get(
      `/api/audit-logs?startDate=${startDate}&endDate=${endDate}`
    );
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch compliance reports', async () => {
    const response = await apiClient.get('/api/compliance/reports');
    
    expect(response).toBeDefined();
  });

  test('should fetch compliance statistics', async () => {
    const response = await apiClient.get('/api/compliance/stats');
    
    expect(response).toBeDefined();
  });

  test('should fetch analytics dashboard data', async () => {
    const response = await apiClient.get('/api/analytics/dashboard');
    
    expect(response).toBeDefined();
  });

  test('should fetch health metrics', async () => {
    const response = await apiClient.get('/api/analytics/health-metrics');
    
    expect(response).toBeDefined();
  });

  test('should fetch medication statistics', async () => {
    const response = await apiClient.get('/api/analytics/medications');
    
    expect(response).toBeDefined();
  });

  test('should fetch student enrollment statistics', async () => {
    const response = await apiClient.get('/api/analytics/students/enrollment');
    
    expect(response).toBeDefined();
  });

  test('should generate compliance report', async () => {
    const reportRequest = {
      reportType: 'MEDICATION_ADMINISTRATION',
      startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
      endDate: new Date().toISOString(),
    };
    
    const response = await apiClient.post('/api/compliance/reports/generate', reportRequest);
    
    expect(response).toBeDefined();
  });

  test('should fetch audit logs by entity type', async () => {
    const response = await apiClient.get('/api/audit-logs?entityType=STUDENT');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch system health status', async () => {
    const response = await apiClient.get('/api/system/health');
    
    expect(response).toBeDefined();
  });
});

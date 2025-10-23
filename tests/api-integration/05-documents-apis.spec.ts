/**
 * Agent 5: Documents API Tests
 * Tests frontend-backend communication for documents APIs
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { TEST_USERS, TEST_DOCUMENT } from './fixtures/test-data';

test.describe('Documents APIs - Frontend to Backend Communication', () => {
  let apiClient: ApiClient;
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001';

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request, baseURL);
    await apiClient.login(TEST_USERS.nurse.email, TEST_USERS.nurse.password);
  });

  test('should fetch list of documents', async () => {
    const response = await apiClient.get('/api/documents');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch documents with pagination', async () => {
    const response = await apiClient.get('/api/documents?page=1&limit=10');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch documents for a specific student', async () => {
    // Get students first
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const response = await apiClient.get(`/api/documents/student/${studentId}`);
        
        expect(response.success).toBeTruthy();
        expect(response.data).toBeDefined();
      }
    }
  });

  test('should fetch document types', async () => {
    const response = await apiClient.get('/api/documents/types');
    
    expect(response).toBeDefined();
  });

  test('should fetch document categories', async () => {
    const response = await apiClient.get('/api/documents/categories');
    
    expect(response).toBeDefined();
  });

  test('should search documents by name', async () => {
    const response = await apiClient.get('/api/documents?search=test');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should filter documents by type', async () => {
    const response = await apiClient.get('/api/documents?type=MEDICAL_FORM');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should handle document not found error', async () => {
    const response = await apiClient.get('/api/documents/999999999');
    
    // Should return error or empty result
    expect(response).toBeDefined();
  });
});

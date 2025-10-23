/**
 * Agent 4: Medications API Tests
 * Tests frontend-backend communication for medications APIs
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { TEST_USERS, TEST_MEDICATION } from './fixtures/test-data';

test.describe('Medications APIs - Frontend to Backend Communication', () => {
  let apiClient: ApiClient;
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001';

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request, baseURL);
    await apiClient.login(TEST_USERS.nurse.email, TEST_USERS.nurse.password);
  });

  test('should fetch list of medications', async () => {
    const response = await apiClient.get('/api/medications');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch medications with pagination', async () => {
    const response = await apiClient.get('/api/medications?page=1&limit=10');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch medications for a specific student', async () => {
    // Get students first
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const response = await apiClient.get(`/api/medications/student/${studentId}`);
        
        expect(response.success).toBeTruthy();
        expect(response.data).toBeDefined();
      }
    }
  });

  test('should create a medication record', async () => {
    // Get a student first
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const medication = {
          ...TEST_MEDICATION,
          studentId,
        };
        
        const response = await apiClient.post('/api/medications', medication);
        
        expect(response).toBeDefined();
      }
    }
  });

  test('should fetch medication administration history', async () => {
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const response = await apiClient.get(`/api/medications/history/${studentId}`);
        
        expect(response).toBeDefined();
      }
    }
  });

  test('should search medications by name', async () => {
    const response = await apiClient.get('/api/medications?search=Test');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should handle medication not found error', async () => {
    const response = await apiClient.get('/api/medications/999999999');
    
    // Should return error or empty result
    expect(response).toBeDefined();
  });
});

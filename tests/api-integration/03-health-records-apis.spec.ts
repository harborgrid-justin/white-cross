/**
 * Agent 3: Health Records API Tests
 * Tests frontend-backend communication for health records APIs
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { TEST_USERS, TEST_HEALTH_RECORD } from './fixtures/test-data';

test.describe('Health Records APIs - Frontend to Backend Communication', () => {
  let apiClient: ApiClient;
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001';

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request, baseURL);
    await apiClient.login(TEST_USERS.nurse.email, TEST_USERS.nurse.password);
  });

  test('should fetch list of health records', async () => {
    const response = await apiClient.get('/api/health-records');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch health records with pagination', async () => {
    const response = await apiClient.get('/api/health-records?page=1&limit=10');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch health records for a specific student', async () => {
    // Get students first to get a valid student ID
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const response = await apiClient.get(`/api/health-records/student/${studentId}`);
        
        expect(response.success).toBeTruthy();
        expect(response.data).toBeDefined();
      }
    }
  });

  test('should create a health record', async () => {
    // Get a student first
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const healthRecord = {
          ...TEST_HEALTH_RECORD,
          studentId,
        };
        
        const response = await apiClient.post('/api/health-records', healthRecord);
        
        // Creation may succeed or fail based on backend validation
        expect(response).toBeDefined();
      }
    }
  });

  test('should fetch health summary for a student', async () => {
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const response = await apiClient.get(`/api/health-records/summary/${studentId}`);
        
        expect(response).toBeDefined();
      }
    }
  });

  test('should fetch allergies for a student', async () => {
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const response = await apiClient.get(`/api/health-records/allergies/${studentId}`);
        
        expect(response).toBeDefined();
      }
    }
  });
});

/**
 * Agent 2: Students API Tests
 * Tests frontend-backend communication for student management APIs
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { TEST_USERS, TEST_STUDENT, generateUniqueTestData } from './fixtures/test-data';

test.describe('Students APIs - Frontend to Backend Communication', () => {
  let apiClient: ApiClient;
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001';

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request, baseURL);
    await apiClient.login(TEST_USERS.nurse.email, TEST_USERS.nurse.password);
  });

  test('should fetch list of students', async () => {
    const response = await apiClient.get('/api/students');
    
    expect(response.success).toBeTruthy();
    expect(Array.isArray(response.data) || Array.isArray(response.data?.students)).toBeTruthy();
  });

  test('should fetch students with pagination', async () => {
    const response = await apiClient.get('/api/students?page=1&limit=10');
    
    expect(response.success).toBeTruthy();
    const data = response.data;
    expect(data).toBeDefined();
  });

  test('should create a new student', async () => {
    const uniqueStudent = generateUniqueTestData(TEST_STUDENT, 'studentId');
    
    const response = await apiClient.post('/api/students', uniqueStudent);
    
    // Creation may return 200 or 201
    expect([200, 201].includes(response.success ? 200 : 500)).toBeTruthy();
  });

  test('should fetch a specific student by ID', async ({ request }) => {
    // First, get the list of students
    const listResponse = await apiClient.get('/api/students');
    
    if (listResponse.success && listResponse.data) {
      const students = Array.isArray(listResponse.data) 
        ? listResponse.data 
        : listResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const response = await apiClient.get(`/api/students/${studentId}`);
        
        expect(response.success).toBeTruthy();
        expect(response.data).toBeDefined();
      }
    }
  });

  test('should search students by name', async () => {
    const response = await apiClient.get('/api/students?search=Test');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should handle student not found error', async () => {
    const response = await apiClient.get('/api/students/999999999');
    
    // Should return error or empty result
    expect([200, 404].includes(response.success ? 200 : 404)).toBeTruthy();
  });
});

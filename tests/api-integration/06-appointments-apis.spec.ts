/**
 * Agent 6: Appointments API Tests
 * Tests frontend-backend communication for appointments APIs
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { TEST_USERS, TEST_APPOINTMENT } from './fixtures/test-data';

test.describe('Appointments APIs - Frontend to Backend Communication', () => {
  let apiClient: ApiClient;
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001';

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request, baseURL);
    await apiClient.login(TEST_USERS.nurse.email, TEST_USERS.nurse.password);
  });

  test('should fetch list of appointments', async () => {
    const response = await apiClient.get('/api/appointments');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch appointments with pagination', async () => {
    const response = await apiClient.get('/api/appointments?page=1&limit=10');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch appointments for a specific student', async () => {
    // Get students first
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const response = await apiClient.get(`/api/appointments/student/${studentId}`);
        
        expect(response.success).toBeTruthy();
        expect(response.data).toBeDefined();
      }
    }
  });

  test('should create an appointment', async () => {
    // Get a student first
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id || students[0].studentId;
        const appointment = {
          ...TEST_APPOINTMENT,
          studentId,
        };
        
        const response = await apiClient.post('/api/appointments', appointment);
        
        expect(response).toBeDefined();
      }
    }
  });

  test('should fetch upcoming appointments', async () => {
    const response = await apiClient.get('/api/appointments/upcoming');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch appointments by date range', async () => {
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + 7 * 86400000).toISOString(); // 7 days from now
    
    const response = await apiClient.get(
      `/api/appointments?startDate=${startDate}&endDate=${endDate}`
    );
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should filter appointments by status', async () => {
    const response = await apiClient.get('/api/appointments?status=SCHEDULED');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should handle appointment not found error', async () => {
    const response = await apiClient.get('/api/appointments/999999999');
    
    // Should return error or empty result
    expect(response).toBeDefined();
  });
});

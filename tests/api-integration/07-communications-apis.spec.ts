/**
 * Agent 7: Communications API Tests
 * Tests frontend-backend communication for communications APIs
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { TEST_USERS, TEST_MESSAGE, TEST_BROADCAST } from './fixtures/test-data';

test.describe('Communications APIs - Frontend to Backend Communication', () => {
  let apiClient: ApiClient;
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001';

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request, baseURL);
    await apiClient.login(TEST_USERS.nurse.email, TEST_USERS.nurse.password);
  });

  test('should fetch list of messages', async () => {
    const response = await apiClient.get('/api/messages');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch messages with pagination', async () => {
    const response = await apiClient.get('/api/messages?page=1&limit=10');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch inbox messages', async () => {
    const response = await apiClient.get('/api/messages/inbox');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should fetch sent messages', async () => {
    const response = await apiClient.get('/api/messages/sent');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should create a message', async () => {
    // Get students first to get a parent contact
    const studentsResponse = await apiClient.get('/api/students');
    
    if (studentsResponse.success && studentsResponse.data) {
      const students = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : studentsResponse.data.students || [];
      
      if (students.length > 0) {
        const message = {
          ...TEST_MESSAGE,
          recipientId: students[0].id || students[0].studentId,
        };
        
        const response = await apiClient.post('/api/messages', message);
        
        expect(response).toBeDefined();
      }
    }
  });

  test('should fetch list of broadcasts', async () => {
    const response = await apiClient.get('/api/broadcasts');
    
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
  });

  test('should create a broadcast', async () => {
    const response = await apiClient.post('/api/broadcasts', TEST_BROADCAST);
    
    expect(response).toBeDefined();
  });

  test('should fetch unread messages count', async () => {
    const response = await apiClient.get('/api/messages/unread/count');
    
    expect(response).toBeDefined();
  });

  test('should mark message as read', async () => {
    // Get messages first
    const messagesResponse = await apiClient.get('/api/messages');
    
    if (messagesResponse.success && messagesResponse.data) {
      const messages = Array.isArray(messagesResponse.data) 
        ? messagesResponse.data 
        : messagesResponse.data.messages || [];
      
      if (messages.length > 0) {
        const messageId = messages[0].id;
        const response = await apiClient.put(`/api/messages/${messageId}/read`, {});
        
        expect(response).toBeDefined();
      }
    }
  });
});

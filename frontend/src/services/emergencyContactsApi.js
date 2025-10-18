/**
 * WF-COMP-263 | emergencyContactsApi.js - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./config/apiConfig | Dependencies: ./config/apiConfig
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .js
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

// Emergency Contacts API - handles emergency contact operations
import { apiInstance } from './config/apiConfig';

export const emergencyContactsApi = {
  // Get all emergency contacts with pagination and filtering
  getAll: async (params = {}) => {
    const response = await apiInstance.get('/emergency-contacts', { params });
    return response.data;
  },

  // Get emergency contacts for a specific student
  getByStudent: async (studentId) => {
    const response = await apiInstance.get(`/emergency-contacts/student/${studentId}`);
    return response.data;
  },

  // Get emergency contact by ID
  getById: async (id) => {
    const response = await apiInstance.get(`/emergency-contacts/${id}`);
    return response.data;
  },

  // Create new emergency contact
  create: async (contactData) => {
    const response = await apiInstance.post('/emergency-contacts', contactData);
    return response.data;
  },

  // Update emergency contact
  update: async (id, contactData) => {
    const response = await apiInstance.put(`/emergency-contacts/${id}`, contactData);
    return response.data;
  },

  // Delete emergency contact
  delete: async (id) => {
    const response = await apiInstance.delete(`/emergency-contacts/${id}`);
    return response.data;
  },

  // Send emergency notification
  sendNotification: async (contactId, notificationData) => {
    const response = await apiInstance.post(`/emergency-contacts/${contactId}/notify`, notificationData);
    return response.data;
  },

  // Send bulk emergency notifications
  sendBulkNotification: async (contactIds, notificationData) => {
    const response = await apiInstance.post('/emergency-contacts/bulk-notify', {
      contactIds,
      ...notificationData
    });
    return response.data;
  },

  // Get notification history
  getNotificationHistory: async (contactId, params = {}) => {
    const response = await apiInstance.get(`/emergency-contacts/${contactId}/notifications`, { params });
    return response.data;
  },

  // Verify contact information
  verifyContact: async (contactId) => {
    const response = await apiInstance.post(`/emergency-contacts/${contactId}/verify`);
    return response.data;
  },

  // Get contact relationship types
  getRelationshipTypes: async () => {
    const response = await apiInstance.get('/emergency-contacts/relationship-types');
    return response.data;
  },

  // Search emergency contacts
  search: async (query, filters = {}) => {
    const params = { query, ...filters };
    const response = await apiInstance.get('/emergency-contacts/search', { params });
    return response.data;
  },

  // Export emergency contacts
  export: async (params = {}) => {
    const response = await apiInstance.get('/emergency-contacts/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Import emergency contacts
  import: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiInstance.post('/emergency-contacts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default emergencyContactsApi;

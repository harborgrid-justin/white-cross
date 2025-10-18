/**
 * WF-COMP-295 | reportsApi.js - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./config/apiConfig | Dependencies: ./config/apiConfig
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .js
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

// Reports API - handles reporting and analytics operations
import { apiInstance } from './config/apiConfig';

export const reportsApi = {
  // Get dashboard statistics
  getDashboardStats: async (dateRange = {}) => {
    const response = await apiInstance.get('/reports/dashboard', { params: dateRange });
    return response.data;
  },

  // Get health reports
  getHealthReports: async (params = {}) => {
    const response = await apiInstance.get('/reports/health', { params });
    return response.data;
  },

  // Get medication reports
  getMedicationReports: async (params = {}) => {
    const response = await apiInstance.get('/reports/medications', { params });
    return response.data;
  },

  // Get attendance reports
  getAttendanceReports: async (params = {}) => {
    const response = await apiInstance.get('/reports/attendance', { params });
    return response.data;
  },

  // Get incident reports
  getIncidentReports: async (params = {}) => {
    const response = await apiInstance.get('/reports/incidents', { params });
    return response.data;
  },

  // Generate custom report
  generateCustomReport: async (reportConfig) => {
    const response = await apiInstance.post('/reports/custom', reportConfig);
    return response.data;
  },

  // Export report
  exportReport: async (reportId, format = 'pdf') => {
    const response = await apiInstance.get(`/reports/${reportId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Get report templates
  getTemplates: async () => {
    const response = await apiInstance.get('/reports/templates');
    return response.data;
  },

  // Create report template
  createTemplate: async (template) => {
    const response = await apiInstance.post('/reports/templates', template);
    return response.data;
  },

  // Update report template
  updateTemplate: async (id, template) => {
    const response = await apiInstance.put(`/reports/templates/${id}`, template);
    return response.data;
  },

  // Delete report template
  deleteTemplate: async (id) => {
    const response = await apiInstance.delete(`/reports/templates/${id}`);
    return response.data;
  }
};

export default reportsApi;

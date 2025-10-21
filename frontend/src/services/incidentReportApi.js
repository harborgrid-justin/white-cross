/**
 * WF-COMP-266 | incidentReportApi.js - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./config/apiConfig | Dependencies: ./config/apiConfig
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .js
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

// Incident Report API - handles incident reporting operations
import { apiInstance } from './config/apiConfig';

export const incidentReportApi = {
  // Get all incident reports with pagination and filtering
  getAll: async (params = {}) => {
    const response = await apiInstance.get('/incident-reports', { params });
    return response.data;
  },

  // Get incident report by ID
  getById: async (id) => {
    const response = await apiInstance.get(`/incident-reports/${id}`);
    return response.data;
  },

  // Create new incident report
  create: async (reportData) => {
    const response = await apiInstance.post('/incident-reports', reportData);
    return response.data;
  },

  // Update incident report
  update: async (id, reportData) => {
    const response = await apiInstance.put(`/incident-reports/${id}`, reportData);
    return response.data;
  },

  // Delete incident report
  delete: async (id) => {
    const response = await apiInstance.delete(`/incident-reports/${id}`);
    return response.data;
  },

  // Get incident types
  getIncidentTypes: async () => {
    const response = await apiInstance.get('/incident-reports/types');
    return response.data;
  },

  // Get incident severity levels
  getSeverityLevels: async () => {
    const response = await apiInstance.get('/incident-reports/severity-levels');
    return response.data;
  },

  // Submit incident report for review
  submitForReview: async (id) => {
    const response = await apiInstance.post(`/incident-reports/${id}/submit`);
    return response.data;
  },

  // Approve incident report
  approve: async (id, approvalData) => {
    const response = await apiInstance.post(`/incident-reports/${id}/approve`, approvalData);
    return response.data;
  },

  // Reject incident report
  reject: async (id, rejectionData) => {
    const response = await apiInstance.post(`/incident-reports/${id}/reject`, rejectionData);
    return response.data;
  },

  // Get incident statistics
  getStatistics: async (dateRange = {}) => {
    const response = await apiInstance.get('/incident-reports/statistics', { params: dateRange });
    return response.data;
  },

  // Export incident reports
  export: async (params = {}) => {
    const response = await apiInstance.get('/incident-reports/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  }
};

export default incidentReportApi;

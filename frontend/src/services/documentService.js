/**
 * WF-COMP-261 | documentService.js - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./config/apiConfig | Dependencies: ./config/apiConfig
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .js
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

// Document Service - handles document management operations
import { apiInstance } from './config/apiConfig';

export const documentService = {
  // Get all documents with pagination and filtering
  getAll: async (params = {}) => {
    const response = await apiInstance.get('/documents', { params });
    return response.data;
  },

  // Get document by ID
  getById: async (id) => {
    const response = await apiInstance.get(`/documents/${id}`);
    return response.data;
  },

  // Upload a new document
  upload: async (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    const response = await apiInstance.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update document metadata
  update: async (id, metadata) => {
    const response = await apiInstance.put(`/documents/${id}`, metadata);
    return response.data;
  },

  // Delete document
  delete: async (id) => {
    const response = await apiInstance.delete(`/documents/${id}`);
    return response.data;
  },

  // Download document
  download: async (id) => {
    const response = await apiInstance.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get document categories
  getCategories: async () => {
    const response = await apiInstance.get('/documents/categories');
    return response.data;
  },

  // Search documents
  search: async (query, filters = {}) => {
    const params = { query, ...filters };
    const response = await apiInstance.get('/documents/search', { params });
    return response.data;
  }
};

export default documentService;

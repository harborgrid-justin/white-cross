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

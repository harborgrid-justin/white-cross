import api from './api';

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  version: number;
  status: string;
  tags: string[];
  isTemplate: boolean;
  templateData?: any;
  parentId?: string;
  retentionDate?: string;
  accessLevel: string;
  uploadedBy: string;
  studentId?: string;
  createdAt: string;
  updatedAt: string;
  signatures?: DocumentSignature[];
  versions?: Document[];
}

export interface DocumentSignature {
  id: string;
  signedBy: string;
  signedByRole: string;
  signatureData?: string;
  signedAt: string;
  ipAddress?: string;
}

export const documentApi = {
  // Document CRUD
  getDocuments: async (params?: any) => {
    const response = await api.get('/documents', { params });
    return response.data.data;
  },

  getDocumentById: async (id: string) => {
    const response = await api.get(`/documents/${id}`);
    return response.data.data;
  },

  createDocument: async (data: any) => {
    const response = await api.post('/documents', data);
    return response.data.data;
  },

  updateDocument: async (id: string, data: any) => {
    const response = await api.put(`/documents/${id}`, data);
    return response.data.data;
  },

  deleteDocument: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data.data;
  },

  // Document Versions
  createDocumentVersion: async (parentId: string, data: any) => {
    const response = await api.post(`/documents/${parentId}/version`, data);
    return response.data.data;
  },

  // Document Actions
  signDocument: async (id: string, signatureData?: string) => {
    const response = await api.post(`/documents/${id}/sign`, { signatureData });
    return response.data.data;
  },

  downloadDocument: async (id: string) => {
    const response = await api.get(`/documents/${id}/download`);
    return response.data.data;
  },

  // Templates
  getTemplates: async (category?: string) => {
    const response = await api.get('/documents/templates/list', {
      params: { category }
    });
    return response.data.data;
  },

  createFromTemplate: async (templateId: string, data: any) => {
    const response = await api.post(`/documents/templates/${templateId}/create`, data);
    return response.data.data;
  },

  // Student Documents
  getStudentDocuments: async (studentId: string) => {
    const response = await api.get(`/documents/student/${studentId}`);
    return response.data.data;
  },

  // Search and Filter
  searchDocuments: async (query: string) => {
    const response = await api.get('/documents/search/query', {
      params: { q: query }
    });
    return response.data.data;
  },

  getExpiringDocuments: async (days?: number) => {
    const response = await api.get('/documents/expiring/list', {
      params: { days }
    });
    return response.data.data;
  },

  // Statistics
  getStatistics: async () => {
    const response = await api.get('/documents/statistics/overview');
    return response.data;
  },
};

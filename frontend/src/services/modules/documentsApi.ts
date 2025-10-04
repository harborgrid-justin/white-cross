import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { extractApiData } from '../utils/apiUtils';
import { buildUrlParams } from '../utils/apiUtils';
import type { Document, DocumentSignature, ApiResponse, PaginationParams } from '../types';

export interface DocumentFilters extends PaginationParams {
  category?: string;
  status?: string;
  tags?: string[];
  studentId?: string;
  accessLevel?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  templateData: any;
  variables: string[];
  isActive: boolean;
}

export interface DocumentVersion {
  id: string;
  parentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  changes?: string;
}

export interface DocumentsApi {
  // Document CRUD
  getDocuments(filters?: DocumentFilters): Promise<{ documents: Document[]; pagination: any }>;
  getDocumentById(id: string): Promise<{ document: Document }>;
  createDocument(data: Partial<Document>): Promise<{ document: Document }>;
  updateDocument(id: string, data: Partial<Document>): Promise<{ document: Document }>;
  deleteDocument(id: string): Promise<void>;

  // Document Versions
  getDocumentVersions(parentId: string): Promise<{ versions: DocumentVersion[] }>;
  createDocumentVersion(parentId: string, data: FormData): Promise<{ version: DocumentVersion }>;
  getDocumentVersion(versionId: string): Promise<{ version: DocumentVersion }>;
  deleteDocumentVersion(versionId: string): Promise<void>;

  // Document Actions
  signDocument(id: string, signatureData?: string): Promise<{ document: Document }>;
  downloadDocument(id: string, version?: number): Promise<Blob>;
  previewDocument(id: string): Promise<{ previewUrl: string }>;
  duplicateDocument(id: string, newTitle?: string): Promise<{ document: Document }>;

  // Templates
  getTemplates(category?: string): Promise<{ templates: DocumentTemplate[] }>;
  getTemplateById(id: string): Promise<{ template: DocumentTemplate }>;
  createTemplate(data: Partial<DocumentTemplate>): Promise<{ template: DocumentTemplate }>;
  updateTemplate(id: string, data: Partial<DocumentTemplate>): Promise<{ template: DocumentTemplate }>;
  deleteTemplate(id: string): Promise<void>;
  createFromTemplate(templateId: string, data: any): Promise<{ document: Document }>;

  // Student Documents
  getStudentDocuments(studentId: string, filters?: Omit<DocumentFilters, 'studentId'>): Promise<{ documents: Document[] }>;
  addDocumentToStudent(studentId: string, documentData: Partial<Document>): Promise<{ document: Document }>;
  removeDocumentFromStudent(studentId: string, documentId: string): Promise<void>;

  // Search and Filter
  searchDocuments(query: string, filters?: DocumentFilters): Promise<{ documents: Document[] }>;
  getDocumentsByCategory(category: string, filters?: DocumentFilters): Promise<{ documents: Document[] }>;
  getDocumentsByTag(tag: string, filters?: DocumentFilters): Promise<{ documents: Document[] }>;
  getExpiringDocuments(days?: number): Promise<{ documents: Document[] }>;
  getRecentDocuments(limit?: number): Promise<{ documents: Document[] }>;

  // Bulk Operations  
  bulkUpdateDocuments(updates: Array<{ id: string; data: Partial<Document> }>): Promise<{ documents: Document[] }>;
  bulkDeleteDocuments(documentIds: string[]): Promise<{ deleted: number }>;
  bulkDownload(documentIds: string[]): Promise<Blob>;

  // Access Control
  shareDocument(id: string, data: { userIds: string[]; permissions: string[]; expiresAt?: string }): Promise<{ shared: boolean }>;
  revokeAccess(id: string, userId: string): Promise<{ revoked: boolean }>;
  getDocumentPermissions(id: string): Promise<{ permissions: any[] }>;

  // Statistics and Analytics
  getStatistics(dateRange?: { startDate: string; endDate: string }): Promise<{ statistics: any }>;
  getUsageAnalytics(documentId: string): Promise<{ analytics: any }>;
  getStorageUsage(): Promise<{ usage: any }>;

  // Import/Export
  exportDocuments(filters?: DocumentFilters, format?: 'zip' | 'pdf'): Promise<Blob>;
  importDocuments(file: File): Promise<{ imported: number; errors: any[] }>;
}

class DocumentsApiImpl implements DocumentsApi {
  // Document CRUD
  async getDocuments(filters: DocumentFilters = {}): Promise<{ documents: Document[]; pagination: any }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ documents: Document[]; pagination: any }>>(
      `${API_ENDPOINTS.DOCUMENTS}?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getDocumentById(id: string): Promise<{ document: Document }> {
    const response = await apiInstance.get<ApiResponse<{ document: Document }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${id}`
    );
    return extractApiData(response);
  }

  async createDocument(data: Partial<Document>): Promise<{ document: Document }> {
    const response = await apiInstance.post<ApiResponse<{ document: Document }>>(
      API_ENDPOINTS.DOCUMENTS,
      data
    );
    return extractApiData(response);
  }

  async updateDocument(id: string, data: Partial<Document>): Promise<{ document: Document }> {
    const response = await apiInstance.put<ApiResponse<{ document: Document }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${id}`,
      data
    );
    return extractApiData(response);
  }

  async deleteDocument(id: string): Promise<void> {
    await apiInstance.delete(`${API_ENDPOINTS.DOCUMENTS}/${id}`);
  }

  // Document Versions
  async getDocumentVersions(parentId: string): Promise<{ versions: DocumentVersion[] }> {
    const response = await apiInstance.get<ApiResponse<{ versions: DocumentVersion[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${parentId}/versions`
    );
    return extractApiData(response);
  }

  async createDocumentVersion(parentId: string, data: FormData): Promise<{ version: DocumentVersion }> {
    const response = await apiInstance.post<ApiResponse<{ version: DocumentVersion }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${parentId}/version`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return extractApiData(response);
  }

  async getDocumentVersion(versionId: string): Promise<{ version: DocumentVersion }> {
    const response = await apiInstance.get<ApiResponse<{ version: DocumentVersion }>>(
      `${API_ENDPOINTS.DOCUMENTS}/version/${versionId}`
    );
    return extractApiData(response);
  }

  async deleteDocumentVersion(versionId: string): Promise<void> {
    await apiInstance.delete(`${API_ENDPOINTS.DOCUMENTS}/version/${versionId}`);
  }

  // Document Actions
  async signDocument(id: string, signatureData?: string): Promise<{ document: Document }> {
    const response = await apiInstance.post<ApiResponse<{ document: Document }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${id}/sign`,
      { signatureData }
    );
    return extractApiData(response);
  }

  async downloadDocument(id: string, version?: number): Promise<Blob> {
    const params = version ? `?version=${version}` : '';
    const response = await apiInstance.get(
      `${API_ENDPOINTS.DOCUMENTS}/${id}/download${params}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  async previewDocument(id: string): Promise<{ previewUrl: string }> {
    const response = await apiInstance.get<ApiResponse<{ previewUrl: string }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${id}/preview`
    );
    return extractApiData(response);
  }

  async duplicateDocument(id: string, newTitle?: string): Promise<{ document: Document }> {
    const response = await apiInstance.post<ApiResponse<{ document: Document }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${id}/duplicate`,
      { title: newTitle }
    );
    return extractApiData(response);
  }

  // Templates
  async getTemplates(category?: string): Promise<{ templates: DocumentTemplate[] }> {
    const params = category ? buildUrlParams({ category }) : '';
    const response = await apiInstance.get<ApiResponse<{ templates: DocumentTemplate[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/templates/list?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getTemplateById(id: string): Promise<{ template: DocumentTemplate }> {
    const response = await apiInstance.get<ApiResponse<{ template: DocumentTemplate }>>(
      `${API_ENDPOINTS.DOCUMENTS}/templates/${id}`
    );
    return extractApiData(response);
  }

  async createTemplate(data: Partial<DocumentTemplate>): Promise<{ template: DocumentTemplate }> {
    const response = await apiInstance.post<ApiResponse<{ template: DocumentTemplate }>>(
      `${API_ENDPOINTS.DOCUMENTS}/templates`,
      data
    );
    return extractApiData(response);
  }

  async updateTemplate(id: string, data: Partial<DocumentTemplate>): Promise<{ template: DocumentTemplate }> {
    const response = await apiInstance.put<ApiResponse<{ template: DocumentTemplate }>>(
      `${API_ENDPOINTS.DOCUMENTS}/templates/${id}`,
      data
    );
    return extractApiData(response);
  }

  async deleteTemplate(id: string): Promise<void> {
    await apiInstance.delete(`${API_ENDPOINTS.DOCUMENTS}/templates/${id}`);
  }

  async createFromTemplate(templateId: string, data: any): Promise<{ document: Document }> {
    const response = await apiInstance.post<ApiResponse<{ document: Document }>>(
      `${API_ENDPOINTS.DOCUMENTS}/templates/${templateId}/create`,
      data
    );
    return extractApiData(response);
  }

  // Student Documents
  async getStudentDocuments(studentId: string, filters: Omit<DocumentFilters, 'studentId'> = {}): Promise<{ documents: Document[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ documents: Document[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/student/${studentId}?${params.toString()}`
    );
    return extractApiData(response);
  }

  async addDocumentToStudent(studentId: string, documentData: Partial<Document>): Promise<{ document: Document }> {
    const response = await apiInstance.post<ApiResponse<{ document: Document }>>(
      `${API_ENDPOINTS.DOCUMENTS}/student/${studentId}`,
      documentData
    );
    return extractApiData(response);
  }

  async removeDocumentFromStudent(studentId: string, documentId: string): Promise<void> {
    await apiInstance.delete(`${API_ENDPOINTS.DOCUMENTS}/student/${studentId}/${documentId}`);
  }

  // Search and Filter
  async searchDocuments(query: string, filters: DocumentFilters = {}): Promise<{ documents: Document[] }> {
    const params = buildUrlParams({ q: query, ...filters });
    const response = await apiInstance.get<ApiResponse<{ documents: Document[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/search/query?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getDocumentsByCategory(category: string, filters: DocumentFilters = {}): Promise<{ documents: Document[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ documents: Document[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/category/${category}?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getDocumentsByTag(tag: string, filters: DocumentFilters = {}): Promise<{ documents: Document[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ documents: Document[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/tag/${tag}?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getExpiringDocuments(days: number = 30): Promise<{ documents: Document[] }> {
    const params = buildUrlParams({ days });
    const response = await apiInstance.get<ApiResponse<{ documents: Document[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/expiring/list?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getRecentDocuments(limit: number = 10): Promise<{ documents: Document[] }> {
    const params = buildUrlParams({ limit });
    const response = await apiInstance.get<ApiResponse<{ documents: Document[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/recent?${params.toString()}`
    );
    return extractApiData(response);
  }

  // Bulk Operations
  async bulkUpdateDocuments(updates: Array<{ id: string; data: Partial<Document> }>): Promise<{ documents: Document[] }> {
    const response = await apiInstance.put<ApiResponse<{ documents: Document[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/bulk-update`,
      { updates }
    );
    return extractApiData(response);
  }

  async bulkDeleteDocuments(documentIds: string[]): Promise<{ deleted: number }> {
    const response = await apiInstance.delete<ApiResponse<{ deleted: number }>>(
      `${API_ENDPOINTS.DOCUMENTS}/bulk-delete`,
      { data: { documentIds } }
    );
    return extractApiData(response);
  }

  async bulkDownload(documentIds: string[]): Promise<Blob> {
    const response = await apiInstance.post(
      `${API_ENDPOINTS.DOCUMENTS}/bulk-download`,
      { documentIds },
      { responseType: 'blob' }
    );
    return response.data;
  }

  // Access Control
  async shareDocument(id: string, data: { userIds: string[]; permissions: string[]; expiresAt?: string }): Promise<{ shared: boolean }> {
    const response = await apiInstance.post<ApiResponse<{ shared: boolean }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${id}/share`,
      data
    );
    return extractApiData(response);
  }

  async revokeAccess(id: string, userId: string): Promise<{ revoked: boolean }> {
    const response = await apiInstance.delete<ApiResponse<{ revoked: boolean }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${id}/share/${userId}`
    );
    return extractApiData(response);
  }

  async getDocumentPermissions(id: string): Promise<{ permissions: any[] }> {
    const response = await apiInstance.get<ApiResponse<{ permissions: any[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${id}/permissions`
    );
    return extractApiData(response);
  }

  // Statistics and Analytics
  async getStatistics(dateRange?: { startDate: string; endDate: string }): Promise<{ statistics: any }> {
    const params = dateRange ? buildUrlParams(dateRange) : '';
    const response = await apiInstance.get<ApiResponse<{ statistics: any }>>(
      `${API_ENDPOINTS.DOCUMENTS}/statistics/overview?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getUsageAnalytics(documentId: string): Promise<{ analytics: any }> {
    const response = await apiInstance.get<ApiResponse<{ analytics: any }>>(
      `${API_ENDPOINTS.DOCUMENTS}/${documentId}/analytics`
    );
    return extractApiData(response);
  }

  async getStorageUsage(): Promise<{ usage: any }> {
    const response = await apiInstance.get<ApiResponse<{ usage: any }>>(
      `${API_ENDPOINTS.DOCUMENTS}/storage/usage`
    );
    return extractApiData(response);
  }

  // Import/Export
  async exportDocuments(filters: DocumentFilters = {}, format: 'zip' | 'pdf' = 'zip'): Promise<Blob> {
    const params = buildUrlParams({ ...filters, format });
    const response = await apiInstance.get(
      `${API_ENDPOINTS.DOCUMENTS}/export?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  async importDocuments(file: File): Promise<{ imported: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiInstance.post<ApiResponse<{ imported: number; errors: any[] }>>(
      `${API_ENDPOINTS.DOCUMENTS}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return extractApiData(response);
  }
}

export const documentsApi = new DocumentsApiImpl();

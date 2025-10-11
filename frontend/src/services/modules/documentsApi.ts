import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { extractApiData } from '../utils/apiUtils';
import { buildUrlParams } from '../utils/apiUtils';
import type { ApiResponse } from '../types';
import type {
  Document,
  DocumentFilters,
  DocumentTemplate,
  DocumentVersion,
  DocumentSignature,
  DocumentAuditTrail,
  DocumentStatistics,
  DocumentUsageAnalytics,
  StorageUsage,
  PaginatedDocumentsResponse,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  SignDocumentRequest,
  CreateDocumentVersionRequest,
  CreateFromTemplateRequest,
  ShareDocumentRequest,
  BulkDeleteDocumentsResponse,
  FileUploadRequest,
  FileUploadResponse,
  ExportDocumentsRequest,
  ImportDocumentsResponse,
  ArchiveDocumentsResponse,
  DocumentCategoryMetadata,
  DocumentPermission,
} from '../types/documents';
import {
  createDocumentSchema,
  updateDocumentSchema,
  signDocumentSchema,
  createDocumentVersionSchema,
  createFromTemplateSchema,
  shareDocumentSchema,
  bulkDeleteDocumentsSchema,
  documentFiltersSchema,
  validateStatusTransition,
  type CreateDocumentInput,
  type UpdateDocumentInput,
  type SignDocumentInput,
  type CreateDocumentVersionInput,
  type CreateFromTemplateInput,
  type ShareDocumentInput,
  type BulkDeleteDocumentsInput,
  type DocumentFiltersInput,
} from '../../schemas/documentSchemas';

export interface DocumentsApi {
  // Document CRUD
  getDocuments(filters?: DocumentFilters): Promise<PaginatedDocumentsResponse>;
  getDocumentById(id: string): Promise<{ document: Document }>;
  createDocument(data: CreateDocumentRequest): Promise<{ document: Document }>;
  updateDocument(id: string, data: UpdateDocumentRequest): Promise<{ document: Document }>;
  deleteDocument(id: string): Promise<void>;

  // Document Versions
  getDocumentVersions(parentId: string): Promise<{ versions: DocumentVersion[] }>;
  createDocumentVersion(parentId: string, data: CreateDocumentVersionRequest | FormData): Promise<{ document: DocumentVersion }>;
  getDocumentVersion(versionId: string): Promise<{ version: DocumentVersion }>;

  // Document Actions
  signDocument(id: string, data: SignDocumentRequest): Promise<{ signature: DocumentSignature }>;
  downloadDocument(id: string, version?: number): Promise<Blob>;
  viewDocument(id: string): Promise<{ document: Document }>;
  shareDocument(id: string, data: ShareDocumentRequest): Promise<{ shared: boolean; sharedWith: string[] }>;

  // Templates
  getTemplates(category?: string): Promise<{ templates: DocumentTemplate[] }>;
  getTemplateById(id: string): Promise<{ template: DocumentTemplate }>;
  createFromTemplate(templateId: string, data: CreateFromTemplateRequest): Promise<{ document: Document }>;

  // Student Documents
  getStudentDocuments(studentId: string, filters?: Omit<DocumentFilters, 'studentId'>): Promise<{ documents: Document[] }>;

  // Search and Filter
  searchDocuments(query: string, filters?: DocumentFilters): Promise<{ documents: Document[] }>;
  getExpiringDocuments(days?: number): Promise<{ documents: Document[] }>;

  // Bulk Operations
  bulkDeleteDocuments(documentIds: string[]): Promise<BulkDeleteDocumentsResponse>;

  // Audit and Signatures
  getDocumentAuditTrail(documentId: string, limit?: number): Promise<{ auditTrail: DocumentAuditTrail[] }>;
  getDocumentSignatures(documentId: string): Promise<{ signatures: DocumentSignature[] }>;

  // Categories and Statistics
  getDocumentCategories(): Promise<{ categories: DocumentCategoryMetadata[] }>;
  getStatistics(dateRange?: { startDate: string; endDate: string }): Promise<{ statistics: DocumentStatistics }>;

  // Archive Operations
  archiveExpiredDocuments(): Promise<ArchiveDocumentsResponse>;
}

class DocumentsApiImpl implements DocumentsApi {
  // Document CRUD
  async getDocuments(filters: DocumentFilters = {}): Promise<PaginatedDocumentsResponse> {
    // Validate filters
    const validatedFilters = documentFiltersSchema.parse(filters);
    const params = buildUrlParams(validatedFilters);
    const response = await apiInstance.get<ApiResponse<PaginatedDocumentsResponse> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getDocumentById(id: string): Promise<{ document: Document }> {
    // Validate ID is a UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('Invalid document ID format');
    }
    const response = await apiInstance.get<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`
    );
    return extractApiData(response as any);
  }

  async createDocument(data: CreateDocumentRequest): Promise<{ document: Document }> {
    // Validate document data
    const validatedData = createDocumentSchema.parse(data);
    const response = await apiInstance.post<ApiResponse<{ document: Document }> | undefined>(
      API_ENDPOINTS.DOCUMENTS.BASE,
      validatedData
    );
    return extractApiData(response as any);
  }

  async updateDocument(id: string, data: UpdateDocumentRequest): Promise<{ document: Document }> {
    // Validate ID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('Invalid document ID format');
    }
    // Validate update data
    const validatedData = updateDocumentSchema.parse(data);
    const response = await apiInstance.put<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`,
      validatedData
    );
    return extractApiData(response as any);
  }

  async deleteDocument(id: string): Promise<void> {
    // Validate ID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('Invalid document ID format');
    }
    await apiInstance.delete(`${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`);
  }

  // Document Versions
  async getDocumentVersions(parentId: string): Promise<{ versions: DocumentVersion[] }> {
    const document = await this.getDocumentById(parentId);
    // Versions are included in the document response
    return { versions: (document.document.versions || []) as unknown as DocumentVersion[] };
  }

  async createDocumentVersion(
    parentId: string,
    data: CreateDocumentVersionRequest | FormData
  ): Promise<{ document: DocumentVersion }> {
    // Validate parent ID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parentId)) {
      throw new Error('Invalid parent document ID format');
    }

    // Validate data if not FormData
    let validatedData: any = data;
    if (!(data instanceof FormData)) {
      validatedData = createDocumentVersionSchema.parse(data);
    }

    const response = await apiInstance.post<ApiResponse<{ document: DocumentVersion }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${parentId}/version`,
      validatedData,
      data instanceof FormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : undefined
    );
    return extractApiData(response as any);
  }

  async getDocumentVersion(versionId: string): Promise<{ version: DocumentVersion }> {
    const response = await apiInstance.get<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${versionId}`
    );
    const data = extractApiData(response as any);
    return { version: data.document as unknown as DocumentVersion };
  }

  // Document Actions
  async signDocument(id: string, data: SignDocumentRequest): Promise<{ signature: DocumentSignature }> {
    // Validate signature data
    const validatedData = signDocumentSchema.parse({ ...data, documentId: id });
    const response = await apiInstance.post<ApiResponse<{ signature: DocumentSignature }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/sign`,
      { signatureData: validatedData.signatureData }
    );
    return extractApiData(response as any);
  }

  async downloadDocument(id: string, version?: number): Promise<Blob> {
    const params = version ? `?version=${version}` : '';
    const response = await apiInstance.get(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/download${params}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  async viewDocument(id: string): Promise<{ document: Document }> {
    // The getDocumentById already tracks viewing via the backend
    return this.getDocumentById(id);
  }

  async shareDocument(id: string, data: ShareDocumentRequest): Promise<{ shared: boolean; sharedWith: string[] }> {
    // Validate ID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('Invalid document ID format');
    }
    // Validate share data
    const validatedData = shareDocumentSchema.parse(data);
    const response = await apiInstance.post<ApiResponse<{ success: boolean; sharedWith: string[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/share`,
      { sharedWith: validatedData.userIds }
    );
    const result = extractApiData(response as any);
    return { shared: result.success, sharedWith: result.sharedWith };
  }

  // Templates
  async getTemplates(category?: string): Promise<{ templates: DocumentTemplate[] }> {
    const params = buildUrlParams({ category });
    const response = await apiInstance.get<ApiResponse<{ templates: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/templates/list?${params.toString()}`
    );
    const result = extractApiData(response as any);
    return { templates: result.templates as unknown as DocumentTemplate[] };
  }

  async getTemplateById(id: string): Promise<{ template: DocumentTemplate }> {
    const response = await apiInstance.get<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`
    );
    const result = extractApiData(response as any);
    return { template: result.document as unknown as DocumentTemplate };
  }

  async createFromTemplate(templateId: string, data: CreateFromTemplateRequest): Promise<{ document: Document }> {
    // Validate template ID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(templateId)) {
      throw new Error('Invalid template ID format');
    }
    // Validate data
    const validatedData = createFromTemplateSchema.parse(data);
    const response = await apiInstance.post<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/templates/${templateId}/create`,
      validatedData
    );
    return extractApiData(response as any);
  }

  // Student Documents
  async getStudentDocuments(studentId: string, filters: Omit<DocumentFilters, 'studentId'> = {}): Promise<{ documents: Document[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ documents: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/student/${studentId}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Search and Filter
  async searchDocuments(query: string, filters: DocumentFilters = {}): Promise<{ documents: Document[] }> {
    const params = buildUrlParams({ q: query, ...filters });
    const response = await apiInstance.get<ApiResponse<{ documents: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/search/query?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getExpiringDocuments(days: number = 30): Promise<{ documents: Document[] }> {
    const params = buildUrlParams({ days });
    const response = await apiInstance.get<ApiResponse<{ documents: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/expiring/list?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Bulk Operations
  async bulkDeleteDocuments(documentIds: string[]): Promise<BulkDeleteDocumentsResponse> {
    // Validate bulk delete request
    const validatedData = bulkDeleteDocumentsSchema.parse({ documentIds });
    const response = await apiInstance.post<ApiResponse<BulkDeleteDocumentsResponse> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/bulk-delete`,
      validatedData
    );
    return extractApiData(response as any);
  }

  // Audit and Signatures
  async getDocumentAuditTrail(documentId: string, limit: number = 100): Promise<{ auditTrail: DocumentAuditTrail[] }> {
    const params = buildUrlParams({ limit });
    const response = await apiInstance.get<ApiResponse<{ auditTrail: DocumentAuditTrail[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/audit-trail?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getDocumentSignatures(documentId: string): Promise<{ signatures: DocumentSignature[] }> {
    const response = await apiInstance.get<ApiResponse<{ signatures: DocumentSignature[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/signatures`
    );
    return extractApiData(response as any);
  }

  // Categories and Statistics
  async getDocumentCategories(): Promise<{ categories: DocumentCategoryMetadata[] }> {
    const response = await apiInstance.get<ApiResponse<{ categories: DocumentCategoryMetadata[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/categories`
    );
    return extractApiData(response as any);
  }

  async getStatistics(dateRange?: { startDate: string; endDate: string }): Promise<{ statistics: DocumentStatistics }> {
    const params = buildUrlParams(dateRange || {});
    const response = await apiInstance.get<ApiResponse<DocumentStatistics> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/statistics/overview?${params.toString()}`
    );
    const data = extractApiData(response as any);
    return { statistics: data as DocumentStatistics };
  }

  // Archive Operations
  async archiveExpiredDocuments(): Promise<ArchiveDocumentsResponse> {
    const response = await apiInstance.post<ApiResponse<{ archived: number }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/archive-expired`
    );
    const result = extractApiData(response as any);
    return { archived: result.archived, failed: 0 };
  }
}

export const documentsApi = new DocumentsApiImpl();

/**
 * Complete Documents API Implementation
 * Enhanced with digital signatures, versioning, advanced search, and bulk operations
 *
 * PHI Protection: All document operations log access for HIPAA compliance
 * Type Safety: Full TypeScript coverage with Zod validation
 * Features: Signing, versioning, search, bulk download with progress tracking
 */

import type { ApiClient } from '../core/ApiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { extractApiData } from '../utils/apiUtils';
import { buildUrlParams } from '../utils/apiUtils';
import type { ApiResponse } from '../types';

// Import types
import type {
  Document,
  DocumentFilters,
  DocumentTemplate,
  DocumentVersion,
  DocumentSignature,
  DocumentAuditTrail,
  DocumentStatistics,
  DocumentCategoryMetadata,
  DocumentPermission,
  PaginatedDocumentsResponse,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  SignDocumentRequest,
  CreateDocumentVersionRequest,
  CreateFromTemplateRequest,
  ShareDocumentRequest,
  BulkDeleteDocumentsResponse,
  AdvancedSearchFilters,
  SearchResults,
  SearchSortOptions,
  SearchDocumentsRequest,
  BulkDownloadRequest,
  BulkDownloadResponse,
  BulkDownloadProgress,
  BulkDownloadOptions,
  VersionComparison,
  VersionComparisonRequest,
  SignatureVerificationResult,
  SignatureType,
} from '../types';

// Import validation schemas from documentSchemas
import {
  signDocumentSchema,
  createDocumentVersionSchema,
  // TODO: Add these schemas to documentSchemas.ts
  // versionComparisonSchema,
  // advancedSearchFiltersSchema,
  // searchDocumentsRequestSchema,
  // bulkDownloadRequestSchema,
  type SignDocumentInput,
  type CreateDocumentVersionInput,
  // type VersionComparisonInput,
  // type AdvancedSearchFiltersInput,
  // type SearchDocumentsRequestInput,
  // type BulkDownloadRequestInput,
} from '../../schemas/documentSchemas';

// Import existing schemas for backward compatibility
import {
  createDocumentSchema,
  updateDocumentSchema,
  createFromTemplateSchema,
  shareDocumentSchema,
  bulkDeleteDocumentsSchema,
  documentFiltersSchema,
  type CreateDocumentInput,
  type UpdateDocumentInput,
  type CreateFromTemplateInput,
  type ShareDocumentInput,
  type BulkDeleteDocumentsInput,
  type DocumentFiltersInput,
} from '../../schemas/documentSchemas';

// ============================================================================
// API Interface
// ============================================================================

/**
 * Documents API Interface
 * Complete interface for document management operations
 */
export interface DocumentsApi {
  // ===== Document CRUD =====
  getDocuments(filters?: DocumentFilters): Promise<PaginatedDocumentsResponse>;
  getDocumentById(id: string): Promise<{ document: Document }>;
  createDocument(data: CreateDocumentRequest): Promise<{ document: Document }>;
  updateDocument(id: string, data: UpdateDocumentRequest): Promise<{ document: Document }>;
  deleteDocument(id: string): Promise<void>;

  // ===== Document Versions =====
  getDocumentVersions(parentId: string): Promise<{ versions: DocumentVersion[] }>;
  createDocumentVersion(
    parentId: string,
    data: CreateDocumentVersionRequest | FormData
  ): Promise<{ document: DocumentVersion }>;
  getDocumentVersion(versionId: string): Promise<{ version: DocumentVersion }>;
  downloadVersion(documentId: string, versionId: string): Promise<Blob>;
  compareVersions(
    documentId: string,
    versionId1: string,
    versionId2: string
  ): Promise<VersionComparison>;

  // ===== Document Actions =====
  signDocument(id: string, data: SignDocumentRequest): Promise<{ signature: DocumentSignature }>;
  verifySignature(signatureId: string): Promise<SignatureVerificationResult>;
  downloadDocument(id: string, version?: number): Promise<Blob>;
  viewDocument(id: string): Promise<{ document: Document }>;
  shareDocument(
    id: string,
    data: ShareDocumentRequest
  ): Promise<{ shared: boolean; sharedWith: string[] }>;

  // ===== Templates =====
  getTemplates(category?: string): Promise<{ templates: DocumentTemplate[] }>;
  getTemplateById(id: string): Promise<{ template: DocumentTemplate }>;
  createFromTemplate(
    templateId: string,
    data: CreateFromTemplateRequest
  ): Promise<{ document: Document }>;

  // ===== Student Documents =====
  getStudentDocuments(
    studentId: string,
    filters?: Omit<DocumentFilters, 'studentId'>
  ): Promise<{ documents: Document[] }>;

  // ===== Search and Filter =====
  searchDocuments(query: string, filters?: DocumentFilters): Promise<{ documents: Document[] }>;
  advancedSearch(
    request: SearchDocumentsRequest
  ): Promise<SearchResults>;
  getExpiringDocuments(days?: number): Promise<{ documents: Document[] }>;

  // ===== Bulk Operations =====
  bulkDeleteDocuments(documentIds: string[]): Promise<BulkDeleteDocumentsResponse>;
  bulkDownload(
    request: BulkDownloadRequest,
    options?: BulkDownloadOptions
  ): Promise<BulkDownloadResponse>;

  // ===== Audit and Signatures =====
  getDocumentAuditTrail(
    documentId: string,
    limit?: number
  ): Promise<{ auditTrail: DocumentAuditTrail[] }>;
  getDocumentSignatures(documentId: string): Promise<{ signatures: DocumentSignature[] }>;

  // ===== Categories and Statistics =====
  getDocumentCategories(): Promise<{ categories: DocumentCategoryMetadata[] }>;
  getStatistics(
    dateRange?: { startDate: string; endDate: string }
  ): Promise<{ statistics: DocumentStatistics }>;

  // ===== Archive Operations =====
  archiveExpiredDocuments(): Promise<{ archived: number; failed: number }>;
}

// ============================================================================
// API Implementation
// ============================================================================

class DocumentsApiImpl implements DocumentsApi {
  constructor(private readonly client: ApiClient) {}

  // =========================================================================
  // Document CRUD
  // =========================================================================

  /**
   * Get documents with optional filters
   * @param filters - Optional filters for querying documents
   * @returns Paginated list of documents
   *
   * PHI: Documents may contain PHI - access is logged for audit trail
   */
  async getDocuments(filters: DocumentFilters = {}): Promise<PaginatedDocumentsResponse> {
    const validatedFilters = documentFiltersSchema.parse(filters);
    const params = buildUrlParams(validatedFilters);
    const response = await this.client.get<ApiResponse<PaginatedDocumentsResponse> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  /**
   * Get document by ID
   * @param id - Document UUID
   * @returns Document with metadata
   *
   * PHI: Document may contain PHI - access is logged
   */
  async getDocumentById(id: string): Promise<{ document: Document }> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('Invalid document ID format');
    }
    const response = await this.client.get<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`
    );
    return extractApiData(response as any);
  }

  /**
   * Create new document
   * @param data - Document creation data
   * @returns Created document
   *
   * PHI: Document may contain PHI - creation is logged
   */
  async createDocument(data: CreateDocumentRequest): Promise<{ document: Document }> {
    const validatedData = createDocumentSchema.parse(data);
    const response = await this.client.post<ApiResponse<{ document: Document }> | undefined>(
      API_ENDPOINTS.DOCUMENTS.BASE,
      validatedData
    );
    return extractApiData(response as any);
  }

  /**
   * Update document
   * @param id - Document UUID
   * @param data - Document update data
   * @returns Updated document
   *
   * PHI: Document may contain PHI - update is logged
   */
  async updateDocument(id: string, data: UpdateDocumentRequest): Promise<{ document: Document }> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('Invalid document ID format');
    }
    const validatedData = updateDocumentSchema.parse(data);
    const response = await this.client.put<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`,
      validatedData
    );
    return extractApiData(response as any);
  }

  /**
   * Delete document
   * @param id - Document UUID
   *
   * PHI: Document deletion is logged for audit trail
   */
  async deleteDocument(id: string): Promise<void> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('Invalid document ID format');
    }
    await this.client.delete(`${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`);
  }

  // =========================================================================
  // Document Versions
  // =========================================================================

  /**
   * Get all versions of a document
   * @param parentId - Parent document UUID
   * @returns List of document versions
   *
   * PHI: Versions may contain PHI - access is logged
   */
  async getDocumentVersions(parentId: string): Promise<{ versions: DocumentVersion[] }> {
    const response = await this.client.get<ApiResponse<{ versions: DocumentVersion[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${parentId}/versions`
    );
    return extractApiData(response as any);
  }

  /**
   * Create new document version
   * @param parentId - Parent document UUID
   * @param data - Version creation data or FormData
   * @returns Created version
   *
   * PHI: New version may contain PHI - creation is logged
   */
  async createDocumentVersion(
    parentId: string,
    data: CreateDocumentVersionRequest | FormData
  ): Promise<{ document: DocumentVersion }> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parentId)) {
      throw new Error('Invalid parent document ID format');
    }

    let validatedData: any = data;
    if (!(data instanceof FormData)) {
      validatedData = createDocumentVersionSchema.parse(data);
    }

    const response = await this.client.post<ApiResponse<{ document: DocumentVersion }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${parentId}/version`,
      validatedData,
      data instanceof FormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined
    );
    return extractApiData(response as any);
  }

  /**
   * Get specific document version
   * @param versionId - Version UUID
   * @returns Document version
   *
   * PHI: Version may contain PHI - access is logged
   */
  async getDocumentVersion(versionId: string): Promise<{ version: DocumentVersion }> {
    const response = await this.client.get<ApiResponse<{ version: DocumentVersion }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/versions/${versionId}`
    );
    return extractApiData(response as any);
  }

  /**
   * Download specific document version
   * @param documentId - Document UUID
   * @param versionId - Version UUID
   * @returns Blob containing the document file
   *
   * PHI: Downloaded file may contain PHI - download is logged
   */
  async downloadVersion(documentId: string, versionId: string): Promise<Blob> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(documentId)) {
      throw new Error('Invalid document ID format');
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(versionId)) {
      throw new Error('Invalid version ID format');
    }

    const response = await this.client.get(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/versions/${versionId}/download`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  /**
   * Compare two document versions
   * @param documentId - Document UUID
   * @param versionId1 - First version UUID
   * @param versionId2 - Second version UUID
   * @returns Comparison result with differences
   *
   * PHI: Comparison may reveal PHI - operation is logged
   */
  async compareVersions(
    documentId: string,
    versionId1: string,
    versionId2: string
  ): Promise<VersionComparison> {
    const validatedRequest = versionComparisonSchema.parse({
      documentId,
      versionId1,
      versionId2,
    });

    const response = await this.client.post<ApiResponse<VersionComparison> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/versions/compare`,
      {
        versionId1: validatedRequest.versionId1,
        versionId2: validatedRequest.versionId2,
        comparisonType: validatedRequest.comparisonType,
        includeContent: validatedRequest.includeContent,
      }
    );
    return extractApiData(response as any);
  }

  // =========================================================================
  // Document Actions
  // =========================================================================

  /**
   * Sign document with digital signature
   * @param id - Document UUID
   * @param data - Signature data including type and metadata
   * @returns Created signature
   *
   * PHI: Signature contains PII - signature is logged for audit trail
   */
  async signDocument(id: string, data: SignDocumentRequest): Promise<{ signature: DocumentSignature }> {
    const validatedData = signDocumentSchema.parse({ ...data, documentId: id });
    const response = await this.client.post<ApiResponse<{ signature: DocumentSignature }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/sign`,
      {
        signedBy: validatedData.signedBy,
        signedByRole: validatedData.signedByRole,
        signatureType: validatedData.signatureType,
        signatureData: validatedData.signatureData,
        ipAddress: validatedData.ipAddress,
        certificateId: validatedData.certificateId,
        location: validatedData.location,
        deviceInfo: validatedData.deviceInfo,
        pin: validatedData.pin,
        biometricData: validatedData.biometricData,
      }
    );
    return extractApiData(response as any);
  }

  /**
   * Verify document signature
   * @param signatureId - Signature UUID
   * @returns Verification result
   *
   * PHI: Verification is logged for audit trail
   */
  async verifySignature(signatureId: string): Promise<SignatureVerificationResult> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(signatureId)) {
      throw new Error('Invalid signature ID format');
    }

    const response = await this.client.get<ApiResponse<SignatureVerificationResult> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/signatures/${signatureId}/verify`
    );
    return extractApiData(response as any);
  }

  /**
   * Download document
   * @param id - Document UUID
   * @param version - Optional version number
   * @returns Blob containing the document file
   *
   * PHI: Downloaded file may contain PHI - download is logged
   */
  async downloadDocument(id: string, version?: number): Promise<Blob> {
    const params = version ? `?version=${version}` : '';
    const response = await this.client.get(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/download${params}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  /**
   * View document (track access)
   * @param id - Document UUID
   * @returns Document with metadata
   *
   * PHI: Document may contain PHI - view is logged
   */
  async viewDocument(id: string): Promise<{ document: Document }> {
    return this.getDocumentById(id);
  }

  /**
   * Share document with users
   * @param id - Document UUID
   * @param data - Share configuration
   * @returns Share result
   *
   * PHI: Sharing PHI documents requires audit logging
   */
  async shareDocument(
    id: string,
    data: ShareDocumentRequest
  ): Promise<{ shared: boolean; sharedWith: string[] }> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('Invalid document ID format');
    }
    const validatedData = shareDocumentSchema.parse(data);
    const response = await this.client.post<
      ApiResponse<{ success: boolean; sharedWith: string[] }> | undefined
    >(`${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/share`, {
      sharedWith: validatedData.userIds,
      permissions: validatedData.permissions,
      expiresAt: validatedData.expiresAt,
      message: validatedData.message,
    });
    const result = extractApiData(response as any);
    return { shared: result.success, sharedWith: result.sharedWith };
  }

  // =========================================================================
  // Templates
  // =========================================================================

  /**
   * Get document templates
   * @param category - Optional category filter
   * @returns List of templates
   */
  async getTemplates(category?: string): Promise<{ templates: DocumentTemplate[] }> {
    const params = buildUrlParams({ category });
    const response = await this.client.get<ApiResponse<{ templates: DocumentTemplate[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/templates/list?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  /**
   * Get template by ID
   * @param id - Template UUID
   * @returns Template details
   */
  async getTemplateById(id: string): Promise<{ template: DocumentTemplate }> {
    const response = await this.client.get<ApiResponse<{ template: DocumentTemplate }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/templates/${id}`
    );
    return extractApiData(response as any);
  }

  /**
   * Create document from template
   * @param templateId - Template UUID
   * @param data - Document creation data
   * @returns Created document
   *
   * PHI: Created document may contain PHI - creation is logged
   */
  async createFromTemplate(
    templateId: string,
    data: CreateFromTemplateRequest
  ): Promise<{ document: Document }> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(templateId)) {
      throw new Error('Invalid template ID format');
    }
    const validatedData = createFromTemplateSchema.parse(data);
    const response = await this.client.post<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/templates/${templateId}/create`,
      validatedData
    );
    return extractApiData(response as any);
  }

  // =========================================================================
  // Student Documents
  // =========================================================================

  /**
   * Get documents for specific student
   * @param studentId - Student UUID
   * @param filters - Optional filters
   * @returns List of student documents
   *
   * PHI: Student documents contain PHI - access is logged
   */
  async getStudentDocuments(
    studentId: string,
    filters: Omit<DocumentFilters, 'studentId'> = {}
  ): Promise<{ documents: Document[] }> {
    const params = buildUrlParams(filters);
    const response = await this.client.get<ApiResponse<{ documents: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/student/${studentId}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // =========================================================================
  // Search and Filter
  // =========================================================================

  /**
   * Basic search documents (GET method for backward compatibility)
   * @param query - Search query
   * @param filters - Optional filters
   * @returns List of matching documents
   *
   * PHI: Search results may contain PHI - search is logged
   */
  async searchDocuments(query: string, filters: DocumentFilters = {}): Promise<{ documents: Document[] }> {
    const params = buildUrlParams({ q: query, ...filters });
    const response = await this.client.get<ApiResponse<{ documents: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/search/query?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  /**
   * Advanced search with POST method and comprehensive filters
   * @param request - Search request with filters, sorting, and pagination
   * @returns Search results with metadata and aggregations
   *
   * PHI: Search results may contain PHI - search is logged
   */
  async advancedSearch(request: SearchDocumentsRequest): Promise<SearchResults> {
    const validatedRequest = searchDocumentsRequestSchema.parse(request);

    const response = await this.client.post<ApiResponse<SearchResults> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/search`,
      {
        filters: validatedRequest.filters,
        sort: validatedRequest.sort,
        page: validatedRequest.page,
        limit: validatedRequest.limit,
        includeAggregations: validatedRequest.includeAggregations,
        includeHighlights: validatedRequest.includeHighlights,
      }
    );
    return extractApiData(response as any);
  }

  /**
   * Get expiring documents
   * @param days - Number of days to look ahead (default 30)
   * @returns List of expiring documents
   *
   * PHI: Expiring documents may contain PHI - access is logged
   */
  async getExpiringDocuments(days: number = 30): Promise<{ documents: Document[] }> {
    const params = buildUrlParams({ days });
    const response = await this.client.get<ApiResponse<{ documents: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/expiring/list?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // =========================================================================
  // Bulk Operations
  // =========================================================================

  /**
   * Bulk delete documents
   * @param documentIds - Array of document UUIDs
   * @returns Delete result
   *
   * PHI: Bulk deletion is logged for audit trail
   */
  async bulkDeleteDocuments(documentIds: string[]): Promise<BulkDeleteDocumentsResponse> {
    const validatedData = bulkDeleteDocumentsSchema.parse({ documentIds });
    const response = await this.client.post<ApiResponse<BulkDeleteDocumentsResponse> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/bulk-delete`,
      validatedData
    );
    return extractApiData(response as any);
  }

  /**
   * Bulk download documents as ZIP archive
   * @param request - Bulk download configuration
   * @param options - Optional progress tracking and cancellation
   * @returns Bulk download response with blob and metadata
   *
   * PHI: Bulk download may contain PHI - operation is logged
   * Progress tracking allows monitoring large downloads
   */
  async bulkDownload(
    request: BulkDownloadRequest,
    options?: BulkDownloadOptions
  ): Promise<BulkDownloadResponse> {
    const validatedRequest = bulkDownloadRequestSchema.parse(request);

    // Create abort controller for cancellation
    const abortController = options?.signal ? undefined : new AbortController();
    const signal = options?.signal || abortController?.signal;

    // Emit initial progress
    options?.onProgress?.({
      status: 'preparing',
      currentStep: 'Validating documents...',
      processedDocuments: 0,
      totalDocuments: validatedRequest.documentIds.length,
      processedBytes: 0,
      totalBytes: 0,
      percentage: 0,
    });

    try {
      // Start download with progress tracking
      const response = await this.client.post(
        `${API_ENDPOINTS.DOCUMENTS.BASE}/bulk-download`,
        {
          documentIds: validatedRequest.documentIds,
          includeVersions: validatedRequest.includeVersions,
          includeMetadata: validatedRequest.includeMetadata,
          format: validatedRequest.format,
          fileName: validatedRequest.fileName,
          excludeArchived: validatedRequest.excludeArchived,
          excludeExpired: validatedRequest.excludeExpired,
          maxFileSize: validatedRequest.maxFileSize,
          metadataFormat: validatedRequest.metadataFormat,
          includeSignatures: validatedRequest.includeSignatures,
          includeAuditTrail: validatedRequest.includeAuditTrail,
        },
        {
          responseType: 'blob',
          timeout: options?.timeout || 300000, // 5 minutes default
          signal,
          onDownloadProgress: (progressEvent) => {
            if (options?.onProgress && progressEvent.total) {
              const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              options.onProgress({
                status: 'downloading',
                currentStep: 'Downloading archive...',
                processedDocuments: Math.floor(
                  (progressEvent.loaded / progressEvent.total) * validatedRequest.documentIds.length
                ),
                totalDocuments: validatedRequest.documentIds.length,
                processedBytes: progressEvent.loaded,
                totalBytes: progressEvent.total,
                percentage,
              });
            }
          },
        }
      );

      // Extract metadata from headers
      const contentDisposition = response.headers['content-disposition'];
      const fileName =
        validatedRequest.fileName ||
        (contentDisposition ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') : undefined) ||
        `documents-${Date.now()}.${validatedRequest.format || 'zip'}`;

      const totalSize = response.data.size;

      // Emit completion progress
      options?.onProgress?.({
        status: 'completed',
        currentStep: 'Download complete',
        processedDocuments: validatedRequest.documentIds.length,
        totalDocuments: validatedRequest.documentIds.length,
        processedBytes: totalSize,
        totalBytes: totalSize,
        percentage: 100,
      });

      // Parse metadata if available
      const metadataHeader = response.headers['x-download-metadata'];
      const metadata = metadataHeader
        ? JSON.parse(decodeURIComponent(metadataHeader))
        : {
            generatedAt: new Date().toISOString(),
            requestedBy: 'current-user',
            includedDocuments: validatedRequest.documentIds.map((id) => ({
              id,
              title: 'Unknown',
              fileName: 'Unknown',
              fileSize: 0,
            })),
          };

      return {
        blob: response.data,
        fileName,
        totalSize,
        documentCount: validatedRequest.documentIds.length,
        metadata,
      };
    } catch (error: any) {
      // Emit error progress
      options?.onProgress?.({
        status: 'error',
        currentStep: 'Download failed',
        processedDocuments: 0,
        totalDocuments: validatedRequest.documentIds.length,
        processedBytes: 0,
        totalBytes: 0,
        percentage: 0,
        error: error.message || 'Unknown error',
      });

      throw error;
    }
  }

  // =========================================================================
  // Audit and Signatures
  // =========================================================================

  /**
   * Get document audit trail
   * @param documentId - Document UUID
   * @param limit - Optional limit (default 100)
   * @returns List of audit trail entries
   *
   * PHI: Audit trail may contain PHI - access is logged
   */
  async getDocumentAuditTrail(
    documentId: string,
    limit: number = 100
  ): Promise<{ auditTrail: DocumentAuditTrail[] }> {
    const params = buildUrlParams({ limit });
    const response = await this.client.get<ApiResponse<{ auditTrail: DocumentAuditTrail[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/audit-trail?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  /**
   * Get document signatures
   * @param documentId - Document UUID
   * @returns List of signatures
   *
   * PHI: Signatures contain PII - access is logged
   */
  async getDocumentSignatures(documentId: string): Promise<{ signatures: DocumentSignature[] }> {
    const response = await this.client.get<ApiResponse<{ signatures: DocumentSignature[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/signatures`
    );
    return extractApiData(response as any);
  }

  // =========================================================================
  // Categories and Statistics
  // =========================================================================

  /**
   * Get document categories with metadata
   * @returns List of categories
   */
  async getDocumentCategories(): Promise<{ categories: DocumentCategoryMetadata[] }> {
    const response = await this.client.get<ApiResponse<{ categories: DocumentCategoryMetadata[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/categories`
    );
    return extractApiData(response as any);
  }

  /**
   * Get document statistics
   * @param dateRange - Optional date range filter
   * @returns Statistics
   */
  async getStatistics(
    dateRange?: { startDate: string; endDate: string }
  ): Promise<{ statistics: DocumentStatistics }> {
    const params = buildUrlParams(dateRange || {});
    const response = await this.client.get<ApiResponse<DocumentStatistics> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/statistics/overview?${params.toString()}`
    );
    const data = extractApiData(response as any);
    return { statistics: data as DocumentStatistics };
  }

  // =========================================================================
  // Archive Operations
  // =========================================================================

  /**
   * Archive expired documents
   * @returns Archive result
   *
   * PHI: Archived documents may contain PHI - operation is logged
   */
  async archiveExpiredDocuments(): Promise<{ archived: number; failed: number }> {
    const response = await this.client.post<ApiResponse<{ archived: number; failed?: number }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/archive-expired`
    );
    const result = extractApiData(response as any);
    return { archived: result.archived, failed: result.failed || 0 };
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create Documents API instance
 * @param client - API client instance
 * @returns Documents API implementation
 */
export function createDocumentsApi(client: ApiClient): DocumentsApiImpl {
  return new DocumentsApiImpl(client);
}

// ============================================================================
// Export Types
// ============================================================================

export type {
  DocumentsApi,
  Document,
  DocumentVersion,
  DocumentSignature,
  DocumentFilters,
  AdvancedSearchFilters,
  SearchResults,
  BulkDownloadRequest,
  BulkDownloadResponse,
  BulkDownloadProgress,
  VersionComparison,
  SignatureType,
};

// Create and export a default instance for backward compatibility
import { apiClient } from '../core/ApiClient';
export const documentsApi = createDocumentsApi(apiClient);

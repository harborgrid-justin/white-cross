/**
 * @fileoverview Documents API - Modular Implementation
 * @module services/modules/documentsApi
 * @category Healthcare - Documents
 *
 * Comprehensive document management API client for the White Cross healthcare platform.
 * Now implemented using modular architecture for better maintainability and focused development.
 *
 * **Refactored Architecture:**
 * This file now serves as a backward-compatible wrapper around the modular services:
 * - `DocumentsCrudService` - CRUD operations (Create, Read, Update, Delete)
 * - `DocumentsVersionService` - Version management and comparison
 * - `DocumentsActionsService` - Actions (sign, share, download, templates)
 * - `DocumentsSearchService` - Search and filtering operations
 * - `DocumentsAuditService` - Audit trail and compliance management
 *
 * Each module is focused on a specific functional area while maintaining
 * healthcare compliance and PHI protection throughout.
 *
 * **Benefits of Modular Architecture:**
 * - **Focused Development**: Each service handles one concern
 * - **Easier Testing**: Isolated functionality can be tested independently
 * - **Better Maintainability**: Changes to one area don't affect others
 * - **Reduced File Size**: Individual modules are under 500 lines
 * - **Improved Performance**: Only load needed functionality
 *
 * **Backward Compatibility:**
 * All existing API methods remain available and work exactly the same.
 * Existing code using `documentsApi.methodName()` continues to work.
 *
 * @example Using the complete API (backward compatible)
 * ```typescript
 * import { documentsApi } from '@/services/modules/documentsApi';
 *
 * // All existing methods work exactly the same
 * const { documents } = await documentsApi.getDocuments({
 *   studentId: 'student-123',
 *   category: 'CONSENT'
 * });
 * ```
 *
 * @example Using individual services (new capability)
 * ```typescript
 * import { createDocumentsApiService } from '@/services/modules/documentsApi';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const documentsApi = createDocumentsApiService(apiClient);
 *
 * // Use complete API
 * const { documents } = await documentsApi.getDocuments();
 *
 * // Or access individual services for focused operations
 * const searchResults = await documentsApi.search.advancedSearch({
 *   filters: { category: 'MEDICAL_RECORD' },
 *   sort: { field: 'createdAt', order: 'desc' }
 * });
 *
 * const auditTrail = await documentsApi.audit.getDocumentAuditTrail('doc-id');
 * ```
 */

// Import the modular implementation
import { 
  DocumentsApiService, 
  createDocumentsApiService,
  type DocumentsApi 
} from './documentsApi/index';

// Import types for re-export
import type {
  Document,
  DocumentVersion,
  DocumentSignature,
  DocumentFilters,
  AdvancedSearchFilters,
  SearchResults,
  BulkDownloadRequest,
  BulkDownloadResponse,
  BulkDownloadProgress,
  BulkDownloadOptions,
  VersionComparison,
  SignatureType,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  SignDocumentRequest,
  CreateDocumentVersionRequest,
  CreateFromTemplateRequest,
  ShareDocumentRequest,
  SearchDocumentsRequest,
  BulkDeleteDocumentsResponse,
} from '../types';

// Import API client for default instance
import { apiClient } from '../core/ApiClient';

// ============================================================================
// Backward Compatibility Implementation
// ============================================================================

/**
 * Legacy Documents API Implementation
 * Maintains backward compatibility while using the modular architecture internally
 */
class DocumentsApiImpl implements DocumentsApi {
  private readonly modularService: DocumentsApiService;

  constructor(client: any) {
    this.modularService = createDocumentsApiService(client);
  }

  // Delegate all methods to the modular implementation
  async getDocuments(filters?: DocumentFilters) {
    return this.modularService.getDocuments(filters);
  }

  async getDocumentById(id: string) {
    return this.modularService.getDocumentById(id);
  }

  async createDocument(data: CreateDocumentRequest) {
    return this.modularService.createDocument(data);
  }

  async updateDocument(id: string, data: UpdateDocumentRequest) {
    return this.modularService.updateDocument(id, data);
  }

  async deleteDocument(id: string) {
    return this.modularService.deleteDocument(id);
  }

  async getDocumentVersions(parentId: string) {
    return this.modularService.getDocumentVersions(parentId);
  }

  async createDocumentVersion(parentId: string, data: CreateDocumentVersionRequest | FormData) {
    return this.modularService.createDocumentVersion(parentId, data);
  }

  async getDocumentVersion(versionId: string) {
    return this.modularService.getDocumentVersion(versionId);
  }

  async downloadVersion(documentId: string, versionId: string) {
    return this.modularService.downloadVersion(documentId, versionId);
  }

  async compareVersions(documentId: string, versionId1: string, versionId2: string) {
    return this.modularService.compareVersions(documentId, versionId1, versionId2);
  }

  async signDocument(id: string, data: SignDocumentRequest) {
    return this.modularService.signDocument(id, data);
  }

  async verifySignature(signatureId: string) {
    return this.modularService.verifySignature(signatureId);
  }

  async downloadDocument(id: string, version?: number) {
    return this.modularService.downloadDocument(id, version);
  }

  async viewDocument(id: string) {
    return this.modularService.viewDocument(id);
  }

  async shareDocument(id: string, data: ShareDocumentRequest) {
    return this.modularService.shareDocument(id, data);
  }

  async getTemplates(category?: string) {
    return this.modularService.getTemplates(category);
  }

  async getTemplateById(id: string) {
    return this.modularService.getTemplateById(id);
  }

  async createFromTemplate(templateId: string, data: CreateFromTemplateRequest) {
    return this.modularService.createFromTemplate(templateId, data);
  }

  async getStudentDocuments(studentId: string, filters?: Omit<DocumentFilters, 'studentId'>) {
    return this.modularService.getStudentDocuments(studentId, filters);
  }

  async searchDocuments(query: string, filters?: DocumentFilters) {
    return this.modularService.searchDocuments(query, filters);
  }

  async advancedSearch(request: SearchDocumentsRequest) {
    return this.modularService.advancedSearch(request);
  }

  async getExpiringDocuments(days?: number) {
    return this.modularService.getExpiringDocuments(days);
  }

  async bulkDeleteDocuments(documentIds: string[]) {
    return this.modularService.bulkDeleteDocuments(documentIds);
  }

  async bulkDownload(request: BulkDownloadRequest, options?: BulkDownloadOptions) {
    return this.modularService.bulkDownload(request, options);
  }

  async getDocumentAuditTrail(documentId: string, limit?: number) {
    return this.modularService.getDocumentAuditTrail(documentId, limit);
  }

  async getDocumentSignatures(documentId: string) {
    return this.modularService.getDocumentSignatures(documentId);
  }

  async getDocumentCategories() {
    return this.modularService.getDocumentCategories();
  }

  async getStatistics(dateRange?: { startDate: string; endDate: string }) {
    return this.modularService.getStatistics(dateRange);
  }

  async archiveExpiredDocuments() {
    return this.modularService.archiveExpiredDocuments();
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create Documents API instance (legacy interface)
 * @param client - API client instance
 * @returns Documents API implementation with backward compatibility
 * 
 * @deprecated Use `createDocumentsApiService` for new code
 */
export function createDocumentsApi(client: any): DocumentsApiImpl {
  return new DocumentsApiImpl(client);
}

// ============================================================================
// Exports
// ============================================================================

// Export the new modular service creation function
export { createDocumentsApiService } from './documentsApi';

// Export the main service class for direct use
export { DocumentsApiService } from './documentsApi';

// Export all types for external usage
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
  BulkDownloadOptions,
  VersionComparison,
  SignatureType,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  SignDocumentRequest,
  CreateDocumentVersionRequest,
  CreateFromTemplateRequest,
  ShareDocumentRequest,
  SearchDocumentsRequest,
  BulkDeleteDocumentsResponse,
};

// Create and export a default instance for backward compatibility
export const documentsApi = createDocumentsApi(apiClient);

/**
 * Export the new modular service instance for new code
 * 
 * @example
 * ```typescript
 * import { documentsApiService } from '@/services/modules/documentsApi';
 * 
 * // Use complete API
 * const documents = await documentsApiService.getDocuments();
 * 
 * // Or access individual services
 * const results = await documentsApiService.search.advancedSearch(request);
 * const audit = await documentsApiService.audit.getDocumentAuditTrail('doc-id');
 * ```
 */
export const documentsApiService = createDocumentsApiService(apiClient);

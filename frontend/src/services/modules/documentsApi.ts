/**
 * MIGRATION STATUS: DEPRECATED
 *
 * This service module has been replaced by Next.js Server Actions for improved
 * performance, security, and Next.js App Router compatibility.
 *
 * **New Implementation:**
 * - Server Components: import from '@/lib/actions/documents.actions'
 * - Client Components: Use Server Actions with useActionState or React Query
 *
 * **Migration Guide:**
 *
 * OLD (Client API):
 * ```typescript
 * import { documentsApi } from '@/services/modules/documentsApi';
 *
 * // Get documents
 * const { documents } = await documentsApi.getDocuments({
 *   studentId: 'student-123',
 *   category: 'CONSENT'
 * });
 *
 * // Upload document
 * const doc = await documentsApi.createDocument(formData);
 *
 * // Sign document
 * await documentsApi.signDocument(docId, signatureData);
 * ```
 *
 * NEW (Server Actions):
 * ```typescript
 * import {
 *   getDocuments,
 *   uploadDocumentAction,
 *   signDocumentAction,
 *   shareDocumentAction
 * } from '@/lib/actions/documents.actions';
 *
 * // In Server Components - direct call
 * const documents = await getDocuments();
 *
 * // In Client Components - with useActionState
 * 'use client';
 * import { useActionState } from 'react';
 *
 * function DocumentUploadForm() {
 *   const [state, formAction, isPending] = useActionState(
 *     uploadDocumentAction,
 *     { errors: {} }
 *   );
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 *
 * **Available Server Actions:**
 * - CRUD: getDocuments, getDocumentAction, updateDocumentAction, deleteDocumentAction
 * - Upload: uploadDocumentAction, uploadDocumentFromForm
 * - Sharing: shareDocumentAction
 * - Signatures: signDocumentAction
 * - Statistics: getDocumentStats, getDocumentsDashboardData
 * - Utilities: documentExists, getDocumentCount
 *
 * **See Also:**
 * - @see {@link /lib/actions/documents.actions.ts} for all available Server Actions
 * - @see {@link /lib/actions/documents.crud.ts} for CRUD operations
 * - @see {@link /lib/actions/documents.upload.ts} for upload operations
 * - @see {@link /lib/actions/documents.sharing.ts} for sharing operations
 * - @see {@link /lib/actions/documents.signatures.ts} for signature operations
 * - @see {@link /lib/api/client} for client-side utilities if needed
 *
 * @deprecated Use Server Actions from @/lib/actions/documents.actions instead
 * @module services/modules/documentsApi
 * @category Healthcare - Documents
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

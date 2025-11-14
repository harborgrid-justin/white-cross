/**
 * @fileoverview Documents API Module Exports
 * @module services/modules/documentsApi
 * @category Healthcare - Documents
 *
 * Modular documents API with focused services for different functional areas.
 * Each service handles a specific aspect of document management while maintaining
 * healthcare compliance and PHI protection.
 */

// Import all service classes and factory functions
import { DocumentsCrudService, createDocumentsCrudService } from './crud';
import { DocumentsVersionService, createDocumentsVersionService } from './versions';
import { DocumentsActionsService, createDocumentsActionsService } from './actions';
import { DocumentsSearchService, createDocumentsSearchService } from './search';
import { DocumentsAuditService, createDocumentsAuditService } from './audit';

// Import types and utilities
import type {
  DocumentsApi,
  BaseDocumentsService,
  DocumentFilters,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  CreateDocumentVersionRequest,
  SignDocumentRequest,
  ShareDocumentRequest,
  CreateFromTemplateRequest,
  SearchDocumentsRequest,
  BulkDownloadRequest,
  BulkDownloadOptions,
  validateUUID,
  validateUUIDOrThrow,
  ERROR_MESSAGES,
  UUID_PATTERN,
} from './types';

// Import API client type
import type { ApiClient } from '../../core/ApiClient';

/**
 * Complete Documents API Implementation
 *
 * @class
 * @classdesc Comprehensive document management API that combines all modular services
 * into a single interface while maintaining the benefits of modular architecture.
 *
 * This class provides the complete DocumentsApi interface by composing the specialized
 * service classes. It maintains backward compatibility while enabling focused
 * development and testing of individual service areas.
 *
 * Healthcare Safety Features:
 * - Complete audit trail logging for all operations
 * - PHI protection with access logging
 * - HIPAA-compliant document handling
 * - Digital signature verification and validation
 * - Comprehensive error handling and validation
 */
export class DocumentsApiService implements DocumentsApi {
  private readonly crudService: DocumentsCrudService;
  private readonly versionsService: DocumentsVersionService;
  private readonly actionsService: DocumentsActionsService;
  private readonly searchService: DocumentsSearchService;
  private readonly auditService: DocumentsAuditService;

  constructor(private readonly client: ApiClient) {
    // Initialize all modular services with the API client
    this.crudService = createDocumentsCrudService(client);
    this.versionsService = createDocumentsVersionService(client);
    this.actionsService = createDocumentsActionsService(client);
    this.searchService = createDocumentsSearchService(client);
    this.auditService = createDocumentsAuditService(client);
  }

  // ===== CRUD Operations =====
  async getDocuments(filters?: DocumentFilters) {
    return this.crudService.getDocuments(filters);
  }

  async getDocumentById(id: string) {
    return this.crudService.getDocumentById(id);
  }

  async createDocument(data: CreateDocumentRequest) {
    return this.crudService.createDocument(data);
  }

  async updateDocument(id: string, data: UpdateDocumentRequest) {
    return this.crudService.updateDocument(id, data);
  }

  async deleteDocument(id: string) {
    return this.crudService.deleteDocument(id);
  }

  // ===== Version Management =====
  async getDocumentVersions(parentId: string) {
    return this.versionsService.getDocumentVersions(parentId);
  }

  async createDocumentVersion(parentId: string, data: CreateDocumentVersionRequest | FormData) {
    return this.versionsService.createDocumentVersion(parentId, data);
  }

  async getDocumentVersion(versionId: string) {
    return this.versionsService.getDocumentVersion(versionId);
  }

  async downloadVersion(documentId: string, versionId: string) {
    return this.versionsService.downloadVersion(documentId, versionId);
  }

  async compareVersions(documentId: string, versionId1: string, versionId2: string) {
    return this.versionsService.compareVersions(documentId, versionId1, versionId2);
  }

  // ===== Document Actions =====
  async signDocument(id: string, data: SignDocumentRequest) {
    return this.actionsService.signDocument(id, data);
  }

  async verifySignature(signatureId: string) {
    return this.actionsService.verifySignature(signatureId);
  }

  async downloadDocument(id: string, version?: number) {
    return this.actionsService.downloadDocument(id, version);
  }

  async viewDocument(id: string) {
    return this.actionsService.viewDocument(id);
  }

  async shareDocument(id: string, data: ShareDocumentRequest) {
    return this.actionsService.shareDocument(id, data);
  }

  async getTemplates(category?: string) {
    return this.actionsService.getTemplates(category);
  }

  async getTemplateById(id: string) {
    return this.actionsService.getTemplateById(id);
  }

  async createFromTemplate(templateId: string, data: CreateFromTemplateRequest) {
    return this.actionsService.createFromTemplate(templateId, data);
  }

  async getStudentDocuments(studentId: string, filters?: Omit<DocumentFilters, 'studentId'>) {
    return this.actionsService.getStudentDocuments(studentId, filters);
  }

  async bulkDeleteDocuments(documentIds: string[]) {
    return this.actionsService.bulkDeleteDocuments(documentIds);
  }

  async bulkDownload(request: BulkDownloadRequest, options?: BulkDownloadOptions) {
    return this.actionsService.bulkDownload(request, options);
  }

  // ===== Search and Filtering =====
  async searchDocuments(query: string, filters?: DocumentFilters) {
    return this.searchService.searchDocuments(query, filters);
  }

  async advancedSearch(request: SearchDocumentsRequest) {
    return this.searchService.advancedSearch(request);
  }

  async getExpiringDocuments(days?: number) {
    return this.searchService.getExpiringDocuments(days);
  }

  // ===== Audit and Compliance =====
  async getDocumentAuditTrail(documentId: string, limit?: number) {
    return this.auditService.getDocumentAuditTrail(documentId, limit);
  }

  async getDocumentSignatures(documentId: string) {
    return this.auditService.getDocumentSignatures(documentId);
  }

  async getDocumentCategories() {
    return this.auditService.getDocumentCategories();
  }

  async getStatistics(dateRange?: { startDate: string; endDate: string }) {
    return this.auditService.getStatistics(dateRange);
  }

  async archiveExpiredDocuments() {
    return this.auditService.archiveExpiredDocuments();
  }

  // ===== Service Access =====
  /**
   * Get direct access to the CRUD service
   * @description For operations that need direct access to CRUD functionality
   */
  get crud() {
    return this.crudService;
  }

  /**
   * Get direct access to the versions service
   * @description For operations that need direct access to version management
   */
  get versions() {
    return this.versionsService;
  }

  /**
   * Get direct access to the actions service
   * @description For operations that need direct access to document actions
   */
  get actions() {
    return this.actionsService;
  }

  /**
   * Get direct access to the search service
   * @description For operations that need direct access to search functionality
   */
  get search() {
    return this.searchService;
  }

  /**
   * Get direct access to the audit service
   * @description For operations that need direct access to audit functionality
   */
  get audit() {
    return this.auditService;
  }
}

/**
 * Factory function to create the complete Documents API service
 *
 * @param client - API client instance
 * @returns Complete documents API service with all functionality
 *
 * @example
 * ```typescript
 * import { createDocumentsApiService } from './services/modules/documentsApi';
 * import { apiClient } from './services/core/ApiClient';
 *
 * // Create complete service
 * const documentsApi = createDocumentsApiService(apiClient);
 *
 * // Use any API method
 * const { documents } = await documentsApi.getDocuments();
 * const { document } = await documentsApi.createDocument(documentData);
 *
 * // Access specific services for focused operations
 * const { versions } = await documentsApi.versions.getDocumentVersions('doc-id');
 * const results = await documentsApi.search.advancedSearch(searchRequest);
 * ```
 */
export function createDocumentsApiService(client: ApiClient): DocumentsApiService {
  return new DocumentsApiService(client);
}

/**
 * Factory functions for individual services
 * Export these for cases where only specific functionality is needed
 */
export {
  createDocumentsCrudService,
  createDocumentsVersionService,
  createDocumentsActionsService,
  createDocumentsSearchService,
  createDocumentsAuditService,
};

/**
 * Export individual service classes
 * For direct instantiation or testing scenarios
 */
export {
  DocumentsCrudService,
  DocumentsVersionService,
  DocumentsActionsService,
  DocumentsSearchService,
  DocumentsAuditService,
};

/**
 * Export all types for external usage
 */
export type {
  DocumentsApi,
  BaseDocumentsService,
  DocumentFilters,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  CreateDocumentVersionRequest,
  SignDocumentRequest,
  ShareDocumentRequest,
  CreateFromTemplateRequest,
  SearchDocumentsRequest,
  BulkDownloadRequest,
  BulkDownloadOptions,
};

/**
 * Export utility functions and constants
 */
export {
  validateUUID,
  validateUUIDOrThrow,
  ERROR_MESSAGES,
  UUID_PATTERN,
};

/**
 * Default export - the complete service factory
 */
export default createDocumentsApiService;

/**
 * @fileoverview Documents API Types and Interfaces
 * @module services/modules/documentsApi/types
 * @category Healthcare - Documents
 *
 * Type definitions and interfaces for the Documents API including core types,
 * request/response schemas, and API interface definitions.
 */

import type { ApiClient } from '../../core/ApiClient';
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
} from '../../types';

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

/**
 * Base API service interface for common dependencies
 */
export interface BaseDocumentsService {
  readonly client: ApiClient;
}

/**
 * Validation function type for ID validation
 */
export type IdValidator = (id: string) => boolean;

/**
 * UUID validation regex pattern
 */
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validate UUID format
 */
export const validateUUID: IdValidator = (id: string): boolean => {
  return UUID_PATTERN.test(id);
};

/**
 * Throw error for invalid UUID
 */
export const validateUUIDOrThrow = (id: string, type: string = 'ID'): void => {
  if (!validateUUID(id)) {
    throw new Error(`Invalid ${type} format`);
  }
};

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  INVALID_DOCUMENT_ID: 'Invalid document ID format',
  INVALID_VERSION_ID: 'Invalid version ID format',
  INVALID_SIGNATURE_ID: 'Invalid signature ID format',
  INVALID_TEMPLATE_ID: 'Invalid template ID format',
  INVALID_STUDENT_ID: 'Invalid student ID format',
} as const;

/**
 * Re-export all document-related types for convenience
 */
export type {
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
};

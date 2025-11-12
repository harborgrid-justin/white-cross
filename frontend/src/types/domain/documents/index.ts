/**
 * Document Types Module - Main Entry Point
 * Comprehensive type definitions for the Document Management module
 * Matches backend document service and models
 *
 * @module types/domain/documents
 */

// ============================================================================
// Enums
// ============================================================================
export {
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
  DocumentAction,
  TemplateFieldType,
  TemplateStatus,
  SignatureStatus,
  WorkflowStatus,
  SignatureType,
} from './enums';

// ============================================================================
// Core Types
// ============================================================================
export type {
  Document,
  DocumentSignature,
  DocumentAuditTrail,
  DocumentTemplate,
  DocumentVersion,
  DocumentCategoryMetadata,
  DocumentPermission,
  DocumentMetadata,
  DocumentListResponse,
} from './core';

// ============================================================================
// Utility Types
// ============================================================================
export type {
  DocumentWithoutRelations,
  PartialDocumentUpdate,
  DocumentSortField,
  DocumentSortOrder,
} from './utilities';

// ============================================================================
// Request Types
// ============================================================================
export type {
  CreateDocumentRequest,
  UpdateDocumentRequest,
  SignDocumentRequest,
  CreateDocumentVersionRequest,
  CreateFromTemplateRequest,
  ShareDocumentRequest,
  ExportDocumentsRequest,
  ImportDocumentsRequest,
} from './requests';

// ============================================================================
// Response Types
// ============================================================================
export type {
  PaginatedDocumentsResponse,
  DocumentWithRelations,
  DocumentStatistics,
  DocumentUsageAnalytics,
  StorageUsage,
  ImportDocumentsResponse,
} from './responses';

// ============================================================================
// Search and Filter Types
// ============================================================================
export type {
  DocumentFilters,
  DocumentSearchParams,
  AdvancedSearchFilters,
  SearchSortOptions,
  SearchDocumentsRequest,
  SearchResults,
  VersionComparisonRequest,
  VersionComparison,
} from './search';

// ============================================================================
// Bulk Operations
// ============================================================================
export type {
  BulkUpdateDocumentsRequest,
  BulkDeleteDocumentsRequest,
  BulkDeleteDocumentsResponse,
  BulkOperationResult,
  BulkDownloadOptions,
  BulkDownloadRequest,
  BulkDownloadProgress,
  BulkDownloadResponse,
} from './bulk-operations';

// ============================================================================
// File Upload Types
// ============================================================================
export type {
  FileUploadRequest,
  FileUploadProgress,
  FileUploadResponse,
  FileMetadata,
  ChunkedUploadSession,
} from './file-upload';

// ============================================================================
// Signature Types
// ============================================================================
export type {
  SignatureWorkflow,
  Signature,
  SignatureVerificationResult,
} from './signatures';

// ============================================================================
// Retention and Archiving Types
// ============================================================================
export type {
  ExpiringDocumentsRequest,
  DocumentRetentionPolicy,
  ArchiveDocumentsRequest,
  ArchiveDocumentsResponse,
} from './retention';

// ============================================================================
// Validation and Error Types
// ============================================================================
export type {
  DocumentValidationError,
  DocumentUploadError,
} from './validation';

// ============================================================================
// Constants
// ============================================================================
export {
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_ACCESS_LEVEL_LABELS,
  DOCUMENT_ACTION_LABELS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  DEFAULT_RETENTION_YEARS,
} from './constants';

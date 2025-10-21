/**
 * WF-COMP-323 | documents.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./common | Dependencies: ./common
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Document Types and Interfaces
 * Comprehensive type definitions for the Document Management module
 * Matches backend document service and models
 */

import { BaseEntity, BaseAuditEntity } from './common';

// ============================================================================
// Document Enums
// ============================================================================

/**
 * Document Category Enum
 * Defines all supported document categories in the healthcare system
 */
export enum DocumentCategory {
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
  CONSENT_FORM = 'CONSENT_FORM',
  POLICY = 'POLICY',
  TRAINING = 'TRAINING',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  STUDENT_FILE = 'STUDENT_FILE',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER',
}

/**
 * Document Status Enum
 * Represents the lifecycle status of a document
 */
export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
  EXPIRED = 'EXPIRED',
}

/**
 * Document Access Level Enum
 * Controls who can access the document based on role and permissions
 */
export enum DocumentAccessLevel {
  PUBLIC = 'PUBLIC',
  STAFF_ONLY = 'STAFF_ONLY',
  ADMIN_ONLY = 'ADMIN_ONLY',
  RESTRICTED = 'RESTRICTED',
}

/**
 * Document Action Enum
 * All possible actions that can be performed on documents for audit trail
 */
export enum DocumentAction {
  CREATED = 'CREATED',
  VIEWED = 'VIEWED',
  DOWNLOADED = 'DOWNLOADED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  SHARED = 'SHARED',
  SIGNED = 'SIGNED',
}

// ============================================================================
// Core Document Interfaces
// ============================================================================

/**
 * Main Document Interface
 * Represents a document in the system with all metadata and relationships
 */
export interface Document extends BaseEntity {
  // Basic Information
  title: string;
  description?: string;
  category: DocumentCategory;

  // File Information
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;

  // Version Control
  version: number;
  parentId?: string;
  parent?: Document;
  versions?: Document[];

  // Status and Access
  status: DocumentStatus;
  accessLevel: DocumentAccessLevel;

  // Metadata
  tags: string[];
  isTemplate: boolean;
  templateData?: any;
  retentionDate?: string;

  // Relationships
  uploadedBy: string;
  studentId?: string;

  // Associated Data
  signatures?: DocumentSignature[];
  auditTrail?: DocumentAuditTrail[];
}

/**
 * Document Signature Interface
 * Tracks digital signatures on documents requiring acknowledgment
 */
export interface DocumentSignature {
  id: string;
  documentId: string;
  signedBy: string;
  signedByRole: string;
  signatureData?: string;
  signedAt: string;
  ipAddress?: string;
}

/**
 * Document Audit Trail Interface
 * Maintains comprehensive audit trail for HIPAA compliance
 */
export interface DocumentAuditTrail {
  id: string;
  documentId: string;
  action: DocumentAction;
  performedBy: string;
  changes?: any;
  ipAddress?: string;
  createdAt: string;
}

/**
 * Document Template Interface
 * Defines reusable document templates with variables
 */
export interface DocumentTemplate extends BaseEntity {
  title: string;
  description?: string;
  category: DocumentCategory;
  fileType: string;
  fileName: string;
  templateData?: any;
  variables?: string[];
  isActive: boolean;
  accessLevel: DocumentAccessLevel;
  tags: string[];
}

/**
 * Document Version Interface
 * Represents a specific version of a document
 */
export interface DocumentVersion {
  id: string;
  parentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  changes?: string;
  status: DocumentStatus;
}

// ============================================================================
// Document Category Metadata
// ============================================================================

/**
 * Document Category Metadata
 * Provides additional information about each document category
 */
export interface DocumentCategoryMetadata {
  value: DocumentCategory;
  label: string;
  description: string;
  requiresSignature: boolean;
  retentionYears: number;
  documentCount?: number;
}

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * Create Document Request
 * Data required to create a new document
 */
export interface CreateDocumentRequest {
  title: string;
  description?: string;
  category: DocumentCategory;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  studentId?: string;
  tags?: string[];
  isTemplate?: boolean;
  templateData?: any;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Update Document Request
 * Fields that can be updated on an existing document
 */
export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  status?: DocumentStatus;
  tags?: string[];
  retentionDate?: string;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Sign Document Request
 * Data required to sign a document
 */
export interface SignDocumentRequest {
  documentId: string;
  signedBy: string;
  signedByRole: string;
  signatureData?: string;
  ipAddress?: string;
}

/**
 * Create Document Version Request
 * Data required to create a new version of an existing document
 */
export interface CreateDocumentVersionRequest {
  title?: string;
  description?: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  tags?: string[];
  templateData?: any;
}

/**
 * Create from Template Request
 * Data required to create a document from a template
 */
export interface CreateFromTemplateRequest {
  title: string;
  uploadedBy: string;
  studentId?: string;
  templateData?: any;
}

/**
 * Share Document Request
 * Data required to share a document with other users
 */
export interface ShareDocumentRequest {
  userIds: string[];
  permissions: string[];
  expiresAt?: string;
  message?: string;
}

/**
 * Document Permission
 * Defines a user's permission to access a document
 */
export interface DocumentPermission {
  id: string;
  documentId: string;
  userId: string;
  permission: 'VIEW' | 'EDIT' | 'ADMIN';
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
}

// ============================================================================
// Filter and Search Types
// ============================================================================

/**
 * Document Filters
 * All available filters for document queries
 */
export interface DocumentFilters {
  page?: number;
  limit?: number;
  category?: DocumentCategory;
  status?: DocumentStatus;
  studentId?: string;
  uploadedBy?: string;
  searchTerm?: string;
  tags?: string[];
  accessLevel?: DocumentAccessLevel;
  dateFrom?: string;
  dateTo?: string;
  retentionDateFrom?: string;
  retentionDateTo?: string;
  isTemplate?: boolean;
  hasSignatures?: boolean;
}

/**
 * Document Search Parameters
 * Extended search parameters with sorting and advanced filters
 */
export interface DocumentSearchParams extends DocumentFilters {
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'category' | 'status' | 'fileSize';
  sortOrder?: 'ASC' | 'DESC';
  includeArchived?: boolean;
  includeExpired?: boolean;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Paginated Documents Response
 * Response structure for paginated document queries
 */
export interface PaginatedDocumentsResponse {
  documents: Document[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Document with Relations
 * Document with all related data loaded
 */
export interface DocumentWithRelations extends Document {
  parent?: Document;
  versions: Document[];
  signatures: DocumentSignature[];
  auditTrail: DocumentAuditTrail[];
  uploadedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

/**
 * Document Statistics
 * Comprehensive statistics about documents in the system
 */
export interface DocumentStatistics {
  total: number;
  byCategory: Array<{
    category: DocumentCategory;
    count: number;
  }>;
  byStatus: Array<{
    status: DocumentStatus;
    count: number;
  }>;
  totalSize: number;
  recentDocuments: number;
  expiringCount?: number;
  signedCount?: number;
}

/**
 * Document Usage Analytics
 * Analytics data for a specific document
 */
export interface DocumentUsageAnalytics {
  documentId: string;
  viewCount: number;
  downloadCount: number;
  shareCount: number;
  signatureCount: number;
  lastViewed?: string;
  lastDownloaded?: string;
  mostViewedBy?: Array<{
    userId: string;
    userName: string;
    viewCount: number;
  }>;
}

/**
 * Storage Usage Information
 * Information about document storage usage
 */
export interface StorageUsage {
  totalSize: number;
  totalDocuments: number;
  byCategory: Array<{
    category: DocumentCategory;
    size: number;
    count: number;
  }>;
  byFileType: Array<{
    fileType: string;
    size: number;
    count: number;
  }>;
  averageFileSize: number;
  largestDocuments?: Array<{
    id: string;
    title: string;
    fileSize: number;
  }>;
}

// ============================================================================
// Bulk Operations
// ============================================================================

/**
 * Bulk Update Request
 * Request structure for bulk document updates
 */
export interface BulkUpdateDocumentsRequest {
  updates: Array<{
    id: string;
    data: UpdateDocumentRequest;
  }>;
}

/**
 * Bulk Delete Request
 * Request structure for bulk document deletion
 */
export interface BulkDeleteDocumentsRequest {
  documentIds: string[];
  reason?: string;
}

/**
 * Bulk Delete Response
 * Response from bulk delete operation
 */
export interface BulkDeleteDocumentsResponse {
  deleted: number;
  notFound: number;
  success: boolean;
  errors?: Array<{
    documentId: string;
    error: string;
  }>;
}

/**
 * Bulk Operation Result
 * Generic result structure for bulk operations
 */
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

// ============================================================================
// File Upload Types
// ============================================================================

/**
 * File Upload Request
 * Data for uploading a file
 */
export interface FileUploadRequest {
  file: File;
  category: DocumentCategory;
  title?: string;
  description?: string;
  studentId?: string;
  tags?: string[];
  accessLevel?: DocumentAccessLevel;
}

/**
 * File Upload Progress
 * Progress information for file uploads
 */
export interface FileUploadProgress {
  fileName: string;
  fileSize: number;
  uploaded: number;
  percentage: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

/**
 * File Upload Response
 * Response after successful file upload
 */
export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

// ============================================================================
// Import/Export Types
// ============================================================================

/**
 * Export Documents Request
 * Parameters for exporting documents
 */
export interface ExportDocumentsRequest {
  documentIds?: string[];
  filters?: DocumentFilters;
  format: 'zip' | 'pdf' | 'csv';
  includeMetadata?: boolean;
}

/**
 * Import Documents Request
 * Parameters for importing documents
 */
export interface ImportDocumentsRequest {
  file: File;
  category?: DocumentCategory;
  tags?: string[];
  accessLevel?: DocumentAccessLevel;
  overwriteExisting?: boolean;
}

/**
 * Import Documents Response
 * Result of document import operation
 */
export interface ImportDocumentsResponse {
  imported: number;
  failed: number;
  skipped: number;
  errors: Array<{
    fileName: string;
    error: string;
  }>;
}

// ============================================================================
// Expiration and Retention
// ============================================================================

/**
 * Expiring Documents Request
 * Parameters for querying expiring documents
 */
export interface ExpiringDocumentsRequest {
  days?: number;
  categories?: DocumentCategory[];
  includeExpired?: boolean;
}

/**
 * Document Retention Policy
 * Defines retention policy for document categories
 */
export interface DocumentRetentionPolicy {
  category: DocumentCategory;
  retentionYears: number;
  autoArchive: boolean;
  autoDelete: boolean;
  requiresApproval: boolean;
}

/**
 * Archive Documents Request
 * Parameters for archiving documents
 */
export interface ArchiveDocumentsRequest {
  documentIds: string[];
  reason?: string;
  archiveExpired?: boolean;
}

/**
 * Archive Documents Response
 * Result of archive operation
 */
export interface ArchiveDocumentsResponse {
  archived: number;
  failed: number;
  errors?: Array<{
    documentId: string;
    error: string;
  }>;
}

// ============================================================================
// Validation and Error Types
// ============================================================================

/**
 * Document Validation Error
 * Specific validation errors for documents
 */
export interface DocumentValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

/**
 * Document Upload Error
 * Errors that can occur during document upload
 */
export interface DocumentUploadError {
  type: 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE' | 'UPLOAD_FAILED' | 'VIRUS_DETECTED' | 'QUOTA_EXCEEDED';
  message: string;
  maxSize?: number;
  allowedTypes?: string[];
}

// ============================================================================
// Type Helpers and Utilities
// ============================================================================

/**
 * Document without relations
 * Document type without associations for simpler operations
 */
export type DocumentWithoutRelations = Omit<Document, 'parent' | 'versions' | 'signatures' | 'auditTrail'>;

/**
 * Partial Document Update
 * Partial type for document updates
 */
export type PartialDocumentUpdate = Partial<Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'uploadedBy'>>;

/**
 * Document Sort Field
 * Valid fields for sorting documents
 */
export type DocumentSortField = 'createdAt' | 'updatedAt' | 'title' | 'category' | 'status' | 'fileSize' | 'version';

/**
 * Document Sort Order
 * Valid sort orders
 */
export type DocumentSortOrder = 'ASC' | 'DESC';

// ============================================================================
// Constants and Mappings
// ============================================================================

/**
 * Document Category Labels
 * Human-readable labels for document categories
 */
export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  [DocumentCategory.MEDICAL_RECORD]: 'Medical Record',
  [DocumentCategory.INCIDENT_REPORT]: 'Incident Report',
  [DocumentCategory.CONSENT_FORM]: 'Consent Form',
  [DocumentCategory.POLICY]: 'Policy Document',
  [DocumentCategory.TRAINING]: 'Training Materials',
  [DocumentCategory.ADMINISTRATIVE]: 'Administrative',
  [DocumentCategory.STUDENT_FILE]: 'Student File',
  [DocumentCategory.INSURANCE]: 'Insurance',
  [DocumentCategory.OTHER]: 'Other',
};

/**
 * Document Status Labels
 * Human-readable labels for document statuses
 */
export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  [DocumentStatus.DRAFT]: 'Draft',
  [DocumentStatus.PENDING_REVIEW]: 'Pending Review',
  [DocumentStatus.APPROVED]: 'Approved',
  [DocumentStatus.ARCHIVED]: 'Archived',
  [DocumentStatus.EXPIRED]: 'Expired',
};

/**
 * Document Access Level Labels
 * Human-readable labels for access levels
 */
export const DOCUMENT_ACCESS_LEVEL_LABELS: Record<DocumentAccessLevel, string> = {
  [DocumentAccessLevel.PUBLIC]: 'Public',
  [DocumentAccessLevel.STAFF_ONLY]: 'Staff Only',
  [DocumentAccessLevel.ADMIN_ONLY]: 'Admin Only',
  [DocumentAccessLevel.RESTRICTED]: 'Restricted',
};

/**
 * Document Action Labels
 * Human-readable labels for document actions
 */
export const DOCUMENT_ACTION_LABELS: Record<DocumentAction, string> = {
  [DocumentAction.CREATED]: 'Created',
  [DocumentAction.VIEWED]: 'Viewed',
  [DocumentAction.DOWNLOADED]: 'Downloaded',
  [DocumentAction.UPDATED]: 'Updated',
  [DocumentAction.DELETED]: 'Deleted',
  [DocumentAction.SHARED]: 'Shared',
  [DocumentAction.SIGNED]: 'Signed',
};

/**
 * Allowed File Types
 * MIME types allowed for document uploads by category
 */
export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  all: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'text/csv',
  ],
};

/**
 * Maximum File Size
 * Maximum allowed file size in bytes (50MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Default Retention Years
 * Default retention period by category
 */
export const DEFAULT_RETENTION_YEARS: Record<DocumentCategory, number> = {
  [DocumentCategory.MEDICAL_RECORD]: 7,
  [DocumentCategory.INCIDENT_REPORT]: 7,
  [DocumentCategory.CONSENT_FORM]: 7,
  [DocumentCategory.POLICY]: 5,
  [DocumentCategory.TRAINING]: 5,
  [DocumentCategory.ADMINISTRATIVE]: 3,
  [DocumentCategory.STUDENT_FILE]: 7,
  [DocumentCategory.INSURANCE]: 7,
  [DocumentCategory.OTHER]: 3,
};

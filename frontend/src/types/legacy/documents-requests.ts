/**
 * WF-COMP-323 | documents-requests.ts - Document request/response types
 * Purpose: API request/response contracts for document operations
 * Upstream: ./documents-core | Dependencies: ./documents-core
 * Downstream: API services, components
 * Related: Document service, API layer
 * Exports: Request/response interfaces, filters, search types
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: API communication for document operations
 * LLM Context: Request/response types for document API operations
 */

/**
 * Document Request and Response Types
 * Type definitions for API communication and data exchange
 */

import {
  Document,
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
  DocumentSignature,
  DocumentAuditTrail,
  DocumentSortField,
  DocumentSortOrder,
} from './documents-core';

// ============================================================================
// Request Types
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
  templateData?: Record<string, unknown>;
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
  templateData?: Record<string, unknown>;
}

/**
 * Create from Template Request
 * Data required to create a document from a template
 */
export interface CreateFromTemplateRequest {
  title: string;
  uploadedBy: string;
  studentId?: string;
  templateData?: Record<string, unknown>;
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
 * Expiring Documents Request
 * Parameters for querying expiring documents
 */
export interface ExpiringDocumentsRequest {
  days?: number;
  categories?: DocumentCategory[];
  includeExpired?: boolean;
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
  pageSize?: number; // Alternative pagination size parameter
  folderId?: string; // Filter by folder/directory
  isPHI?: boolean; // Filter by PHI status
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

/**
 * Advanced Search Filters
 * Extended filtering options for document search
 */
export interface AdvancedSearchFilters extends DocumentFilters {
  fullTextSearch?: string;
  tags?: string[];
  metadataFilters?: Record<string, unknown>;
  uploadedByIds?: string[];
  sharedWithIds?: string[];
  signedStatus?: 'SIGNED' | 'UNSIGNED' | 'PENDING';
  hasAttachments?: boolean;
  minVersion?: number;
  maxVersion?: number;
  retentionStatus?: 'ACTIVE' | 'ARCHIVED' | 'EXPIRED';
}

/**
 * Search Sort Options
 * Configuration for sorting search results
 */
export interface SearchSortOptions {
  field: DocumentSortField;
  order: DocumentSortOrder;
}

/**
 * Search Documents Request
 * Full request payload for advanced document search
 */
export interface SearchDocumentsRequest {
  query?: string;
  filters?: AdvancedSearchFilters;
  sortOptions?: SearchSortOptions;
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
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
 * Document List Response - Paginated list of documents
 */
export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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

/**
 * Search Results
 * Response containing search results with metadata
 */
export interface SearchResults {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets?: {
    categories?: Record<DocumentCategory, number>;
    statuses?: Record<DocumentStatus, number>;
    years?: Record<string, number>;
  };
  suggestions?: string[];
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

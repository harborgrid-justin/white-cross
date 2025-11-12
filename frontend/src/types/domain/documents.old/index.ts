/**
 * Document types index
 *
 * @module types/documents
 * @description Central export for all document-related types
 */

// Core document types
export * from './core';

// E-signature types
export * from './signature';

// Template types
export * from './template';

// Version control types
export * from './version';

/**
 * API Response Types
 */

import { Document, Folder, DocumentAccessLog } from './core';
import { SignatureWorkflow, Signature } from './signature';
import { DocumentTemplate } from './template';
import { DocumentVersion } from './version';

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Data items */
  data: T[];

  /** Pagination metadata */
  pagination: {
    /** Current page */
    page: number;

    /** Items per page */
    pageSize: number;

    /** Total items */
    totalItems: number;

    /** Total pages */
    totalPages: number;

    /** Has next page */
    hasNext: boolean;

    /** Has previous page */
    hasPrevious: boolean;
  };
}

/**
 * Document list response
 */
export interface DocumentListResponse extends PaginatedResponse<Document> {
  /** Total size of all documents */
  totalSize: number;

  /** Folder context */
  folder?: Folder;
}

/**
 * Document search response
 */
export interface DocumentSearchResponse extends PaginatedResponse<Document> {
  /** Search query */
  query: string;

  /** Search took (ms) */
  took: number;

  /** Facets for filtering */
  facets?: {
    categories: Record<string, number>;
    tags: Record<string, number>;
    fileTypes: Record<string, number>;
    accessLevels: Record<string, number>;
  };

  /** Suggestions */
  suggestions?: string[];
}

/**
 * Document details response
 */
export interface DocumentDetailsResponse {
  /** Document */
  document: Document;

  /** Document versions */
  versions?: DocumentVersion[];

  /** Active workflows */
  workflows?: SignatureWorkflow[];

  /** Access log (recent) */
  accessLog?: DocumentAccessLog[];

  /** Related documents */
  relatedDocuments?: Document[];

  /** User permissions */
  permissions: {
    canView: boolean;
    canDownload: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    canSign: boolean;
  };
}

/**
 * Upload response
 */
export interface UploadResponse {
  /** Uploaded document */
  document: Document;

  /** Upload ID */
  uploadId: string;

  /** Processing status */
  processingStatus: 'pending' | 'processing' | 'complete' | 'failed';

  /** Virus scan result */
  virusScanResult?: {
    status: 'clean' | 'infected' | 'pending';
    details?: string;
  };

  /** OCR status */
  ocrStatus?: 'pending' | 'processing' | 'complete' | 'failed';
}

/**
 * Bulk upload response
 */
export interface BulkUploadResponse {
  /** Upload session ID */
  sessionId: string;

  /** Uploaded documents */
  documents: Document[];

  /** Failed uploads */
  failures: Array<{
    fileName: string;
    reason: string;
  }>;

  /** Success count */
  successCount: number;

  /** Failure count */
  failureCount: number;

  /** Total size uploaded */
  totalSize: number;
}

/**
 * Document statistics
 */
export interface DocumentStatistics {
  /** Total documents */
  totalDocuments: number;

  /** Total size in bytes */
  totalSize: number;

  /** Documents by category */
  byCategory: Record<string, number>;

  /** Documents by status */
  byStatus: Record<string, number>;

  /** Documents by access level */
  byAccessLevel: Record<string, number>;

  /** Recent uploads (last 30 days) */
  recentUploads: number;

  /** Pending signatures */
  pendingSignatures: number;

  /** Expiring soon (next 30 days) */
  expiringSoon: number;

  /** Storage usage */
  storageUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}

/**
 * Document filter options
 */
export interface DocumentFilters {
  /** Search query */
  query?: string;

  /** Filter by category */
  category?: string[];

  /** Filter by status */
  status?: string[];

  /** Filter by access level */
  accessLevel?: string[];

  /** Filter by tags */
  tags?: string[];

  /** Filter by folder */
  folderId?: string;

  /** Filter by student */
  studentId?: string;

  /** Filter by school */
  schoolId?: string;

  /** Filter by district */
  districtId?: string;

  /** Filter by date range */
  dateFrom?: Date;
  dateTo?: Date;

  /** Filter by file type */
  fileType?: string[];

  /** Filter by creator */
  createdBy?: string;

  /** Include deleted */
  includeDeleted?: boolean;

  /** Require signature */
  requiresSignature?: boolean;

  /** Is PHI */
  isPHI?: boolean;

  /** Sort by */
  sortBy?: 'name' | 'date' | 'size' | 'category' | 'status';

  /** Sort direction */
  sortDirection?: 'asc' | 'desc';

  /** Page number */
  page?: number;

  /** Page size */
  pageSize?: number;
}

/**
 * Document action result
 */
export interface DocumentActionResult {
  /** Success status */
  success: boolean;

  /** Result message */
  message: string;

  /** Affected document */
  document?: Document;

  /** Error details */
  error?: {
    code: string;
    details: string;
  };
}

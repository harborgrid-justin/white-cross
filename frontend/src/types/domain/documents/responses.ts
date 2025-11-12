/**
 * Document Response Types Module
 * Response interfaces for document operations
 * Dependencies: core.ts, enums.ts
 */

import {
  Document,
  DocumentSignature,
  DocumentAuditTrail,
} from './core';
import { DocumentCategory, DocumentStatus } from './enums';

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

/**
 * Bulk Operations Types Module
 * Types for bulk document operations
 * Dependencies: requests.ts, responses.ts
 */

import { UpdateDocumentRequest } from './requests';

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

/**
 * Bulk Download Options
 * Configuration options for bulk download operations
 */
export interface BulkDownloadOptions {
  format?: 'ZIP' | 'TAR';
  includeMetadata?: boolean;
  compression?: 'NONE' | 'FAST' | 'BEST';
  maxSize?: number; // Maximum size in bytes
}

/**
 * Bulk Download Request
 * Request to download multiple documents
 */
export interface BulkDownloadRequest {
  documentIds: string[];
  options?: BulkDownloadOptions;
  includeVersions?: boolean;
}

/**
 * Bulk Download Progress
 * Progress tracking for bulk download operations
 */
export interface BulkDownloadProgress {
  processed: number;
  total: number;
  currentDocument?: string;
  bytesProcessed: number;
  totalBytes: number;
  estimatedTimeRemaining?: number; // seconds
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}

/**
 * Bulk Download Response
 * Response from bulk download operation
 */
export interface BulkDownloadResponse {
  downloadUrl: string;
  blob?: Blob;
  filename: string;
  size: number;
  expiresAt: string; // ISO 8601 datetime
  documentCount: number;
}

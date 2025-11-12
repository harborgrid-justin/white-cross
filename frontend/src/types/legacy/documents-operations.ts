/**
 * WF-COMP-323 | documents-operations.ts - Document operational types
 * Purpose: Types for bulk operations, workflows, and file uploads
 * Upstream: ./documents-core | Dependencies: ./documents-core
 * Downstream: Document services, upload handlers, workflow engines
 * Related: File upload service, signature service, bulk operations
 * Exports: Bulk operation types, file upload types, workflow types
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Operational workflows for document management
 * LLM Context: Operational types for document bulk operations and workflows
 */

/**
 * Document Operations and Workflows
 * Type definitions for bulk operations, file uploads, and document workflows
 */

import {
  Document,
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
  DocumentVersion,
  SignatureType,
} from './documents-core';
import { UpdateDocumentRequest } from './documents-requests';

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

/**
 * Chunked Upload Session - For large file uploads
 */
export interface ChunkedUploadSession {
  sessionId: string;
  fileName: string;
  fileSize: number;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: number[];
  status: 'pending' | 'uploading' | 'completed' | 'failed';
}

// ============================================================================
// Signature Workflow Types
// ============================================================================

/**
 * Signature Workflow - Workflow for document signatures
 */
export interface SignatureWorkflow {
  id: string;
  documentId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  signers: Array<{
    userId: string;
    role: string;
    signed: boolean;
    signedAt?: string;
  }>;
  createdAt: string;
  completedAt?: string;
}

/**
 * Signature Verification Result
 * Result of signature verification operation
 */
export interface SignatureVerificationResult {
  signatureId: string;
  documentId: string;
  isValid: boolean;
  signedBy: string;
  signedAt: string;
  signatureType: SignatureType;
  certificateChain?: string[];
  trustLevel: 'TRUSTED' | 'UNTRUSTED' | 'UNKNOWN';
  verificationMethod: string;
  timestamp: string;
  errors?: string[];
  warnings?: string[];
}

// ============================================================================
// Version Management Types
// ============================================================================

/**
 * Version Comparison Request
 * Request to compare two document versions
 */
export interface VersionComparisonRequest {
  documentId: string;
  version1Id: string;
  version2Id: string;
  compareOptions?: {
    ignoreWhitespace?: boolean;
    showDiff?: boolean;
  };
}

/**
 * Version Comparison
 * Result of comparing two document versions
 */
export interface VersionComparison {
  documentId: string;
  version1: DocumentVersion;
  version2: DocumentVersion;
  differences: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
    type: 'ADDED' | 'REMOVED' | 'MODIFIED';
  }[];
  similarity: number; // 0-100 percentage
  hasDifferences: boolean;
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
  value?: unknown;
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

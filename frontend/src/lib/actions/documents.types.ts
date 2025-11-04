/**
 * @fileoverview Document Management Type Definitions
 * @module lib/actions/documents.types
 *
 * Centralized type definitions for document management operations.
 * Shared across all document action modules.
 */

// ==========================================
// CONFIGURATION CONSTANTS
// ==========================================

/**
 * Allowed file types for document uploads
 */
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
] as const;

/**
 * Maximum file size for uploads (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Custom cache tags for documents
 */
export const DOCUMENT_CACHE_TAGS = {
  DOCUMENTS: 'documents',
  DOCUMENT_SHARES: 'document-shares',
  DOCUMENT_SIGNATURES: 'document-signatures',
  DOCUMENT_TEMPLATES: 'document-templates',
} as const;

// ==========================================
// CORE TYPE DEFINITIONS
// ==========================================

/**
 * Standard action result wrapper for server actions
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

/**
 * Document metadata for upload and update operations
 */
export interface DocumentMetadata {
  title: string;
  category?: string;
  isPHI: boolean;
  description?: string;
}

/**
 * Complete document information
 */
export interface DocumentInfo {
  id: string;
  title: string;
  filename: string;
  mimeType: string;
  size: number;
  category?: string;
  description?: string;
  isPHI: boolean;
  uploadedAt: string;
  data?: string; // base64 encoded
}

/**
 * Document signature data structure
 */
export interface DocumentSignature {
  id: string;
  documentId: string;
  userId: string;
  signatureData: string;
  signatureHash: string;
  timestamp: {
    timestamp: Date;
    source: string;
  };
  metadata: {
    fullName: string;
    email: string;
    agreedToTerms: boolean;
    ipAddress: string;
    userAgent: string;
  };
}

/**
 * Document sharing configuration
 */
export interface DocumentShareData {
  userId?: string;
  email?: string;
  permissions: ('view' | 'download' | 'edit')[];
  expiresAt?: Date;
}

/**
 * Electronic signature agreement data
 */
export interface SignatureAgreement {
  agreedToTerms: boolean;
  fullName: string;
  email: string;
}

/**
 * Document statistics for dashboard metrics
 */
export interface DocumentStats {
  totalDocuments: number;
  pendingSignatures: number;
  sharedDocuments: number;
  recentUploads: number;
  storageUsed: number;
  storageLimit: number;
  documentTypes: {
    forms: number;
    reports: number;
    policies: number;
    agreements: number;
    certificates: number;
    other: number;
  };
  signatureStatus: {
    signed: number;
    pending: number;
    expired: number;
  };
}

/**
 * @fileoverview Documents Constants
 * @module lib/actions/documents/constants
 *
 * Runtime constant values for document management.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// FILE CONFIGURATION
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
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

/**
 * Maximum file size for uploads (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Cache tags for document operations
 */
export const DOCUMENT_CACHE_TAGS = {
  DOCUMENTS: 'documents',
  DOCUMENT_SHARES: 'document-shares',
  DOCUMENT_SIGNATURES: 'document-signatures',
  DOCUMENT_TEMPLATES: 'document-templates',
} as const;

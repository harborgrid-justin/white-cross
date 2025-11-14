/**
 * Document Validation and Error Types Module
 * Error types and validation interfaces for document operations
 * No external dependencies - base layer module
 */

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

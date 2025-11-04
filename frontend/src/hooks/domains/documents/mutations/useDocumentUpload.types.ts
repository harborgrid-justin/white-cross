/**
 * Type definitions for document upload hooks
 *
 * @module hooks/documents/useDocumentUpload.types
 * @description Shared types for upload functionality
 */

import type { UploadProgress, Document } from '@/types/documents';

/**
 * Upload options
 */
export interface UploadOptions {
  /** Authentication token */
  token?: string;

  /** Folder ID to upload to */
  folderId?: string;

  /** Enable auto-retry on failure */
  enableRetry?: boolean;

  /** Maximum file size in bytes */
  maxFileSize?: number;

  /** Allowed file types */
  allowedTypes?: string[];
}

/**
 * Upload state
 */
export interface UploadState {
  /** Upload progress */
  progress: UploadProgress | null;

  /** Upload status */
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

  /** Uploaded document */
  document: Document | null;

  /** Error message */
  error: string | null;
}

/**
 * API configuration
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

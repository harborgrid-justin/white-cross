/**
 * useDocumentUpload hook for file uploads
 *
 * @module hooks/documents/useDocumentUpload
 * @description Hook for uploading documents with progress tracking
 */

'use client';

// Re-export types
export type { UploadOptions, UploadState } from './useDocumentUpload.types';
export { API_BASE_URL } from './useDocumentUpload.types';

// Re-export single upload hook
export { useDocumentUpload } from './useSingleUpload';

// Re-export bulk upload hook
export { useBulkDocumentUpload } from './useBulkUpload';

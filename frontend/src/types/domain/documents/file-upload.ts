/**
 * File Upload Types Module
 * Types related to file uploading and processing
 * Dependencies: enums.ts
 */

import { DocumentCategory, DocumentAccessLevel } from './enums';

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
 * File Metadata
 * Basic file information
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

/**
 * Chunked Upload Session
 * For large file uploads
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

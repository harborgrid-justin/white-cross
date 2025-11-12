/**
 * WF-COMP-319 | document-types.ts - Document and File Type Definitions
 * Purpose: File upload and document reference types
 * Upstream: File storage service | Dependencies: None
 * Downstream: File uploads, document management, attachments | Called by: Upload components
 * Related: Base entities
 * Exports: FileUpload, DocumentReference | Key Features: File metadata tracking
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: File select → Upload → Storage → Reference creation → Display
 * LLM Context: Document and file types, part of type system refactoring
 */

/**
 * Document Types Module
 *
 * Defines types for file uploads and document references.
 * Used across the application for file management and attachments.
 *
 * @module types/core/document-types
 * @category Types
 */

/**
 * File upload metadata.
 *
 * Represents a file being uploaded or recently uploaded.
 * Contains file information and optional storage details.
 *
 * @property {string} name - Original filename
 * @property {number} size - File size in bytes
 * @property {string} type - MIME type (e.g., 'application/pdf', 'image/jpeg')
 * @property {string} [url] - Storage URL after successful upload
 * @property {string} [uploadedAt] - ISO 8601 timestamp of upload completion
 * @property {string} [uploadedBy] - UUID of user who uploaded the file
 *
 * @example
 * ```typescript
 * const upload: FileUpload = {
 *   name: 'immunization_record.pdf',
 *   size: 245678,
 *   type: 'application/pdf',
 *   url: 'https://storage.example.com/files/abc123.pdf',
 *   uploadedAt: '2025-11-12T10:00:00Z',
 *   uploadedBy: 'user-uuid'
 * };
 * ```
 */
export interface FileUpload {
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

/**
 * Document reference for stored files.
 *
 * Persistent reference to a document stored in the system.
 * Used for attachments, health records, forms, etc.
 *
 * @property {string} id - Unique document identifier
 * @property {string} name - Document filename or title
 * @property {string} type - Document MIME type
 * @property {string} url - Storage URL for accessing the document
 * @property {number} [size] - File size in bytes
 * @property {string} createdAt - ISO 8601 timestamp when document was created
 * @property {string} [createdBy] - UUID of user who created/uploaded the document
 *
 * @example
 * ```typescript
 * const document: DocumentReference = {
 *   id: 'doc-uuid',
 *   name: 'Physical_Exam_Form_2025.pdf',
 *   type: 'application/pdf',
 *   url: 'https://storage.example.com/documents/physical-exam-uuid.pdf',
 *   size: 512000,
 *   createdAt: '2025-08-15T09:30:00Z',
 *   createdBy: 'nurse-user-uuid'
 * };
 * ```
 */
export interface DocumentReference {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  createdAt: string;
  createdBy?: string;
}

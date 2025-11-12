/**
 * Document Request Types Module
 * Request interfaces for document operations
 * Dependencies: enums.ts, core.ts
 */

import { DocumentCategory, DocumentStatus, DocumentAccessLevel } from './enums';

/**
 * Create Document Request
 * Data required to create a new document
 */
export interface CreateDocumentRequest {
  title: string;
  description?: string;
  category: DocumentCategory;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  studentId?: string;
  tags?: string[];
  isTemplate?: boolean;
  templateData?: Record<string, unknown>;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Update Document Request
 * Fields that can be updated on an existing document
 */
export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  status?: DocumentStatus;
  tags?: string[];
  retentionDate?: string;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Sign Document Request
 * Data required to sign a document
 */
export interface SignDocumentRequest {
  documentId: string;
  signedBy: string;
  signedByRole: string;
  signatureData?: string;
  ipAddress?: string;
}

/**
 * Create Document Version Request
 * Data required to create a new version of an existing document
 */
export interface CreateDocumentVersionRequest {
  title?: string;
  description?: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  tags?: string[];
  templateData?: Record<string, unknown>;
}

/**
 * Create from Template Request
 * Data required to create a document from a template
 */
export interface CreateFromTemplateRequest {
  title: string;
  uploadedBy: string;
  studentId?: string;
  templateData?: Record<string, unknown>;
}

/**
 * Share Document Request
 * Data required to share a document with other users
 */
export interface ShareDocumentRequest {
  userIds: string[];
  permissions: string[];
  expiresAt?: string;
  message?: string;
}

/**
 * Export Documents Request
 * Parameters for exporting documents
 */
export interface ExportDocumentsRequest {
  documentIds?: string[];
  filters?: Record<string, unknown>;
  format: 'zip' | 'pdf' | 'csv';
  includeMetadata?: boolean;
}

/**
 * Import Documents Request
 * Parameters for importing documents
 */
export interface ImportDocumentsRequest {
  file: File;
  category?: DocumentCategory;
  tags?: string[];
  accessLevel?: DocumentAccessLevel;
  overwriteExisting?: boolean;
}

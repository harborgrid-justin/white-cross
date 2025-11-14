/**
 * Document Retention and Archiving Types Module
 * Types related to document retention policies and archiving
 * Dependencies: enums.ts, core.ts
 */

import { DocumentCategory } from './enums';

/**
 * Expiring Documents Request
 * Parameters for querying expiring documents
 */
export interface ExpiringDocumentsRequest {
  days?: number;
  categories?: DocumentCategory[];
  includeExpired?: boolean;
}

/**
 * Document Retention Policy
 * Defines retention policy for document categories
 */
export interface DocumentRetentionPolicy {
  category: DocumentCategory;
  retentionYears: number;
  autoArchive: boolean;
  autoDelete: boolean;
  requiresApproval: boolean;
}

/**
 * Archive Documents Request
 * Parameters for archiving documents
 */
export interface ArchiveDocumentsRequest {
  documentIds: string[];
  reason?: string;
  archiveExpired?: boolean;
}

/**
 * Archive Documents Response
 * Result of archive operation
 */
export interface ArchiveDocumentsResponse {
  archived: number;
  failed: number;
  errors?: Array<{
    documentId: string;
    error: string;
  }>;
}

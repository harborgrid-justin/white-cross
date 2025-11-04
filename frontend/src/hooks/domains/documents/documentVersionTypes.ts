/**
 * Documents Domain Version Type Definitions
 *
 * TypeScript interfaces for document version history tracking.
 *
 * @module hooks/domains/documents/documentVersionTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import type { DocumentUser } from './documentTypes';

/**
 * Document version history entry.
 *
 * Tracks historical versions of a document, enabling version control and
 * audit trail for document changes. Each version upload creates a new entry
 * while preserving previous versions.
 *
 * @property id - Unique version identifier
 * @property documentId - Parent document ID
 * @property version - Version number (1, 2, 3, etc.)
 * @property fileName - Filename for this version
 * @property fileSize - File size in bytes for this version
 * @property fileUrl - Authenticated URL to access this version
 * @property changes - Description of changes made in this version
 * @property createdBy - User who uploaded this version
 * @property createdAt - ISO 8601 timestamp of version creation
 * @property isLatest - Whether this is the current latest version
 *
 * @remarks
 * **Version Control:**
 * - Each document upload increments the version number
 * - Previous versions remain accessible for audit/comparison
 * - isLatest flag marks the current version
 * - Changes field documents what was modified
 *
 * **HIPAA Compliance:**
 * - Version history provides audit trail
 * - All version access must be logged
 * - Versions cannot be deleted (only archived)
 *
 * @example
 * ```typescript
 * const version: DocumentVersion = {
 *   id: 'ver-456',
 *   documentId: 'doc-123',
 *   version: 2,
 *   fileName: 'health-assessment-2025-revised.pdf',
 *   fileSize: 248320,
 *   fileUrl: 'https://cdn.example.com/docs/versions/ver-456.pdf',
 *   changes: 'Updated immunization records section',
 *   createdBy: {
 *     id: 'user-nurse-01',
 *     name: 'Jane Smith, RN',
 *     email: 'jane.smith@school.edu'
 *   },
 *   createdAt: '2025-01-16T09:15:00Z',
 *   isLatest: true
 * };
 * ```
 *
 * @see {@link Document} for parent document
 * @see {@link useDocumentVersions} for fetching version history
 */
export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  changes: string;
  createdBy: DocumentUser;
  createdAt: string;
  isLatest: boolean;
}

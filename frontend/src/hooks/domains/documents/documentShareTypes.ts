/**
 * Documents Domain Share Type Definitions
 *
 * TypeScript interfaces for document sharing, share recipients,
 * and share access tracking.
 *
 * @module hooks/domains/documents/documentShareTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import type { Document, DocumentUser } from './documentTypes';

/**
 * Share recipient information and access tracking.
 *
 * Tracks individual recipients of document shares and their access patterns.
 *
 * @property id - Unique recipient identifier
 * @property email - Recipient email address
 * @property name - Optional recipient display name
 * @property accessedAt - ISO 8601 timestamp of last access (if accessed)
 * @property accessCount - Number of times recipient accessed the document
 */
export interface ShareRecipient {
  id: string;
  email: string;
  name?: string;
  accessedAt?: string;
  accessCount: number;
}

/**
 * Document share configuration for external/internal sharing.
 *
 * Defines how a document is shared with others, including access controls,
 * expiration, password protection, and delivery method.
 *
 * @property id - Unique share identifier
 * @property documentId - ID of the shared document
 * @property document - Full document object being shared
 * @property shareType - Sharing method (LINK, EMAIL, INTERNAL)
 * @property shareToken - Optional secure token for link-based sharing
 * @property expiresAt - Optional ISO 8601 timestamp when share expires
 * @property password - Whether share is password-protected (boolean flag)
 * @property allowDownload - Whether recipients can download the document
 * @property allowComments - Whether recipients can comment on the document
 * @property accessCount - Number of times share has been accessed
 * @property maxAccessCount - Optional maximum number of accesses allowed
 * @property recipients - Array of share recipients (for EMAIL/INTERNAL shares)
 * @property createdBy - User who created the share
 * @property createdAt - ISO 8601 timestamp of share creation
 *
 * @remarks
 * **Share Types:**
 * - LINK: Public/authenticated link sharing with optional password
 * - EMAIL: Direct email delivery to specified recipients
 * - INTERNAL: Sharing within organization only
 *
 * **Security:**
 * - Shares can expire automatically
 * - Password protection adds additional security layer
 * - Access count tracking prevents unlimited distribution
 * - All accesses must be audited for PHI documents
 *
 * @example
 * ```typescript
 * const share: DocumentShare = {
 *   id: 'share-789',
 *   documentId: 'doc-123',
 *   document: {...}, // Full document object
 *   shareType: 'EMAIL',
 *   expiresAt: '2025-02-01T00:00:00Z',
 *   password: false,
 *   allowDownload: true,
 *   allowComments: false,
 *   accessCount: 0,
 *   maxAccessCount: 10,
 *   recipients: [
 *     {
 *       id: 'recip-1',
 *       email: 'parent@example.com',
 *       name: 'Parent Name',
 *       accessCount: 0
 *     }
 *   ],
 *   createdBy: {
 *     id: 'user-nurse-01',
 *     name: 'Jane Smith, RN',
 *     email: 'jane.smith@school.edu'
 *   },
 *   createdAt: '2025-01-15T10:00:00Z'
 * };
 * ```
 *
 * @see {@link ShareRecipient} for recipient structure
 * @see {@link useCreateShare} for creating shares
 */
export interface DocumentShare {
  id: string;
  documentId: string;
  document: Document;
  shareType: 'LINK' | 'EMAIL' | 'INTERNAL';
  shareToken?: string;
  expiresAt?: string;
  password?: boolean;
  allowDownload: boolean;
  allowComments: boolean;
  accessCount: number;
  maxAccessCount?: number;
  recipients: ShareRecipient[];
  createdBy: DocumentUser;
  createdAt: string;
}

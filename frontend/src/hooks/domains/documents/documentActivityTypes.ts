/**
 * Documents Domain Activity and Comment Type Definitions
 *
 * TypeScript interfaces for document activity logs, comments,
 * and collaboration features.
 *
 * @module hooks/domains/documents/documentActivityTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import type { DocumentUser } from './documentTypes';

/**
 * Document activity log entry for audit trail.
 *
 * Tracks all actions performed on a document for compliance and security auditing.
 * Essential for HIPAA compliance when documents contain PHI.
 *
 * @property id - Unique activity entry identifier
 * @property documentId - ID of the document this activity relates to
 * @property action - Type of action performed (CREATED, UPDATED, VIEWED, DOWNLOADED, SHARED, COMMENTED, DELETED)
 * @property userId - ID of user who performed the action
 * @property user - Full user object who performed the action
 * @property details - Optional human-readable description of the action
 * @property metadata - Optional structured data about the action (e.g., IP address, device)
 * @property timestamp - ISO 8601 timestamp when action occurred
 *
 * @remarks
 * **HIPAA Compliance:**
 * - All PHI document access MUST be logged
 * - Audit logs retained for compliance period (typically 6 years)
 * - Logs must include who, what, when, and from where
 * - Access logs cannot be modified or deleted
 *
 * **Activity Types:**
 * - CREATED: Document first uploaded
 * - UPDATED: Document metadata or file modified
 * - VIEWED: Document accessed/viewed
 * - DOWNLOADED: Document file downloaded
 * - SHARED: Document shared with others
 * - COMMENTED: Comment added to document
 * - DELETED: Document deleted/archived
 *
 * @example
 * ```typescript
 * const activity: DocumentActivity = {
 *   id: 'act-456',
 *   documentId: 'doc-123',
 *   action: 'VIEWED',
 *   userId: 'user-nurse-02',
 *   user: {
 *     id: 'user-nurse-02',
 *     name: 'Sarah Johnson, RN',
 *     email: 'sarah.johnson@school.edu'
 *   },
 *   details: 'Viewed student health assessment',
 *   metadata: {
 *     ipAddress: '192.168.1.100',
 *     userAgent: 'Mozilla/5.0...',
 *     location: 'School Nurse Office'
 *   },
 *   timestamp: '2025-01-15T14:35:00Z'
 * };
 * ```
 *
 * @see {@link useDocumentActivity} for fetching activity history
 */
export interface DocumentActivity {
  id: string;
  documentId: string;
  action: 'CREATED' | 'UPDATED' | 'VIEWED' | 'DOWNLOADED' | 'SHARED' | 'COMMENTED' | 'DELETED';
  userId: string;
  user: DocumentUser;
  details?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

/**
 * Position coordinates for document annotations.
 *
 * Defines the visual position and dimensions of a comment annotation
 * on a document page.
 *
 * @property x - Horizontal position (pixels from left)
 * @property y - Vertical position (pixels from top)
 * @property width - Optional annotation width in pixels
 * @property height - Optional annotation height in pixels
 */
export interface CommentPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

/**
 * Document comment for collaboration and annotation.
 *
 * Enables users to add comments to documents for collaboration, review feedback,
 * and discussion. Supports threaded replies and position-based annotations.
 *
 * @property id - Unique comment identifier
 * @property documentId - ID of the document being commented on
 * @property content - Comment text content
 * @property page - Optional page number for PDF annotations
 * @property position - Optional position coordinates for visual annotations
 * @property parentId - Optional parent comment ID for threaded replies
 * @property replies - Array of nested reply comments
 * @property author - User who authored the comment
 * @property createdAt - ISO 8601 timestamp of comment creation
 * @property updatedAt - ISO 8601 timestamp of last comment update
 * @property isResolved - Whether comment/thread has been resolved
 *
 * @remarks
 * **Comment Features:**
 * - Threaded replies for discussions
 * - Position-based annotations on documents
 * - Page-specific comments for PDFs
 * - Resolvable comments for review workflows
 *
 * **Use Cases:**
 * - Document review and approval workflows
 * - Collaborative editing feedback
 * - Quality assurance annotations
 * - Training and education notes
 *
 * @example
 * ```typescript
 * const comment: DocumentComment = {
 *   id: 'cmt-789',
 *   documentId: 'doc-123',
 *   content: 'Please verify the immunization dates in section 3',
 *   page: 2,
 *   position: { x: 100, y: 200, width: 150, height: 50 },
 *   parentId: undefined,
 *   replies: [],
 *   author: {
 *     id: 'user-admin-01',
 *     name: 'Admin User',
 *     email: 'admin@school.edu'
 *   },
 *   createdAt: '2025-01-15T11:00:00Z',
 *   updatedAt: '2025-01-15T11:00:00Z',
 *   isResolved: false
 * };
 * ```
 *
 * @see {@link CommentPosition} for annotation position structure
 * @see {@link useDocumentComments} for fetching comments
 * @see {@link useCreateComment} for adding comments
 */
export interface DocumentComment {
  id: string;
  documentId: string;
  content: string;
  page?: number;
  position?: CommentPosition;
  parentId?: string;
  replies: DocumentComment[];
  author: DocumentUser;
  createdAt: string;
  updatedAt: string;
  isResolved: boolean;
}

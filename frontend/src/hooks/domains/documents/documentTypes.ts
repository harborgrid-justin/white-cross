/**
 * Documents Domain Core Type Definitions
 *
 * TypeScript interfaces for core document entities: Document, DocumentCategory,
 * DocumentMetadata, DocumentPermission, and DocumentUser.
 *
 * @module hooks/domains/documents/documentTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * User information embedded in document-related entities.
 *
 * Simplified user representation for document creators, editors, and collaborators.
 * Used in Document, Permission, Activity, Comment, and Share entities.
 *
 * @property id - Unique user identifier
 * @property name - User's full display name
 * @property email - User's email address
 * @property avatar - Optional URL to user's avatar image
 *
 * @example
 * ```typescript
 * const user: DocumentUser = {
 *   id: 'user-nurse-01',
 *   name: 'Jane Smith, RN',
 *   email: 'jane.smith@school.edu',
 *   avatar: 'https://cdn.example.com/avatars/jane-smith.jpg'
 * };
 * ```
 */
export interface DocumentUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Document category for hierarchical organization and classification.
 *
 * Defines organizational structure for documents. Supports nested categories
 * for hierarchical classification (e.g., Health Records → Immunizations).
 *
 * @property id - Unique category identifier
 * @property name - Category display name
 * @property description - Optional category description
 * @property parentId - Parent category ID for nested structure (null for root)
 * @property color - Hex color code for UI display (e.g., '#007bff')
 * @property icon - Icon identifier for UI rendering
 * @property path - Full hierarchical path (e.g., '/health-records/immunizations')
 * @property isActive - Whether category is currently active/visible
 *
 * @example
 * ```typescript
 * const category: DocumentCategory = {
 *   id: 'cat-immunizations',
 *   name: 'Immunization Records',
 *   description: 'Student vaccination records and certificates',
 *   parentId: 'cat-health',
 *   color: '#28a745',
 *   icon: 'syringe',
 *   path: '/health-records/immunizations',
 *   isActive: true
 * };
 * ```
 */
export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
  path: string;
  isActive: boolean;
}

/**
 * Document metadata containing additional information about the document.
 *
 * Stores document-specific metadata such as page count, language, author information,
 * and custom fields for healthcare-specific data.
 *
 * @property pageCount - Number of pages in document (for PDFs, images)
 * @property wordCount - Number of words (for text documents)
 * @property language - Document language code (ISO 639-1, e.g., 'en', 'es')
 * @property author - Document author name (from file metadata)
 * @property subject - Document subject/topic
 * @property keywords - Array of keywords from document metadata
 * @property customFields - Flexible object for healthcare-specific custom data
 *
 * @example
 * ```typescript
 * const metadata: DocumentMetadata = {
 *   pageCount: 5,
 *   language: 'en',
 *   keywords: ['immunization', 'vaccine', 'covid-19'],
 *   customFields: {
 *     studentId: '12345',
 *     vaccineType: 'COVID-19',
 *     administeredDate: '2025-01-15',
 *     lotNumber: 'ABC123'
 *   }
 * };
 * ```
 */
export interface DocumentMetadata {
  pageCount?: number;
  wordCount?: number;
  language?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  customFields: Record<string, any>;
}

/**
 * Document permission defining user access rights.
 *
 * Granular permission control for document access. Defines what actions
 * a specific user can perform on a document (view, edit, delete, share).
 *
 * @property userId - User ID granted this permission
 * @property user - Full user object with contact information
 * @property role - Permission role level (VIEWER, EDITOR, OWNER, ADMIN)
 * @property canView - Whether user can view the document
 * @property canEdit - Whether user can modify the document
 * @property canDelete - Whether user can delete the document
 * @property canShare - Whether user can share the document with others
 * @property grantedAt - ISO 8601 timestamp when permission was granted
 * @property grantedBy - User ID who granted this permission
 *
 * @remarks
 * **HIPAA Compliance:**
 * - All permission grants must be audited
 * - Minimum necessary principle applies
 * - Regular permission reviews required
 *
 * @example
 * ```typescript
 * const permission: DocumentPermission = {
 *   userId: 'user-nurse-02',
 *   user: {
 *     id: 'user-nurse-02',
 *     name: 'Sarah Johnson, RN',
 *     email: 'sarah.johnson@school.edu'
 *   },
 *   role: 'EDITOR',
 *   canView: true,
 *   canEdit: true,
 *   canDelete: false,
 *   canShare: false,
 *   grantedAt: '2025-01-15T10:00:00Z',
 *   grantedBy: 'user-admin-01'
 * };
 * ```
 */
export interface DocumentPermission {
  userId: string;
  user: DocumentUser;
  role: 'VIEWER' | 'EDITOR' | 'OWNER' | 'ADMIN';
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  grantedAt: string;
  grantedBy: string;
}

/**
 * Document entity representing a healthcare-related file or record.
 *
 * Core type for document management system. Represents uploaded files, scanned
 * documents, generated reports, and digital records. Includes metadata, permissions,
 * versioning, and audit information.
 *
 * @property id - Unique document identifier (UUID)
 * @property title - Human-readable document title
 * @property description - Optional detailed description of document content
 * @property fileName - Original filename of uploaded document
 * @property fileSize - File size in bytes
 * @property mimeType - MIME type (e.g., 'application/pdf', 'image/jpeg')
 * @property fileUrl - URL to access the document file (authenticated)
 * @property thumbnailUrl - Optional URL to document thumbnail/preview
 * @property category - Document category for organization
 * @property tags - Array of searchable tags for classification
 * @property status - Document lifecycle status (DRAFT → REVIEW → APPROVED → PUBLISHED → ARCHIVED)
 * @property visibility - Access visibility level (PRIVATE, INTERNAL, PUBLIC)
 * @property version - Current version number (increments with each version upload)
 * @property isLatestVersion - Whether this is the most recent version
 * @property metadata - Additional document metadata (page count, keywords, custom fields)
 * @property permissions - Array of user permissions for this document
 * @property createdBy - User who created/uploaded the document
 * @property updatedBy - User who last modified the document
 * @property createdAt - ISO 8601 timestamp of creation
 * @property updatedAt - ISO 8601 timestamp of last update
 * @property publishedAt - ISO 8601 timestamp of publication (if PUBLISHED status)
 * @property expiresAt - Optional expiration date for temporary documents
 *
 * @remarks
 * **PHI Handling:**
 * - Documents may contain Protected Health Information (PHI)
 * - All access must be audited via DocumentActivity tracking
 * - File URLs must be authenticated and time-limited
 * - Thumbnails must not reveal PHI in preview
 *
 * **Version Control:**
 * - version field tracks the document version number
 * - isLatestVersion indicates if this is the current version
 * - Historical versions accessible via DocumentVersion entity
 * - Each version upload creates audit trail entry
 *
 * **Status Workflow:**
 * - DRAFT: Initial upload, editable
 * - REVIEW: Submitted for review, restricted editing
 * - APPROVED: Reviewed and approved, read-only
 * - PUBLISHED: Published to intended audience
 * - ARCHIVED: Retained for compliance, read-only
 *
 * @example
 * ```typescript
 * const document: Document = {
 *   id: 'doc-12345',
 *   title: 'Student Health Assessment - John Doe',
 *   description: 'Annual health screening results',
 *   fileName: 'health-assessment-2025.pdf',
 *   fileSize: 245760,
 *   mimeType: 'application/pdf',
 *   fileUrl: 'https://cdn.example.com/docs/health-assessment-2025.pdf',
 *   thumbnailUrl: 'https://cdn.example.com/thumbs/health-assessment-2025.jpg',
 *   category: {
 *     id: 'cat-health',
 *     name: 'Health Records',
 *     path: '/health-records',
 *     isActive: true
 *   },
 *   tags: ['health-screening', 'annual', 'student-12345'],
 *   status: 'PUBLISHED',
 *   visibility: 'INTERNAL',
 *   version: 1,
 *   isLatestVersion: true,
 *   metadata: {
 *     pageCount: 3,
 *     customFields: {
 *       studentId: '12345',
 *       assessmentDate: '2025-01-15'
 *     }
 *   },
 *   permissions: [],
 *   createdBy: {
 *     id: 'user-nurse-01',
 *     name: 'Jane Smith, RN',
 *     email: 'jane.smith@school.edu'
 *   },
 *   createdAt: '2025-01-15T14:30:00Z',
 *   updatedAt: '2025-01-15T14:30:00Z'
 * };
 * ```
 *
 * @see {@link DocumentVersion} for version history tracking
 * @see {@link DocumentActivity} for audit trail
 * @see {@link DocumentPermission} for access control
 */
export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  category: DocumentCategory;
  tags: string[];
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  visibility: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  version: number;
  isLatestVersion: boolean;
  metadata: DocumentMetadata;
  permissions: DocumentPermission[];
  createdBy: DocumentUser;
  updatedBy?: DocumentUser;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
}

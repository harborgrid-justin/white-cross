/**
 * Documents Domain Configuration
 *
 * Query keys, cache settings, TypeScript interfaces, and utility functions
 * for document management hooks. Supports document CRUD, versioning, sharing,
 * templates, categories, comments, and activity tracking.
 *
 * @module hooks/domains/documents/config
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query keys for Documents domain TanStack Query operations.
 *
 * Provides a structured, hierarchical approach to cache key management for all
 * document-related queries. Keys are organized by entity type (documents, categories,
 * templates, shares) and operation (list, detail, versions).
 *
 * @remarks
 * - Uses const assertions for type safety and autocompletion
 * - Supports hierarchical cache invalidation (invalidate all documents, specific document, etc.)
 * - Keys include filters/parameters as part of cache identity for granular control
 * - Enables precise query matching and selective invalidation
 * - Essential for optimistic updates and cache synchronization
 *
 * @example
 * ```typescript
 * // Fetch all documents with filters
 * useQuery({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documentsList({ status: 'PUBLISHED' }),
 *   queryFn: () => fetchDocuments({ status: 'PUBLISHED' })
 * });
 *
 * // Invalidate all document-related queries
 * queryClient.invalidateQueries({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documents
 * });
 *
 * // Invalidate specific document details
 * queryClient.invalidateQueries({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documentDetails('doc-123')
 * });
 *
 * // Invalidate all categories
 * queryClient.invalidateQueries({
 *   queryKey: DOCUMENTS_QUERY_KEYS.categories
 * });
 * ```
 *
 * @see {@link invalidateDocumentQueries} for bulk invalidation utilities
 */
export const DOCUMENTS_QUERY_KEYS = {
  // Documents
  documents: ['documents'] as const,
  documentsList: (filters?: any) => [...DOCUMENTS_QUERY_KEYS.documents, 'list', filters] as const,
  documentDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.documents, 'detail', id] as const,
  documentVersions: (docId: string) => [...DOCUMENTS_QUERY_KEYS.documents, docId, 'versions'] as const,
  
  // Categories
  categories: ['documents', 'categories'] as const,
  categoriesList: (filters?: any) => [...DOCUMENTS_QUERY_KEYS.categories, 'list', filters] as const,
  categoryDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.categories, 'detail', id] as const,
  
  // Templates
  templates: ['documents', 'templates'] as const,
  templatesList: (filters?: any) => [...DOCUMENTS_QUERY_KEYS.templates, 'list', filters] as const,
  templateDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.templates, 'detail', id] as const,
  
  // Shares
  shares: ['documents', 'shares'] as const,
  sharesList: (docId?: string) => [...DOCUMENTS_QUERY_KEYS.shares, 'list', docId] as const,
  shareDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.shares, 'detail', id] as const,
} as const;

/**
 * Cache configuration for Documents domain TanStack Query operations.
 *
 * Defines staleTime and cacheTime (garbage collection time) for different types
 * of document data to balance performance and data freshness. Healthcare documents
 * often contain PHI, so cache times are configured to ensure timely updates while
 * minimizing unnecessary API calls.
 *
 * @remarks
 * - **staleTime**: How long data is considered fresh before automatic refetch
 * - **cacheTime**: How long unused data remains in cache before garbage collection
 * - Documents: 10min staleTime (moderate freshness for active documents)
 * - Categories: 30min staleTime (rarely change)
 * - Templates: 15min staleTime (static structure, occasional updates)
 * - Default: 5min staleTime (for activity, comments, analytics)
 * - PHI-containing documents should use shorter staleTime in production
 *
 * @example
 * ```typescript
 * // Used in query hooks
 * useQuery({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documentsList(),
 *   queryFn: fetchDocuments,
 *   staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME, // 10 minutes
 * });
 *
 * // Override for PHI-sensitive documents
 * useQuery({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(id),
 *   queryFn: () => fetchDocument(id),
 *   staleTime: 0, // Always fetch fresh for PHI documents
 * });
 * ```
 *
 * @see {@link DOCUMENTS_QUERY_KEYS} for related query key structure
 */
export const DOCUMENTS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  DOCUMENTS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  CATEGORIES_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  TEMPLATES_STALE_TIME: 15 * 60 * 1000, // 15 minutes
} as const;

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

/**
 * Document template for creating standardized documents.
 *
 * Defines reusable templates with predefined structure and fillable fields.
 * Used for generating consistent healthcare forms, reports, and records.
 *
 * @property id - Unique template identifier
 * @property name - Template display name
 * @property description - Optional template description and usage notes
 * @property category - Template category (forms, reports, letters, etc.)
 * @property templateUrl - URL to the template file (PDF, DOCX, etc.)
 * @property thumbnailUrl - Optional preview thumbnail URL
 * @property fields - Array of fillable template fields with validation
 * @property isPublic - Whether template is available to all users
 * @property usageCount - Number of times template has been used
 * @property createdBy - User who created the template
 * @property createdAt - ISO 8601 timestamp of template creation
 * @property updatedAt - ISO 8601 timestamp of last template update
 *
 * @remarks
 * **Template Fields:**
 * - Each field defines a fillable area in the template
 * - Supports text, number, date, boolean, select, textarea types
 * - Required fields must be completed before document generation
 * - Validation rules ensure data quality
 *
 * **Usage:**
 * - Templates standardize document creation
 * - Fields are populated with student/health data
 * - Generated documents follow consistent format
 *
 * @example
 * ```typescript
 * const template: DocumentTemplate = {
 *   id: 'tmpl-health-assessment',
 *   name: 'Annual Health Assessment Form',
 *   description: 'Standard form for annual student health screenings',
 *   category: 'health-forms',
 *   templateUrl: 'https://cdn.example.com/templates/health-assessment.pdf',
 *   thumbnailUrl: 'https://cdn.example.com/templates/thumbs/health-assessment.jpg',
 *   fields: [
 *     {
 *       id: 'student-name',
 *       name: 'studentName',
 *       label: 'Student Name',
 *       type: 'text',
 *       required: true,
 *       validation: { minLength: 2, maxLength: 100 }
 *     },
 *     {
 *       id: 'assessment-date',
 *       name: 'assessmentDate',
 *       label: 'Assessment Date',
 *       type: 'date',
 *       required: true
 *     }
 *   ],
 *   isPublic: true,
 *   usageCount: 145,
 *   createdBy: {
 *     id: 'user-admin-01',
 *     name: 'Admin User',
 *     email: 'admin@school.edu'
 *   },
 *   createdAt: '2024-09-01T00:00:00Z',
 *   updatedAt: '2025-01-01T00:00:00Z'
 * };
 * ```
 *
 * @see {@link TemplateField} for field definition structure
 * @see {@link useCreateFromTemplate} for generating documents from templates
 */
export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  templateUrl: string;
  thumbnailUrl?: string;
  fields: TemplateField[];
  isPublic: boolean;
  usageCount: number;
  createdBy: DocumentUser;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fillable field definition within a document template.
 *
 * Defines a single fillable field in a template, including its type,
 * validation rules, and default value.
 *
 * @property id - Unique field identifier within template
 * @property name - Field programmatic name (used in data mapping)
 * @property label - Human-readable field label for forms
 * @property type - Field data type (text, number, date, boolean, select, textarea)
 * @property required - Whether field must be filled before document generation
 * @property defaultValue - Optional default value for the field
 * @property options - Array of options for 'select' type fields
 * @property validation - Optional validation rules for field input
 *
 * @see {@link FieldValidation} for validation rule structure
 * @see {@link DocumentTemplate} for template structure
 */
export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: FieldValidation;
}

/**
 * Validation rules for template field input.
 *
 * Defines constraints for template field values to ensure data quality
 * and consistency across generated documents.
 *
 * @property minLength - Minimum string length for text fields
 * @property maxLength - Maximum string length for text fields
 * @property min - Minimum value for number fields
 * @property max - Maximum value for number fields
 * @property pattern - Regular expression pattern for validation
 */
export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
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
 * Invalidates all document-related queries in the cache.
 *
 * Utility function to invalidate all queries under the 'documents' key,
 * triggering refetch for any active queries. Use when you need to refresh
 * all document data after batch operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates ALL documents domain queries (documents, categories, templates, shares)
 * - More aggressive than invalidateDocumentQueries - use sparingly
 * - Triggers refetch for all active queries
 * - Use after system-wide changes or bulk operations
 *
 * @example
 * ```typescript
 * // After bulk document import
 * const importDocuments = async (files: File[]) => {
 *   await Promise.all(files.map(uploadDocument));
 *   invalidateDocumentsQueries(queryClient);
 * };
 * ```
 *
 * @see {@link invalidateDocumentQueries} for more targeted invalidation
 */
export const invalidateDocumentsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['documents'] });
};

/**
 * Invalidates document-specific queries in the cache.
 *
 * Invalidates all queries related to documents (lists, details, versions)
 * but not categories, templates, or shares. Use after document CRUD operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates documents lists, details, versions, activity, comments
 * - Does NOT invalidate categories, templates, or shares
 * - Efficient for most document mutations
 * - Automatically called by document mutation hooks
 *
 * @example
 * ```typescript
 * // After creating a document
 * const { mutate } = useCreateDocument({
 *   onSuccess: () => {
 *     invalidateDocumentQueries(queryClient);
 *     toast.success('Document uploaded successfully');
 *   }
 * });
 * ```
 *
 * @see {@link DOCUMENTS_QUERY_KEYS} for query key structure
 */
export const invalidateDocumentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documents });
};

/**
 * Invalidates document category queries in the cache.
 *
 * Invalidates all category-related queries (lists, details, category documents).
 * Use after category CRUD operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates categories lists, details, and category document lists
 * - Use after creating, updating, or deleting categories
 * - Does not affect document queries directly
 *
 * @example
 * ```typescript
 * // After creating a category
 * const { mutate } = useCreateCategory({
 *   onSuccess: () => {
 *     invalidateCategoryQueries(queryClient);
 *   }
 * });
 * ```
 */
export const invalidateCategoryQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.categories });
};

/**
 * Invalidates document template queries in the cache.
 *
 * Invalidates all template-related queries (lists, details, popular templates).
 * Use after template CRUD operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates templates lists, details, and popular templates
 * - Use after creating, updating, or deleting templates
 * - Does not affect document or category queries
 *
 * @example
 * ```typescript
 * // After creating a template
 * const { mutate } = useCreateTemplate({
 *   onSuccess: () => {
 *     invalidateTemplateQueries(queryClient);
 *   }
 * });
 * ```
 */
export const invalidateTemplateQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.templates });
};

/**
 * Invalidates document share queries in the cache.
 *
 * Invalidates all share-related queries (lists, details, share tokens).
 * Use after share CRUD operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates shares lists, details, and token-based shares
 * - Use after creating, updating, or deleting shares
 * - Does not affect document queries directly
 *
 * @example
 * ```typescript
 * // After creating a share
 * const { mutate } = useCreateShare({
 *   onSuccess: () => {
 *     invalidateShareQueries(queryClient);
 *   }
 * });
 * ```
 */
export const invalidateShareQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.shares });
};

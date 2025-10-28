/**
 * @fileoverview Document service type definitions for enterprise-grade healthcare document management.
 *
 * Provides comprehensive TypeScript interfaces and types for document lifecycle management,
 * including creation, updates, signatures, versioning, sharing, and compliance tracking.
 * Supports HIPAA-compliant document storage, retention policies, digital signatures,
 * and audit trails.
 *
 * LOC: D6A44FD802-T
 * WC-GEN-249 | types.ts - Document service type definitions
 *
 * UPSTREAM (imports from):
 *   - database/types/enums.ts - Document enumerations (category, status, access levels)
 *
 * DOWNSTREAM (imported by):
 *   - documentService.ts - Main document orchestration service
 *   - crud.operations.ts - Document CRUD operations
 *   - signature.operations.ts - Digital signature workflows
 *   - version.operations.ts - Version control operations
 *   - All other document service modules
 *
 * Key Features:
 * - HIPAA-compliant document metadata
 * - Digital signature support with verification
 * - Document retention and lifecycle management
 * - Comprehensive audit trail tracking
 * - Template-based document generation
 * - Multi-level access control
 *
 * @module services/document/types
 * @since 1.0.0
 */

import { DocumentCategory, DocumentStatus, DocumentAccessLevel } from '../../database/types/enums';

/**
 * Data required to create a new document in the system.
 *
 * Supports both regular documents and templates with comprehensive metadata
 * for healthcare compliance, retention policies, and access control.
 *
 * @interface CreateDocumentData
 * @property {string} title - Human-readable document title (required, max 255 chars)
 * @property {string} [description] - Detailed document description or purpose
 * @property {DocumentCategory} category - Document category (medical, consent, immunization, etc.)
 * @property {string} fileType - MIME type (e.g., 'application/pdf', 'image/jpeg')
 * @property {string} fileName - Original filename with extension
 * @property {number} fileSize - File size in bytes (used for storage quota tracking)
 * @property {string} fileUrl - Storage URL or S3 key for document retrieval
 * @property {string} uploadedBy - User ID of the uploader (for audit trail)
 * @property {string} [studentId] - Optional student ID for student-specific documents
 * @property {string[]} [tags] - Optional searchable tags for categorization
 * @property {boolean} [isTemplate] - Flag indicating if this is a reusable template
 * @property {any} [templateData] - Template configuration data (merge fields, placeholders)
 * @property {DocumentAccessLevel} [accessLevel] - Access control level (defaults to PRIVATE)
 *
 * @example
 * ```typescript
 * const newDocument: CreateDocumentData = {
 *   title: 'Student Health Assessment Form',
 *   description: 'Annual health screening documentation',
 *   category: DocumentCategory.HEALTH_RECORD,
 *   fileType: 'application/pdf',
 *   fileName: 'health_assessment_2025.pdf',
 *   fileSize: 245760,
 *   fileUrl: 's3://documents/students/12345/health_assessment_2025.pdf',
 *   uploadedBy: 'nurse_001',
 *   studentId: 'student_12345',
 *   tags: ['health', 'annual', 'screening'],
 *   accessLevel: DocumentAccessLevel.RESTRICTED
 * };
 * ```
 */
export interface CreateDocumentData {
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
  templateData?: any;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Data for updating an existing document's metadata.
 *
 * All fields are optional to support partial updates. Changes are tracked
 * in the audit trail for compliance. Status changes may trigger retention
 * policy calculations.
 *
 * @interface UpdateDocumentData
 * @property {string} [title] - Updated document title
 * @property {string} [description] - Updated description or purpose
 * @property {DocumentStatus} [status] - New document status (DRAFT, ACTIVE, ARCHIVED, etc.)
 * @property {string[]} [tags] - Updated searchable tags (replaces existing tags)
 * @property {Date} [retentionDate] - Document retention/destruction date per policy
 * @property {DocumentAccessLevel} [accessLevel] - Updated access control level
 *
 * @example
 * ```typescript
 * const updates: UpdateDocumentData = {
 *   status: DocumentStatus.ARCHIVED,
 *   retentionDate: new Date('2032-12-31'),
 *   tags: ['archived', 'health', '2025']
 * };
 * ```
 */
export interface UpdateDocumentData {
  title?: string;
  description?: string;
  status?: DocumentStatus;
  tags?: string[];
  retentionDate?: Date;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Filters for searching and retrieving documents.
 *
 * Supports multi-criteria filtering for efficient document discovery.
 * All filters are combined with AND logic. Empty filters return all documents.
 *
 * @interface DocumentFilters
 * @property {DocumentCategory} [category] - Filter by document category
 * @property {DocumentStatus} [status] - Filter by current document status
 * @property {string} [studentId] - Filter documents for specific student
 * @property {string} [uploadedBy] - Filter by uploader user ID
 * @property {string} [searchTerm] - Full-text search in title and description
 * @property {string[]} [tags] - Filter by tags (documents matching ANY tag)
 *
 * @example
 * ```typescript
 * const filters: DocumentFilters = {
 *   category: DocumentCategory.CONSENT_FORM,
 *   status: DocumentStatus.ACTIVE,
 *   studentId: 'student_12345',
 *   tags: ['2025', 'medical']
 * };
 * ```
 */
export interface DocumentFilters {
  category?: DocumentCategory;
  status?: DocumentStatus;
  studentId?: string;
  uploadedBy?: string;
  searchTerm?: string;
  tags?: string[];
}

/**
 * Data required to digitally sign a document.
 *
 * Captures signature metadata for legal compliance, including signer identity,
 * role, timestamp, and optional digital signature data. IP address is captured
 * for audit purposes.
 *
 * @interface SignDocumentData
 * @property {string} documentId - ID of document being signed
 * @property {string} signedBy - User ID of the signer
 * @property {string} signedByRole - Role of signer (e.g., 'school_nurse', 'parent', 'administrator')
 * @property {string} [signatureData] - Optional base64-encoded signature image or cryptographic signature
 * @property {string} [ipAddress] - IP address of signer for audit trail
 *
 * @example
 * ```typescript
 * const signatureData: SignDocumentData = {
 *   documentId: 'doc_123',
 *   signedBy: 'user_456',
 *   signedByRole: 'school_nurse',
 *   signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
 *   ipAddress: '192.168.1.100'
 * };
 * ```
 */
export interface SignDocumentData {
  documentId: string;
  signedBy: string;
  signedByRole: string;
  signatureData?: string;
  ipAddress?: string;
}

/**
 * Data for creating a new document from an existing template.
 *
 * Templates provide pre-configured document structures with merge fields
 * that are populated with templateData during creation.
 *
 * @interface CreateFromTemplateData
 * @property {string} title - Title for the new document instance
 * @property {string} uploadedBy - User ID creating the document from template
 * @property {string} [studentId] - Optional student ID for student-specific documents
 * @property {any} [templateData] - Data to populate template merge fields (e.g., student name, dates)
 *
 * @example
 * ```typescript
 * const templateInstance: CreateFromTemplateData = {
 *   title: 'Medical Consent - John Doe',
 *   uploadedBy: 'nurse_001',
 *   studentId: 'student_12345',
 *   templateData: {
 *     studentName: 'John Doe',
 *     parentName: 'Jane Doe',
 *     consentDate: '2025-10-25'
 *   }
 * };
 * ```
 */
export interface CreateFromTemplateData {
  title: string;
  uploadedBy: string;
  studentId?: string;
  templateData?: any;
}

/**
 * Pagination metadata for document list responses.
 *
 * Provides page navigation information for large document sets.
 * Used in conjunction with DocumentListResponse for efficient data retrieval.
 *
 * @interface PaginationInfo
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Maximum documents per page
 * @property {number} total - Total number of documents matching filters
 * @property {number} pages - Total number of pages available
 *
 * @example
 * ```typescript
 * const pagination: PaginationInfo = {
 *   page: 2,
 *   limit: 25,
 *   total: 150,
 *   pages: 6
 * };
 * ```
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Response structure for paginated document list queries.
 *
 * Combines document data with pagination metadata for efficient
 * client-side rendering and navigation.
 *
 * @interface DocumentListResponse
 * @property {any[]} documents - Array of document objects matching query
 * @property {PaginationInfo} pagination - Pagination metadata
 *
 * @example
 * ```typescript
 * const response: DocumentListResponse = {
 *   documents: [{ id: '1', title: 'Doc 1' }, { id: '2', title: 'Doc 2' }],
 *   pagination: { page: 1, limit: 25, total: 50, pages: 2 }
 * };
 * ```
 */
export interface DocumentListResponse {
  documents: any[];
  pagination: PaginationInfo;
}

/**
 * Result of a document sharing operation.
 *
 * Indicates success status and lists user IDs with whom the document
 * has been shared. Used for access control and collaboration features.
 *
 * @interface ShareDocumentResult
 * @property {boolean} success - Whether sharing operation completed successfully
 * @property {string[]} sharedWith - Array of user IDs who now have access to the document
 *
 * @example
 * ```typescript
 * const shareResult: ShareDocumentResult = {
 *   success: true,
 *   sharedWith: ['nurse_002', 'admin_001', 'doctor_005']
 * };
 * ```
 */
export interface ShareDocumentResult {
  success: boolean;
  sharedWith: string[];
}

/**
 * Result of a bulk document deletion operation.
 *
 * Provides statistics on deletion success, including number of documents
 * deleted and number not found. Used for batch cleanup operations.
 *
 * @interface BulkDeleteResult
 * @property {number} deleted - Number of documents successfully deleted
 * @property {number} notFound - Number of document IDs not found in database
 * @property {boolean} success - Overall operation success (true if at least one deleted)
 *
 * @example
 * ```typescript
 * const bulkResult: BulkDeleteResult = {
 *   deleted: 45,
 *   notFound: 5,
 *   success: true
 * };
 * ```
 */
export interface BulkDeleteResult {
  deleted: number;
  notFound: number;
  success: boolean;
}

/**
 * Comprehensive statistics for document analytics and reporting.
 *
 * Provides aggregate metrics on document counts, categorization,
 * status distribution, storage usage, and recent activity.
 *
 * @interface DocumentStatistics
 * @property {number} total - Total number of documents in system
 * @property {Array<{category: string, count: number}>} byCategory - Document counts grouped by category
 * @property {Array<{status: string, count: number}>} byStatus - Document counts grouped by status
 * @property {number} totalSize - Total storage size in bytes for all documents
 * @property {number} recentDocuments - Number of documents created in last 30 days
 *
 * @example
 * ```typescript
 * const stats: DocumentStatistics = {
 *   total: 1250,
 *   byCategory: [
 *     { category: 'HEALTH_RECORD', count: 450 },
 *     { category: 'CONSENT_FORM', count: 300 }
 *   ],
 *   byStatus: [
 *     { status: 'ACTIVE', count: 1000 },
 *     { status: 'ARCHIVED', count: 250 }
 *   ],
 *   totalSize: 524288000, // ~500 MB
 *   recentDocuments: 85
 * };
 * ```
 */
export interface DocumentStatistics {
  total: number;
  byCategory: Array<{
    category: string;
    count: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  totalSize: number;
  recentDocuments: number;
}

/**
 * Metadata for document categories with compliance requirements.
 *
 * Defines category-specific rules including signature requirements
 * and retention policies per healthcare regulations.
 *
 * @interface DocumentCategoryMetadata
 * @property {DocumentCategory} value - Enumeration value for the category
 * @property {string} label - Human-readable category label
 * @property {string} description - Detailed category description
 * @property {boolean} requiresSignature - Whether documents in this category require digital signature
 * @property {number} retentionYears - Number of years to retain documents per compliance policy
 * @property {number} [documentCount] - Optional count of documents in this category
 *
 * @example
 * ```typescript
 * const categoryMeta: DocumentCategoryMetadata = {
 *   value: DocumentCategory.IMMUNIZATION_RECORD,
 *   label: 'Immunization Records',
 *   description: 'Student immunization history and vaccination certificates',
 *   requiresSignature: true,
 *   retentionYears: 7,
 *   documentCount: 342
 * };
 * ```
 */
export interface DocumentCategoryMetadata {
  value: DocumentCategory;
  label: string;
  description: string;
  requiresSignature: boolean;
  retentionYears: number;
  documentCount?: number;
}

/**
 * Digital signature metadata for document verification.
 *
 * Captures complete signature information including signer identity,
 * timestamp, signature type, and verification status. Used for legal
 * compliance and audit trails.
 *
 * @interface DocumentSignature
 * @property {string} id - Unique signature record ID
 * @property {string} documentId - ID of signed document
 * @property {string} signerId - User ID of the signer
 * @property {string} signerName - Full name of signer for display
 * @property {Date} signedAt - Timestamp when signature was applied
 * @property {'DIGITAL' | 'ELECTRONIC' | 'WET'} signatureType - Type of signature (digital cert, electronic, or scanned wet signature)
 * @property {string} [ipAddress] - IP address of signer for audit trail
 * @property {boolean} verified - Whether signature has been cryptographically verified
 *
 * @example
 * ```typescript
 * const signature: DocumentSignature = {
 *   id: 'sig_789',
 *   documentId: 'doc_123',
 *   signerId: 'nurse_001',
 *   signerName: 'Mary Johnson, RN',
 *   signedAt: new Date('2025-10-25T14:30:00Z'),
 *   signatureType: 'ELECTRONIC',
 *   ipAddress: '192.168.1.100',
 *   verified: true
 * };
 * ```
 */
export interface DocumentSignature {
  id: string;
  documentId: string;
  signerId: string;
  signerName: string;
  signedAt: Date;
  signatureType: 'DIGITAL' | 'ELECTRONIC' | 'WET';
  ipAddress?: string;
  verified: boolean;
}

/**
 * Audit trail entry for document access and modifications.
 *
 * Tracks all document operations for HIPAA compliance and security auditing.
 * Every view, edit, share, or delete action creates an audit entry.
 *
 * @interface DocumentAuditTrail
 * @property {string} id - Unique audit entry ID
 * @property {string} documentId - ID of document being audited
 * @property {string} action - Action performed (VIEW, EDIT, DELETE, SHARE, SIGN, etc.)
 * @property {string} userId - User ID who performed the action
 * @property {string} userName - Full name of user for audit reports
 * @property {Date} timestamp - When the action occurred
 * @property {Record<string, any>} [details] - Additional action-specific details (e.g., fields changed)
 * @property {string} [ipAddress] - IP address from which action was performed
 *
 * @example
 * ```typescript
 * const auditEntry: DocumentAuditTrail = {
 *   id: 'audit_456',
 *   documentId: 'doc_123',
 *   action: 'EDIT',
 *   userId: 'nurse_001',
 *   userName: 'Mary Johnson',
 *   timestamp: new Date('2025-10-25T14:30:00Z'),
 *   details: { fieldsChanged: ['title', 'tags'] },
 *   ipAddress: '192.168.1.100'
 * };
 * ```
 */
export interface DocumentAuditTrail {
  id: string;
  documentId: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details?: Record<string, any>;
  ipAddress?: string;
}

/**
 * Type augmentation for Document model associations.
 *
 * Extends the Document model interface to include optional associations
 * that may be loaded via eager loading. Improves type safety when
 * working with related document data.
 *
 * @remarks
 * These properties are only populated when explicitly included in
 * Sequelize queries using the `include` option. They will be undefined
 * if not eagerly loaded.
 *
 * @example
 * ```typescript
 * const doc = await Document.findByPk(id, {
 *   include: ['versions', 'signatures', 'auditTrail']
 * });
 * // doc.versions, doc.signatures, doc.auditTrail are now typed and available
 * ```
 */
declare module '../../database/models' {
  interface Document {
    /** Document version history (if versioning is enabled) */
    versions?: Document[];
    /** Parent document (for versions that reference an original) */
    parent?: Document;
    /** Digital signatures applied to this document */
    signatures?: DocumentSignature[];
    /** Audit trail of all access and modifications */
    auditTrail?: DocumentAuditTrail[];
  }
}

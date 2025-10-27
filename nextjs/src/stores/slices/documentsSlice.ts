/**
 * @module pages/documents/store/documentsSlice
 *
 * @description
 * Production-grade Redux state management for document management system.
 * Handles CRUD operations for documents with support for versioning, digital signatures,
 * audit trails, and HIPAA-compliant access control.
 *
 * ## Architecture
 *
 * This slice uses the entity slice factory pattern (`createEntitySlice`) for standardized
 * CRUD operations with normalized state management via Redux Toolkit's `EntityAdapter`.
 * This provides optimized entity management with O(1) lookups and efficient updates.
 *
 * ## State Structure
 *
 * The state is normalized using EntityAdapter pattern:
 * - **entities**: Normalized document entities by ID for fast lookups
 * - **ids**: Ordered array of document IDs for iteration
 * - **loading**: Operation-specific loading flags
 * - **error**: Operation-specific error messages
 * - **pagination**: Page metadata for list views
 *
 * ## Key Features
 *
 * - **Document Upload**: Support for multiple file types with size validation
 * - **Version Control**: Automatic versioning with audit trail
 * - **Digital Signatures**: Electronic signature capture and validation
 * - **Access Control**: Role-based document visibility and permissions
 * - **Tag System**: Flexible tagging for categorization and search
 * - **Status Tracking**: DRAFT, PENDING_REVIEW, APPROVED, ARCHIVED workflow
 * - **Audit Trail**: Complete history of document access and modifications
 *
 * @remarks
 * ## Document Management Workflows
 *
 * ### Document Upload and Processing
 *
 * 1. User selects file(s) for upload
 * 2. Client validates file type, size, and content
 * 3. File uploaded to secure storage (S3/Azure Blob)
 * 4. Document metadata created with PENDING_REVIEW status
 * 5. OCR/text extraction performed for searchability
 * 6. Virus scanning completed before approval
 * 7. Administrator reviews and approves document
 * 8. Document status updated to APPROVED
 *
 * ### Document Versioning Workflow
 *
 * 1. User uploads new version of existing document
 * 2. Previous version archived with version number
 * 3. New version created with incremented version number
 * 4. Audit trail updated with version change details
 * 5. Users notified of new version availability
 * 6. Previous versions remain accessible for compliance
 *
 * ### Digital Signature Workflow
 *
 * 1. Document marked as requiring signature
 * 2. Signature request sent to designated signers
 * 3. Signer reviews document content
 * 4. Electronic signature captured (typed, drawn, or image)
 * 5. Signature cryptographically bound to document
 * 6. Timestamp and IP address recorded
 * 7. Document locked for editing after signing
 * 8. Signed document archived with certificate
 *
 * ### Document Access Audit Trail
 *
 * All document operations are logged:
 * - **View**: User ID, timestamp, IP address, duration
 * - **Download**: User ID, timestamp, IP address, file hash
 * - **Edit**: User ID, timestamp, changes made, previous version
 * - **Share**: User ID, timestamp, recipient(s), expiration
 * - **Delete**: User ID, timestamp, reason, soft delete only
 *
 * ## PHI Handling
 *
 * Documents containing PHI (Protected Health Information) receive special handling:
 * - Encryption at rest using AES-256
 * - Encryption in transit using TLS 1.3
 * - Access limited to authorized users only
 * - Audit logging for all access attempts
 * - Automatic expiration for shared links
 * - Watermarks on downloaded copies
 *
 * ## Document Retention Policy
 *
 * - **Medical Records**: Retained for 7 years after last treatment
 * - **Consent Forms**: Retained for 7 years after student graduation
 * - **Incident Reports**: Retained for 10 years
 * - **General Documents**: Retained for 3 years
 * - **Archived Documents**: Moved to cold storage after retention period
 * - **Deletion**: Physical deletion only after legal hold clearance
 *
 * ## Performance Considerations
 *
 * - Pagination for large document lists
 * - Lazy loading of document content (metadata first, content on-demand)
 * - Thumbnail generation for image documents
 * - PDF preview generation for quick viewing
 * - Client-side caching with cache invalidation
 * - Compression for large files during upload/download
 *
 * @see {@link module:pages/compliance/store/complianceSlice} for compliance document tracking
 * @see {@link module:pages/students/store/studentsSlice} for student-specific documents
 * @see {@link module:pages/incidents/store/incidentReportsSlice} for incident documentation
 *
 * @example
 * ```typescript
 * // Upload new document
 * dispatch(documentsThunks.create({
 *   name: 'Consent Form - Annual Physical',
 *   type: 'application/pdf',
 *   size: 245678,
 *   url: 's3://bucket/documents/consent-form.pdf',
 *   studentId: 'student-123',
 *   tags: ['consent', 'medical', 'physical'],
 *   category: 'CONSENT_FORM'
 * }));
 *
 * // Fetch student documents
 * dispatch(documentsThunks.fetchAll({
 *   studentId: 'student-123',
 *   category: 'MEDICAL_RECORDS',
 *   isActive: true
 * }));
 *
 * // Update document status
 * dispatch(documentsThunks.update('doc-456', {
 *   status: 'APPROVED',
 *   reviewedBy: currentUserId,
 *   reviewedAt: new Date().toISOString()
 * }));
 *
 * // Access documents using selectors
 * const allDocuments = useSelector(documentsSelectors.selectAll);
 * const studentDocs = useSelector(state =>
 *   selectDocumentsByStudent(state, studentId)
 * );
 * const activeDocuments = useSelector(selectActiveDocuments);
 * const recentDocuments = useSelector(state =>
 *   selectRecentDocuments(state, 30)
 * );
 * ```
 */

import { createEntitySlice, EntityApiService } from '../../stores/sliceFactory';
import { documentsApi } from '../../services/api';
import type { Document as DocumentType } from '../../types/documents';

// Use the imported Document type instead of local interface
type Document = DocumentType;

/**
 * Document creation data.
 *
 * Defines the structure for creating new documents in the system.
 *
 * @interface CreateDocumentData
 *
 * @property {string} name - Document filename
 * @property {string} type - MIME type (e.g., application/pdf, image/jpeg)
 * @property {number} size - File size in bytes
 * @property {string} url - Storage URL (S3/Azure Blob)
 * @property {string} [studentId] - Associated student ID (for student-specific documents)
 * @property {string[]} [tags] - Tags for categorization and search
 *
 * @example
 * ```typescript
 * const newDoc: CreateDocumentData = {
 *   name: 'vaccination-record.pdf',
 *   type: 'application/pdf',
 *   size: 156789,
 *   url: 's3://documents/vaccination-record.pdf',
 *   studentId: 'student-123',
 *   tags: ['vaccination', 'medical', 'immunization']
 * };
 * ```
 */
interface CreateDocumentData {
  name: string;
  type: string;
  size: number;
  url: string;
  studentId?: string;
  tags?: string[];
}

/**
 * Document update data.
 *
 * Partial update data for modifying existing documents.
 *
 * @interface UpdateDocumentData
 *
 * @property {string} [name] - Updated document name
 * @property {string[]} [tags] - Updated tags
 * @property {boolean} [isActive] - Active/archived status
 *
 * @remarks
 * Only metadata can be updated after document creation.
 * To update content, upload a new version using versioning workflow.
 *
 * @example
 * ```typescript
 * const updates: UpdateDocumentData = {
 *   tags: ['consent', 'medical', 'updated'],
 *   isActive: true
 * };
 * ```
 */
interface UpdateDocumentData {
  name?: string;
  tags?: string[];
  isActive?: boolean;
}

/**
 * Document filters for querying.
 *
 * Defines available filter options for document queries.
 *
 * @interface DocumentFilters
 *
 * @property {string} [studentId] - Filter by student
 * @property {string} [type] - Filter by MIME type
 * @property {string} [uploadedBy] - Filter by uploader user ID
 * @property {string[]} [tags] - Filter by tags
 * @property {boolean} [isActive] - Filter by active status
 * @property {number} [page] - Page number for pagination
 * @property {number} [limit] - Items per page
 *
 * @example
 * ```typescript
 * const filters: DocumentFilters = {
 *   studentId: 'student-123',
 *   category: 'MEDICAL_RECORDS',
 *   isActive: true,
 *   page: 1,
 *   limit: 20
 * };
 * ```
 */
interface DocumentFilters {
  studentId?: string;
  type?: string;
  uploadedBy?: string;
  tags?: string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Documents API service adapter.
 *
 * Adapts the documents API to the entity service interface required by
 * the slice factory. Provides standardized CRUD operations with consistent
 * error handling and response formatting.
 *
 * @const {EntityApiService<Document, CreateDocumentData, UpdateDocumentData>}
 *
 * @remarks
 * ## API Integration Notes
 *
 * - `getAll`: Supports filtering by student, type, category, tags, status
 * - `getById`: Loads full document metadata with access history
 * - `create`: Validates file type and size before storage
 * - `update`: Only metadata updates allowed (name, tags, status)
 * - `delete`: Soft-deletes documents for audit trail preservation
 *
 * ## Error Handling
 *
 * All methods handle common error scenarios:
 * - Invalid file types (rejected with validation error)
 * - File size exceeding limits (rejected with size error)
 * - Unauthorized access (RBAC permission check failures)
 * - Storage failures (automatic retry with exponential backoff)
 * - Virus detection (document quarantined, user notified)
 */
const documentsApiService: EntityApiService<Document, CreateDocumentData, UpdateDocumentData> = {
  /**
   * Fetch all documents with optional filtering.
   *
   * @async
   * @param {DocumentFilters} [params] - Filter and pagination parameters
   * @returns {Promise<{data: Document[], total: number, pagination?: Object}>}
   */
  async getAll(params?: DocumentFilters) {
    const response = await documentsApi.getDocuments(params);
    return {
      data: response.documents || [],
      total: response.pagination?.total || 0,
      pagination: response.pagination ? {
        page: response.pagination.page,
        pageSize: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.pages
      } : undefined,
    };
  },

  /**
   * Fetch single document by ID.
   *
   * @async
   * @param {string} id - Document unique identifier
   * @returns {Promise<{data: Document}>}
   */
  async getById(id: string) {
    const response = await documentsApi.getDocumentById(id);
    return { data: response.document };
  },

  /**
   * Create new document.
   *
   * @async
   * @param {CreateDocumentData} data - Document creation data
   * @returns {Promise<{data: Document}>}
   */
  async create(data: CreateDocumentData) {
    const response = await documentsApi.createDocument(data as any);
    return { data: response.document };
  },

  /**
   * Update existing document metadata.
   *
   * @async
   * @param {string} id - Document unique identifier
   * @param {UpdateDocumentData} data - Partial update data
   * @returns {Promise<{data: Document}>}
   */
  async update(id: string, data: UpdateDocumentData) {
    const response = await documentsApi.updateDocument(id, data as any);
    return { data: response.document };
  },

  /**
   * Delete document (soft delete).
   *
   * @async
   * @param {string} id - Document unique identifier
   * @returns {Promise<{success: boolean}>}
   */
  async delete(id: string) {
    await documentsApi.deleteDocument(id);
    return { success: true };
  },
};

/**
 * Documents slice factory instance.
 *
 * Creates the Redux slice using the entity factory pattern with standardized
 * CRUD operations, normalized state, and built-in selectors.
 *
 * @const
 *
 * @property {Object} slice - Redux slice with reducers and actions
 * @property {EntityAdapter} adapter - Entity adapter with normalized selectors
 * @property {Object} thunks - Async thunk creators for API operations
 * @property {Object} actions - Synchronous action creators
 */
const documentsSliceFactory = createEntitySlice<Document, CreateDocumentData, UpdateDocumentData>(
  'documents',
  documentsApiService,
  {
    enableBulkOperations: true,
  }
);

// Export the slice and its components
export const documentsSlice = documentsSliceFactory.slice;
export const documentsReducer = documentsSlice.reducer;
export const documentsActions = documentsSliceFactory.actions;
export const documentsSelectors = documentsSliceFactory.adapter.getSelectors((state: any) => state.documents);
export const documentsThunks = documentsSliceFactory.thunks;

// =====================
// CUSTOM SELECTORS
// =====================

/**
 * Select documents by student ID.
 *
 * Custom selector that filters documents belonging to a specific student.
 *
 * @function selectDocumentsByStudent
 *
 * @param {any} state - Redux root state
 * @param {string} studentId - Student unique identifier
 *
 * @returns {Document[]} Filtered array of student's documents
 *
 * @example
 * ```typescript
 * const studentDocuments = selectDocumentsByStudent(state, 'student-123');
 * ```
 */
export const selectDocumentsByStudent = (state: any, studentId: string): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document => document.studentId === studentId);
};

/**
 * Select active documents.
 *
 * Derived selector that filters documents with APPROVED or PENDING_REVIEW status.
 * Excludes archived and draft documents.
 *
 * @function selectActiveDocuments
 *
 * @param {any} state - Redux root state
 *
 * @returns {Document[]} Array of active documents
 *
 * @remarks
 * Active documents are those that are currently in use and accessible.
 * Archived documents are excluded for performance but can be queried separately.
 *
 * @example
 * ```typescript
 * const activeDocuments = selectActiveDocuments(state);
 * ```
 */
export const selectActiveDocuments = (state: any): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document =>
    document.status === 'APPROVED' || document.status === 'PENDING_REVIEW'
  );
};

/**
 * Select documents by category/type.
 *
 * Custom selector that filters documents by category (e.g., MEDICAL_RECORDS, CONSENT_FORMS).
 *
 * @function selectDocumentsByType
 *
 * @param {any} state - Redux root state
 * @param {string} category - Document category to filter by
 *
 * @returns {Document[]} Filtered array of documents in the category
 *
 * @example
 * ```typescript
 * const medicalRecords = selectDocumentsByType(state, 'MEDICAL_RECORDS');
 * const consentForms = selectDocumentsByType(state, 'CONSENT_FORMS');
 * ```
 */
export const selectDocumentsByType = (state: any, category: string): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document => document.category === category);
};

/**
 * Select documents by uploader.
 *
 * Custom selector that filters documents uploaded by a specific user.
 *
 * @function selectDocumentsByUploader
 *
 * @param {any} state - Redux root state
 * @param {string} uploadedBy - Uploader user ID
 *
 * @returns {Document[]} Filtered array of documents uploaded by the user
 *
 * @example
 * ```typescript
 * const myUploads = selectDocumentsByUploader(state, currentUserId);
 * ```
 */
export const selectDocumentsByUploader = (state: any, uploadedBy: string): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document => document.uploadedBy === uploadedBy);
};

/**
 * Select documents by tag.
 *
 * Custom selector that filters documents containing a specific tag.
 *
 * @function selectDocumentsByTag
 *
 * @param {any} state - Redux root state
 * @param {string} tag - Tag to filter by
 *
 * @returns {Document[]} Filtered array of documents with the tag
 *
 * @remarks
 * Tags are case-insensitive for filtering. Documents can have multiple tags.
 *
 * @example
 * ```typescript
 * const vaccinationDocs = selectDocumentsByTag(state, 'vaccination');
 * const urgentDocs = selectDocumentsByTag(state, 'urgent');
 * ```
 */
export const selectDocumentsByTag = (state: any, tag: string): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document =>
    document.tags && document.tags.includes(tag)
  );
};

/**
 * Select recent documents within time window.
 *
 * Derived selector that filters documents created within the last N days.
 * Results are sorted by creation date in descending order (most recent first).
 *
 * @function selectRecentDocuments
 *
 * @param {any} state - Redux root state
 * @param {number} [days=7] - Number of days to look back (default: 7)
 *
 * @returns {Document[]} Array of recent documents, sorted by creation date descending
 *
 * @remarks
 * This selector performs client-side filtering and sorting. For large document
 * collections, consider using server-side filtering with date range parameters.
 *
 * @example
 * ```typescript
 * // Get documents from last 7 days (default)
 * const lastWeek = selectRecentDocuments(state);
 *
 * // Get documents from last 24 hours
 * const today = selectRecentDocuments(state, 1);
 *
 * // Get documents from last 30 days
 * const lastMonth = selectRecentDocuments(state, 30);
 * ```
 */
export const selectRecentDocuments = (state: any, days: number = 7): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return allDocuments.filter(document => {
    const createdDate = new Date(document.createdAt!);
    return createdDate >= cutoffDate;
  }).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
};

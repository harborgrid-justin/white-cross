/**
 * MIGRATION STATUS: DEPRECATED
 *
 * @deprecated Use Server Actions from @/lib/actions/documents.crud
 * @see {@link /lib/actions/documents.crud.ts}
 * @module services/modules/documentsApi/crud
 * @category Healthcare - Documents
 */

import type { ApiResponse } from '../../types';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { extractApiData, buildUrlParams } from '../../utils/apiUtils';
import type {
  BaseDocumentsService,
  DocumentsApi,
  Document,
  DocumentFilters,
  PaginatedDocumentsResponse,
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from './types';
import { validateUUIDOrThrow, ERROR_MESSAGES } from './types';

// Import validation schemas
import {
  createDocumentSchema,
  updateDocumentSchema,
  documentFiltersSchema,
  type CreateDocumentInput,
  type UpdateDocumentInput,
  type DocumentFiltersInput,
} from '../../../schemas/documentSchemas';

/**
 * Documents CRUD Service
 *
 * @class
 * @classdesc Handles basic document CRUD operations including create, read, update,
 * and delete operations with proper validation and PHI protection logging.
 *
 * Healthcare Safety Features:
 * - All operations log access for HIPAA compliance
 * - UUID validation for all document IDs
 * - Comprehensive error handling
 * - PHI detection and protection
 */
export class DocumentsCrudService implements Pick<DocumentsApi, 'getDocuments' | 'getDocumentById' | 'createDocument' | 'updateDocument' | 'deleteDocument'> {
  constructor(private readonly client: BaseDocumentsService['client']) {}

  /**
   * Get documents with optional filters
   * @param filters - Optional filters for querying documents
   * @returns Paginated list of documents
   *
   * @description
   * Retrieves documents with optional filtering, sorting, and pagination.
   * Supports filtering by student ID, category, status, date ranges, and more.
   *
   * PHI Protection: Documents may contain PHI - access is logged for audit trail
   *
   * @example
   * ```typescript
   * const crudService = new DocumentsCrudService(apiClient);
   *
   * // Get all documents with pagination
   * const { documents, pagination } = await crudService.getDocuments({
   *   page: 1,
   *   limit: 20,
   *   sortBy: 'createdAt',
   *   sortOrder: 'desc'
   * });
   *
   * // Filter by student and category
   * const { documents: consentForms } = await crudService.getDocuments({
   *   studentId: 'student-123',
   *   category: 'CONSENT',
   *   status: 'ACTIVE'
   * });
   *
   * // Get documents expiring soon
   * const expiringDocs = await crudService.getDocuments({
   *   expirationDate: {
   *     before: '2024-12-31',
   *     after: '2024-01-01'
   *   }
   * });
   * ```
   */
  async getDocuments(filters: DocumentFilters = {}): Promise<PaginatedDocumentsResponse> {
    const validatedFilters = documentFiltersSchema.parse(filters);
    const params = buildUrlParams(validatedFilters);
    
    const response = await this.client.get<ApiResponse<PaginatedDocumentsResponse> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}?${params.toString()}`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Get document by ID
   * @param id - Document UUID
   * @returns Document with complete metadata
   *
   * @description
   * Retrieves a single document by its UUID including all metadata, permissions,
   * version information, and signature status.
   *
   * PHI Protection: Document may contain PHI - access is logged for audit trail
   *
   * @example
   * ```typescript
   * const crudService = new DocumentsCrudService(apiClient);
   *
   * try {
   *   const { document } = await crudService.getDocumentById('doc-uuid-123');
   *   
   *   console.log(`Document: ${document.title}`);
   *   console.log(`Category: ${document.category}`);
   *   console.log(`Status: ${document.status}`);
   *   console.log(`Signatures: ${document.signatures?.length || 0}`);
   *   
   *   if (document.expirationDate) {
   *     const daysUntilExpiry = Math.ceil(
   *       (new Date(document.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
   *     );
   *     console.log(`Expires in: ${daysUntilExpiry} days`);
   *   }
   * } catch (error) {
   *   console.error('Document not found or access denied:', error.message);
   * }
   * ```
   */
  async getDocumentById(id: string): Promise<{ document: Document }> {
    validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    
    const response = await this.client.get<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Create new document
   * @param data - Document creation data
   * @returns Created document with generated metadata
   *
   * @description
   * Creates a new document with the provided data. Automatically generates
   * metadata including creation timestamp, version number, and unique ID.
   * Supports file upload via URL or direct file data.
   *
   * PHI Protection: Created document may contain PHI - creation is logged for audit trail
   *
   * Validation:
   * - Title is required and must be 1-200 characters
   * - Category must be valid document category
   * - Student ID must be valid UUID format
   * - File URL or file data is required
   * - Expiration date must be in the future (if provided)
   *
   * @example
   * ```typescript
   * const crudService = new DocumentsCrudService(apiClient);
   *
   * // Create document with file URL
   * const { document } = await crudService.createDocument({
   *   studentId: 'student-uuid-123',
   *   title: 'Annual Physical Examination',
   *   description: 'Required annual physical for school enrollment',
   *   category: 'MEDICAL_RECORD',
   *   fileUrl: 'https://storage.example.com/physicals/annual-2024.pdf',
   *   expirationDate: '2025-08-31',
   *   tags: ['physical', 'required', '2024'],
   *   metadata: {
   *     doctorName: 'Dr. Smith',
   *     clinicName: 'Family Health Clinic',
   *     examDate: '2024-08-15'
   *   }
   * });
   *
   * console.log(`Created document: ${document.id}`);
   * console.log(`Version: ${document.version}`);
   * ```
   *
   * @example
   * ```typescript
   * // Create consent form from template
   * const { document: consentForm } = await crudService.createDocument({
   *   studentId: 'student-uuid-456',
   *   title: 'Field Trip Permission Slip',
   *   description: 'Permission for Science Museum field trip',
   *   category: 'CONSENT',
   *   templateId: 'template-field-trip-uuid',
   *   requiredSignatures: ['parent', 'guardian'],
   *   expirationDate: '2024-10-15',
   *   metadata: {
   *     tripDate: '2024-10-10',
   *     destination: 'Science Museum',
   *     teacherName: 'Ms. Johnson'
   *   }
   * });
   * ```
   */
  async createDocument(data: CreateDocumentRequest): Promise<{ document: Document }> {
    const validatedData = createDocumentSchema.parse(data);
    
    const response = await this.client.post<ApiResponse<{ document: Document }> | undefined>(
      API_ENDPOINTS.DOCUMENTS.BASE,
      validatedData
    );
    
    return extractApiData(response as any);
  }

  /**
   * Update document
   * @param id - Document UUID
   * @param data - Document update data
   * @returns Updated document
   *
   * @description
   * Updates an existing document with new data. Only provided fields are updated;
   * omitted fields retain their current values. Version number is automatically
   * incremented and change history is tracked.
   *
   * PHI Protection: Updated document may contain PHI - update is logged for audit trail
   *
   * Restrictions:
   * - Cannot update documents that are archived or deleted
   * - Cannot change student ID after creation
   * - Cannot update documents that have required signatures pending
   * - File updates create new versions (use createDocumentVersion instead)
   *
   * @example
   * ```typescript
   * const crudService = new DocumentsCrudService(apiClient);
   *
   * // Update document metadata
   * const { document } = await crudService.updateDocument('doc-uuid-123', {
   *   title: 'Updated Annual Physical Examination',
   *   description: 'Annual physical with updated contact information',
   *   tags: ['physical', 'required', '2024', 'updated'],
   *   metadata: {
   *     doctorName: 'Dr. Smith',
   *     clinicName: 'Family Health Clinic - New Location',
   *     examDate: '2024-08-15',
   *     updateReason: 'Clinic address change'
   *   }
   * });
   *
   * console.log(`Updated document: ${document.id}`);
   * console.log(`New version: ${document.version}`);
   * ```
   *
   * @example
   * ```typescript
   * // Update document status and expiration
   * const { document: updatedDoc } = await crudService.updateDocument('doc-uuid-456', {
   *   status: 'PENDING_SIGNATURE',
   *   expirationDate: '2025-12-31',
   *   notes: 'Extended expiration date per parent request'
   * });
   * ```
   */
  async updateDocument(id: string, data: UpdateDocumentRequest): Promise<{ document: Document }> {
    validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    const validatedData = updateDocumentSchema.parse(data);
    
    const response = await this.client.put<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`,
      validatedData
    );
    
    return extractApiData(response as any);
  }

  /**
   * Delete document
   * @param id - Document UUID
   *
   * @description
   * Permanently deletes a document and all associated data including versions,
   * signatures, and audit trail entries. This operation cannot be undone.
   *
   * PHI Protection: Document deletion is logged for audit trail and compliance
   *
   * Safety Checks:
   * - Cannot delete documents that are currently required for compliance
   * - Cannot delete documents with active legal holds
   * - Cannot delete documents with pending signature requirements
   * - Warns if document has associated child documents or references
   *
   * Alternative: Consider using archive functionality for non-permanent removal
   *
   * @example
   * ```typescript
   * const crudService = new DocumentsCrudService(apiClient);
   *
   * try {
   *   await crudService.deleteDocument('doc-uuid-123');
   *   console.log('Document successfully deleted');
   * } catch (error) {
   *   if (error.message.includes('required for compliance')) {
   *     console.error('Cannot delete: Document is required for regulatory compliance');
   *   } else if (error.message.includes('pending signatures')) {
   *     console.error('Cannot delete: Document has pending signature requirements');
   *   } else {
   *     console.error('Delete failed:', error.message);
   *   }
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Safe deletion with confirmation
   * const { document } = await crudService.getDocumentById('doc-uuid-456');
   * 
   * if (document.status === 'DRAFT' && !document.signatures?.length) {
   *   await crudService.deleteDocument('doc-uuid-456');
   *   console.log('Draft document deleted safely');
   * } else {
   *   console.log('Document has signatures or is not in draft status - consider archiving instead');
   * }
   * ```
   */
  async deleteDocument(id: string): Promise<void> {
    validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    
    await this.client.delete(`${API_ENDPOINTS.DOCUMENTS.BASE}/${id}`);
  }
}

/**
 * Factory function to create CRUD service
 */
export function createDocumentsCrudService(client: BaseDocumentsService['client']): DocumentsCrudService {
  return new DocumentsCrudService(client);
}

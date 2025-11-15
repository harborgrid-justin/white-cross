/**
 * MIGRATION STATUS: DEPRECATED
 *
 * @deprecated Use Server Actions from @/lib/actions/documents.{sharing,signatures,upload}
 * @see {@link /lib/actions/documents.sharing.ts}
 * @see {@link /lib/actions/documents.signatures.ts}
 * @see {@link /lib/actions/documents.upload.ts}
 * @module services/modules/documentsApi/actions
 * @category Healthcare - Documents
 */

import type { ApiResponse } from '../../types';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { extractApiData } from '../../utils/apiUtils';
import type {
  BaseDocumentsService,
  DocumentsApi,
  Document,
  DocumentTemplate,
  DocumentSignature,
  CreateFromTemplateRequest,
  ShareDocumentRequest,
  SignDocumentRequest,
  SignatureVerificationResult,
  DocumentFilters,
  BulkDeleteDocumentsResponse,
  BulkDownloadRequest,
  BulkDownloadResponse,
  BulkDownloadOptions,
} from './types';
import { validateUUIDOrThrow, ERROR_MESSAGES } from './types';

// Import validation schemas
import {
  createFromTemplateSchema,
  shareDocumentSchema,
  signDocumentSchema,
  bulkDeleteDocumentsSchema,
  bulkDownloadRequestSchema,
  type CreateFromTemplateInput,
  type ShareDocumentInput,
  type SignDocumentInput,
  type BulkDeleteDocumentsInput,
} from '../../../schemas/documentSchemas';

/**
 * Documents Actions Service
 *
 * @class
 * @classdesc Handles document actions and operations including signing, sharing,
 * downloading, templates, and bulk operations with healthcare compliance.
 *
 * Healthcare Safety Features:
 * - Digital signature verification and validation
 * - Secure document sharing with permission controls
 * - Audit trail logging for all actions
 * - PHI protection during operations
 * - Template-based document creation with data validation
 */
export class DocumentsActionsService implements Pick<DocumentsApi, 
  'signDocument' | 'verifySignature' | 'downloadDocument' | 'viewDocument' | 
  'shareDocument' | 'getTemplates' | 'getTemplateById' | 'createFromTemplate' | 
  'getStudentDocuments' | 'bulkDeleteDocuments' | 'bulkDownload'> {
  
  constructor(private readonly client: BaseDocumentsService['client']) {}

  /**
   * Sign a document with digital signature
   * @param id - Document UUID
   * @param data - Signature data and verification information
   * @returns Created digital signature record
   *
   * @description
   * Creates a legally binding digital signature on a document with full
   * verification and audit trail. Supports multiple signature types including
   * electronic, digital certificates, biometric, and PIN-based signatures.
   *
   * PHI Protection: Signature may involve PHI access - operation is fully logged
   *
   * Signature Types:
   * - ELECTRONIC: Standard electronic signature with timestamp
   * - DIGITAL: Certificate-based digital signature with PKI validation
   * - BIOMETRIC: Biometric verification (fingerprint, facial recognition)
   * - PIN: PIN-based signature verification
   *
   * @example
   * ```typescript
   * const actionsService = new DocumentsActionsService(apiClient);
   *
   * // Electronic signature
   * const { signature } = await actionsService.signDocument('doc-uuid-123', {
   *   signedBy: 'user-uuid-456',
   *   signedByRole: 'Guardian',
   *   signatureType: 'ELECTRONIC',
   *   signatureData: 'base64-encoded-signature-image',
   *   ipAddress: '192.168.1.100',
   *   location: 'Home Office',
   *   deviceInfo: 'iPad Pro 12.9" - Safari 17.0'
   * });
   *
   * console.log(`Document signed with signature ID: ${signature.id}`);
   * console.log(`Signature timestamp: ${new Date(signature.signedAt).toLocaleString()}`);
   * ```
   */
  async signDocument(id: string, data: SignDocumentRequest): Promise<{ signature: DocumentSignature }> {
    validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    
    const validatedData = signDocumentSchema.parse(data) as SignDocumentRequest;

    const response = await this.client.post<ApiResponse<{ signature: DocumentSignature }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/sign`,
      validatedData
    );
    
    return extractApiData(response as any);
  }

  /**
   * Verify a digital signature
   * @param signatureId - Signature UUID
   * @returns Signature verification results and status
   *
   * @description
   * Verifies the integrity and authenticity of a digital signature including
   * certificate validation, timestamp verification, and signature integrity checks.
   *
   * @example
   * ```typescript
   * const verification = await actionsService.verifySignature('signature-uuid-789');
   *
   * console.log(`Signature verification:`);
   * console.log(`  Valid: ${verification.isValid}`);
   * console.log(`  Signer: ${verification.signerInfo.name}`);
   * console.log(`  Certificate: ${verification.certificateStatus}`);
   * console.log(`  Timestamp: ${verification.timestampStatus}`);
   *
   * if (!verification.isValid) {
   *   console.log(`  Issues: ${verification.errors.join(', ')}`);
   * }
   * ```
   */
  async verifySignature(signatureId: string): Promise<SignatureVerificationResult> {
    validateUUIDOrThrow(signatureId, ERROR_MESSAGES.INVALID_SIGNATURE_ID);
    
    const response = await this.client.get<ApiResponse<SignatureVerificationResult> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/signatures/${signatureId}/verify`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Download document file
   * @param id - Document UUID
   * @param version - Optional version number (defaults to latest)
   * @returns Blob containing the document file
   *
   * @description
   * Downloads the document file content. Can specify a specific version or
   * download the latest version. Returns the file as a Blob for client-side handling.
   *
   * PHI Protection: Downloaded file may contain PHI - access is logged for audit trail
   *
   * @example
   * ```typescript
   * const blob = await actionsService.downloadDocument('doc-uuid-123');
   *
   * // Create download link
   * const url = URL.createObjectURL(blob);
   * const link = document.createElement('a');
   * link.href = url;
   * link.download = 'health-record.pdf';
   * link.click();
   * URL.revokeObjectURL(url);
   * ```
   */
  async downloadDocument(id: string, version?: number): Promise<Blob> {
    validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_DOCUMENT_ID);

    const queryParams = version ? `?version=${version}` : '';
    const response = await this.client.get(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/download${queryParams}`,
      { responseType: 'blob' }
    );
    
    return response.data as Blob;
  }

  /**
   * View document metadata and access details
   * @param id - Document UUID
   * @returns Document details with access tracking
   *
   * @description
   * Retrieves document metadata and records the view access for audit purposes.
   * Different from getDocumentById as this specifically tracks document viewing.
   *
   * PHI Protection: View access is logged for audit trail
   *
   * @example
   * ```typescript
   * const { document } = await actionsService.viewDocument('doc-uuid-123');
   * console.log(`Viewing: ${document.title}`);
   * console.log(`Last modified: ${new Date(document.updatedAt).toLocaleString()}`);
   * ```
   */
  async viewDocument(id: string): Promise<{ document: Document }> {
    validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    
    const response = await this.client.post<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/view`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Share document with other users
   * @param id - Document UUID
   * @param data - Sharing configuration and permissions
   * @returns Sharing confirmation and recipient list
   *
   * @description
   * Shares a document with specified users with granular permission controls.
   * Supports temporary sharing with expiration dates and custom messages.
   *
   * PHI Protection: Document sharing involving PHI is logged for audit trail
   *
   * Permission Levels:
   * - view: Can view document only
   * - edit: Can view and modify document
   * - admin: Full document management permissions
   *
   * @example
   * ```typescript
   * const { shared, sharedWith } = await actionsService.shareDocument('doc-uuid-123', {
   *   documentId: 'doc-uuid-123',
   *   userIds: ['teacher-uuid-456', 'nurse-uuid-789'],
   *   permissions: 'view',
   *   expiresAt: '2024-06-30T23:59:59Z',
   *   message: 'Please review this student health record for the upcoming field trip.'
   * });
   *
   * console.log(`Document shared with ${sharedWith.length} users`);
   * ```
   */
  async shareDocument(
    id: string,
    data: ShareDocumentRequest
  ): Promise<{ shared: boolean; sharedWith: string[] }> {
    validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    
    const validatedData = shareDocumentSchema.parse(data);

    const response = await this.client.post<ApiResponse<{ shared: boolean; sharedWith: string[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${id}/share`,
      validatedData
    );
    
    return extractApiData(response as any);
  }

  /**
   * Get available document templates
   * @param category - Optional category filter
   * @returns List of available document templates
   *
   * @description
   * Retrieves available document templates filtered by category.
   * Templates provide standardized document structures for healthcare forms,
   * consent forms, medical records, and administrative documents.
   *
   * @example
   * ```typescript
   * const { templates } = await actionsService.getTemplates('medical');
   *
   * console.log(`Available medical templates:`);
   * templates.forEach(template => {
   *   console.log(`- ${template.name}: ${template.description}`);
   *   console.log(`  Fields: ${template.fields.map(f => f.name).join(', ')}`);
   * });
   * ```
   */
  async getTemplates(category?: string): Promise<{ templates: DocumentTemplate[] }> {
    const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';
    
    const response = await this.client.get<ApiResponse<{ templates: DocumentTemplate[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.TEMPLATES}${queryParams}`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Get specific document template
   * @param id - Template UUID
   * @returns Template details with fields and configuration
   *
   * @description
   * Retrieves detailed information about a specific document template including
   * field definitions, validation rules, and template configuration.
   *
   * @example
   * ```typescript
   * const { template } = await actionsService.getTemplateById('template-uuid-123');
   *
   * console.log(`Template: ${template.name}`);
   * console.log(`Category: ${template.category}`);
   * console.log(`Required fields:`);
   * template.fields
   *   .filter(field => field.required)
   *   .forEach(field => console.log(`- ${field.name} (${field.type})`));
   * ```
   */
  async getTemplateById(id: string): Promise<{ template: DocumentTemplate }> {
    validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_TEMPLATE_ID);
    
    const response = await this.client.get<ApiResponse<{ template: DocumentTemplate }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.TEMPLATES}/${id}`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Create document from template
   * @param templateId - Template UUID
   * @param data - Template variables and document details
   * @returns Created document from template
   *
   * @description
   * Creates a new document using a predefined template with custom data.
   * Templates ensure consistent document structure and required field validation
   * for healthcare compliance.
   *
   * PHI Protection: Created document may contain PHI - creation is logged for audit trail
   *
   * @example
   * ```typescript
   * const { document } = await actionsService.createFromTemplate(
   *   'health-record-template-uuid',
   *   {
   *     templateId: 'health-record-template-uuid',
   *     title: 'Sarah Johnson - Annual Physical 2024',
   *     description: 'Annual physical examination and health screening',
   *     variables: {
   *       studentName: 'Sarah Johnson',
   *       studentId: 'STU-2024-0156',
   *       examDate: '2024-03-15',
   *       examiner: 'Dr. Emily Rodriguez',
   *       height: '5\'4"',
   *       weight: '125 lbs',
   *       bloodPressure: '110/70',
   *       allergies: 'None known',
   *       medications: 'Daily multivitamin',
   *       notes: 'Student is in excellent health. Clear for all activities.'
   *     }
   *   }
   * );
   *
   * console.log(`Created health record: ${document.title}`);
   * console.log(`Document ID: ${document.id}`);
   * ```
   */
  async createFromTemplate(
    templateId: string,
    data: CreateFromTemplateRequest
  ): Promise<{ document: Document }> {
    validateUUIDOrThrow(templateId, ERROR_MESSAGES.INVALID_TEMPLATE_ID);
    
    const validatedData = createFromTemplateSchema.parse(data);

    const response = await this.client.post<ApiResponse<{ document: Document }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.TEMPLATES}/${templateId}/create`,
      validatedData
    );
    
    return extractApiData(response as any);
  }

  /**
   * Get all documents for a specific student
   * @param studentId - Student UUID
   * @param filters - Optional additional filters
   * @returns Student's documents with healthcare categorization
   *
   * @description
   * Retrieves all documents associated with a specific student including
   * health records, consent forms, emergency contacts, and academic documents.
   *
   * PHI Protection: Student documents contain PHI - access is logged for audit trail
   *
   * @example
   * ```typescript
   * const { documents } = await actionsService.getStudentDocuments(
   *   'student-uuid-123',
   *   {
   *     category: 'medical',
   *     createdAfter: '2024-01-01T00:00:00Z'
   *   }
   * );
   *
   * console.log(`Medical documents for student:`);
   * documents.forEach(doc => {
   *   console.log(`- ${doc.title} (${doc.category})`);
   *   console.log(`  Created: ${new Date(doc.createdAt).toLocaleDateString()}`);
   *   console.log(`  Status: ${doc.status}`);
   * });
   * ```
   */
  async getStudentDocuments(
    studentId: string,
    filters?: Omit<DocumentFilters, 'studentId'>
  ): Promise<{ documents: Document[] }> {
    validateUUIDOrThrow(studentId, ERROR_MESSAGES.INVALID_STUDENT_ID);

    const queryParams = new URLSearchParams();
    queryParams.set('studentId', studentId);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, item.toString()));
          } else {
            queryParams.set(key, value.toString());
          }
        }
      });
    }

    const response = await this.client.get<ApiResponse<{ documents: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/students/${studentId}/documents?${queryParams.toString()}`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Bulk delete multiple documents
   * @param documentIds - Array of document UUIDs
   * @returns Deletion results with success/failure counts
   *
   * @description
   * Performs bulk deletion of multiple documents with detailed results.
   * Supports both soft delete (move to trash) and permanent deletion
   * with comprehensive audit logging.
   *
   * PHI Protection: Document deletion involving PHI is fully logged for audit trail
   *
   * @example
   * ```typescript
   * const result = await actionsService.bulkDeleteDocuments([
   *   'doc-uuid-123',
   *   'doc-uuid-456',
   *   'doc-uuid-789'
   * ]);
   *
   * console.log(`Bulk deletion results:`);
   * console.log(`  Successfully deleted: ${result.deleted.length}`);
   * console.log(`  Failed to delete: ${result.failed.length}`);
   *
   * if (result.failed.length > 0) {
   *   console.log(`Failed deletions:`);
   *   result.failed.forEach(failure => {
   *     console.log(`  - ${failure.documentId}: ${failure.error}`);
   *   });
   * }
   * ```
   */
  async bulkDeleteDocuments(documentIds: string[]): Promise<BulkDeleteDocumentsResponse> {
    const validatedData = bulkDeleteDocumentsSchema.parse({ documentIds });
    
    // Validate each document ID
    documentIds.forEach(id => validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_DOCUMENT_ID));

    const response = await this.client.post<ApiResponse<BulkDeleteDocumentsResponse> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/bulk-delete`,
      validatedData
    );
    
    return extractApiData(response as any);
  }

  /**
   * Bulk download multiple documents
   * @param request - Bulk download request configuration
   * @param options - Optional download configuration
   * @returns Bulk download response with archive information
   *
   * @description
   * Downloads multiple documents packaged into a single archive file (ZIP, TAR, etc.).
   * Supports including versions, metadata, signatures, and audit trails with
   * comprehensive customization options.
   *
   * PHI Protection: Bulk download may contain PHI - operation is logged for audit trail
   *
   * @example
   * ```typescript
   * const downloadResponse = await actionsService.bulkDownload(
   *   {
   *     documentIds: ['doc-1', 'doc-2', 'doc-3'],
   *     includeVersions: true,
   *     includeMetadata: true,
   *     format: 'zip',
   *     fileName: 'student-health-records',
   *     metadataFormat: 'json',
   *     includeSignatures: true
   *   },
   *   {
   *     maxRetries: 3,
   *     timeout: 300000,
   *     compressionLevel: 6
   *   }
   * );
   *
   * console.log(`Archive created: ${downloadResponse.fileName}`);
   * console.log(`Size: ${downloadResponse.fileSizeBytes} bytes`);
   * console.log(`Contains ${downloadResponse.documentCount} documents`);
   * ```
   */
  async bulkDownload(
    request: BulkDownloadRequest,
    options?: BulkDownloadOptions
  ): Promise<BulkDownloadResponse> {
    const validatedRequest = bulkDownloadRequestSchema.parse(request);
    
    // Validate each document ID
    validatedRequest.documentIds.forEach(id => 
      validateUUIDOrThrow(id, ERROR_MESSAGES.INVALID_DOCUMENT_ID)
    );

    const requestBody = {
      ...validatedRequest,
      options
    };

    const response = await this.client.post<ApiResponse<BulkDownloadResponse> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/bulk-download`,
      requestBody
    );
    
    return extractApiData(response as any);
  }
}

/**
 * Factory function to create document actions service
 */
export function createDocumentsActionsService(client: BaseDocumentsService['client']): DocumentsActionsService {
  return new DocumentsActionsService(client);
}

/**
 * @fileoverview Documents API Version Management
 * @module services/modules/documentsApi/versions
 * @category Healthcare - Documents
 *
 * Document version management operations including version creation, comparison,
 * and download capabilities with full audit trail support.
 */

import type { ApiResponse } from '../../types';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { extractApiData } from '../../utils/apiUtils';
import type {
  BaseDocumentsService,
  DocumentsApi,
  DocumentVersion,
  CreateDocumentVersionRequest,
  VersionComparison,
} from './types';
import { validateUUIDOrThrow, ERROR_MESSAGES } from './types';

// Import validation schemas
import {
  createDocumentVersionSchema,
  type CreateDocumentVersionInput,
} from '../../../schemas/documentSchemas';

// Add missing schema for version comparison
const versionComparisonSchema = {
  parse: (data: {
    documentId: string;
    versionId1: string;
    versionId2: string;
    comparisonType?: string;
    includeContent?: boolean;
  }) => ({
    documentId: data.documentId,
    versionId1: data.versionId1,
    versionId2: data.versionId2,
    comparisonType: data.comparisonType || 'content',
    includeContent: data.includeContent ?? true,
  })
};

/**
 * Documents Version Management Service
 *
 * @class
 * @classdesc Handles document version operations including creation, comparison,
 * and download with comprehensive audit logging for healthcare compliance.
 *
 * Healthcare Safety Features:
 * - Complete version history tracking for compliance
 * - Immutable version records for audit trail
 * - PHI protection with access logging
 * - Detailed change tracking and comparison
 */
export class DocumentsVersionService implements Pick<DocumentsApi, 'getDocumentVersions' | 'createDocumentVersion' | 'getDocumentVersion' | 'downloadVersion' | 'compareVersions'> {
  constructor(private readonly client: BaseDocumentsService['client']) {}

  /**
   * Get all versions of a document
   * @param parentId - Parent document UUID
   * @returns List of document versions in chronological order
   *
   * @description
   * Retrieves all versions of a document including version metadata, creation
   * timestamps, and change summaries. Versions are returned in chronological
   * order with the most recent version first.
   *
   * PHI Protection: Versions may contain PHI - access is logged for audit trail
   *
   * @example
   * ```typescript
   * const versionService = new DocumentsVersionService(apiClient);
   *
   * const { versions } = await versionService.getDocumentVersions('doc-uuid-123');
   *
   * console.log(`Document has ${versions.length} versions:`);
   * versions.forEach((version, index) => {
   *   console.log(`Version ${version.versionNumber}:`);
   *   console.log(`  Created: ${new Date(version.createdAt).toLocaleString()}`);
   *   console.log(`  By: ${version.createdBy}`);
   *   console.log(`  Notes: ${version.notes || 'No notes'}`);
   *   console.log(`  File size: ${version.fileSize} bytes`);
   * });
   *
   * // Get the latest version
   * const latestVersion = versions[0];
   * console.log(`Latest version: ${latestVersion.versionNumber}`);
   * ```
   */
  async getDocumentVersions(parentId: string): Promise<{ versions: DocumentVersion[] }> {
    validateUUIDOrThrow(parentId, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    
    const response = await this.client.get<ApiResponse<{ versions: DocumentVersion[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${parentId}/versions`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Create new document version
   * @param parentId - Parent document UUID
   * @param data - Version creation data or FormData for file upload
   * @returns Created document version
   *
   * @description
   * Creates a new version of an existing document. Supports both JSON data with
   * file URLs and FormData for direct file uploads. Each version is immutable
   * and maintains a complete audit trail.
   *
   * PHI Protection: New version may contain PHI - creation is logged for audit trail
   *
   * Version Rules:
   * - Version numbers are automatically incremented
   * - Previous versions remain immutable and accessible
   * - Each version can have different file content
   * - Metadata changes are tracked between versions
   * - Digital signatures apply to specific versions
   *
   * @example
   * ```typescript
   * const versionService = new DocumentsVersionService(apiClient);
   *
   * // Create version with updated file URL
   * const { document: newVersion } = await versionService.createDocumentVersion(
   *   'doc-uuid-123',
   *   {
   *     versionNumber: 2,
   *     notes: 'Updated with current medical information',
   *     fileUrl: 'https://storage.example.com/updated-physical.pdf',
   *     changeDescription: 'Added recent lab results and updated contact info'
   *   }
   * );
   *
   * console.log(`Created version ${newVersion.versionNumber}`);
   * console.log(`Version ID: ${newVersion.id}`);
   * ```
   *
   * @example
   * ```typescript
   * // Create version with file upload
   * const formData = new FormData();
   * formData.append('file', fileBlob, 'updated-consent-form.pdf');
   * formData.append('notes', 'Updated consent form with new school year dates');
   * formData.append('changeDescription', 'Updated academic year dates and emergency contacts');
   *
   * const { document: uploadedVersion } = await versionService.createDocumentVersion(
   *   'consent-doc-uuid',
   *   formData
   * );
   *
   * console.log(`Uploaded new version: ${uploadedVersion.versionNumber}`);
   * ```
   */
  async createDocumentVersion(
    parentId: string,
    data: CreateDocumentVersionRequest | FormData
  ): Promise<{ document: DocumentVersion }> {
    validateUUIDOrThrow(parentId, ERROR_MESSAGES.INVALID_DOCUMENT_ID);

    let validatedData: CreateDocumentVersionRequest | FormData = data;
    if (!(data instanceof FormData)) {
      validatedData = createDocumentVersionSchema.parse(data) as CreateDocumentVersionRequest;
    }

    const response = await this.client.post<ApiResponse<{ document: DocumentVersion }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${parentId}/version`,
      validatedData,
      data instanceof FormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined
    );
    
    return extractApiData(response as any);
  }

  /**
   * Get specific document version
   * @param versionId - Version UUID
   * @returns Complete document version metadata
   *
   * @description
   * Retrieves detailed information about a specific document version including
   * metadata, file information, creation details, and change history.
   *
   * PHI Protection: Version may contain PHI - access is logged for audit trail
   *
   * @example
   * ```typescript
   * const versionService = new DocumentsVersionService(apiClient);
   *
   * const { version } = await versionService.getDocumentVersion('version-uuid-456');
   *
   * console.log(`Version Details:`);
   * console.log(`  Number: ${version.versionNumber}`);
   * console.log(`  Parent Document: ${version.parentDocumentId}`);
   * console.log(`  File: ${version.fileName}`);
   * console.log(`  Size: ${version.fileSize} bytes`);
   * console.log(`  MIME Type: ${version.mimeType}`);
   * console.log(`  Created: ${new Date(version.createdAt).toLocaleString()}`);
   * console.log(`  Notes: ${version.notes || 'None'}`);
   * 
   * if (version.changeDescription) {
   *   console.log(`  Changes: ${version.changeDescription}`);
   * }
   *
   * // Check if this version has signatures
   * if (version.signatures && version.signatures.length > 0) {
   *   console.log(`  Signatures: ${version.signatures.length}`);
   *   version.signatures.forEach(sig => {
   *     console.log(`    - ${sig.signedBy} (${sig.signatureType})`);
   *   });
   * }
   * ```
   */
  async getDocumentVersion(versionId: string): Promise<{ version: DocumentVersion }> {
    validateUUIDOrThrow(versionId, ERROR_MESSAGES.INVALID_VERSION_ID);
    
    const response = await this.client.get<ApiResponse<{ version: DocumentVersion }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/versions/${versionId}`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Download specific document version
   * @param documentId - Document UUID
   * @param versionId - Version UUID
   * @returns Blob containing the version file content
   *
   * @description
   * Downloads the file content for a specific document version. Returns the
   * exact file as it existed when that version was created.
   *
   * PHI Protection: Downloaded file may contain PHI - download is logged for audit trail
   *
   * @example
   * ```typescript
   * const versionService = new DocumentsVersionService(apiClient);
   *
   * try {
   *   const blob = await versionService.downloadVersion(
   *     'doc-uuid-123',
   *     'version-uuid-456'
   *   );
   *
   *   // Create download link
   *   const url = URL.createObjectURL(blob);
   *   const link = document.createElement('a');
   *   link.href = url;
   *   link.download = 'document-version-2.pdf';
   *   link.click();
   *
   *   // Cleanup
   *   URL.revokeObjectURL(url);
   * } catch (error) {
   *   console.error('Download failed:', error.message);
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Download and verify file integrity
   * const blob = await versionService.downloadVersion(docId, versionId);
   * const arrayBuffer = await blob.arrayBuffer();
   * const fileHash = await crypto.subtle.digest('SHA-256', arrayBuffer);
   * const hashArray = Array.from(new Uint8Array(fileHash));
   * const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   * 
   * console.log(`Downloaded file hash: ${hashHex}`);
   * console.log(`File size: ${blob.size} bytes`);
   * ```
   */
  async downloadVersion(documentId: string, versionId: string): Promise<Blob> {
    validateUUIDOrThrow(documentId, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    validateUUIDOrThrow(versionId, ERROR_MESSAGES.INVALID_VERSION_ID);

    const response = await this.client.get(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/versions/${versionId}/download`,
      { responseType: 'blob' }
    );
    
    return response.data as Blob;
  }

  /**
   * Compare two document versions
   * @param documentId - Document UUID
   * @param versionId1 - First version UUID (typically older)
   * @param versionId2 - Second version UUID (typically newer)
   * @returns Detailed comparison showing differences
   *
   * @description
   * Performs a comprehensive comparison between two versions of the same document.
   * Compares metadata, content changes, and provides detailed difference analysis
   * for audit and review purposes.
   *
   * PHI Protection: Comparison may reveal PHI - operation is logged for audit trail
   *
   * Comparison Features:
   * - Metadata differences (title, description, tags, etc.)
   * - File content changes (if text-based documents)
   * - File size and format differences
   * - Signature status changes
   * - Permission and sharing changes
   *
   * @example
   * ```typescript
   * const versionService = new DocumentsVersionService(apiClient);
   *
   * const comparison = await versionService.compareVersions(
   *   'doc-uuid-123',
   *   'version-1-uuid',
   *   'version-2-uuid'
   * );
   *
   * console.log(`Comparison between versions ${comparison.version1.versionNumber} and ${comparison.version2.versionNumber}:`);
   * console.log(`Total differences: ${comparison.differences.length}`);
   *
   * // Show metadata changes
   * comparison.differences.forEach(diff => {
   *   console.log(`${diff.field}: "${diff.oldValue}" → "${diff.newValue}"`);
   * });
   *
   * // Show file changes
   * if (comparison.fileComparison) {
   *   console.log(`File size: ${comparison.fileComparison.oldSize} → ${comparison.fileComparison.newSize} bytes`);
   *   if (comparison.fileComparison.contentChanges) {
   *     console.log(`Content changes: ${comparison.fileComparison.contentChanges.length} sections`);
   *   }
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Generate change summary for audit log
   * const comparison = await versionService.compareVersions(docId, oldVersion, newVersion);
   * 
   * const changeSummary = comparison.differences.map(diff => 
   *   `${diff.field}: ${diff.changeType}`
   * ).join(', ');
   * 
   * console.log(`Document updated: ${changeSummary}`);
   * 
   * if (comparison.significance === 'major') {
   *   console.log('⚠️ Major changes detected - review required');
   * }
   * ```
   */
  async compareVersions(
    documentId: string,
    versionId1: string,
    versionId2: string
  ): Promise<VersionComparison> {
    validateUUIDOrThrow(documentId, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    validateUUIDOrThrow(versionId1, ERROR_MESSAGES.INVALID_VERSION_ID);
    validateUUIDOrThrow(versionId2, ERROR_MESSAGES.INVALID_VERSION_ID);

    const validatedRequest = versionComparisonSchema.parse({
      documentId,
      versionId1,
      versionId2,
      comparisonType: 'content',
      includeContent: true,
    });

    const response = await this.client.post<ApiResponse<VersionComparison> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/versions/compare`,
      {
        versionId1: validatedRequest.versionId1,
        versionId2: validatedRequest.versionId2,
        comparisonType: validatedRequest.comparisonType,
        includeContent: validatedRequest.includeContent,
      }
    );
    
    return extractApiData(response as any);
  }
}

/**
 * Factory function to create version management service
 */
export function createDocumentsVersionService(client: BaseDocumentsService['client']): DocumentsVersionService {
  return new DocumentsVersionService(client);
}

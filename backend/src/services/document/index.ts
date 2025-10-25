/**
 * @fileoverview Document service facade aggregating all document management operations.
 *
 * Provides a unified interface for document lifecycle management, versioning, signatures,
 * search, sharing, templates, analytics, and compliance through the Facade pattern.
 * Delegates operations to specialized modules for improved maintainability.
 *
 * LOC: D6A44FD802-I
 * WC-GEN-259 | index.ts - Document service main aggregator
 *
 * UPSTREAM (imports from):
 *   - crud.operations.ts - CRUD operations
 *   - storage.operations.ts - Storage and access tracking
 *   - sharing.operations.ts - Document sharing
 *   - version.operations.ts - Version control
 *   - signature.operations.ts - Digital signatures
 *   - search.operations.ts - Search and retrieval
 *   - template.operations.ts - Template management
 *   - analytics.operations.ts - Statistics and analytics
 *   - audit.operations.ts - Audit trail operations
 *   - types.ts - TypeScript interfaces and types
 *
 * DOWNSTREAM (imported by):
 *   - routes/v1/documents.ts - Document API routes
 *   - Application controllers and services
 *
 * Architecture Pattern:
 * - Facade pattern for simplified API surface
 * - Modular operation separation by concern
 * - Delegation to specialized operation modules
 * - Type-safe interfaces for all operations
 *
 * Key Features:
 * - Complete document lifecycle management
 * - HIPAA-compliant storage and access tracking
 * - Digital signature workflows
 * - Version control with history
 * - Template-based document generation
 * - Comprehensive search and filtering
 * - Document sharing and permissions
 * - Analytics and statistics
 * - Full audit trail compliance
 *
 * @module services/document
 * @since 1.0.0
 */

// Export all types
export * from './types';

// Import all operations
import * as CrudOps from './crud.operations';
import * as StorageOps from './storage.operations';
import * as SharingOps from './sharing.operations';
import * as VersionOps from './version.operations';
import * as SignatureOps from './signature.operations';
import * as SearchOps from './search.operations';
import * as TemplateOps from './template.operations';
import * as AnalyticsOps from './analytics.operations';
import * as AuditOps from './audit.operations';

import type {
  CreateDocumentData,
  UpdateDocumentData,
  DocumentFilters,
  SignDocumentData,
  CreateFromTemplateData,
  DocumentListResponse,
  ShareDocumentResult,
  BulkDeleteResult,
  DocumentStatistics,
  DocumentCategoryMetadata
} from './types';
import type { DocumentCategory } from '../../database/types/enums';

/**
 * Enterprise document management service with HIPAA compliance and comprehensive audit trails.
 *
 * Provides a unified facade for all document operations including CRUD, versioning, signatures,
 * search, sharing, templates, and analytics. Delegates to specialized operation modules following
 * the Facade pattern for clean separation of concerns.
 *
 * @class DocumentService
 *
 * @example
 * ```typescript
 * // Create a new document
 * const doc = await DocumentService.createDocument({
 *   title: 'Student Health Assessment',
 *   category: DocumentCategory.HEALTH_RECORD,
 *   fileType: 'application/pdf',
 *   fileName: 'assessment.pdf',
 *   fileSize: 256000,
 *   fileUrl: 's3://docs/assessment.pdf',
 *   uploadedBy: 'nurse_001',
 *   studentId: 'student_12345'
 * });
 *
 * // Sign the document
 * await DocumentService.signDocument({
 *   documentId: doc.id,
 *   signedBy: 'nurse_001',
 *   signedByRole: 'school_nurse'
 * });
 *
 * // Search documents
 * const results = await DocumentService.searchDocuments('immunization', {
 *   category: DocumentCategory.IMMUNIZATION_RECORD
 * });
 * ```
 *
 * @remarks
 * - All operations include automatic audit logging for HIPAA compliance
 * - PHI documents receive special tracking and protection
 * - Transaction-safe operations with automatic rollback on errors
 * - Comprehensive validation before all database operations
 * - Retention policies automatically calculated and enforced
 *
 * @since 1.0.0
 */
export class DocumentService {
  // ========================================
  // CRUD Operations
  // ========================================

  /**
   * Get all documents with pagination and filters
   * @param page - Page number (1-indexed)
   * @param limit - Number of documents per page
   * @param filters - Optional filters for documents
   */
  static async getDocuments(
    page: number = 1,
    limit: number = 20,
    filters: DocumentFilters = {}
  ): Promise<DocumentListResponse> {
    return CrudOps.getDocuments(page, limit, filters);
  }

  /**
   * Get document by ID with all associations
   * @param id - Document ID
   */
  static async getDocumentById(id: string) {
    return CrudOps.getDocumentById(id);
  }

  /**
   * Create a new document
   * @param data - Document creation data
   */
  static async createDocument(data: CreateDocumentData) {
    return CrudOps.createDocument(data);
  }

  /**
   * Update an existing document
   * @param id - Document ID
   * @param data - Update data
   * @param updatedBy - User ID performing the update
   */
  static async updateDocument(id: string, data: UpdateDocumentData, updatedBy: string) {
    return CrudOps.updateDocument(id, data, updatedBy);
  }

  /**
   * Delete a document
   * @param id - Document ID
   * @param deletedBy - User ID performing the deletion
   */
  static async deleteDocument(id: string, deletedBy: string) {
    return CrudOps.deleteDocument(id, deletedBy);
  }

  /**
   * Bulk delete documents by IDs
   * @param documentIds - Array of document IDs to delete
   * @param deletedBy - User ID performing the deletion
   */
  static async bulkDeleteDocuments(documentIds: string[], deletedBy: string): Promise<BulkDeleteResult> {
    return CrudOps.bulkDeleteDocuments(documentIds, deletedBy);
  }

  // ========================================
  // Storage Operations
  // ========================================

  /**
   * Download a document (tracks access)
   * @param documentId - Document ID
   * @param downloadedBy - User ID downloading the document
   * @param ipAddress - Optional IP address of the downloader
   */
  static async downloadDocument(documentId: string, downloadedBy: string, ipAddress?: string) {
    return StorageOps.downloadDocument(documentId, downloadedBy, ipAddress);
  }

  /**
   * View a document (tracks access)
   * @param documentId - Document ID
   * @param viewedBy - User ID viewing the document
   * @param ipAddress - Optional IP address of the viewer
   */
  static async viewDocument(documentId: string, viewedBy: string, ipAddress?: string) {
    return StorageOps.viewDocument(documentId, viewedBy, ipAddress);
  }

  // ========================================
  // Sharing and Permissions
  // ========================================

  /**
   * Share a document with specified users
   * @param documentId - Document ID
   * @param sharedBy - User ID sharing the document
   * @param sharedWith - Array of user IDs to share with
   */
  static async shareDocument(
    documentId: string,
    sharedBy: string,
    sharedWith: string[]
  ): Promise<ShareDocumentResult> {
    return SharingOps.shareDocument(documentId, sharedBy, sharedWith);
  }

  // ========================================
  // Version Control
  // ========================================

  /**
   * Create a new version of an existing document
   * @param parentId - Parent document ID
   * @param data - Document data for new version
   */
  static async createDocumentVersion(parentId: string, data: CreateDocumentData) {
    return VersionOps.createDocumentVersion(parentId, data);
  }

  // ========================================
  // Signature Operations
  // ========================================

  /**
   * Sign a document
   * @param data - Signature data
   */
  static async signDocument(data: SignDocumentData) {
    return SignatureOps.signDocument(data);
  }

  /**
   * Get all signatures for a specific document
   * @param documentId - Document ID
   */
  static async getDocumentSignatures(documentId: string) {
    return SignatureOps.getDocumentSignatures(documentId);
  }

  // ========================================
  // Search and Retrieval
  // ========================================

  /**
   * Search documents across all fields
   * @param query - Search query string
   * @param filters - Optional additional filters
   */
  static async searchDocuments(query: string, filters: Partial<DocumentFilters> = {}) {
    return SearchOps.searchDocuments(query, filters);
  }

  /**
   * Get all documents for a specific student
   * @param studentId - Student ID
   */
  static async getStudentDocuments(studentId: string) {
    return SearchOps.getStudentDocuments(studentId);
  }

  /**
   * Get documents expiring within specified days
   * @param days - Number of days to look ahead
   */
  static async getExpiringDocuments(days: number = 30) {
    return SearchOps.getExpiringDocuments(days);
  }

  /**
   * Archive all expired documents
   */
  static async archiveExpiredDocuments() {
    return SearchOps.archiveExpiredDocuments();
  }

  /**
   * Get all document templates
   * @param category - Optional category filter
   */
  static async getTemplates(category?: DocumentCategory) {
    return SearchOps.getTemplates(category);
  }

  // ========================================
  // Template Operations
  // ========================================

  /**
   * Create a document from a template
   * @param templateId - Template document ID
   * @param data - Data for new document
   */
  static async createFromTemplate(templateId: string, data: CreateFromTemplateData) {
    return TemplateOps.createFromTemplate(templateId, data);
  }

  // ========================================
  // Analytics and Statistics
  // ========================================

  /**
   * Get comprehensive document statistics
   */
  static async getDocumentStatistics(): Promise<DocumentStatistics> {
    return AnalyticsOps.getDocumentStatistics();
  }

  /**
   * Get all document categories with metadata
   */
  static async getDocumentCategories(): Promise<DocumentCategoryMetadata[]> {
    return AnalyticsOps.getDocumentCategories();
  }

  // ========================================
  // Audit Trail Operations
  // ========================================

  /**
   * Get audit trail for a specific document
   * @param documentId - Document ID
   * @param limit - Maximum number of entries to retrieve
   */
  static async getDocumentAuditTrail(documentId: string, limit: number = 100) {
    return AuditOps.getDocumentAuditTrail(documentId, limit);
  }
}

// Re-export the DocumentService as default
export default DocumentService;

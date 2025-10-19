/**
 * LOC: D6A44FD802-I
 * WC-GEN-259 | index.ts - Document service main aggregator
 *
 * UPSTREAM (imports from):
 *   - All document operation modules
 *
 * DOWNSTREAM (imported by):
 *   - documents.ts (routes/documents.ts)
 */

/**
 * WC-GEN-259 | index.ts - Document service main aggregator
 * Purpose: Central export point for all document service operations
 * Upstream: Document operation modules | Dependencies: All document modules
 * Downstream: Routes, controllers | Called by: Application components
 * Related: documentService.ts (legacy), Document model
 * Exports: DocumentService class | Key Services: Document management facade
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Module aggregation → Service delegation → Operation execution
 * LLM Context: Facade pattern for enterprise document management system
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
 * Document Service
 * Handles all document management operations including creation, versioning,
 * signatures, and audit trail with full HIPAA compliance
 *
 * This service acts as a facade, delegating operations to specialized modules
 * for improved maintainability and separation of concerns.
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

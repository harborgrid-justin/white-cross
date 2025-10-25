/**
 * Documents Controller
 * Business logic for comprehensive document lifecycle management
 */

import { ResponseToolkit } from '@hapi/hapi';
import { DocumentService } from '../../../../services/document';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

export class DocumentsController {
  /**
   * DOCUMENT CRUD OPERATIONS
   */

  /**
   * List all documents with pagination and filters
   */
  static async listDocuments(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      category: { type: 'string' },
      status: { type: 'string' },
      studentId: { type: 'string' },
      uploadedBy: { type: 'string' },
      searchTerm: { type: 'string' },
      tags: { type: 'string' }
    });

    // Convert tags from comma-separated string to array
    if (filters.tags && typeof filters.tags === 'string') {
      filters.tags = filters.tags.split(',').map((tag: string) => tag.trim());
    }

    const result = await DocumentService.getDocuments(page, limit, filters);

    return paginatedResponse(
      h,
      result.documents,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const document = await DocumentService.getDocumentById(id);

    return successResponse(h, { document });
  }

  /**
   * Create new document
   */
  static async createDocument(request: AuthenticatedRequest, h: ResponseToolkit) {
    const uploadedBy = request.auth.credentials.userId as string;

    const documentData = {
      ...request.payload,
      uploadedBy
    };

    const document = await DocumentService.createDocument(documentData);

    return createdResponse(h, { document });
  }

  /**
   * Update document metadata
   */
  static async updateDocument(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const updatedBy = request.auth.credentials.userId as string;

    const document = await DocumentService.updateDocument(id, request.payload, updatedBy);

    return successResponse(h, { document });
  }

  /**
   * Delete/archive document
   */
  /**
   * Delete document - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async deleteDocument(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const deletedBy = request.auth.credentials.userId as string;

    await DocumentService.deleteDocument(id, deletedBy);

    return h.response().code(204);
  }

  /**
   * DOCUMENT FILE OPERATIONS
   */

  /**
   * Download document file
   */
  static async downloadDocument(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const downloadedBy = request.auth.credentials.userId as string;
    const ipAddress = request.info.remoteAddress;

    const document = await DocumentService.downloadDocument(id, downloadedBy, ipAddress);

    return successResponse(h, { document });
  }

  /**
   * View document (tracks access without download)
   */
  static async viewDocument(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const viewedBy = request.auth.credentials.userId as string;
    const ipAddress = request.info.remoteAddress;

    const document = await DocumentService.viewDocument(id, viewedBy, ipAddress);

    return successResponse(h, { document });
  }

  /**
   * DOCUMENT SIGNATURE OPERATIONS
   */

  /**
   * E-sign a document
   */
  static async signDocument(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const signedBy = request.auth.credentials.userId as string;
    const signedByRole = request.payload.signedByRole || request.auth.credentials.role;
    const ipAddress = request.info.remoteAddress;

    const signatureData = {
      documentId: id,
      signedBy,
      signedByRole,
      signatureData: request.payload.signatureData,
      ipAddress
    };

    const signature = await DocumentService.signDocument(signatureData);

    return createdResponse(h, { signature, message: 'Document signed successfully' });
  }

  /**
   * Get all signatures for a document
   */
  static async getDocumentSignatures(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const signatures = await DocumentService.getDocumentSignatures(id);

    return successResponse(h, { signatures });
  }

  /**
   * DOCUMENT VERSIONING
   */

  /**
   * Get version history for a document
   */
  static async getDocumentVersions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const document = await DocumentService.getDocumentById(id);

    return successResponse(h, { versions: document.versions || [] });
  }

  /**
   * Create new version of document
   */
  static async createDocumentVersion(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const uploadedBy = request.auth.credentials.userId as string;

    const versionData = {
      ...request.payload,
      uploadedBy
    };

    const document = await DocumentService.createDocumentVersion(id, versionData);

    return createdResponse(h, { document, message: 'Document version created successfully' });
  }

  /**
   * DOCUMENT SHARING
   */

  /**
   * Share document with users
   */
  static async shareDocument(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const sharedBy = request.auth.credentials.userId as string;
    const { sharedWith } = request.payload;

    const result = await DocumentService.shareDocument(id, sharedBy, sharedWith);

    return successResponse(h, {
      message: `Document shared with ${sharedWith.length} user(s)`,
      result
    });
  }

  /**
   * DOCUMENT TEMPLATES
   */

  /**
   * List all document templates
   */
  static async listTemplates(request: AuthenticatedRequest, h: ResponseToolkit) {
    const category = request.query.category;
    const templates = await DocumentService.getTemplates(category);

    return successResponse(h, { templates });
  }

  /**
   * Create document from template
   */
  static async createFromTemplate(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { templateId } = request.params;
    const uploadedBy = request.auth.credentials.userId as string;

    const documentData = {
      ...request.payload,
      uploadedBy
    };

    const document = await DocumentService.createFromTemplate(templateId, documentData);

    return createdResponse(h, { document, message: 'Document created from template successfully' });
  }

  /**
   * DOCUMENT SEARCH & RETRIEVAL
   */

  /**
   * Get all documents for a student
   */
  static async getStudentDocuments(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const documents = await DocumentService.getStudentDocuments(studentId);

    return successResponse(h, { documents });
  }

  /**
   * Search documents
   */
  static async searchDocuments(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { q: query, category, status, studentId } = request.query;

    const filters = {
      category,
      status,
      studentId
    };

    const documents = await DocumentService.searchDocuments(query, filters);

    return successResponse(h, { documents, query });
  }

  /**
   * Get expiring documents
   */
  static async getExpiringDocuments(request: AuthenticatedRequest, h: ResponseToolkit) {
    const days = parseInt(request.query.days as string) || 30;
    const documents = await DocumentService.getExpiringDocuments(days);

    return successResponse(h, {
      documents,
      expiringWithinDays: days,
      count: documents.length
    });
  }

  /**
   * DOCUMENT ANALYTICS & REPORTING
   */

  /**
   * Get document analytics and statistics
   */
  static async getDocumentAnalytics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const statistics = await DocumentService.getDocumentStatistics();

    return successResponse(h, { statistics });
  }

  /**
   * Get document categories with metadata
   */
  static async getDocumentCategories(request: AuthenticatedRequest, h: ResponseToolkit) {
    const categories = await DocumentService.getDocumentCategories();

    return successResponse(h, { categories });
  }

  /**
   * DOCUMENT AUDIT TRAIL
   */

  /**
   * Get audit trail for a document
   */
  static async getDocumentAuditTrail(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const limit = parseInt(request.query.limit as string) || 100;

    const auditTrail = await DocumentService.getDocumentAuditTrail(id, limit);

    return successResponse(h, { auditTrail });
  }

  /**
   * BULK OPERATIONS
   */

  /**
   * Bulk delete documents
   */
  static async bulkDeleteDocuments(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { documentIds } = request.payload;
    const deletedBy = request.auth.credentials.userId as string;

    const result = await DocumentService.bulkDeleteDocuments(documentIds, deletedBy);

    return successResponse(h, {
      message: `Bulk delete completed: ${result.deleted} deleted, ${result.notFound} not found`,
      result
    });
  }

  /**
   * Archive expired documents
   */
  static async archiveExpiredDocuments(request: AuthenticatedRequest, h: ResponseToolkit) {
    const result = await DocumentService.archiveExpiredDocuments();

    return successResponse(h, {
      message: `Archived ${result.archived} expired document(s)`,
      result
    });
  }
}

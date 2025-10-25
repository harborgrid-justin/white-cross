/**
 * @fileoverview Document CRUD operations with HIPAA compliance and comprehensive auditing.
 *
 * Provides transaction-safe create, read, update, and delete operations for documents
 * with automatic audit trail logging, retention policy enforcement, and data validation.
 * All operations are designed for healthcare compliance with PHI protection.
 *
 * LOC: D6A44FD802-C
 * WC-GEN-250 | crud.operations.ts - Document CRUD operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts - Winston logging for operations tracking
 *   - database/models - Document, DocumentSignature, DocumentAuditTrail, Student models
 *   - types.ts - TypeScript interfaces for document operations
 *   - audit.operations.ts - Audit trail creation functions
 *   - documentValidation.ts - Validation utilities and rules
 *
 * DOWNSTREAM (imported by):
 *   - index.ts - Document service aggregator
 *   - documentService.ts - Main document orchestration service
 *
 * Key Features:
 * - Transaction-safe CRUD operations with automatic rollback on errors
 * - Comprehensive validation before database operations
 * - Automatic audit trail creation for HIPAA compliance
 * - Retention policy calculation and enforcement
 * - Multi-criteria document filtering and search
 * - Paginated list queries for large document sets
 * - Bulk operations with detailed result tracking
 *
 * Compliance Notes:
 * - All document operations logged to audit trail
 * - Retention dates calculated per category-specific policies
 * - PHI flags tracked for access monitoring
 * - Student verification before document creation
 *
 * @module services/document/crud.operations
 * @since 1.0.0
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  Document,
  DocumentSignature,
  DocumentAuditTrail,
  Student,
  sequelize
} from '../../database/models';
import {
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
  DocumentAction
} from '../../database/types/enums';
import {
  validateDocumentCreation,
  validateDocumentUpdate,
  validateDocumentCanBeDeleted,
  throwIfValidationErrors,
  DocumentValidationError,
  calculateDefaultRetentionDate,
} from '../../utils/documentValidation';
import {
  CreateDocumentData,
  UpdateDocumentData,
  DocumentFilters,
  DocumentListResponse
} from './types';
import { addAuditTrail } from './audit.operations';

/**
 * Retrieve documents with pagination, filtering, and related associations.
 *
 * Supports multi-criteria filtering including category, status, student, uploader,
 * full-text search, and tag matching. Returns documents with version history
 * and signature information eagerly loaded for efficient client rendering.
 *
 * @async
 * @param {number} [page=1] - Page number (1-indexed) for pagination
 * @param {number} [limit=20] - Maximum number of documents per page (default: 20)
 * @param {DocumentFilters} [filters={}] - Optional filter criteria:
 *   - category: Filter by document category (MEDICAL_RECORD, CONSENT_FORM, etc.)
 *   - status: Filter by status (DRAFT, ACTIVE, ARCHIVED, etc.)
 *   - studentId: Filter documents for specific student
 *   - uploadedBy: Filter by uploader user ID
 *   - searchTerm: Full-text search in title, description, fileName (case-insensitive)
 *   - tags: Array of tags (documents matching ANY tag returned)
 *
 * @returns {Promise<DocumentListResponse>} Paginated document list with metadata:
 *   - documents: Array of document objects with versions and signatures
 *   - pagination: {page, limit, total, pages} metadata
 *
 * @throws {Error} If database query fails or filters are malformed
 *
 * @example
 * ```typescript
 * // Get first page of consent forms for a student
 * const result = await getDocuments(1, 25, {
 *   category: DocumentCategory.CONSENT_FORM,
 *   status: DocumentStatus.ACTIVE,
 *   studentId: 'student_12345'
 * });
 * console.log(`Found ${result.pagination.total} consent forms`);
 *
 * // Full-text search across all documents
 * const searchResults = await getDocuments(1, 50, {
 *   searchTerm: 'immunization'
 * });
 * ```
 *
 * @remarks
 * - Documents ordered by createdAt DESC (newest first)
 * - Includes up to 5 most recent versions per document
 * - Includes all digital signatures
 * - Uses PostgreSQL ILIKE for case-insensitive search
 * - Tags use PostgreSQL array overlap operator for efficient matching
 */
export async function getDocuments(
  page: number = 1,
  limit: number = 20,
  filters: DocumentFilters = {}
): Promise<DocumentListResponse> {
  try {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    // Apply filters
    if (filters.category) {
      whereClause.category = filters.category;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }
    if (filters.uploadedBy) {
      whereClause.uploadedBy = filters.uploadedBy;
    }
    if (filters.searchTerm) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { description: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { fileName: { [Op.iLike]: `%${filters.searchTerm}%` } }
      ];
    }
    if (filters.tags && filters.tags.length > 0) {
      whereClause.tags = { [Op.overlap]: filters.tags };
    }

    const { rows: documents, count: total } = await Document.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      include: [
        {
          model: Document,
          as: 'versions',
          limit: 5,
          separate: true,
          order: [['version', 'DESC']]
        },
        {
          model: DocumentSignature,
          as: 'signatures'
        }
      ],
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    logger.info(`Retrieved ${documents.length} documents`);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error getting documents:', error);
    throw new Error('Failed to retrieve documents');
  }
}

/**
 * Retrieve a single document by ID with complete associations.
 *
 * Loads document with parent reference, all versions, digital signatures,
 * and audit trail history (limited to most recent 50 entries). Used for
 * detailed document views and compliance reporting.
 *
 * @async
 * @param {string} id - Unique document identifier (UUID)
 *
 * @returns {Promise<Document>} Document instance with all associations:
 *   - parent: Parent document (if this is a version)
 *   - versions: All document versions ordered by version DESC
 *   - signatures: All digital signatures ordered by signedAt DESC
 *   - auditTrail: Most recent 50 audit entries ordered by createdAt DESC
 *
 * @throws {Error} If document not found or database query fails
 *
 * @example
 * ```typescript
 * const document = await getDocumentById('doc_123');
 * console.log(`Version ${document.version} of "${document.title}"`);
 * console.log(`Signed by ${document.signatures?.length || 0} parties`);
 * console.log(`Audit trail: ${document.auditTrail?.length || 0} entries`);
 * ```
 *
 * @remarks
 * - Throws specific error if document does not exist
 * - Audit trail limited to 50 most recent entries for performance
 * - All related collections ordered for chronological display
 */
export async function getDocumentById(id: string) {
  try {
    const document = await Document.findByPk(id, {
      include: [
        {
          model: Document,
          as: 'parent'
        },
        {
          model: Document,
          as: 'versions',
          separate: true,
          order: [['version', 'DESC']]
        },
        {
          model: DocumentSignature,
          as: 'signatures',
          separate: true,
          order: [['signedAt', 'DESC']]
        },
        {
          model: DocumentAuditTrail,
          as: 'auditTrail',
          limit: 50,
          separate: true,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!document) {
      throw new Error('Document not found');
    }

    logger.info(`Retrieved document: ${id}`);
    return document;
  } catch (error) {
    logger.error(`Error getting document ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new document with comprehensive validation and audit logging.
 *
 * Validates document metadata, verifies student existence (if applicable),
 * calculates retention date per category policy, and creates audit trail entry.
 * All operations performed within a database transaction for atomicity.
 *
 * @async
 * @param {CreateDocumentData} data - Document creation data including:
 *   - title: Document title (required, trimmed, max 255 chars)
 *   - description: Optional detailed description
 *   - category: Document category (determines retention policy)
 *   - fileType: MIME type (normalized to lowercase)
 *   - fileName: Original filename (trimmed)
 *   - fileSize: Size in bytes (for quota tracking)
 *   - fileUrl: Storage URL or S3 key
 *   - uploadedBy: User ID of uploader (for audit)
 *   - studentId: Optional student association
 *   - tags: Optional searchable tags (trimmed)
 *   - isTemplate: Whether this is a reusable template
 *   - templateData: Template configuration
 *   - accessLevel: Access control level (defaults to STAFF_ONLY)
 *
 * @returns {Promise<Document>} Created document with signatures association loaded
 *
 * @throws {DocumentValidationError} If validation fails (title, category, file constraints)
 * @throws {Error} If student not found or database operation fails
 *
 * @example
 * ```typescript
 * const newDoc = await createDocument({
 *   title: 'Annual Health Assessment',
 *   category: DocumentCategory.HEALTH_RECORD,
 *   fileType: 'application/pdf',
 *   fileName: 'assessment_2025.pdf',
 *   fileSize: 245760,
 *   fileUrl: 's3://docs/health/assessment_2025.pdf',
 *   uploadedBy: 'nurse_001',
 *   studentId: 'student_12345',
 *   tags: ['health', 'annual', '2025']
 * });
 * console.log(`Created document ${newDoc.id}, retention until ${newDoc.retentionDate}`);
 * ```
 *
 * @remarks
 * - Initial status set to DRAFT
 * - Version automatically set to 1
 * - Retention date calculated per RETENTION_YEARS config
 * - Student verification prevents orphaned documents
 * - Transaction ensures atomicity (all or nothing)
 * - Audit trail entry created with CREATED action
 */
export async function createDocument(data: CreateDocumentData) {
  const transaction = await sequelize.transaction();

  try {
    // Validate document creation data
    const validationErrors = validateDocumentCreation({
      title: data.title,
      description: data.description,
      category: data.category,
      fileType: data.fileType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      tags: data.tags,
      accessLevel: data.accessLevel,
    });

    throwIfValidationErrors(validationErrors);

    // Verify student exists if studentId is provided
    if (data.studentId) {
      const student = await Student.findByPk(data.studentId);
      if (!student) {
        throw new Error('Student not found');
      }
    }

    // Calculate default retention date based on category
    const defaultRetentionDate = calculateDefaultRetentionDate(data.category as DocumentCategory);

    // Create the document
    const document = await Document.create({
      title: data.title.trim(),
      description: data.description?.trim(),
      category: data.category,
      fileType: data.fileType.toLowerCase().trim(),
      fileName: data.fileName.trim(),
      fileSize: data.fileSize,
      fileUrl: data.fileUrl,
      uploadedBy: data.uploadedBy,
      studentId: data.studentId,
      tags: data.tags?.map(tag => tag.trim()) || [],
      isTemplate: data.isTemplate || false,
      templateData: data.templateData,
      status: DocumentStatus.DRAFT,
      version: 1,
      accessLevel: data.accessLevel || DocumentAccessLevel.STAFF_ONLY,
      retentionDate: defaultRetentionDate,
    }, { transaction });

    // Create audit trail entry
    await addAuditTrail(
      document.id,
      DocumentAction.CREATED,
      data.uploadedBy,
      undefined,
      transaction
    );

    await transaction.commit();

    // Reload with associations
    await document.reload({
      include: [
        {
          model: DocumentSignature,
          as: 'signatures'
        }
      ]
    });

    logger.info(`Created document: ${document.id} - ${document.title}`);
    return document;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating document:', error);
    throw error;
  }
}

/**
 * Update an existing document's metadata with validation and audit tracking.
 *
 * Validates update data against current document state, applies sanitization,
 * and creates audit trail entry documenting changes. Status changes may affect
 * retention calculations. All operations in database transaction.
 *
 * @async
 * @param {string} id - Document ID to update
 * @param {UpdateDocumentData} data - Partial update data (all fields optional):
 *   - title: Updated document title
 *   - description: Updated description
 *   - status: New status (DRAFT, ACTIVE, APPROVED, ARCHIVED, EXPIRED)
 *   - tags: Updated tags array (replaces existing)
 *   - retentionDate: Manual retention date override
 *   - accessLevel: Updated access control level
 * @param {string} updatedBy - User ID performing the update (for audit trail)
 *
 * @returns {Promise<Document>} Updated document with signatures and versions loaded
 *
 * @throws {Error} If document not found
 * @throws {DocumentValidationError} If validation fails (status transition, retention constraints)
 *
 * @example
 * ```typescript
 * const updated = await updateDocument('doc_123', {
 *   status: DocumentStatus.ACTIVE,
 *   tags: ['health', 'annual', '2025', 'reviewed']
 * }, 'nurse_001');
 * console.log(`Document ${updated.id} activated`);
 * ```
 *
 * @remarks
 * - All text fields trimmed for consistency
 * - Status changes validated against current state
 * - Tags array completely replaced (not merged)
 * - Audit trail captures all changed fields
 * - Transaction ensures atomicity
 * - Document reloaded with associations after update
 */
export async function updateDocument(id: string, data: UpdateDocumentData, updatedBy: string) {
  const transaction = await sequelize.transaction();

  try {
    const document = await Document.findByPk(id);

    if (!document) {
      throw new Error('Document not found');
    }

    // Validate update data
    const validationErrors = validateDocumentUpdate(
      document.status,
      {
        title: data.title,
        description: data.description,
        status: data.status,
        tags: data.tags,
        retentionDate: data.retentionDate,
        accessLevel: data.accessLevel,
      },
      document.category
    );

    throwIfValidationErrors(validationErrors);

    // Build update data with sanitization
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined) updateData.description = data.description?.trim();
    if (data.status !== undefined) updateData.status = data.status;
    if (data.tags !== undefined) updateData.tags = data.tags.map(tag => tag.trim());
    if (data.retentionDate !== undefined) updateData.retentionDate = data.retentionDate;
    if (data.accessLevel !== undefined) updateData.accessLevel = data.accessLevel;

    // Update the document
    await document.update(updateData, { transaction });

    // Create audit trail entry with changes
    await addAuditTrail(
      id,
      DocumentAction.UPDATED,
      updatedBy,
      data,
      transaction
    );

    await transaction.commit();

    // Reload with associations
    await document.reload({
      include: [
        {
          model: DocumentSignature,
          as: 'signatures'
        },
        {
          model: Document,
          as: 'versions'
        }
      ]
    });

    logger.info(`Updated document: ${id}`);
    return document;
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error updating document ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a document with validation and audit logging.
 *
 * Validates that document can be deleted (based on status and category),
 * creates audit trail entry, then performs cascade deletion (removes
 * signatures and audit trail via database constraints).
 *
 * @async
 * @param {string} id - Document ID to delete
 * @param {string} deletedBy - User ID performing deletion (for audit trail)
 *
 * @returns {Promise<{success: boolean}>} Deletion success indicator
 *
 * @throws {Error} If document not found
 * @throws {DocumentValidationError} If document cannot be deleted (e.g., signed, active medical records)
 *
 * @example
 * ```typescript
 * try {
 *   await deleteDocument('doc_123', 'admin_001');
 *   console.log('Document deleted successfully');
 * } catch (error) {
 *   if (error instanceof DocumentValidationError) {
 *     console.error('Cannot delete:', error.message);
 *   }
 * }
 * ```
 *
 * @remarks
 * - Deletion validation prevents accidental removal of critical documents
 * - Signed documents typically cannot be deleted (compliance requirement)
 * - Audit trail entry created BEFORE deletion for compliance
 * - Cascade delete removes signatures and audit trail automatically
 * - Transaction ensures atomicity
 * - Some document categories may have permanent retention requirements
 */
export async function deleteDocument(id: string, deletedBy: string) {
  const transaction = await sequelize.transaction();

  try {
    const document = await Document.findByPk(id);

    if (!document) {
      throw new Error('Document not found');
    }

    // Validate if document can be deleted
    const deletionError = validateDocumentCanBeDeleted(document.status, document.category);
    if (deletionError) {
      throw new DocumentValidationError([deletionError]);
    }

    // Create audit trail entry before deletion
    await addAuditTrail(
      id,
      DocumentAction.DELETED,
      deletedBy,
      undefined,
      transaction
    );

    // Delete the document (cascade will handle signatures and audit trail)
    await document.destroy({ transaction });

    await transaction.commit();

    logger.info(`Deleted document: ${id}`);
    return { success: true };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error deleting document ${id}:`, error);
    throw error;
  }
}

/**
 * Bulk delete multiple documents with detailed result tracking.
 *
 * Deletes multiple documents in a single transaction with audit trail
 * entries for each deletion. Returns statistics on successful deletions
 * and documents not found. Useful for cleanup operations.
 *
 * @async
 * @param {string[]} documentIds - Array of document IDs to delete
 * @param {string} deletedBy - User ID performing bulk deletion (for audit trail)
 *
 * @returns {Promise<BulkDeleteResult>} Deletion statistics:
 *   - deleted: Number of documents successfully deleted
 *   - notFound: Number of document IDs not found in database
 *   - success: Overall operation success (true if at least one deleted)
 *
 * @throws {Error} If documentIds array is empty or null
 *
 * @example
 * ```typescript
 * const result = await bulkDeleteDocuments(
 *   ['doc_1', 'doc_2', 'doc_3', 'doc_invalid'],
 *   'admin_001'
 * );
 * console.log(`Deleted: ${result.deleted}, Not found: ${result.notFound}`);
 * // Output: Deleted: 3, Not found: 1
 * ```
 *
 * @remarks
 * - Audit trail entry created for each document before deletion
 * - Entries marked with bulkDelete flag for reporting
 * - Transaction ensures all-or-nothing semantics
 * - Does not throw on missing documents (returns count instead)
 * - Efficient single-query deletion after audit trail creation
 * - Cascade delete removes all related records automatically
 */
export async function bulkDeleteDocuments(documentIds: string[], deletedBy: string) {
  const transaction = await sequelize.transaction();

  try {
    if (!documentIds || documentIds.length === 0) {
      throw new Error('No document IDs provided');
    }

    // Get documents to be deleted for logging
    const documentsToDelete = await Document.findAll({
      where: {
        id: { [Op.in]: documentIds }
      },
      transaction
    });

    // Create audit trail entries for each document
    for (const doc of documentsToDelete) {
      await addAuditTrail(
        doc.id,
        DocumentAction.DELETED,
        deletedBy,
        { bulkDelete: true },
        transaction
      );
    }

    // Delete the documents
    const deletedCount = await Document.destroy({
      where: {
        id: { [Op.in]: documentIds }
      },
      transaction
    });

    await transaction.commit();

    const notFoundCount = documentIds.length - deletedCount;

    logger.info(`Bulk delete completed: ${deletedCount} documents deleted, ${notFoundCount} not found`);

    return {
      deleted: deletedCount,
      notFound: notFoundCount,
      success: true
    };
  } catch (error) {
    await transaction.rollback();
    logger.error('Error in bulk delete operation:', error);
    throw error;
  }
}

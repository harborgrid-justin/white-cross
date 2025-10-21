/**
 * LOC: D6A44FD802-C
 * WC-GEN-250 | crud.operations.ts - Document CRUD operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - database/models
 *   - types.ts
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (document service aggregator)
 */

/**
 * WC-GEN-250 | crud.operations.ts - Document CRUD operations
 * Purpose: Core create, read, update, delete operations for documents
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: Document service index | Called by: DocumentService class
 * Related: Document model, audit operations
 * Exports: CRUD functions | Key Services: Document lifecycle management
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Validation → Database transaction → Audit logging
 * LLM Context: Enterprise-grade CRUD with HIPAA compliance, transaction safety
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
 * Get all documents with pagination and filters
 * @param page - Page number (1-indexed)
 * @param limit - Number of documents per page
 * @param filters - Optional filters for documents
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
 * Get document by ID with all associations
 * @param id - Document ID
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
 * Create a new document
 * @param data - Document creation data
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
 * Update an existing document
 * @param id - Document ID
 * @param data - Update data
 * @param updatedBy - User ID performing the update
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
 * Delete a document
 * @param id - Document ID
 * @param deletedBy - User ID performing the deletion
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
 * Bulk delete documents by IDs
 * @param documentIds - Array of document IDs to delete
 * @param deletedBy - User ID performing the deletion
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

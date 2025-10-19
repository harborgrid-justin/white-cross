/**
 * LOC: D6A44FD802-V
 * WC-GEN-253 | version.operations.ts - Document version control
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
 * WC-GEN-253 | version.operations.ts - Document version control
 * Purpose: Document versioning, version creation, and version management
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: Document service index | Called by: DocumentService class
 * Related: Document model, audit operations
 * Exports: Version functions | Key Services: Version control
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Version validation → Version creation → Audit logging
 * LLM Context: Enterprise document versioning with audit compliance
 */

import { logger } from '../../utils/logger';
import { Document, sequelize } from '../../database/models';
import { DocumentStatus, DocumentAction } from '../../database/types/enums';
import {
  validateVersionCreation,
  validateFileUpload,
  throwIfValidationErrors,
  DocumentValidationError,
} from '../../utils/documentValidation';
import { CreateDocumentData } from './types';
import { addAuditTrail } from './audit.operations';

/**
 * Create a new version of an existing document
 * @param parentId - Parent document ID
 * @param data - Document data for new version
 */
export async function createDocumentVersion(
  parentId: string,
  data: CreateDocumentData
) {
  const transaction = await sequelize.transaction();

  try {
    const parent = await Document.findByPk(parentId, {
      include: [
        {
          model: Document,
          as: 'versions'
        }
      ],
      transaction
    });

    if (!parent) {
      throw new Error('Parent document not found');
    }

    // Validate if new version can be created
    const versionCount = parent.versions?.length || 0;
    const versionError = validateVersionCreation(parent.status, versionCount);
    if (versionError) {
      throw new DocumentValidationError([versionError]);
    }

    // Validate file upload for new version
    const fileErrors = validateFileUpload(data.fileName, data.fileType, data.fileSize);
    throwIfValidationErrors(fileErrors);

    const newVersion = parent.version + 1;

    // Create new document version
    const document = await Document.create({
      title: data.title || parent.title,
      description: data.description || parent.description,
      category: parent.category,
      fileType: data.fileType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileUrl: data.fileUrl,
      uploadedBy: data.uploadedBy,
      studentId: parent.studentId,
      tags: data.tags || parent.tags,
      isTemplate: parent.isTemplate,
      templateData: data.templateData || parent.templateData,
      status: DocumentStatus.DRAFT,
      version: newVersion,
      accessLevel: parent.accessLevel,
      parentId: parentId
    }, { transaction });

    // Create audit trail entry
    await addAuditTrail(
      document.id,
      DocumentAction.CREATED,
      data.uploadedBy,
      { version: newVersion, parentId },
      transaction
    );

    await transaction.commit();

    logger.info(`Created document version ${newVersion}: ${document.id}`);
    return document;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating document version:', error);
    throw error;
  }
}

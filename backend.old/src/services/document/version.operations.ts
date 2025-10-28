/**
 * @fileoverview Document version control operations for enterprise version management.
 *
 * Provides document versioning capabilities with parent-child relationships, version
 * numbering, inheritance of metadata, and comprehensive audit trails. Supports
 * collaborative document workflows with version history tracking.
 *
 * LOC: D6A44FD802-V
 * WC-GEN-253 | version.operations.ts - Document version control
 *
 * UPSTREAM (imports from):
 *   - logger.ts - Winston logging for version operations
 *   - database/models - Document model with version associations
 *   - documentValidation.ts - Version creation and file upload validation
 *   - types.ts - CreateDocumentData interface
 *   - audit.operations.ts - Audit trail creation
 *
 * DOWNSTREAM (imported by):
 *   - index.ts - Document service aggregator
 *   - documentService.ts - Main document orchestration service
 *
 * Key Features:
 * - Automatic version number incrementation
 * - Parent-child document relationships
 * - Metadata inheritance from parent document
 * - Version count limits and validation
 * - File upload validation for new versions
 * - Comprehensive audit trail for version history
 * - Transaction-safe operations
 *
 * Version Management Rules:
 * - New versions start in DRAFT status
 * - Version numbers auto-increment from parent
 * - Student ID, category, and access level inherited from parent
 * - Title and description can be overridden
 * - Tags and template data can be updated
 * - Parent must exist and be in appropriate status
 *
 * @module services/document/version.operations
 * @since 1.0.0
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
 * Create a new version of an existing document with metadata inheritance.
 *
 * Creates a new document as a version of an existing parent document. Inherits
 * category, student ID, and access level from parent. Validates version limits
 * and file upload constraints. New version starts in DRAFT status.
 *
 * @async
 * @param {string} parentId - ID of parent document to create version from
 * @param {CreateDocumentData} data - Version document data:
 *   - title: Optional new title (defaults to parent title)
 *   - description: Optional new description (defaults to parent description)
 *   - fileType: MIME type of new file (required, must pass validation)
 *   - fileName: New filename (required, must pass validation)
 *   - fileSize: New file size in bytes (required, must pass validation)
 *   - fileUrl: Storage URL for new file version
 *   - uploadedBy: User ID creating the version
 *   - tags: Optional new tags (defaults to parent tags)
 *   - templateData: Optional new template data (defaults to parent)
 *
 * @returns {Promise<Document>} Created version document with version number and parent reference
 *
 * @throws {Error} If parent document not found
 * @throws {DocumentValidationError} If version creation not allowed (status, count limit) or file validation fails
 *
 * @example
 * ```typescript
 * const newVersion = await createDocumentVersion('doc_123', {
 *   title: 'Updated Health Assessment', // Optional override
 *   fileType: 'application/pdf',
 *   fileName: 'assessment_v2.pdf',
 *   fileSize: 256000,
 *   fileUrl: 's3://docs/health/assessment_v2.pdf',
 *   uploadedBy: 'nurse_001',
 *   tags: ['health', 'annual', '2025', 'revised']
 * });
 * console.log(`Created version ${newVersion.version} of parent document`);
 * ```
 *
 * @remarks
 * - Version number automatically incremented from parent (parent.version + 1)
 * - New version inherits: category, studentId, accessLevel, isTemplate from parent
 * - New version starts in DRAFT status regardless of parent status
 * - Parent ID stored in parentId field for relationship
 * - Audit trail entry created with version number and parent ID
 * - File upload validation ensures size and type constraints
 * - Version count limits prevent excessive version proliferation
 * - Transaction ensures atomic version creation and audit logging
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

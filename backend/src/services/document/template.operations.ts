/**
 * LOC: D6A44FD802-T
 * WC-GEN-256 | template.operations.ts - Document template operations
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
 * WC-GEN-256 | template.operations.ts - Document template operations
 * Purpose: Document template creation and instantiation
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: Document service index | Called by: DocumentService class
 * Related: Document model, audit operations
 * Exports: Template functions | Key Services: Template management
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Template validation → Document creation → Audit logging
 * LLM Context: Healthcare document templates for standardized form generation
 */

import { logger } from '../../utils/logger';
import { Document, sequelize } from '../../database/models';
import { DocumentStatus, DocumentAction } from '../../database/types/enums';
import { CreateFromTemplateData } from './types';
import { addAuditTrail } from './audit.operations';

/**
 * Create a document from a template
 * @param templateId - Template document ID
 * @param data - Data for new document
 */
export async function createFromTemplate(
  templateId: string,
  data: CreateFromTemplateData
) {
  const transaction = await sequelize.transaction();

  try {
    const template = await Document.findByPk(templateId);

    if (!template || !template.isTemplate) {
      throw new Error('Template not found');
    }

    // Merge template data with provided data
    const mergedTemplateData = data.templateData
      ? { ...(template.templateData || {}), ...data.templateData }
      : template.templateData;

    // Create document from template
    const document = await Document.create({
      title: data.title,
      description: template.description,
      category: template.category,
      fileType: template.fileType,
      fileName: `${data.title}.${template.fileType}`,
      fileSize: 0, // Will be updated when file is generated
      fileUrl: '', // Will be updated when file is generated
      uploadedBy: data.uploadedBy,
      studentId: data.studentId,
      tags: template.tags,
      isTemplate: false,
      templateData: mergedTemplateData,
      status: DocumentStatus.DRAFT,
      version: 1,
      accessLevel: template.accessLevel
    }, { transaction });

    // Create audit trail entry
    await addAuditTrail(
      document.id,
      DocumentAction.CREATED,
      data.uploadedBy,
      { fromTemplate: templateId },
      transaction
    );

    await transaction.commit();

    logger.info(`Created document from template: ${document.id}`);
    return document;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating document from template:', error);
    throw error;
  }
}

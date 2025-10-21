/**
 * LOC: D6A44FD802-S
 * WC-GEN-251 | storage.operations.ts - Document storage operations
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
 * WC-GEN-251 | storage.operations.ts - Document storage operations
 * Purpose: File upload, download, access tracking for document storage
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: Document service index | Called by: DocumentService class
 * Related: Document model, audit operations
 * Exports: Storage functions | Key Services: File lifecycle, access tracking
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Access validation → Storage operation → Audit logging
 * LLM Context: HIPAA-compliant document storage with comprehensive access tracking
 */

import { logger } from '../../utils/logger';
import {
  Document,
  DocumentSignature,
  DocumentAuditTrail,
  sequelize
} from '../../database/models';
import { DocumentAction } from '../../database/types/enums';
import { addAuditTrail } from './audit.operations';

/**
 * Download a document (tracks access)
 * @param documentId - Document ID
 * @param downloadedBy - User ID downloading the document
 * @param ipAddress - Optional IP address of the downloader
 */
export async function downloadDocument(documentId: string, downloadedBy: string, ipAddress?: string) {
  const transaction = await sequelize.transaction();

  try {
    const document = await Document.findByPk(documentId, { transaction });

    if (!document) {
      throw new Error('Document not found');
    }

    // Update access tracking for HIPAA compliance
    await document.update(
      {
        lastAccessedAt: new Date(),
        accessCount: document.accessCount + 1,
      },
      { transaction }
    );

    // Create audit trail entry with PHI flag
    await addAuditTrail(
      documentId,
      DocumentAction.DOWNLOADED,
      downloadedBy,
      { ipAddress, containsPHI: document.containsPHI },
      transaction
    );

    await transaction.commit();

    // Reload with associations
    await document.reload({
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

    logger.info(`Document downloaded: ${documentId} by ${downloadedBy}${document.containsPHI ? ' [PHI]' : ''}`);
    return document;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error downloading document:', error);
    throw error;
  }
}

/**
 * View a document (tracks access)
 * @param documentId - Document ID
 * @param viewedBy - User ID viewing the document
 * @param ipAddress - Optional IP address of the viewer
 */
export async function viewDocument(documentId: string, viewedBy: string, ipAddress?: string) {
  const transaction = await sequelize.transaction();

  try {
    const document = await Document.findByPk(documentId, { transaction });

    if (!document) {
      throw new Error('Document not found');
    }

    // Update access tracking for HIPAA compliance
    await document.update(
      {
        lastAccessedAt: new Date(),
        accessCount: document.accessCount + 1,
      },
      { transaction }
    );

    // Create audit trail entry
    await addAuditTrail(
      documentId,
      DocumentAction.VIEWED,
      viewedBy,
      { ipAddress, containsPHI: document.containsPHI },
      transaction
    );

    await transaction.commit();

    // Reload with associations
    await document.reload({
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

    logger.info(`Document viewed: ${documentId} by ${viewedBy}${document.containsPHI ? ' [PHI]' : ''}`);
    return document;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error viewing document:', error);
    throw error;
  }
}

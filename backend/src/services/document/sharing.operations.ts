/**
 * LOC: D6A44FD802-SH
 * WC-GEN-252 | sharing.operations.ts - Document sharing and permissions
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
 * WC-GEN-252 | sharing.operations.ts - Document sharing and permissions
 * Purpose: Document sharing, access control, and permission management
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: Document service index | Called by: DocumentService class
 * Related: Document model, audit operations
 * Exports: Sharing functions | Key Services: Access control, sharing
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Permission validation → Sharing operation → Audit logging
 * LLM Context: HIPAA-compliant document sharing with access control
 */

import { logger } from '../../utils/logger';
import { Document } from '../../database/models';
import { DocumentStatus, DocumentAction } from '../../database/types/enums';
import {
  validateSharePermissions,
  throwIfValidationErrors,
  DocumentValidationError,
} from '../../utils/documentValidation';
import { ShareDocumentResult } from './types';
import { addAuditTrail } from './audit.operations';

/**
 * Share a document with specified users
 * @param documentId - Document ID
 * @param sharedBy - User ID sharing the document
 * @param sharedWith - Array of user IDs to share with
 */
export async function shareDocument(
  documentId: string,
  sharedBy: string,
  sharedWith: string[]
): Promise<ShareDocumentResult> {
  try {
    // Validate share permissions
    const shareErrors = validateSharePermissions(sharedWith);
    throwIfValidationErrors(shareErrors);

    // Verify document exists
    const document = await Document.findByPk(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // Validate document is not archived or expired
    if (document.status === DocumentStatus.ARCHIVED || document.status === DocumentStatus.EXPIRED) {
      throw new DocumentValidationError([{
        field: 'status',
        message: `Cannot share ${document.status.toLowerCase()} documents`,
        code: 'DOCUMENT_NOT_SHAREABLE',
        value: document.status,
      }]);
    }

    // Create audit trail entry
    await addAuditTrail(
      documentId,
      DocumentAction.SHARED,
      sharedBy,
      { sharedWith }
    );

    logger.info(`Document shared: ${documentId} with ${sharedWith.length} users`);
    return { success: true, sharedWith };
  } catch (error) {
    logger.error('Error sharing document:', error);
    throw error;
  }
}

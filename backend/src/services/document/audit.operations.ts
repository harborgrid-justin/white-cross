/**
 * LOC: D6A44FD802-AU
 * WC-GEN-258 | audit.operations.ts - Document audit trail operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - database/models
 *
 * DOWNSTREAM (imported by):
 *   - All document operation modules
 */

/**
 * WC-GEN-258 | audit.operations.ts - Document audit trail operations
 * Purpose: HIPAA-compliant audit trail creation and retrieval
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: All document operations | Called by: All document modules
 * Related: DocumentAuditTrail model
 * Exports: Audit functions | Key Services: Audit logging
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Action capture → Audit entry creation → Compliance logging
 * LLM Context: HIPAA-compliant audit trail for healthcare document operations
 */

import { logger } from '../../utils/logger';
import { Document, DocumentAuditTrail } from '../../database/models';
import { DocumentAction } from '../../database/types/enums';

/**
 * Add audit trail entry for document operations
 * @param documentId - Document ID
 * @param action - Action performed
 * @param performedBy - User ID performing the action
 * @param changes - Optional changes data
 * @param transaction - Optional transaction
 */
export async function addAuditTrail(
  documentId: string,
  action: DocumentAction,
  performedBy: string,
  changes?: any,
  transaction?: any
): Promise<void> {
  try {
    await DocumentAuditTrail.create({
      documentId,
      action,
      performedBy,
      changes
    }, { transaction });
  } catch (error) {
    logger.error('Error adding audit trail:', error);
    // Don't throw error - audit trail failures shouldn't stop operations
  }
}

/**
 * Get audit trail for a specific document
 * @param documentId - Document ID
 * @param limit - Maximum number of entries to retrieve
 */
export async function getDocumentAuditTrail(documentId: string, limit: number = 100) {
  try {
    const document = await Document.findByPk(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    const auditTrail = await DocumentAuditTrail.findAll({
      where: { documentId },
      order: [['createdAt', 'DESC']],
      limit
    });

    logger.info(`Retrieved ${auditTrail.length} audit trail entries for document ${documentId}`);
    return auditTrail;
  } catch (error) {
    logger.error(`Error getting audit trail for document ${documentId}:`, error);
    throw error;
  }
}

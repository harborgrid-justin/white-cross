/**
 * @fileoverview HIPAA-compliant audit trail operations for document access and modifications.
 *
 * Provides immutable audit logging for all document operations including creation, viewing,
 * editing, signing, sharing, and deletion. Critical for healthcare compliance, security
 * forensics, and regulatory reporting.
 *
 * LOC: D6A44FD802-AU
 * WC-GEN-258 | audit.operations.ts - Document audit trail operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts - Winston logging for audit operations
 *   - database/models - Document, DocumentAuditTrail models
 *   - database/types/enums - DocumentAction enumeration
 *
 * DOWNSTREAM (imported by):
 *   - crud.operations.ts - CRUD operation auditing
 *   - storage.operations.ts - Access auditing
 *   - signature.operations.ts - Signature auditing
 *   - version.operations.ts - Version auditing
 *   - sharing.operations.ts - Sharing auditing
 *   - All other document operation modules
 *
 * Key Features:
 * - Immutable audit trail entries for all document operations
 * - Action type classification (CREATED, VIEWED, DOWNLOADED, EDITED, SIGNED, etc.)
 * - User identification for accountability
 * - Change detail capture for before/after comparison
 * - Transaction support for atomic audit logging
 * - Graceful error handling (audit failures don't block operations)
 * - Chronological audit history retrieval
 *
 * HIPAA Compliance:
 * - Every document access and modification logged
 * - Audit entries timestamped with automatic createdAt
 * - User ID captured for accountability
 * - Changes object stores operation details
 * - Immutable records (no update or delete allowed)
 * - Required for HIPAA Security Rule § 164.312(b)
 *
 * @module services/document/audit.operations
 * @since 1.0.0
 */

import { logger } from '../../utils/logger';
import { Document, DocumentAuditTrail } from '../../database/models';
import { DocumentAction } from '../../database/types/enums';

/**
 * Create an immutable audit trail entry for a document operation.
 *
 * Logs all document actions for HIPAA compliance and security forensics.
 * Designed to be non-blocking - failures are logged but don't throw errors
 * to prevent audit system issues from stopping critical operations.
 *
 * @async
 * @param {string} documentId - ID of document being operated on
 * @param {DocumentAction} action - Type of action performed (CREATED, VIEWED, DOWNLOADED, EDITED, SIGNED, SHARED, DELETED, etc.)
 * @param {string} performedBy - User ID of person performing the action
 * @param {any} [changes] - Optional details about the operation:
 *   - For EDITED: Fields changed with before/after values
 *   - For SIGNED: Signer role and signature metadata
 *   - For SHARED: List of users shared with
 *   - For DOWNLOADED/VIEWED: IP address, PHI flag
 *   - For CREATED: Version number, parent ID, template ID
 * @param {any} [transaction] - Optional Sequelize transaction for atomic operations
 *
 * @returns {Promise<void>} Resolves when audit entry created (or fails gracefully)
 *
 * @example
 * ```typescript
 * // Audit document creation
 * await addAuditTrail(
 *   'doc_123',
 *   DocumentAction.CREATED,
 *   'nurse_001',
 *   { retentionYears: 7 },
 *   transaction
 * );
 *
 * // Audit document editing
 * await addAuditTrail(
 *   'doc_123',
 *   DocumentAction.EDITED,
 *   'nurse_001',
 *   {
 *     fieldsChanged: ['title', 'tags'],
 *     before: { title: 'Old Title', tags: ['old'] },
 *     after: { title: 'New Title', tags: ['new', 'updated'] }
 *   }
 * );
 *
 * // Audit PHI document access
 * await addAuditTrail(
 *   'doc_123',
 *   DocumentAction.VIEWED,
 *   'nurse_001',
 *   { ipAddress: '192.168.1.100', containsPHI: true }
 * );
 * ```
 *
 * @remarks
 * - Does NOT throw errors - failures logged but operation continues
 * - Audit entries are immutable (no updates or deletes allowed)
 * - Timestamp automatically captured via createdAt field
 * - Changes object stored as JSONB for flexible querying
 * - Transaction parameter ensures atomic audit logging with operations
 * - Critical for HIPAA Security Rule compliance
 * - Supports forensic investigation and compliance reporting
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
 * Retrieve audit trail history for a specific document.
 *
 * Returns chronological audit entries ordered newest first, limited to specified count.
 * Used for compliance reporting, security investigations, and user activity monitoring.
 *
 * @async
 * @param {string} documentId - Document ID to retrieve audit trail for
 * @param {number} [limit=100] - Maximum number of audit entries to return (default: 100)
 *
 * @returns {Promise<DocumentAuditTrail[]>} Array of audit entries ordered by createdAt DESC:
 *   - action: Type of action performed (CREATED, VIEWED, etc.)
 *   - performedBy: User ID who performed the action
 *   - changes: Details about the operation (JSONB object)
 *   - createdAt: Timestamp when action occurred
 *
 * @throws {Error} If document not found
 *
 * @example
 * ```typescript
 * const auditTrail = await getDocumentAuditTrail('doc_123', 50);
 * console.log(`${auditTrail.length} audit entries`);
 * auditTrail.forEach(entry => {
 *   console.log(`${entry.createdAt}: ${entry.action} by ${entry.performedBy}`);
 * });
 * ```
 *
 * @remarks
 * - Entries ordered by createdAt DESC (newest first)
 * - Document existence verified before query
 * - Limit parameter prevents excessive data retrieval
 * - Useful for compliance audits and investigation
 * - Changes object contains operation-specific details
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

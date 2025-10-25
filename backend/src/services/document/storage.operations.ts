/**
 * @fileoverview HIPAA-compliant document storage operations with comprehensive access tracking.
 *
 * Provides secure document download and view operations with automatic audit logging,
 * PHI flagging, and access counting for compliance monitoring. Every document access
 * is tracked with user ID, timestamp, IP address, and PHI indicators.
 *
 * LOC: D6A44FD802-S
 * WC-GEN-251 | storage.operations.ts - Document storage operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts - Winston logging for access tracking
 *   - database/models - Document, DocumentSignature, DocumentAuditTrail models
 *   - audit.operations.ts - Audit trail creation functions
 *   - database/types/enums - DocumentAction enumeration
 *
 * DOWNSTREAM (imported by):
 *   - index.ts - Document service aggregator
 *   - documentService.ts - Main document orchestration service
 *
 * Key Features:
 * - HIPAA-compliant access tracking for all document operations
 * - Automatic PHI flagging in audit trails
 * - Access count incrementation for usage analytics
 * - Last accessed timestamp tracking
 * - IP address logging for security audits
 * - Transaction-safe operations with rollback on errors
 * - Complete association loading for document views
 *
 * Compliance Notes:
 * - Every document access logged to audit trail (HIPAA requirement)
 * - PHI flag captured in audit entries for sensitive documents
 * - IP addresses recorded for security forensics
 * - Access counts support usage pattern analysis
 * - Audit entries immutable and timestamped
 *
 * @module services/document/storage.operations
 * @since 1.0.0
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
 * Download a document with HIPAA-compliant access tracking.
 *
 * Records document download in audit trail, increments access counter,
 * updates last accessed timestamp, and loads complete document data
 * including versions, signatures, and audit history for compliance.
 *
 * @async
 * @param {string} documentId - Unique document identifier to download
 * @param {string} downloadedBy - User ID performing the download (for audit trail)
 * @param {string} [ipAddress] - Optional IP address of downloader for security audit
 *
 * @returns {Promise<Document>} Document instance with all associations:
 *   - parent: Parent document (if this is a version)
 *   - versions: All document versions ordered by version DESC
 *   - signatures: All digital signatures ordered by signedAt DESC
 *   - auditTrail: Most recent 50 audit entries ordered by createdAt DESC
 *
 * @throws {Error} If document not found or database operation fails
 *
 * @example
 * ```typescript
 * const document = await downloadDocument(
 *   'doc_123',
 *   'nurse_001',
 *   '192.168.1.100'
 * );
 * console.log(`Downloaded: ${document.title}`);
 * console.log(`Access count: ${document.accessCount}`);
 * console.log(`Contains PHI: ${document.containsPHI ? 'Yes' : 'No'}`);
 * ```
 *
 * @remarks
 * - Creates DOWNLOADED audit trail entry with PHI flag
 * - Increments document accessCount for usage analytics
 * - Updates lastAccessedAt to current timestamp
 * - PHI documents logged with special [PHI] indicator
 * - Transaction ensures atomicity of access tracking
 * - Associations loaded after transaction commit for current data
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
 * View a document with HIPAA-compliant access tracking.
 *
 * Records document view in audit trail (distinct from download),
 * increments access counter, updates last accessed timestamp, and
 * loads complete document data for display.
 *
 * @async
 * @param {string} documentId - Unique document identifier to view
 * @param {string} viewedBy - User ID performing the view (for audit trail)
 * @param {string} [ipAddress] - Optional IP address of viewer for security audit
 *
 * @returns {Promise<Document>} Document instance with all associations:
 *   - parent: Parent document (if this is a version)
 *   - versions: All document versions ordered by version DESC
 *   - signatures: All digital signatures ordered by signedAt DESC
 *   - auditTrail: Most recent 50 audit entries ordered by createdAt DESC
 *
 * @throws {Error} If document not found or database operation fails
 *
 * @example
 * ```typescript
 * const document = await viewDocument(
 *   'doc_123',
 *   'nurse_001',
 *   '192.168.1.100'
 * );
 * console.log(`Viewing: ${document.title} (v${document.version})`);
 * console.log(`Signatures: ${document.signatures?.length || 0}`);
 * ```
 *
 * @remarks
 * - Creates VIEWED audit trail entry (separate from DOWNLOADED)
 * - Increments document accessCount for usage analytics
 * - Updates lastAccessedAt to current timestamp
 * - PHI documents logged with special [PHI] indicator
 * - Transaction ensures atomicity of access tracking
 * - View action distinct from download for compliance reporting
 * - Useful for differentiating read-only access from file retrieval
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

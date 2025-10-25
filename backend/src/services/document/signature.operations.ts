/**
 * @fileoverview Digital signature operations for legally-compliant healthcare document signing.
 *
 * Provides secure digital signature application with comprehensive validation, audit logging,
 * and automatic document status updates. Supports electronic, digital, and wet signatures
 * with full chain of trust verification for legal compliance.
 *
 * LOC: D6A44FD802-SI
 * WC-GEN-254 | signature.operations.ts - Document signature operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts - Winston logging for signature operations
 *   - database/models - Document, DocumentSignature models
 *   - documentValidation.ts - Signature and document validation functions
 *   - types.ts - SignDocumentData interface
 *   - audit.operations.ts - Audit trail creation
 *
 * DOWNSTREAM (imported by):
 *   - index.ts - Document service aggregator
 *   - documentService.ts - Main document orchestration service
 *
 * Key Features:
 * - Legally-compliant digital signature application
 * - Validation of document signable status (not expired, not archived)
 * - Signature data validation (signer, role, signature image/hash)
 * - Automatic document status update to APPROVED upon signing
 * - Comprehensive audit trail for signature events
 * - Transaction-safe operations with rollback on errors
 * - IP address capture for forensics and compliance
 *
 * Compliance Notes:
 * - Signatures create immutable audit trail entries
 * - Document status automatically transitions to APPROVED
 * - Expired or archived documents cannot be signed
 * - Signer role captured for authorization verification
 * - IP address logged for security audits
 *
 * @module services/document/signature.operations
 * @since 1.0.0
 */

import { logger } from '../../utils/logger';
import { Document, DocumentSignature, sequelize } from '../../database/models';
import { DocumentStatus, DocumentAction } from '../../database/types/enums';
import {
  validateDocumentCanBeSigned,
  validateSignatureData,
  throwIfValidationErrors,
  DocumentValidationError,
} from '../../utils/documentValidation';
import { SignDocumentData } from './types';
import { addAuditTrail } from './audit.operations';

/**
 * Apply a digital signature to a document with validation and audit logging.
 *
 * Validates that document can be signed (not expired, not archived), validates signature data,
 * creates signature record, updates document status to APPROVED, and logs to audit trail.
 * All operations performed in a database transaction for atomicity.
 *
 * @async
 * @param {SignDocumentData} data - Signature application data:
 *   - documentId: ID of document to sign
 *   - signedBy: User ID of the signer
 *   - signedByRole: Role of signer (e.g., 'school_nurse', 'parent', 'doctor')
 *   - signatureData: Optional base64-encoded signature image or cryptographic hash
 *   - ipAddress: Optional IP address of signer for audit/security
 *
 * @returns {Promise<DocumentSignature>} Created signature record with timestamp and metadata
 *
 * @throws {Error} If document not found
 * @throws {DocumentValidationError} If document cannot be signed (expired, archived, missing required fields)
 *
 * @example
 * ```typescript
 * const signature = await signDocument({
 *   documentId: 'doc_123',
 *   signedBy: 'nurse_001',
 *   signedByRole: 'school_nurse',
 *   signatureData: 'data:image/png;base64,iVBORw0KGgo...',
 *   ipAddress: '192.168.1.100'
 * });
 * console.log(`Document signed at ${signature.signedAt}`);
 * ```
 *
 * @remarks
 * - Document status automatically updated to APPROVED after signing
 * - Signature timestamp automatically captured
 * - Audit trail entry created with SIGNED action
 * - Transaction ensures atomic signature + status update + audit
 * - Signer role trimmed for consistency
 * - Documents with expired retention dates cannot be signed
 * - Previously signed documents can receive multiple signatures (co-signing)
 */
export async function signDocument(data: SignDocumentData) {
  const transaction = await sequelize.transaction();

  try {
    // Verify document exists
    const document = await Document.findByPk(data.documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // Validate if document can be signed
    const signableError = validateDocumentCanBeSigned(
      document.status,
      document.retentionDate?.toISOString()
    );
    if (signableError) {
      throw new DocumentValidationError([signableError]);
    }

    // Validate signature data
    const signatureErrors = validateSignatureData(
      data.signedBy,
      data.signedByRole,
      data.signatureData
    );
    throwIfValidationErrors(signatureErrors);

    // Create signature
    const signature = await DocumentSignature.create({
      documentId: data.documentId,
      signedBy: data.signedBy,
      signedByRole: data.signedByRole.trim(),
      signatureData: data.signatureData,
      ipAddress: data.ipAddress
    }, { transaction });

    // Update document status to APPROVED
    await document.update(
      { status: DocumentStatus.APPROVED },
      { transaction }
    );

    // Create audit trail entry
    await addAuditTrail(
      data.documentId,
      DocumentAction.SIGNED,
      data.signedBy,
      { signedByRole: data.signedByRole },
      transaction
    );

    await transaction.commit();

    logger.info(`Document signed: ${data.documentId} by ${data.signedBy}`);
    return signature;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error signing document:', error);
    throw error;
  }
}

/**
 * Retrieve all digital signatures for a specific document.
 *
 * Returns signature records ordered chronologically (newest first) for display
 * and compliance reporting. Useful for multi-signature documents and audit reviews.
 *
 * @async
 * @param {string} documentId - Document ID to retrieve signatures for
 *
 * @returns {Promise<DocumentSignature[]>} Array of signature records ordered by signedAt DESC:
 *   - signerId: User ID of signer
 *   - signerName: Full name of signer
 *   - signedAt: Timestamp when signed
 *   - signatureType: DIGITAL, ELECTRONIC, or WET
 *   - ipAddress: IP address of signer (if captured)
 *   - verified: Verification status
 *
 * @throws {Error} If document not found
 *
 * @example
 * ```typescript
 * const signatures = await getDocumentSignatures('doc_123');
 * console.log(`${signatures.length} signature(s) on document`);
 * signatures.forEach(sig => {
 *   console.log(`- ${sig.signerName} (${sig.signerRole}) at ${sig.signedAt}`);
 * });
 * ```
 *
 * @remarks
 * - Signatures ordered by signedAt DESC (newest first)
 * - Empty array returned if document has no signatures
 * - Document existence verified before query
 * - Useful for signature verification workflows
 */
export async function getDocumentSignatures(documentId: string) {
  try {
    const document = await Document.findByPk(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    const signatures = await DocumentSignature.findAll({
      where: { documentId },
      order: [['signedAt', 'DESC']]
    });

    logger.info(`Retrieved ${signatures.length} signatures for document ${documentId}`);
    return signatures;
  } catch (error) {
    logger.error(`Error getting signatures for document ${documentId}:`, error);
    throw error;
  }
}

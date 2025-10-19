/**
 * LOC: D6A44FD802-SI
 * WC-GEN-254 | signature.operations.ts - Document signature operations
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
 * WC-GEN-254 | signature.operations.ts - Document signature operations
 * Purpose: Digital signature creation, validation, and retrieval
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: Document service index | Called by: DocumentService class
 * Related: DocumentSignature model, audit operations
 * Exports: Signature functions | Key Services: Digital signatures
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Signature validation → Signature creation → Status update
 * LLM Context: Legally-compliant digital signatures for healthcare documents
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
 * Sign a document
 * @param data - Signature data
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
 * Get all signatures for a specific document
 * @param documentId - Document ID
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

/**
 * @fileoverview Document Signature Operations
 * @module lib/actions/documents.signatures
 *
 * Handles electronic document signing operations
 * with HIPAA audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types/api';
import type {
  ActionResult,
  SignatureAgreement
} from './documents.types';
import { DOCUMENT_CACHE_TAGS } from './documents.types';

// ==========================================
// DOCUMENT SIGNING OPERATIONS
// ==========================================

/**
 * Sign document action
 * Includes HIPAA audit logging and cache invalidation
 */
export async function signDocumentAction(
  documentId: string,
  signatureData: string,
  agreement: SignatureAgreement
): Promise<ActionResult<{ signatureId: string; certificate: string }>> {
  try {
    if (!documentId) {
      return {
        success: false,
        error: 'Document ID is required'
      };
    }

    // Verify agreement
    if (!agreement.agreedToTerms) {
      return { success: false, error: 'Must agree to electronic signature terms' };
    }

    // Validate signature data format
    if (!signatureData || signatureData.length < 100) {
      return { success: false, error: 'Invalid signature data - signature too short' };
    }

    const signaturePayload = {
      documentId,
      signatureData,
      agreement
    };

    const response = await serverPost<ApiResponse<{ signatureId: string; certificate: string }>>(
      API_ENDPOINTS.DOCUMENTS.SIGN(documentId),
      signaturePayload,
      {
        cache: 'no-store',
        next: { tags: [DOCUMENT_CACHE_TAGS.DOCUMENTS, DOCUMENT_CACHE_TAGS.DOCUMENT_SIGNATURES, `document-${documentId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to sign document');
    }

    // HIPAA AUDIT LOG - Mandatory for document signing
    await auditLog({
      action: AUDIT_ACTIONS.SIGN_DOCUMENT,
      resource: 'Document',
      resourceId: documentId,
      details: `Document signed by ${agreement.fullName}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS, 'default');
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENT_SIGNATURES, 'default');
    revalidateTag(`document-${documentId}`, 'default');
    revalidatePath('/documents', 'page');
    revalidatePath(`/documents/${documentId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Document signed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to sign document';

    await auditLog({
      action: AUDIT_ACTIONS.SIGN_DOCUMENT,
      resource: 'Document',
      resourceId: documentId,
      details: `Failed to sign document: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

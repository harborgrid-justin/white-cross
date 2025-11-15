/**
 * @fileoverview Document Sharing Operations
 * @module lib/actions/documents.sharing
 *
 * Handles document sharing and permissions management
 * with HIPAA audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, NextApiClientError } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types/api';
import type {
  ActionResult,
  DocumentShareData
} from './documents.types';
import { DOCUMENT_CACHE_TAGS } from './documents.types';

// ==========================================
// DOCUMENT SHARING OPERATIONS
// ==========================================

/**
 * Share document action
 * Includes HIPAA audit logging and cache invalidation
 */
export async function shareDocumentAction(
  documentId: string,
  shareWith: DocumentShareData
): Promise<ActionResult<void>> {
  try {
    if (!documentId) {
      return {
        success: false,
        error: 'Document ID is required'
      };
    }

    // Validate share recipient
    if (!shareWith.userId && !shareWith.email) {
      return { success: false, error: 'Must specify userId or email' };
    }

    // Validate permissions
    if (!shareWith.permissions || shareWith.permissions.length === 0) {
      return { success: false, error: 'Must specify at least one permission' };
    }

    const sharePayload = {
      sharedWith: shareWith.userId || shareWith.email,
      permissions: shareWith.permissions,
      expiresAt: shareWith.expiresAt
    };

    const response = await serverPost<ApiResponse<void>>(
      `${API_ENDPOINTS.DOCUMENTS.BY_ID(documentId)}/shares`,
      sharePayload,
      {
        cache: 'no-store',
        next: { tags: [DOCUMENT_CACHE_TAGS.DOCUMENTS, DOCUMENT_CACHE_TAGS.DOCUMENT_SHARES, `document-${documentId}`] }
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to share document');
    }

    // HIPAA AUDIT LOG - Mandatory for document sharing
    await auditLog({
      action: AUDIT_ACTIONS.SHARE_DOCUMENT,
      resource: 'Document',
      resourceId: documentId,
      details: `Document shared with ${shareWith.userId || shareWith.email}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS, 'default');
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENT_SHARES, 'default');
    revalidateTag(`document-${documentId}`, 'default');
    revalidatePath('/documents', 'page');

    return {
      success: true,
      message: 'Document shared successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to share document';

    await auditLog({
      action: AUDIT_ACTIONS.SHARE_DOCUMENT,
      resource: 'Document',
      resourceId: documentId,
      details: `Failed to share document: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

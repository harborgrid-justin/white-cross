/**
 * @fileoverview Document CRUD Operations
 * @module lib/actions/documents.crud
 *
 * Create, Read, Update, Delete operations for documents
 * with HIPAA audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPut, serverDelete, NextApiClientError } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';
import type {
  ActionResult,
  DocumentMetadata,
  DocumentInfo
} from './documents.types';
import { DOCUMENT_CACHE_TAGS } from './documents.types';

// ==========================================
// DOCUMENT READ OPERATIONS
// ==========================================

/**
 * Get document action with caching
 */
export async function getDocumentAction(documentId: string): Promise<ActionResult<DocumentInfo>> {
  try {
    if (!documentId) {
      return {
        success: false,
        error: 'Document ID is required'
      };
    }

    const response = await serverGet<ApiResponse<DocumentInfo>>(
      API_ENDPOINTS.DOCUMENTS.BY_ID(documentId),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`document-${documentId}`, DOCUMENT_CACHE_TAGS.DOCUMENTS, CACHE_TAGS.PHI]
        }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get document');
    }

    // HIPAA AUDIT LOG - Log document access if PHI
    if (response.data.isPHI) {
      await auditLog({
        action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
        resource: 'Document',
        resourceId: documentId,
        details: `Accessed PHI document: ${response.data.title}`,
        success: true
      });
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to get document';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// DOCUMENT UPDATE OPERATIONS
// ==========================================

/**
 * Update document metadata
 */
export async function updateDocumentAction(
  documentId: string,
  updateData: Partial<DocumentMetadata>
): Promise<ActionResult<DocumentInfo>> {
  try {
    if (!documentId) {
      return {
        success: false,
        error: 'Document ID is required'
      };
    }

    const response = await serverPut<ApiResponse<DocumentInfo>>(
      API_ENDPOINTS.DOCUMENTS.BY_ID(documentId),
      updateData,
      {
        cache: 'no-store',
        next: { tags: [DOCUMENT_CACHE_TAGS.DOCUMENTS, `document-${documentId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update document');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI modification
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Document',
      resourceId: documentId,
      details: 'Updated document metadata',
      changes: updateData,
      success: true
    });

    // Cache invalidation
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS, 'default');
    revalidateTag(`document-${documentId}`, 'default');
    revalidateTag('document-list', 'default');
    revalidatePath('/documents', 'page');
    revalidatePath(`/documents/${documentId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Document updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update document';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Document',
      resourceId: documentId,
      details: `Failed to update document: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update document from form data
 * Form-friendly wrapper for updateDocumentAction
 */
export async function updateDocumentFromForm(
  documentId: string,
  formData: FormData
): Promise<ActionResult<DocumentInfo>> {
  const updateData: Partial<DocumentMetadata> = {
    title: formData.get('title') as string || undefined,
    category: formData.get('category') as string || undefined,
    isPHI: formData.has('isPHI') ? formData.get('isPHI') === 'true' : undefined,
    description: formData.get('description') as string || undefined,
  };

  // Filter out undefined values
  const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof Partial<DocumentMetadata>] = value;
    }
    return acc;
  }, {} as Partial<DocumentMetadata>);

  const result = await updateDocumentAction(documentId, filteredData);

  if (result.success && result.data) {
    redirect(`/documents/${result.data.id}`);
  }

  return result;
}

// ==========================================
// DOCUMENT DELETE OPERATIONS
// ==========================================

/**
 * Delete document action (soft delete)
 * Includes HIPAA audit logging and cache invalidation
 */
export async function deleteDocumentAction(documentId: string): Promise<ActionResult<void>> {
  try {
    if (!documentId) {
      return {
        success: false,
        error: 'Document ID is required'
      };
    }

    await serverDelete<ApiResponse<void>>(
      API_ENDPOINTS.DOCUMENTS.BY_ID(documentId),
      {
        cache: 'no-store',
        next: { tags: [DOCUMENT_CACHE_TAGS.DOCUMENTS, `document-${documentId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for PHI deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Document',
      resourceId: documentId,
      details: 'Deleted document record (soft delete)',
      success: true
    });

    // Cache invalidation
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS, 'default');
    revalidateTag(`document-${documentId}`, 'default');
    revalidateTag('document-list', 'default');
    revalidatePath('/documents', 'page');

    return {
      success: true,
      message: 'Document deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete document';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Document',
      resourceId: documentId,
      details: `Failed to delete document: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * @fileoverview Document Upload Operations
 * @module lib/actions/documents.upload
 *
 * Handles document upload operations with file validation,
 * HIPAA audit logging, and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';
import type {
  ActionResult,
  DocumentMetadata,
  DocumentInfo
} from './documents.types';
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  DOCUMENT_CACHE_TAGS
} from './documents.types';

// ==========================================
// DOCUMENT UPLOAD OPERATIONS
// ==========================================

/**
 * Upload document action
 * Includes HIPAA audit logging and cache invalidation
 */
export async function uploadDocumentAction(
  formData: FormData,
  metadata: DocumentMetadata
): Promise<ActionResult<{ documentId: string }>> {
  try {
    // Validate required fields
    if (!metadata.title || typeof metadata.isPHI !== 'boolean') {
      return {
        success: false,
        error: 'Missing required fields: title, isPHI'
      };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Allowed: PDF, images (JPEG, PNG, GIF), Word, Excel'
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File too large. Maximum size is 10MB' };
    }

    // Convert file to base64 for API
    const fileBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString('base64');

    const documentData = {
      filename: file.name,
      title: metadata.title,
      category: metadata.category,
      isPHI: metadata.isPHI,
      description: metadata.description,
      size: file.size,
      mimeType: file.type,
      data: base64Data
    };

    const response = await serverPost<ApiResponse<{ documentId: string }>>(
      API_ENDPOINTS.DOCUMENTS.UPLOAD,
      documentData,
      {
        cache: 'no-store',
        next: { tags: [DOCUMENT_CACHE_TAGS.DOCUMENTS, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to upload document');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI document operations
    await auditLog({
      action: AUDIT_ACTIONS.UPLOAD_DOCUMENT,
      resource: 'Document',
      resourceId: response.data.documentId,
      details: `Uploaded document: ${metadata.title}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS, 'default');
    revalidateTag('document-list', 'default');
    revalidatePath('/documents', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Document uploaded successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to upload document';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: metadata.isPHI ? AUDIT_ACTIONS.CREATE_PHI_RECORD : AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Document',
      details: `Failed to upload document: ${errorMessage}`,
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
 * Upload document from form data
 * Form-friendly wrapper for uploadDocumentAction
 */
export async function uploadDocumentFromForm(formData: FormData): Promise<ActionResult<{ documentId: string }>> {
  const metadata: DocumentMetadata = {
    title: formData.get('title') as string,
    category: formData.get('category') as string || undefined,
    isPHI: formData.get('isPHI') === 'true',
    description: formData.get('description') as string || undefined,
  };

  const result = await uploadDocumentAction(formData, metadata);

  if (result.success && result.data) {
    redirect(`/documents/${result.data.documentId}`);
  }

  return result;
}

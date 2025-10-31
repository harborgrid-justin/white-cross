/**
 * @fileoverview Document Management Server Actions - Next.js v14+ Compatible
 * @module app/documents/actions
 *
 * HIPAA-compliant server actions for document management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all PHI operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// File validation constants
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Custom cache tags for documents
export const DOCUMENT_CACHE_TAGS = {
  DOCUMENTS: 'documents',
  DOCUMENT_SHARES: 'document-shares',
  DOCUMENT_SIGNATURES: 'document-signatures',
  DOCUMENT_TEMPLATES: 'document-templates',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface DocumentMetadata {
  title: string;
  category?: string;
  isPHI: boolean;
  description?: string;
}

export interface DocumentSignature {
  id: string;
  documentId: string;
  userId: string;
  signatureData: string;
  signatureHash: string;
  timestamp: {
    timestamp: Date;
    source: string;
  };
  metadata: {
    fullName: string;
    email: string;
    agreedToTerms: boolean;
    ipAddress: string;
    userAgent: string;
  };
}

export interface DocumentShareData {
  userId?: string;
  email?: string;
  permissions: ('view' | 'download' | 'edit')[];
  expiresAt?: Date;
}

export interface DocumentInfo {
  id: string;
  title: string;
  filename: string;
  mimeType: string;
  size: number;
  category?: string;
  description?: string;
  isPHI: boolean;
  uploadedAt: string;
  data?: string; // base64 encoded
}

export interface SignatureAgreement {
  agreedToTerms: boolean;
  fullName: string;
  email: string;
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get document by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getDocument = cache(async (id: string): Promise<DocumentInfo | null> => {
  try {
    const response = await serverGet<ApiResponse<DocumentInfo>>(
      API_ENDPOINTS.DOCUMENTS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`document-${id}`, DOCUMENT_CACHE_TAGS.DOCUMENTS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get document:', error);
    return null;
  }
});

/**
 * Get all documents with caching
 * Uses shorter TTL for frequently updated data
 */
export const getDocuments = cache(async (filters?: Record<string, unknown>): Promise<DocumentInfo[]> => {
  try {
    const response = await serverGet<ApiResponse<DocumentInfo[]>>(
      API_ENDPOINTS.DOCUMENTS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [DOCUMENT_CACHE_TAGS.DOCUMENTS, 'document-list', CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get documents:', error);
    return [];
  }
});

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
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS);
    revalidateTag('document-list');
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
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS);
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENT_SIGNATURES);
    revalidateTag(`document-${documentId}`);
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
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS);
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENT_SHARES);
    revalidateTag(`document-${documentId}`);
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

// ==========================================
// DOCUMENT MANAGEMENT OPERATIONS
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
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS);
    revalidateTag(`document-${documentId}`);
    revalidateTag('document-list');
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
    revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS);
    revalidateTag(`document-${documentId}`);
    revalidateTag('document-list');
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

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

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
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if document exists
 */
export async function documentExists(documentId: string): Promise<boolean> {
  const document = await getDocument(documentId);
  return document !== null;
}

/**
 * Get document count
 */
export async function getDocumentCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const documents = await getDocuments(filters);
    return documents.length;
  } catch {
    return 0;
  }
}

/**
 * Clear document cache
 */
export async function clearDocumentCache(documentId?: string): Promise<void> {
  if (documentId) {
    revalidateTag(`document-${documentId}`);
  }
  revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS);
  revalidateTag('document-list');
  revalidatePath('/documents', 'page');
}

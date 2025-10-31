'use server';
'use cache';

/**
 * Document Server Actions - Next.js v16 App Router
 *
 * @module app/documents/actions
 * @description Secure server actions for document management with HIPAA compliance
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { headers, cookies } from 'next/headers';

// ============================================================================
// Configuration
// ============================================================================

const BACKEND_URL = process.env.BACKEND_URL || process.env.API_BASE_URL || 'http://localhost:3001';

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

// ============================================================================
// Types
// ============================================================================

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

interface DocumentMetadata {
  title: string;
  category?: string;
  isPHI: boolean;
  description?: string;
}

interface DocumentSignature {
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

interface DocumentShareData {
  userId?: string;
  email?: string;
  permissions: ('view' | 'download' | 'edit')[];
  expiresAt?: Date;
}

interface DocumentInfo {
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

interface SignatureAgreement {
  agreedToTerms: boolean;
  fullName: string;
  email: string;
}

// ============================================================================
// Document Upload Actions
// ============================================================================

/**
 * Upload document action
 * Cache: 5 minutes for uploaded documents
 */
export async function uploadDocumentAction(
  formData: FormData,
  metadata: DocumentMetadata
): Promise<ActionResult<{ documentId: string }>> {
  'use cache';
  // cacheLife({ revalidate: 300 }); // 5 minutes cache - Available in Next.js v16

  try {
    // Log HIPAA compliance audit entry
    await logHIPAAAuditEntry({
      action: 'DOCUMENT_UPLOAD_ATTEMPT',
      resourceType: 'DOCUMENT',
      details: {
        title: metadata.title,
        isPHI: metadata.isPHI,
        category: metadata.category
      }
    });

    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Unauthorized - Please sign in' };
    }

    // 2. Verify authorization
    const hasAccess = await checkDocumentAccess(
      session.user.id,
      'new-document',
      'upload',
      session.user.role
    );
    if (!hasAccess) {
      return { success: false, error: 'Access denied - Insufficient permissions to upload documents' };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // 3. Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { 
        success: false, 
        error: 'Invalid file type. Allowed: PDF, images (JPEG, PNG, GIF), Word, Excel' 
      };
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File too large. Maximum size is 10MB' };
    }

    // Get request context for audit logging
    const requestContext = await getRequestContext();

    // 5. Virus scanning
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    try {
      const scanResult = await scanFile(fileBuffer, file.name);
      validateScanResult(scanResult);
    } catch (scanError) {
      await logHIPAAAuditEntry({
        action: 'DOCUMENT_UPLOAD_BLOCKED',
        resourceType: 'DOCUMENT',
        details: {
          reason: 'virus_scan_failed',
          error: scanError instanceof Error ? scanError.message : 'Unknown error'
        }
      });

      return {
        success: false,
        error: 'File upload blocked due to security scan failure'
      };
    }

    // 6. Store document with encryption
    const documentId = await storeDocument(fileBuffer, {
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      title: metadata.title,
      category: metadata.category,
      isPHI: metadata.isPHI,
      description: metadata.description,
      ownerId: session.user.id
    });

    // 7. Enhanced fetch to backend with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID(),
        'X-Source': 'document-actions'
      },
      body: JSON.stringify({
        id: documentId,
        filename: file.name,
        title: metadata.title,
        category: metadata.category,
        isPHI: metadata.isPHI,
        description: metadata.description,
        size: file.size,
        mimeType: file.type,
        uploadedBy: session.user.id
      }),
      next: {
        revalidate: 300,
        tags: ['documents', `document-${documentId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Revalidate document caches
    revalidateTag('documents', 'documents');
    revalidatePath('/documents');

    // Log successful upload
    await logHIPAAAuditEntry({
      action: metadata.isPHI ? 'PHI_UPLOAD' : 'DOCUMENT_UPLOAD',
      resourceType: 'DOCUMENT',
      resourceId: documentId,
      details: {
        title: metadata.title,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        isPHI: metadata.isPHI,
        category: metadata.category
      }
    });

    return {
      success: true,
      data: { documentId },
      message: 'Document uploaded successfully'
    };
  } catch (error) {
    console.error('Document upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

// ============================================================================
// Document Signing Actions
// ============================================================================

/**
 * Sign document action
 * Cache: 10 minutes for signatures
 */
export async function signDocumentAction(
  documentId: string,
  signatureData: string,
  agreement: SignatureAgreement
): Promise<ActionResult<{ signatureId: string; certificate: string }>> {
  'use cache';
  // cacheLife({ revalidate: 600 }); // 10 minutes cache - Available in Next.js v16

  try {
    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Unauthorized - Please sign in' };
    }

    // 2. Verify agreement
    if (!agreement.agreedToTerms) {
      return { success: false, error: 'Must agree to electronic signature terms' };
    }

    // 3. Validate signature data format
    if (!signatureData || signatureData.length < 100) {
      return { success: false, error: 'Invalid signature data - signature too short' };
    }

    // Get request context for audit logging
    const requestContext = await getRequestContext();

    // 4. Create cryptographic signature with hash and timestamp
    const signature = await createDocumentSignature(
      documentId,
      session.user.id,
      signatureData,
      {
        fullName: agreement.fullName,
        email: agreement.email,
        agreedToTerms: agreement.agreedToTerms,
        ipAddress: requestContext.ipAddress,
        userAgent: requestContext.userAgent
      }
    );

    // 5. Enhanced fetch to backend with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/documents/${documentId}/signatures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify(signature),
      next: {
        revalidate: 600,
        tags: ['documents', `document-${documentId}`, 'signatures']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 6. Generate signature certificate for legal documentation
    const certificate = createSignatureCertificate(signature);

    // Revalidate document caches
    revalidateTag('documents', 'documents');
    revalidateTag(`document-${documentId}`, 'documents');
    revalidatePath(`/documents/${documentId}`);
    revalidatePath('/documents');

    // Log signature action
    await logHIPAAAuditEntry({
      action: 'DOCUMENT_SIGN',
      resourceType: 'DOCUMENT',
      resourceId: documentId,
      details: {
        signatureId: signature.id,
        signatureHash: signature.signatureHash,
        signerName: agreement.fullName,
        signerEmail: agreement.email,
        timestamp: signature.timestamp.timestamp.toISOString()
      }
    });

    return {
      success: true,
      data: {
        signatureId: signature.id,
        certificate
      },
      message: 'Document signed successfully'
    };
  } catch (error) {
    console.error('Document signing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Signing failed'
    };
  }
}

// ============================================================================
// Document Sharing Actions
// ============================================================================

/**
 * Share document action
 * Cache: 15 minutes for shared documents
 */
export async function shareDocumentAction(
  documentId: string,
  shareWith: DocumentShareData
): Promise<ActionResult<void>> {
  'use cache';
  // cacheLife({ revalidate: 900 }); // 15 minutes cache - Available in Next.js v16

  try {
    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Unauthorized - Please sign in' };
    }

    // 2. Verify document access
    const hasAccess = await checkDocumentAccess(
      session.user.id,
      documentId,
      'share',
      session.user.role
    );
    if (!hasAccess) {
      return { success: false, error: 'Access denied - You do not have permission to share this document' };
    }

    // 3. Validate share recipient
    if (!shareWith.userId && !shareWith.email) {
      return { success: false, error: 'Must specify userId or email' };
    }

    // Validate permissions
    if (!shareWith.permissions || shareWith.permissions.length === 0) {
      return { success: false, error: 'Must specify at least one permission' };
    }

    // 4. Create share record
    const sharedAccess = await createDocumentShare({
      documentId,
      sharedBy: session.user.id,
      sharedWith: shareWith.userId || shareWith.email!,
      permissions: shareWith.permissions,
      expiresAt: shareWith.expiresAt
    });

    // 5. Enhanced fetch to backend with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/documents/${documentId}/shares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify(sharedAccess),
      next: {
        revalidate: 900,
        tags: ['documents', `document-${documentId}`, 'document-shares']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Revalidate document caches
    revalidateTag('documents', 'documents');
    revalidateTag(`document-${documentId}`, 'documents');
    revalidatePath('/documents');

    // Log document sharing
    await logHIPAAAuditEntry({
      action: 'DOCUMENT_SHARE',
      resourceType: 'DOCUMENT',
      resourceId: documentId,
      details: {
        sharedWith: shareWith.userId || shareWith.email,
        permissions: shareWith.permissions,
        expiresAt: shareWith.expiresAt?.toISOString()
      }
    });

    return {
      success: true,
      message: 'Document shared successfully'
    };
  } catch (error) {
    console.error('Document sharing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sharing failed'
    };
  }
}

// ============================================================================
// Document Management Actions
// ============================================================================

/**
 * Delete document action
 * No cache for deletion (always fresh)
 */
export async function deleteDocumentAction(documentId: string): Promise<ActionResult<void>> {
  try {
    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Unauthorized - Please sign in' };
    }

    // 2. Verify permission
    const deleteCheck = await canDeleteDocument(
      session.user.id,
      documentId,
      session.user.role
    );

    if (!deleteCheck.allowed) {
      return {
        success: false,
        error: `Access denied - ${deleteCheck.reason || 'Insufficient permissions to delete document'}`
      };
    }

    // 3. Check if document can be deleted
    try {
      const metadata = await getDocumentMetadata(documentId);

    if ((metadata as { deletedAt?: string }).deletedAt) {
        return { success: false, error: 'Document has already been deleted' };
      }
    } catch (metadataError) {
      return { success: false, error: 'Document not found' };
    }

    // 4. Soft delete via enhanced fetch
    const response = await fetch(`${BACKEND_URL}/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        tags: ['documents', `document-${documentId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Soft delete local storage
    await softDeleteDocument(documentId);

    // Revalidate document caches
    revalidateTag('documents', 'documents');
    revalidateTag(`document-${documentId}`, 'documents');
    revalidatePath('/documents');

    // Log document deletion
    await logHIPAAAuditEntry({
      action: 'DOCUMENT_DELETE',
      resourceType: 'DOCUMENT',
      resourceId: documentId,
      details: {
        action: 'soft_delete',
        deletedAt: new Date().toISOString()
      }
    });

    return {
      success: true,
      message: 'Document deleted successfully'
    };
  } catch (error) {
    console.error('Document deletion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Deletion failed'
    };
  }
}

/**
 * Get document action
 * Cache: 10 minutes for document retrieval
 */
export async function getDocumentAction(documentId: string): Promise<ActionResult<DocumentInfo>> {
  'use cache';
  // cacheLife({ revalidate: 600 }); // 10 minutes cache - Available in Next.js v16

  try {
    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Unauthorized - Please sign in' };
    }

    // 2. Verify access
    const hasAccess = await checkDocumentAccess(
      session.user.id,
      documentId,
      'view',
      session.user.role
    );

    if (!hasAccess) {
      return { success: false, error: 'Access denied - You do not have permission to view this document' };
    }

    // 3. Enhanced fetch to backend with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/documents/${documentId}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['documents', `document-${documentId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const documentInfo = await response.json() as DocumentInfo;

    // 4. Fetch and decrypt document from storage
    const storedDocument = await retrieveDocument(documentId);

    // 5. Audit log if PHI (HIPAA requirement)
    if (requiresPHIAudit(storedDocument.metadata)) {
      await logHIPAAAuditEntry({
        action: 'PHI_ACCESS',
        resourceType: 'DOCUMENT',
        resourceId: documentId,
        details: {
          documentTitle: storedDocument.metadata.title,
          category: storedDocument.metadata.category,
          isPHI: true
        }
      });
    }

    // Return document with metadata
    return {
      success: true,
      data: {
        ...documentInfo,
        // Convert buffer to base64 for transport (in production, use signed URLs)
        data: storedDocument.buffer?.toString('base64')
      }
    };
  } catch (error) {
    console.error('Document fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch document'
    };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get authentication token from cookies
 */
async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
}

/**
 * Get server session (mock implementation)
 */
async function getServerSession(): Promise<{ user: { id: string; email: string; role: string } } | null> {
  try {
    const token = await getAuthToken();
    const payload = await verifyAccessToken(token);
    return {
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      }
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get request context for audit logging
 */
async function getRequestContext(): Promise<{ ipAddress: string; userAgent: string }> {
  const headersList = await headers();
  const mockRequest = createMockRequest(headersList);
  
  return {
    ipAddress: extractIPAddress(mockRequest) || '0.0.0.0',
    userAgent: extractUserAgent(mockRequest) || 'Unknown'
  };
}

/**
 * Create mock request from Next.js headers
 */
function createMockRequest(headersList: Headers): Request {
  return {
    headers: {
      get: (name: string) => headersList.get(name)
    }
  } as Request;
}

/**
 * Extract IP address from request
 */
function extractIPAddress(request: Request): string | null {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || 
         '0.0.0.0';
}

/**
 * Extract user agent from request
 */
function extractUserAgent(request: Request): string | null {
  return request.headers.get('user-agent') || 'Unknown';
}

/**
 * HIPAA-compliant audit logging
 */
async function logHIPAAAuditEntry(entry: {
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    const session = await getServerSession();
    const requestContext = await getRequestContext();
    
    console.log('[HIPAA Audit]', {
      timestamp: new Date().toISOString(),
      userId: session?.user.id || 'anonymous',
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      ipAddress: requestContext.ipAddress,
      userAgent: requestContext.userAgent,
      details: entry.details
    });
  } catch (error) {
    // Never throw - audit logging is fire-and-forget
    console.warn('HIPAA audit logging failed:', error);
  }
}

/**
 * Mock implementations for document operations
 * These would be replaced with actual implementations in production
 */

async function checkDocumentAccess(
  userId: string,
  documentId: string,
  action: string,
  userRole: string
): Promise<boolean> {
  // Mock implementation - replace with actual access control logic
  return true;
}

async function scanFile(buffer: Buffer, filename: string): Promise<{ clean: boolean }> {
  // Mock virus scan - replace with actual antivirus integration
  return { clean: true };
}

function validateScanResult(result: { clean: boolean }): void {
  if (!result.clean) {
    throw new Error('File contains threats');
  }
}

async function storeDocument(buffer: Buffer, metadata: Record<string, unknown>): Promise<string> {
  // Mock document storage - replace with encrypted storage implementation
  const documentId = crypto.randomUUID();
  console.log(`[Storage] Stored document ${documentId} with metadata:`, metadata);
  return documentId;
}

async function createDocumentSignature(
  documentId: string,
  userId: string,
  signatureData: string,
  metadata: {
    fullName: string;
    email: string;
    agreedToTerms: boolean;
    ipAddress: string;
    userAgent: string;
  }
): Promise<DocumentSignature> {
  // Mock signature creation - replace with actual cryptographic signing
  const signature: DocumentSignature = {
    id: crypto.randomUUID(),
    documentId,
    userId,
    signatureData,
    signatureHash: await hashSignatureData(signatureData),
    timestamp: {
      timestamp: new Date(),
      source: 'server'
    },
    metadata
  };
  return signature;
}

async function hashSignatureData(data: string): Promise<string> {
  // Mock hash generation - replace with actual cryptographic hashing
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data + Date.now());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function createSignatureCertificate(signature: DocumentSignature): string {
  // Mock certificate generation - replace with actual certificate creation
  return `Certificate for signature ${signature.id} created at ${signature.timestamp.timestamp.toISOString()}`;
}

async function createDocumentShare(shareData: Record<string, unknown>): Promise<Record<string, unknown>> {
  // Mock share creation - replace with actual database operation
  console.log('[Sharing] Created document share:', shareData);
  return { id: crypto.randomUUID(), ...shareData };
}

async function canDeleteDocument(
  userId: string,
  documentId: string,
  userRole: string
): Promise<{ allowed: boolean; reason?: string }> {
  // Mock deletion check - replace with actual business logic
  return { allowed: true };
}

async function getDocumentMetadata(documentId: string): Promise<Record<string, unknown>> {
  // Mock metadata retrieval - replace with actual database query
  return {
    id: documentId,
    title: 'Mock Document',
    uploadedAt: new Date().toISOString()
  };
}

async function softDeleteDocument(documentId: string): Promise<void> {
  // Mock soft delete - replace with actual database operation
  console.log(`[Storage] Soft deleted document ${documentId}`);
}

async function retrieveDocument(documentId: string): Promise<{
  buffer?: Buffer;
  metadata: Record<string, unknown>;
}> {
  // Mock document retrieval - replace with actual encrypted storage retrieval
  return {
    buffer: Buffer.from('mock document content'),
    metadata: {
      id: documentId,
      title: 'Mock Document',
      category: 'general',
      isPHI: false
    }
  };
}

function requiresPHIAudit(metadata: Record<string, unknown>): boolean {
  return metadata?.isPHI === true;
}

async function verifyAccessToken(token: string): Promise<{ id: string; email: string; role: string }> {
  // Mock token verification - replace with actual JWT verification
  return {
    id: 'user-123',
    email: 'user@example.com',
    role: 'USER'
  };
}

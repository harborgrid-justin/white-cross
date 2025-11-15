/**
 * Documents by ID API endpoint
 * Get, update, or delete individual documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/documents/[id]
 * Get document by ID
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Extract document ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Proxy request to backend
    const response = await proxyToBackend(request, `/documents/${id}`);

    const data = await response.json();

    // Audit log document access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Document',
      resourceId: id,
      details: `Document accessed, may contain PHI`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching document:', error);

    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/documents/[id]
 * Update document by ID
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Extract document ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Proxy request to backend
    const response = await proxyToBackend(request, `/documents/${id}`);

    const data = await response.json();

    // Audit log document update
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'UPDATE',
      resource: 'Document',
      resourceId: id,
      details: `Document updated`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating document:', error);

    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/documents/[id]
 * Delete document by ID
 */
export const DELETE = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Extract document ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Proxy request to backend
    const response = await proxyToBackend(request, `/documents/${id}`);

    // Audit log document deletion
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'DELETE',
      resource: 'Document',
      resourceId: id,
      details: `Document deleted`
    });

    return NextResponse.json({ success: true }, { status: response.status });
  } catch (error) {
    console.error('Error deleting document:', error);

    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
});
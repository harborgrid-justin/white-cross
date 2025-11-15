/**
 * Individual Invoice API endpoints
 * HIPAA-compliant invoice management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';
import {
  getCacheConfig,
  generateCacheTags,
  getCacheControlHeader
} from '@/lib/cache/config';
import { invalidateResource } from '@/lib/cache/invalidation';

/**
 * GET /api/billing/invoices/[id]
 * Get invoice by ID
 */
export const GET = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;
    const cacheConfig = getCacheConfig('billing');
    const cacheTags = generateCacheTags('billing', id);
    const cacheControl = getCacheControlHeader('billing');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/billing/invoices/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // HIPAA: Audit log billing access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BillingInvoice',
      resourceId: id,
      details: 'Invoice accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching invoice:', error);

    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/billing/invoices/[id]
 * Update invoice
 */
export const PUT = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/billing/invoices/${id}`, {
      method: 'PUT'
    });

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // HIPAA: Audit log billing update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'BillingInvoice',
        resourceId: id,
        details: 'Invoice updated'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating invoice:', error);

    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/billing/invoices/[id]
 * Delete invoice
 */
export const DELETE = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/billing/invoices/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      // HIPAA: Audit log billing deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'BillingInvoice',
        resourceId: id,
        details: 'Invoice deleted'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error deleting invoice:', error);

    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
});
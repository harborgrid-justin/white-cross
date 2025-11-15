/**
 * Individual Purchase Order API endpoints
 * Purchase order management
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
 * GET /api/purchase-orders/[id]
 * Get purchase order by ID
 */
export const GET = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;
    const cacheConfig = getCacheConfig('billing');
    const cacheTags = generateCacheTags('billing', id);
    const cacheControl = getCacheControlHeader('billing');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/purchase-orders/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log purchase order access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'PurchaseOrders',
      resourceId: id,
      details: 'Purchase order accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching purchase order:', error);

    return NextResponse.json(
      { error: 'Failed to fetch purchase order' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/purchase-orders/[id]
 * Update purchase order
 */
export const PUT = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/purchase-orders/${id}`, {
      method: 'PUT'
    });

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log purchase order update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'PurchaseOrders',
        resourceId: id,
        details: 'Purchase order updated'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating purchase order:', error);

    return NextResponse.json(
      { error: 'Failed to update purchase order' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/purchase-orders/[id]
 * Delete purchase order
 */
export const DELETE = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/purchase-orders/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      // Audit log purchase order deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'PurchaseOrders',
        resourceId: id,
        details: 'Purchase order deleted'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error deleting purchase order:', error);

    return NextResponse.json(
      { error: 'Failed to delete purchase order' },
      { status: 500 }
    );
  }
});
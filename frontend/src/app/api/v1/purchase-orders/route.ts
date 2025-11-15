/**
 * Purchase Orders API endpoints
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
 * GET /api/purchase-orders
 * List purchase orders
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('billing');
    const cacheTags = generateCacheTags('billing');
    const cacheControl = getCacheControlHeader('billing');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/purchase-orders', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log purchase orders access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'PurchaseOrders',
      details: 'Purchase orders accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);

    return NextResponse.json(
      { error: 'Failed to fetch purchase orders' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/purchase-orders
 * Create purchase order
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/purchase-orders');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log purchase order creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'PurchaseOrders',
        resourceId: data.data.id,
        details: 'Purchase order created'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating purchase order:', error);

    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    );
  }
});
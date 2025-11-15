/**
 * Individual inventory item API endpoints
 * Medical inventory item management
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
 * GET /api/inventory/[id]
 * Get inventory item by ID
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Inventory item ID is required' },
        { status: 400 }
      );
    }

    const cacheConfig = getCacheConfig('medications');
    const cacheTags = generateCacheTags('medications', id);
    const cacheControl = getCacheControlHeader('medications');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/inventory/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log inventory access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Inventory',
      resourceId: id,
      details: 'Inventory item accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching inventory item:', error);

    return NextResponse.json(
      { error: 'Failed to fetch inventory item' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/inventory/[id]
 * Update inventory item
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Inventory item ID is required' },
        { status: 400 }
      );
    }

    // Proxy request to backend
    const response = await proxyToBackend(request, `/inventory/${id}`);

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log inventory update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'Inventory',
        resourceId: id,
        details: 'Inventory item updated'
      });

      // Invalidate cache
      await invalidateResource('medications');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating inventory item:', error);

    return NextResponse.json(
      { error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/inventory/[id]
 * Delete inventory item
 */
export const DELETE = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Inventory item ID is required' },
        { status: 400 }
      );
    }

    // Proxy request to backend
    const response = await proxyToBackend(request, `/inventory/${id}`);

    if (response.status === 204) {
      // Audit log inventory deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'Inventory',
        resourceId: id,
        details: 'Inventory item deleted'
      });

      // Invalidate cache
      await invalidateResource('medications');
    }

    return NextResponse.json({}, { status: response.status });
  } catch (error) {
    console.error('Error deleting inventory item:', error);

    return NextResponse.json(
      { error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
});
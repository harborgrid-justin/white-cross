/**
 * Inventory API endpoints
 * Medical inventory and stock management
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
 * GET /api/inventory
 * List inventory items
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('medications');
    const cacheTags = generateCacheTags('medications');
    const cacheControl = getCacheControlHeader('medications');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/inventory', {
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
      details: `Inventory accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching inventory:', error);

    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/inventory
 * Create inventory item
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/inventory');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log inventory creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Inventory',
        resourceId: data.data.id,
        details: 'Inventory item created'
      });

      // Invalidate cache
      await invalidateResource('medications');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating inventory item:', error);

    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
});
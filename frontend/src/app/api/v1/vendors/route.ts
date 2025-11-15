/**
 * Vendors API endpoints
 * Vendor management
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
 * GET /api/vendors
 * List vendors
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('configuration');
    const cacheTags = generateCacheTags('configuration');
    const cacheControl = getCacheControlHeader('configuration');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/vendors', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log vendors access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Vendors',
      details: 'Vendors accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching vendors:', error);

    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/vendors
 * Create vendor
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vendors');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log vendor creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Vendors',
        resourceId: data.data.id,
        details: 'Vendor created'
      });

      // Invalidate cache
      await invalidateResource('configuration');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating vendor:', error);

    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
});
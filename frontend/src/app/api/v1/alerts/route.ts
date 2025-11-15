/**
 * Alerts API endpoints
 * System alerts and notifications management
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
 * GET /api/alerts
 * List alerts
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('analytics');
    const cacheTags = generateCacheTags('analytics');
    const cacheControl = getCacheControlHeader('analytics');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/alerts', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log alerts access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Alerts',
      details: 'Alerts accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching alerts:', error);

    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/alerts
 * Create alert
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/alerts');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log alert creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Alerts',
        resourceId: data.data.id,
        details: 'Alert created'
      });

      // Invalidate cache
      await invalidateResource('analytics');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating alert:', error);

    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
});
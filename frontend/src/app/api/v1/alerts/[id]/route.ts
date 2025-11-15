/**
 * Individual Alert API endpoints
 * Alert management
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
 * GET /api/alerts/[id]
 * Get alert by ID
 */
export const GET = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;
    const cacheConfig = getCacheConfig('analytics');
    const cacheTags = generateCacheTags('analytics', id);
    const cacheControl = getCacheControlHeader('analytics');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/alerts/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log alert access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Alerts',
      resourceId: id,
      details: 'Alert accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching alert:', error);

    return NextResponse.json(
      { error: 'Failed to fetch alert' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/alerts/[id]
 * Update alert
 */
export const PUT = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/alerts/${id}`, {
      method: 'PUT'
    });

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log alert update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'Alerts',
        resourceId: id,
        details: 'Alert updated'
      });

      // Invalidate cache
      await invalidateResource('analytics');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating alert:', error);

    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/alerts/[id]
 * Delete alert
 */
export const DELETE = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/alerts/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      // Audit log alert deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'Alerts',
        resourceId: id,
        details: 'Alert deleted'
      });

      // Invalidate cache
      await invalidateResource('analytics');
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error deleting alert:', error);

    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
});
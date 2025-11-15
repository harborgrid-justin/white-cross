/**
 * Individual Vendor API endpoints
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
 * GET /api/vendors/[id]
 * Get vendor by ID
 */
export const GET = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;
    const cacheConfig = getCacheConfig('configuration');
    const cacheTags = generateCacheTags('configuration', id);
    const cacheControl = getCacheControlHeader('configuration');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/vendors/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log vendor access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Vendors',
      resourceId: id,
      details: 'Vendor accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching vendor:', error);

    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/vendors/[id]
 * Update vendor
 */
export const PUT = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/vendors/${id}`, {
      method: 'PUT'
    });

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log vendor update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'Vendors',
        resourceId: id,
        details: 'Vendor updated'
      });

      // Invalidate cache
      await invalidateResource('configuration');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating vendor:', error);

    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/vendors/[id]
 * Delete vendor
 */
export const DELETE = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/vendors/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      // Audit log vendor deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'Vendors',
        resourceId: id,
        details: 'Vendor deleted'
      });

      // Invalidate cache
      await invalidateResource('configuration');
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error deleting vendor:', error);

    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
});
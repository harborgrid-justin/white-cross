/**
 * Individual Form API endpoints
 * Form management
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
 * GET /api/forms/[id]
 * Get form by ID
 */
export const GET = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;
    const cacheConfig = getCacheConfig('configuration');
    const cacheTags = generateCacheTags('configuration', id);
    const cacheControl = getCacheControlHeader('configuration');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/forms/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log form access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Forms',
      resourceId: id,
      details: 'Form accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching form:', error);

    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/forms/[id]
 * Update form
 */
export const PUT = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/forms/${id}`, {
      method: 'PUT'
    });

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log form update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'Forms',
        resourceId: id,
        details: 'Form updated'
      });

      // Invalidate cache
      await invalidateResource('configuration');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating form:', error);

    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/forms/[id]
 * Delete form
 */
export const DELETE = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/forms/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      // Audit log form deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'Forms',
        resourceId: id,
        details: 'Form deleted'
      });

      // Invalidate cache
      await invalidateResource('configuration');
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error deleting form:', error);

    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    );
  }
});
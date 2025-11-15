/**
 * API keys settings API endpoint
 * User API key management and authentication
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
 * GET /api/settings/api-keys
 * Get user API keys
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('settings');
    const cacheTags = generateCacheTags('settings', 'api-keys');
    const cacheControl = getCacheControlHeader('settings');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/settings/api-keys', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log API keys access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'APIKeys',
      details: 'API keys accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching API keys:', error);

    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/settings/api-keys
 * Create new API key
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings/api-keys');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log API key creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'APIKey',
        resourceId: data.data.id,
        details: 'API key created'
      });

      // Invalidate cache
      await invalidateResource('settings');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating API key:', error);

    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/settings/api-keys/[id]
 * Delete API key (handled by dynamic route)
 */
export const DELETE = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }

    // Proxy request to backend
    const response = await proxyToBackend(request, `/settings/api-keys/${id}`);

    if (response.status === 204) {
      // Audit log API key deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'APIKey',
        resourceId: id,
        details: 'API key deleted'
      });

      // Invalidate cache
      await invalidateResource('settings');
    }

    return NextResponse.json({}, { status: response.status });
  } catch (error) {
    console.error('Error deleting API key:', error);

    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
});
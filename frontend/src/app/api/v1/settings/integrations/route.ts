/**
 * Integrations settings API endpoint
 * Third-party integrations and API connections
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
 * GET /api/settings/integrations
 * Get user integrations settings
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('settings');
    const cacheTags = generateCacheTags('settings', 'integrations');
    const cacheControl = getCacheControlHeader('settings');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/settings/integrations', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log integrations settings access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'IntegrationSettings',
      details: 'Integration settings accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching integrations settings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch integrations settings' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/settings/integrations
 * Update user integrations settings
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings/integrations');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log integrations settings update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'IntegrationSettings',
        details: 'Integration settings updated'
      });

      // Invalidate cache
      await invalidateResource('settings');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating integrations settings:', error);

    return NextResponse.json(
      { error: 'Failed to update integrations settings' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/settings/integrations/connect
 * Connect to third-party service
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings/integrations/connect');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log integration connection
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Integration',
        details: 'Third-party integration connected'
      });

      // Invalidate cache
      await invalidateResource('settings');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error connecting integration:', error);

    return NextResponse.json(
      { error: 'Failed to connect integration' },
      { status: 500 }
    );
  }
});
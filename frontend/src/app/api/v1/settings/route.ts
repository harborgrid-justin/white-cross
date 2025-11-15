/**
 * Settings API endpoints
 * User and system settings management
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
 * GET /api/settings
 * Get all user settings
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('settings');
    const cacheTags = generateCacheTags('settings');
    const cacheControl = getCacheControlHeader('settings');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/settings', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log settings access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Settings',
      details: 'User settings accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching settings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/settings
 * Update user settings
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log settings update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'Settings',
        details: 'User settings updated'
      });

      // Invalidate cache
      await invalidateResource('settings');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating settings:', error);

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
});
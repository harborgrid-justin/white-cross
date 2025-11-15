/**
 * Data storage settings API endpoint
 * User data storage and retention settings
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
 * GET /api/settings/data-storage
 * Get user data storage settings
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('settings');
    const cacheTags = generateCacheTags('settings', 'data-storage');
    const cacheControl = getCacheControlHeader('settings');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/settings/data-storage', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log data storage settings access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'DataStorageSettings',
      details: 'Data storage settings accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching data storage settings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch data storage settings' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/settings/data-storage
 * Update user data storage settings
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings/data-storage');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log data storage settings update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'DataStorageSettings',
        details: 'Data storage settings updated'
      });

      // Invalidate cache
      await invalidateResource('settings');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating data storage settings:', error);

    return NextResponse.json(
      { error: 'Failed to update data storage settings' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/settings/data-storage/export
 * Export user data
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings/data-storage/export');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log data export
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'EXPORT',
        resource: 'UserData',
        details: 'User data export initiated'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error exporting user data:', error);

    return NextResponse.json(
      { error: 'Failed to export user data' },
      { status: 500 }
    );
  }
});
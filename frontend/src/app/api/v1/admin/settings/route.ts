/**
 * Admin settings API endpoint
 * System-wide settings and configuration for administrators
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
 * GET /api/admin/settings
 * Get system-wide settings and configuration
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('configuration');
    const cacheTags = generateCacheTags('configuration', 'admin');
    const cacheControl = getCacheControlHeader('configuration');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/admin/settings', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log admin settings access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'AdminSettings',
      details: 'System settings accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching admin settings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch admin settings' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/admin/settings
 * Update system-wide settings
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/admin/settings');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log admin settings update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'AdminSettings',
        details: 'System settings updated'
      });

      // Invalidate cache
      await invalidateResource('configuration');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating admin settings:', error);

    return NextResponse.json(
      { error: 'Failed to update admin settings' },
      { status: 500 }
    );
  }
});
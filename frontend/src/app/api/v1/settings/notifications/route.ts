/**
 * Notification settings API endpoint
 * User notification preferences management
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
 * GET /api/settings/notifications
 * Get user notification settings
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('settings');
    const cacheTags = generateCacheTags('settings', 'notifications');
    const cacheControl = getCacheControlHeader('settings');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/settings/notifications', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log notification settings access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'NotificationSettings',
      details: 'Notification settings accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching notification settings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/settings/notifications
 * Update user notification settings
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings/notifications');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log notification settings update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'NotificationSettings',
        details: 'Notification settings updated'
      });

      // Invalidate cache
      await invalidateResource('settings');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating notification settings:', error);

    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    );
  }
});
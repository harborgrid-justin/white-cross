/**
 * Profile settings API endpoint
 * User profile settings management
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
 * GET /api/settings/profile
 * Get user profile settings
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('settings');
    const cacheTags = generateCacheTags('settings', 'profile');
    const cacheControl = getCacheControlHeader('settings');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/settings/profile', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log profile settings access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ProfileSettings',
      details: 'Profile settings accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching profile settings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch profile settings' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/settings/profile
 * Update user profile settings
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings/profile');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log profile settings update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'ProfileSettings',
        details: 'Profile settings updated'
      });

      // Invalidate cache
      await invalidateResource('settings');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating profile settings:', error);

    return NextResponse.json(
      { error: 'Failed to update profile settings' },
      { status: 500 }
    );
  }
});
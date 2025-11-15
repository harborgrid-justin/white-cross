/**
 * Billing Settings API endpoints
 * Billing configuration and preferences
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

/**
 * GET /api/billing/settings
 * Get billing settings
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('configuration');
    const cacheTags = generateCacheTags('configuration');
    const cacheControl = getCacheControlHeader('configuration');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/billing/settings', {
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
      resource: 'BillingSettings',
      details: 'Billing settings accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching billing settings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch billing settings' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/billing/settings
 * Update billing settings
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/billing/settings', {
      method: 'PUT'
    });

    const data = await response.json();

    if (response.status === 200) {
      // Audit log settings update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'BillingSettings',
        details: 'Billing settings updated'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating billing settings:', error);

    return NextResponse.json(
      { error: 'Failed to update billing settings' },
      { status: 500 }
    );
  }
});
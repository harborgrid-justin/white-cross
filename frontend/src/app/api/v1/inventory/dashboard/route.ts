/**
 * Inventory dashboard API endpoint
 * Get inventory dashboard data and summary
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
 * GET /api/inventory/dashboard
 * Get inventory dashboard data and summary
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('analytics');
    const cacheTags = generateCacheTags('analytics', 'inventory-dashboard');
    const cacheControl = getCacheControlHeader('analytics');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/inventory/dashboard', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log inventory dashboard access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'InventoryDashboard',
      details: 'Inventory dashboard accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching inventory dashboard:', error);

    return NextResponse.json(
      { error: 'Failed to fetch inventory dashboard' },
      { status: 500 }
    );
  }
});
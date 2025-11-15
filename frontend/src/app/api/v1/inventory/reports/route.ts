/**
 * Inventory reports API endpoint
 * Get inventory reports and exports
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
 * GET /api/inventory/reports
 * Get inventory reports and exports
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('reports');
    const cacheTags = generateCacheTags('reports', 'inventory');
    const cacheControl = getCacheControlHeader('reports');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/inventory/reports', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log inventory reports access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'InventoryReports',
      details: 'Inventory reports accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching inventory reports:', error);

    return NextResponse.json(
      { error: 'Failed to fetch inventory reports' },
      { status: 500 }
    );
  }
});
/**
 * Expiring inventory API endpoint
 * Get inventory items that are expiring soon
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
 * GET /api/inventory/expiring
 * Get inventory items that are expiring soon
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('medications');
    const cacheTags = generateCacheTags('medications', 'expiring');
    const cacheControl = getCacheControlHeader('medications');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/inventory/expiring', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log expiring inventory access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Inventory',
      details: `Expiring inventory accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching expiring inventory:', error);

    return NextResponse.json(
      { error: 'Failed to fetch expiring inventory' },
      { status: 500 }
    );
  }
});
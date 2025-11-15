/**
 * Inventory audit API endpoint
 * Get inventory audit logs and history
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
 * GET /api/inventory/audit
 * Get inventory audit logs and history
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('audit');
    const cacheTags = generateCacheTags('audit', 'inventory');
    const cacheControl = getCacheControlHeader('audit');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/inventory/audit', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log audit access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'InventoryAudit',
      details: `Inventory audit logs accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching inventory audit:', error);

    return NextResponse.json(
      { error: 'Failed to fetch inventory audit' },
      { status: 500 }
    );
  }
});
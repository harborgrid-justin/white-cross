/**
 * Admin monitoring API endpoint
 * System monitoring and health checks for administrators
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
 * GET /api/admin/monitoring
 * Get system monitoring data and health status
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('compliance');
    const cacheTags = generateCacheTags('compliance', 'monitoring');
    const cacheControl = getCacheControlHeader('compliance');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/admin/monitoring', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log monitoring access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'SystemMonitoring',
      details: 'System monitoring data accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);

    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
});
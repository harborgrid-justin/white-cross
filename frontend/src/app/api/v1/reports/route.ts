/**
 * Reports API endpoints
 * System and user reports generation
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
 * GET /api/reports
 * Get available reports and report history
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('analytics');
    const cacheTags = generateCacheTags('analytics', 'reports');
    const cacheControl = getCacheControlHeader('analytics');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/reports', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log reports access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Reports',
      details: `Reports accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching reports:', error);

    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/reports
 * Generate new report
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/reports');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log report generation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Report',
        resourceId: data.data.id,
        details: 'Report generated'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error generating report:', error);

    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
});
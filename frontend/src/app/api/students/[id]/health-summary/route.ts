/**
 * Student health summary API endpoint
 * Get comprehensive health data for a specific student
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';
import {
  getCacheConfig,
  generateCacheTags,
  getCacheControlHeader
} from '@/lib/cache/config';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/students/[id]/health-summary
 * Get comprehensive health data for student
 */
export const GET = withAuth(async (
  request: NextRequest, 
  context: RouteContext, 
  auth
) => {
  try {
    const { id: studentId } = context.params;

    // Cache configuration for health data
    const cacheConfig = getCacheConfig('healthRecords');
    const cacheTags = generateCacheTags('healthRecords');
    const cacheControl = getCacheControlHeader('healthRecords');

    // Proxy request to backend health summary endpoint
    const response = await proxyToBackend(
      request, 
      `/health-records/student/${studentId}/summary`,
      {
        cache: {
          revalidate: cacheConfig.revalidate,
          tags: cacheTags
        },
        cacheControl
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      // HIPAA: Audit log PHI access
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'VIEW',
        resource: 'StudentHealthSummary',
        resourceId: studentId,
        details: `Viewed health summary for student ${studentId}`
      });
    }

    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Cache-Control': cacheControl
      }
    });
  } catch (error) {
    console.error('Error fetching student health summary:', error);

    return NextResponse.json(
      { error: 'Failed to fetch student health summary' },
      { status: 500 }
    );
  }
});
/**
 * Incidents API endpoints
 * List and create incident reports with HIPAA compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';
import {
  getCacheConfig,
  generateCacheTags,
  getCacheControlHeader
} from '@/lib/cache/config';
import { invalidateIncidentData } from '@/lib/cache/invalidation';

/**
 * Route segment configuration
 * Force dynamic rendering for authenticated routes
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /incidents
 * List all incidents with filtering and pagination
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    const cacheConfig = getCacheConfig('incidents');
    const cacheTags = generateCacheTags('incidents');
    const cacheControl = getCacheControlHeader('incidents');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/incident-report', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Incident',
      details: `Listed incidents, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching incidents:', error);

    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
});

/**
 * POST /incidents
 * Create new incident report
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/incident-report');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Incident',
        resourceId: data.data.id,
        details: 'Incident report created'
      });

      // Invalidate cache with related resources
      await invalidateIncidentData(
        data.data.id,
        data.data.studentId
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating incident:', error);

    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
});

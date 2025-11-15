/**
 * Health Records API endpoints
 * List and create health records with HIPAA compliance
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
import { invalidateHealthRecordData } from '@/lib/cache/invalidation';

/**
 * Route segment configuration
 * Force dynamic rendering for authenticated routes
 */

/**
 * GET /health-records
 * List all health records with filtering and pagination
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    const cacheConfig = getCacheConfig('healthRecords');
    const cacheTags = generateCacheTags('healthRecords');
    const cacheControl = getCacheControlHeader('healthRecords');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/health-records', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // HIPAA: Audit log PHI access
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'HealthRecord',
      details: `Listed health records, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching health records:', error);

    return NextResponse.json(
      { error: 'Failed to fetch health records' },
      { status: 500 }
    );
  }
});

/**
 * POST /health-records
 * Create new health record
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/health-records');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // HIPAA: Audit log PHI creation
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'HealthRecord',
        resourceId: data.data.id,
        details: 'Health record created'
      });

      // Invalidate cache with related resources
      await invalidateHealthRecordData(
        data.data.id,
        data.data.studentId
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating health record:', error);

    return NextResponse.json(
      { error: 'Failed to create health record' },
      { status: 500 }
    );
  }
});

/**
 * Health Records API endpoints
 * List and create health records with HIPAA compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '../../middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';

/**
 * GET /api/v1/health-records
 * List all health records with filtering and pagination
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/api/v1/health-records', {
      cache: {
        revalidate: 30, // Cache for 30 seconds (highly sensitive PHI)
        tags: ['health-records']
      }
    });

    const data = await response.json();

    // HIPAA: Audit log PHI access
    const auditContext = createAuditContext(request, auth.user.id);
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
 * POST /api/v1/health-records
 * Create new health record
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/api/v1/health-records');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // HIPAA: Audit log PHI creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'HealthRecord',
        resourceId: data.data.id,
        details: 'Health record created'
      });

      // Revalidate cache
      revalidateTag('health-records');
      if (data.data.studentId) {
        revalidateTag(`student-${data.data.studentId}-health-records`);
        revalidateTag(`student-${data.data.studentId}`);
      }
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

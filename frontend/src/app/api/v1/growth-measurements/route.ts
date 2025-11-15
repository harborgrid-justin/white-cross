/**
 * Growth measurements API endpoints
 * Student growth and development tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/growth-measurements
 * Get growth measurements
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/growth-measurements');

    const data = await response.json();

    // Audit log growth measurements access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'GrowthMeasurements',
      details: `Growth measurements accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching growth measurements:', error);

    return NextResponse.json(
      { error: 'Failed to fetch growth measurements' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/growth-measurements
 * Record growth measurement
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/growth-measurements');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log growth measurement recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'GrowthMeasurement',
        resourceId: data.data.id,
        details: 'Growth measurement recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording growth measurement:', error);

    return NextResponse.json(
      { error: 'Failed to record growth measurement' },
      { status: 500 }
    );
  }
});
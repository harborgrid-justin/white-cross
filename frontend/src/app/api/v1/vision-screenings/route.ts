/**
 * Vision screenings API endpoints
 * Student vision screening and eye examination records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/vision-screenings
 * Get vision screening records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vision-screenings');

    const data = await response.json();

    // Audit log vision screenings access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'VisionScreenings',
      details: `Vision screenings accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching vision screenings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch vision screenings' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/vision-screenings
 * Record vision screening
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vision-screenings');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log vision screening recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'VisionScreening',
        resourceId: data.data.id,
        details: 'Vision screening recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording vision screening:', error);

    return NextResponse.json(
      { error: 'Failed to record vision screening' },
      { status: 500 }
    );
  }
});
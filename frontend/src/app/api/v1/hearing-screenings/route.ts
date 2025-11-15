/**
 * Hearing screenings API endpoints
 * Student hearing screening and audiology records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/hearing-screenings
 * Get hearing screening records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/hearing-screenings');

    const data = await response.json();

    // Audit log hearing screenings access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'HearingScreenings',
      details: `Hearing screenings accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching hearing screenings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch hearing screenings' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/hearing-screenings
 * Record hearing screening
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/hearing-screenings');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log hearing screening recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'HearingScreening',
        resourceId: data.data.id,
        details: 'Hearing screening recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording hearing screening:', error);

    return NextResponse.json(
      { error: 'Failed to record hearing screening' },
      { status: 500 }
    );
  }
});
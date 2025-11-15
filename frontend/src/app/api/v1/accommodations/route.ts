/**
 * Accommodations API endpoints
 * Student accommodation and support services records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/accommodations
 * Get accommodation records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/accommodations');

    const data = await response.json();

    // Audit log accommodations access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Accommodations',
      details: `Accommodations accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching accommodations:', error);

    return NextResponse.json(
      { error: 'Failed to fetch accommodations' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/accommodations
 * Record accommodation request/support
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/accommodations');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log accommodation record creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Accommodation',
        resourceId: data.data.id,
        details: 'Accommodation record created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording accommodation:', error);

    return NextResponse.json(
      { error: 'Failed to record accommodation' },
      { status: 500 }
    );
  }
});
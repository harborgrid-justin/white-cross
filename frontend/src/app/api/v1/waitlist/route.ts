/**
 * Waitlist API endpoints
 * Appointment waitlist management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/waitlist
 * Get waitlist entries
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/waitlist');

    const data = await response.json();

    // Audit log waitlist access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Waitlist',
      details: `Waitlist accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching waitlist:', error);

    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/waitlist
 * Add to waitlist
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/waitlist');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log waitlist addition
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'WaitlistEntry',
        resourceId: data.data.id,
        details: 'Added to waitlist'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error adding to waitlist:', error);

    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
});
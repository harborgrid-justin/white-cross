/**
 * Vital signs API endpoints
 * Student vital signs tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/vital-signs
 * Get vital signs
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vital-signs');

    const data = await response.json();

    // Audit log vital signs access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'VitalSigns',
      details: `Vital signs accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching vital signs:', error);

    return NextResponse.json(
      { error: 'Failed to fetch vital signs' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/vital-signs
 * Record vital signs
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vital-signs');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log vital signs recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'VitalSigns',
        resourceId: data.data.id,
        details: 'Vital signs recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording vital signs:', error);

    return NextResponse.json(
      { error: 'Failed to record vital signs' },
      { status: 500 }
    );
  }
});
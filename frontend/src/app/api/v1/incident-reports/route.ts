/**
 * Incident reports API endpoints
 * Student incident reporting and documentation
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/incident-reports
 * Get incident reports
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/incident-reports');

    const data = await response.json();

    // Audit log incident reports access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'IncidentReports',
      details: `Incident reports accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching incident reports:', error);

    return NextResponse.json(
      { error: 'Failed to fetch incident reports' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/incident-reports
 * Create incident report
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/incident-reports');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log incident report creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'IncidentReport',
        resourceId: data.data.id,
        details: 'Incident report created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating incident report:', error);

    return NextResponse.json(
      { error: 'Failed to create incident report' },
      { status: 500 }
    );
  }
});
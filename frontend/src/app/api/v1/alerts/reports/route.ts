/**
 * Alerts reports API endpoint
 * Get alert reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/alerts/reports
 * Get alert reports
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/alerts/reports');

    const data = await response.json();

    // Audit log alert reports access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'AlertsReports',
      details: `Alert reports accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching alert reports:', error);

    return NextResponse.json(
      { error: 'Failed to fetch alert reports' },
      { status: 500 }
    );
  }
});
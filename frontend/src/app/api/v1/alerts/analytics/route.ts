/**
 * Alerts analytics API endpoint
 * Get alert analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/alerts/analytics
 * Get alert analytics
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/alerts/analytics');

    const data = await response.json();

    // Audit log alert analytics access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'AlertsAnalytics',
      details: `Alert analytics accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching alert analytics:', error);

    return NextResponse.json(
      { error: 'Failed to fetch alert analytics' },
      { status: 500 }
    );
  }
});
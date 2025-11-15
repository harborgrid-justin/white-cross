/**
 * Alerts recommendations API endpoint
 * Get alert recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/alerts/recommendations
 * Get alert recommendations
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/alerts/recommendations');

    const data = await response.json();

    // Audit log alert recommendations access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'AlertsRecommendations',
      details: `Alert recommendations accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching alert recommendations:', error);

    return NextResponse.json(
      { error: 'Failed to fetch alert recommendations' },
      { status: 500 }
    );
  }
});
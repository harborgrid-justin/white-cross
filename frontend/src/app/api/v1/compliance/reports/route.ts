/**
 * Compliance Reports API endpoints
 * Generate and retrieve compliance reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { withMinimumRole } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

/**
 * GET /api/v1/compliance/reports
 * List compliance reports (requires ADMIN role or higher)
 */
export const GET = withMinimumRole('ADMIN', async (request: NextRequest, context, auth) => {
  try {
    const response = await proxyToBackend(request, '/api/v1/compliance/reports', {
      cache: {
        revalidate: 300, // Cache for 5 minutes
        tags: ['compliance-reports']
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching compliance reports:', error);
    return NextResponse.json({ error: 'Failed to fetch compliance reports' }, { status: 500 });
  }
});

/**
 * POST /api/v1/compliance/reports
 * Generate new compliance report (requires ADMIN role or higher)
 */
export const POST = withMinimumRole('ADMIN', async (request: NextRequest, context, auth) => {
  try {
    const response = await proxyToBackend(request, '/api/v1/compliance/reports');
    const data = await response.json();

    if (response.status === 201 && data.data) {
      const auditContext = createAuditContext(request, auth.user.id);
      await auditLog({
        ...auditContext,
        action: AUDIT_ACTIONS.GENERATE_REPORT,
        resource: 'ComplianceReport',
        resourceId: data.data.id,
        details: 'Compliance report generated'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    return NextResponse.json({ error: 'Failed to generate compliance report' }, { status: 500 });
  }
});

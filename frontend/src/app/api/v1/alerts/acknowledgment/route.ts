/**
 * Alerts acknowledgment API endpoint
 * Acknowledge alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * POST /api/alerts/acknowledgment
 * Acknowledge alerts
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/alerts/acknowledgment');

    const data = await response.json();

    // Audit log alert acknowledgment
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'UPDATE',
      resource: 'AlertsAcknowledgment',
      details: `Alert acknowledged`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error acknowledging alert:', error);

    return NextResponse.json(
      { error: 'Failed to acknowledge alert' },
      { status: 500 }
    );
  }
});
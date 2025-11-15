/**
 * Statement Notification API endpoint
 * Send billing statements to clients
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * POST /api/billing/notifications/statement
 * Send billing statement
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/billing/notifications/statement');

    const data = await response.json();

    if (response.status === 200) {
      // Audit log statement sent
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'BillingNotifications',
        details: 'Billing statement sent'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error sending billing statement:', error);

    return NextResponse.json(
      { error: 'Failed to send billing statement' },
      { status: 500 }
    );
  }
});
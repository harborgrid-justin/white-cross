/**
 * Payment Reminder API endpoint
 * Send payment reminders to clients
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * POST /api/billing/notifications/reminder
 * Send payment reminder
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/billing/notifications/reminder');

    const data = await response.json();

    if (response.status === 200) {
      // Audit log reminder sent
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'BillingNotifications',
        details: 'Payment reminder sent'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error sending payment reminder:', error);

    return NextResponse.json(
      { error: 'Failed to send payment reminder' },
      { status: 500 }
    );
  }
});
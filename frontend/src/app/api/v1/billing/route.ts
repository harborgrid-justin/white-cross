/**
 * Billing API endpoints
 * Financial management, invoices, payments, analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/billing
 * Get billing data, invoices, payments, analytics
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/billing');

    const data = await response.json();

    // Audit log billing access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Billing',
      details: `Billing data accessed, contains financial information`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching billing data:', error);

    return NextResponse.json(
      { error: 'Failed to fetch billing data' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/billing
 * Create billing resource (invoice, payment, etc.)
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/billing');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log billing creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Billing',
        resourceId: data.data.id,
        details: 'Billing resource created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating billing resource:', error);

    return NextResponse.json(
      { error: 'Failed to create billing resource' },
      { status: 500 }
    );
  }
});
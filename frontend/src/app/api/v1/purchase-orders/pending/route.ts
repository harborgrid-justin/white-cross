/**
 * Purchase orders pending API endpoint
 * Get pending purchase orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/purchase-orders/pending
 * Get pending purchase orders
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/purchase-orders/pending');

    const data = await response.json();

    // Audit log pending purchase orders access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'PurchaseOrdersPending',
      details: `Pending purchase orders accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching pending purchase orders:', error);

    return NextResponse.json(
      { error: 'Failed to fetch pending purchase orders' },
      { status: 500 }
    );
  }
});
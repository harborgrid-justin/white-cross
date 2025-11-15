/**
 * Purchase orders received API endpoint
 * Get received purchase orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/purchase-orders/received
 * Get received purchase orders
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/purchase-orders/received');

    const data = await response.json();

    // Audit log received purchase orders access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'PurchaseOrdersReceived',
      details: `Received purchase orders accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching received purchase orders:', error);

    return NextResponse.json(
      { error: 'Failed to fetch received purchase orders' },
      { status: 500 }
    );
  }
});
/**
 * Purchase orders approved API endpoint
 * Get approved purchase orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/purchase-orders/approved
 * Get approved purchase orders
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/purchase-orders/approved');

    const data = await response.json();

    // Audit log approved purchase orders access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'PurchaseOrdersApproved',
      details: `Approved purchase orders accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching approved purchase orders:', error);

    return NextResponse.json(
      { error: 'Failed to fetch approved purchase orders' },
      { status: 500 }
    );
  }
});
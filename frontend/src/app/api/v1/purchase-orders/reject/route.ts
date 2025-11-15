/**
 * Purchase orders reject API endpoint
 * Reject purchase orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * POST /api/purchase-orders/reject
 * Reject a purchase order
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/purchase-orders/reject');

    const data = await response.json();

    // Audit log purchase order rejection
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'UPDATE',
      resource: 'PurchaseOrder',
      details: `Purchase order rejected`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error rejecting purchase order:', error);

    return NextResponse.json(
      { error: 'Failed to reject purchase order' },
      { status: 500 }
    );
  }
});
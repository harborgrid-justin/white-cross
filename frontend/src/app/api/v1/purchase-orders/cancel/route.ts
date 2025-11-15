/**
 * Purchase orders cancel API endpoint
 * Cancel purchase orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * POST /api/purchase-orders/cancel
 * Cancel a purchase order
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/purchase-orders/cancel');

    const data = await response.json();

    // Audit log purchase order cancellation
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'UPDATE',
      resource: 'PurchaseOrder',
      details: `Purchase order cancelled`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error cancelling purchase order:', error);

    return NextResponse.json(
      { error: 'Failed to cancel purchase order' },
      { status: 500 }
    );
  }
});
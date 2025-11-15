/**
 * Purchase orders approve API endpoint
 * Approve purchase orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * POST /api/purchase-orders/approve
 * Approve a purchase order
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/purchase-orders/approve');

    const data = await response.json();

    // Audit log purchase order approval
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'UPDATE',
      resource: 'PurchaseOrder',
      details: `Purchase order approved`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error approving purchase order:', error);

    return NextResponse.json(
      { error: 'Failed to approve purchase order' },
      { status: 500 }
    );
  }
});
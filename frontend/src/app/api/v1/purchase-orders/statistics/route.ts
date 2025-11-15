/**
 * Purchase orders statistics API endpoint
 * Get purchase order statistics and analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/purchase-orders/statistics
 * Get purchase order statistics
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/purchase-orders/statistics');

    const data = await response.json();

    // Audit log purchase order statistics access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'PurchaseOrdersStatistics',
      details: `Purchase order statistics accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching purchase order statistics:', error);

    return NextResponse.json(
      { error: 'Failed to fetch purchase order statistics' },
      { status: 500 }
    );
  }
});
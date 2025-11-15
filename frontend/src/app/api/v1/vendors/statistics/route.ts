/**
 * Vendors statistics API endpoint
 * Get vendor statistics and analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/vendors/statistics
 * Get vendor statistics
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vendors/statistics');

    const data = await response.json();

    // Audit log vendor statistics access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'VendorsStatistics',
      details: `Vendor statistics accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching vendor statistics:', error);

    return NextResponse.json(
      { error: 'Failed to fetch vendor statistics' },
      { status: 500 }
    );
  }
});
/**
 * Vendors top API endpoint
 * Get top vendors
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/vendors/top
 * Get top vendors
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vendors/top');

    const data = await response.json();

    // Audit log top vendors access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'VendorsTop',
      details: `Top vendors accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching top vendors:', error);

    return NextResponse.json(
      { error: 'Failed to fetch top vendors' },
      { status: 500 }
    );
  }
});
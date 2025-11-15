/**
 * Vendors compare API endpoint
 * Compare vendors for items
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/vendors/compare
 * Compare vendors for items
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vendors/compare');

    const data = await response.json();

    // Audit log vendor comparison
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'VendorsCompare',
      details: `Vendor comparison performed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error comparing vendors:', error);

    return NextResponse.json(
      { error: 'Failed to compare vendors' },
      { status: 500 }
    );
  }
});
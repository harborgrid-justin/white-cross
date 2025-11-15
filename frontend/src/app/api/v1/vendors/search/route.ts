/**
 * Vendors search API endpoint
 * Search vendors
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/vendors/search
 * Search vendors
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vendors/search');

    const data = await response.json();

    // Audit log vendor search
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'SEARCH',
      resource: 'VendorsSearch',
      details: `Vendor search performed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error searching vendors:', error);

    return NextResponse.json(
      { error: 'Failed to search vendors' },
      { status: 500 }
    );
  }
});
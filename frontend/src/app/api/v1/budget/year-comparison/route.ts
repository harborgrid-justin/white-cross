/**
 * Budget year comparison API endpoint
 * Compare budget data across years
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/budget/year-comparison
 * Get year-over-year budget comparison
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/budget/year-comparison');

    const data = await response.json();

    // Audit log budget year comparison access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BudgetYearComparison',
      details: `Budget year comparison data accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching budget year comparison:', error);

    return NextResponse.json(
      { error: 'Failed to fetch budget year comparison' },
      { status: 500 }
    );
  }
});
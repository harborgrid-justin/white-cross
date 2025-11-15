/**
 * Budget recommendations API endpoint
 * Get budget recommendations and suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/budget/recommendations
 * Get budget recommendations
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/budget/recommendations');

    const data = await response.json();

    // Audit log budget recommendations access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BudgetRecommendations',
      details: `Budget recommendations accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching budget recommendations:', error);

    return NextResponse.json(
      { error: 'Failed to fetch budget recommendations' },
      { status: 500 }
    );
  }
});
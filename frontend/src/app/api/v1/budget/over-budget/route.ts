/**
 * Budget over-budget API endpoint
 * Get over-budget alerts and analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/budget/over-budget
 * Get over-budget items and alerts
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/budget/over-budget');

    const data = await response.json();

    // Audit log over-budget access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BudgetOverBudget',
      details: `Over-budget items accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching over-budget data:', error);

    return NextResponse.json(
      { error: 'Failed to fetch over-budget data' },
      { status: 500 }
    );
  }
});
/**
 * Budget export API endpoint
 * Export budget data and reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/budget/export
 * Export budget data
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/budget/export');

    const data = await response.json();

    // Audit log budget export
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'EXPORT',
      resource: 'BudgetExport',
      details: `Budget data exported`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error exporting budget data:', error);

    return NextResponse.json(
      { error: 'Failed to export budget data' },
      { status: 500 }
    );
  }
});
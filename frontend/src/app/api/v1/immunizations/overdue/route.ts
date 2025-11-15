/**
 * Immunizations overdue API endpoint
 * Get overdue immunizations
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/immunizations/overdue
 * Get overdue immunizations
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/immunizations/overdue');

    const data = await response.json();

    // Audit log overdue immunizations access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ImmunizationsOverdue',
      details: `Overdue immunizations accessed, contains PHI`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching overdue immunizations:', error);

    return NextResponse.json(
      { error: 'Failed to fetch overdue immunizations' },
      { status: 500 }
    );
  }
});
/**
 * Immunizations due API endpoint
 * Get due immunizations
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/immunizations/due
 * Get due immunizations
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/immunizations/due');

    const data = await response.json();

    // Audit log due immunizations access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ImmunizationsDue',
      details: `Due immunizations accessed, contains PHI`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching due immunizations:', error);

    return NextResponse.json(
      { error: 'Failed to fetch due immunizations' },
      { status: 500 }
    );
  }
});
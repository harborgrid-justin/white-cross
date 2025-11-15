/**
 * Immunizations exemptions API endpoint
 * Get immunization exemptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/immunizations/exemptions
 * Get immunization exemptions
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/immunizations/exemptions');

    const data = await response.json();

    // Audit log immunization exemptions access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ImmunizationsExemptions',
      details: `Immunization exemptions accessed, contains PHI`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching immunization exemptions:', error);

    return NextResponse.json(
      { error: 'Failed to fetch immunization exemptions' },
      { status: 500 }
    );
  }
});
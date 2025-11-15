/**
 * Immunizations schedule API endpoint
 * Get immunization schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/immunizations/schedule
 * Get immunization schedule
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/immunizations/schedule');

    const data = await response.json();

    // Audit log immunization schedule access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ImmunizationsSchedule',
      details: `Immunization schedule accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching immunization schedule:', error);

    return NextResponse.json(
      { error: 'Failed to fetch immunization schedule' },
      { status: 500 }
    );
  }
});
/**
 * Immunizations compliance API endpoint
 * Get immunization compliance data
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/immunizations/compliance
 * Get immunization compliance data
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/immunizations/compliance');

    const data = await response.json();

    // Audit log immunization compliance access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ImmunizationsCompliance',
      details: `Immunization compliance data accessed, contains PHI`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching immunization compliance:', error);

    return NextResponse.json(
      { error: 'Failed to fetch immunization compliance' },
      { status: 500 }
    );
  }
});
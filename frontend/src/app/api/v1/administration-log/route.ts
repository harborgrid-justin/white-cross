/**
 * Administration log API endpoints
 * Medication administration tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/administration-log
 * Get medication administration logs
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/administration-log');

    const data = await response.json();

    // Audit log administration log access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'AdministrationLog',
      details: `Administration logs accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching administration logs:', error);

    return NextResponse.json(
      { error: 'Failed to fetch administration logs' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/administration-log
 * Record medication administration
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/administration-log');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log administration recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'AdministrationLog',
        resourceId: data.data.id,
        details: 'Medication administration recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording medication administration:', error);

    return NextResponse.json(
      { error: 'Failed to record medication administration' },
      { status: 500 }
    );
  }
});
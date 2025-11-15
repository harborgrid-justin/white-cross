/**
 * Transportation API endpoints
 * Student transportation and mobility assistance records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/transportation
 * Get transportation records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/transportation');

    const data = await response.json();

    // Audit log transportation records access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Transportation',
      details: `Transportation records accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching transportation records:', error);

    return NextResponse.json(
      { error: 'Failed to fetch transportation records' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/transportation
 * Record transportation assistance
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/transportation');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log transportation record creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Transportation',
        resourceId: data.data.id,
        details: 'Transportation record created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording transportation record:', error);

    return NextResponse.json(
      { error: 'Failed to record transportation record' },
      { status: 500 }
    );
  }
});
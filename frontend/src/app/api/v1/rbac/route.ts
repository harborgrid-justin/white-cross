/**
 * RBAC API endpoints
 * Role-based access control management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/rbac
 * Get RBAC configuration and roles
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/rbac');

    const data = await response.json();

    // Audit log RBAC access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'RBAC',
      details: 'RBAC configuration accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching RBAC configuration:', error);

    return NextResponse.json(
      { error: 'Failed to fetch RBAC configuration' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/rbac
 * Update RBAC configuration
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/rbac');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log RBAC update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'RBAC',
        details: 'RBAC configuration updated'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating RBAC configuration:', error);

    return NextResponse.json(
      { error: 'Failed to update RBAC configuration' },
      { status: 500 }
    );
  }
});
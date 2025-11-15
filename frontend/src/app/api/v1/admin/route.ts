/**
 * Admin API endpoints
 * System administration, users, districts, schools, backups, licenses, configurations
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/admin
 * Get admin dashboard data and system information
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/admin');

    const data = await response.json();

    // Audit log admin access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Admin',
      details: `Admin dashboard accessed, contains system metrics and user data`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching admin data:', error);

    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin
 * Create admin resource or perform admin action
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/admin');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log admin action
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Admin',
        resourceId: data.data.id,
        details: 'Admin resource created or action performed'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error performing admin action:', error);

    return NextResponse.json(
      { error: 'Failed to perform admin action' },
      { status: 500 }
    );
  }
});
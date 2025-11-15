/**
 * Monitoring API endpoints
 * System monitoring, health checks, performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/monitoring
 * Get system monitoring data, health checks, performance metrics
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/monitoring');

    const data = await response.json();

    // Audit log monitoring access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Monitoring',
      details: `System monitoring data accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);

    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/monitoring
 * Create monitoring alert or perform monitoring action
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/monitoring');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log monitoring action
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Monitoring',
        resourceId: data.data.id,
        details: 'Monitoring alert or action created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error performing monitoring action:', error);

    return NextResponse.json(
      { error: 'Failed to perform monitoring action' },
      { status: 500 }
    );
  }
});
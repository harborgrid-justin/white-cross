/**
 * Proxy API endpoints
 * API proxy for external services and integrations
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/proxy
 * Proxy GET requests to external services
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/proxy');

    const data = await response.json();

    // Audit log proxy access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Proxy',
      details: `Proxy request made to external service`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying request:', error);

    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/proxy
 * Proxy POST requests to external services
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/proxy');

    const data = await response.json();

    // Audit log proxy action
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'CREATE',
      resource: 'Proxy',
      details: `Proxy request made to external service`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying request:', error);

    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
});
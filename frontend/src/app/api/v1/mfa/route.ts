/**
 * MFA API endpoints
 * Multi-factor authentication management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/mfa
 * Get MFA configuration
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/mfa');

    const data = await response.json();

    // Audit log MFA access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'MFA',
      details: 'MFA configuration accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching MFA configuration:', error);

    return NextResponse.json(
      { error: 'Failed to fetch MFA configuration' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/mfa
 * Configure MFA
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/mfa');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log MFA configuration
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'MFA',
        details: 'MFA configuration updated'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error configuring MFA:', error);

    return NextResponse.json(
      { error: 'Failed to configure MFA' },
      { status: 500 }
    );
  }
});
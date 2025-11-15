/**
 * Social history API endpoints
 * Student social and environmental history records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/social-history
 * Get social history records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/social-history');

    const data = await response.json();

    // Audit log social history access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'SocialHistory',
      details: `Social history records accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching social history:', error);

    return NextResponse.json(
      { error: 'Failed to fetch social history' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/social-history
 * Record social history information
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/social-history');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log social history recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'SocialHistory',
        resourceId: data.data.id,
        details: 'Social history recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording social history:', error);

    return NextResponse.json(
      { error: 'Failed to record social history' },
      { status: 500 }
    );
  }
});
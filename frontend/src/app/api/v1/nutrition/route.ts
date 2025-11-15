/**
 * Nutrition API endpoints
 * Student nutrition and dietary tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/nutrition
 * Get nutrition records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/nutrition');

    const data = await response.json();

    // Audit log nutrition records access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Nutrition',
      details: `Nutrition records accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching nutrition records:', error);

    return NextResponse.json(
      { error: 'Failed to fetch nutrition records' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/nutrition
 * Record nutrition entry
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/nutrition');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log nutrition entry recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Nutrition',
        resourceId: data.data.id,
        details: 'Nutrition entry recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording nutrition entry:', error);

    return NextResponse.json(
      { error: 'Failed to record nutrition entry' },
      { status: 500 }
    );
  }
});
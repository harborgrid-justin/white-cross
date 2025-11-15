/**
 * Developmental milestones API endpoints
 * Student developmental milestone tracking and assessments
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/developmental-milestones
 * Get developmental milestone records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/developmental-milestones');

    const data = await response.json();

    // Audit log developmental milestones access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'DevelopmentalMilestones',
      details: `Developmental milestones accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching developmental milestones:', error);

    return NextResponse.json(
      { error: 'Failed to fetch developmental milestones' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/developmental-milestones
 * Record developmental milestone assessment
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/developmental-milestones');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log developmental milestone recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'DevelopmentalMilestone',
        resourceId: data.data.id,
        details: 'Developmental milestone recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording developmental milestone:', error);

    return NextResponse.json(
      { error: 'Failed to record developmental milestone' },
      { status: 500 }
    );
  }
});
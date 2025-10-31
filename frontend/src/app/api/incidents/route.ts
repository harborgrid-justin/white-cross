/**
 * Incidents API endpoints
 * List and create incident reports with HIPAA compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

/**
 * GET /incidents
 * List all incidents with filtering and pagination
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/incidents', {
      cache: {
        revalidate: 60,
        tags: ['incidents']
      }
    });

    const data = await response.json();

    // Audit log
    const auditContext = createAuditContext(request, auth.user.id);
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.VIEW_INCIDENT,
      resource: 'Incident',
      details: `Listed incidents, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching incidents:', error);

    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
});

/**
 * POST /incidents
 * Create new incident report
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/incidents');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log
      const auditContext = createAuditContext(request, auth.user.id);
      await auditLog({
        ...auditContext,
        action: AUDIT_ACTIONS.CREATE_INCIDENT,
        resource: 'Incident',
        resourceId: data.data.id,
        details: 'Incident report created'
      });

      // Revalidate cache
      revalidateTag('incidents');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating incident:', error);

    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
});

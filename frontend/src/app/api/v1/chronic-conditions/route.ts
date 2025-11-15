/**
 * Chronic conditions API endpoints
 * Student chronic condition management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/chronic-conditions
 * Get chronic conditions
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/chronic-conditions');

    const data = await response.json();

    // Audit log chronic conditions access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ChronicConditions',
      details: `Chronic conditions accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching chronic conditions:', error);

    return NextResponse.json(
      { error: 'Failed to fetch chronic conditions' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/chronic-conditions
 * Create chronic condition record
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/chronic-conditions');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log chronic condition creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'ChronicCondition',
        resourceId: data.data.id,
        details: 'Chronic condition record created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating chronic condition record:', error);

    return NextResponse.json(
      { error: 'Failed to create chronic condition record' },
      { status: 500 }
    );
  }
});
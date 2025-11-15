/**
 * Allergies API endpoints
 * Student allergy management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/allergies
 * Get allergies
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/allergies');

    const data = await response.json();

    // Audit log allergies access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Allergies',
      details: `Allergies accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching allergies:', error);

    return NextResponse.json(
      { error: 'Failed to fetch allergies' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/allergies
 * Create allergy record
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/allergies');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log allergy creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Allergy',
        resourceId: data.data.id,
        details: 'Allergy record created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating allergy record:', error);

    return NextResponse.json(
      { error: 'Failed to create allergy record' },
      { status: 500 }
    );
  }
});
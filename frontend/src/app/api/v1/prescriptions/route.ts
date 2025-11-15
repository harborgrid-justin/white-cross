/**
 * Prescriptions API endpoints
 * Prescription management and tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/prescriptions
 * Get prescriptions
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/prescriptions');

    const data = await response.json();

    // Audit log prescriptions access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Prescriptions',
      details: `Prescriptions accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);

    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/prescriptions
 * Create prescription
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/prescriptions');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log prescription creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Prescription',
        resourceId: data.data.id,
        details: 'Prescription created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating prescription:', error);

    return NextResponse.json(
      { error: 'Failed to create prescription' },
      { status: 500 }
    );
  }
});
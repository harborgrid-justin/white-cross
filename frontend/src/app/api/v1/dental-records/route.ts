/**
 * Dental records API endpoints
 * Student dental examination and treatment records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/dental-records
 * Get dental records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/dental-records');

    const data = await response.json();

    // Audit log dental records access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'DentalRecords',
      details: `Dental records accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching dental records:', error);

    return NextResponse.json(
      { error: 'Failed to fetch dental records' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/dental-records
 * Record dental examination/treatment
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/dental-records');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log dental record creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'DentalRecord',
        resourceId: data.data.id,
        details: 'Dental record created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording dental record:', error);

    return NextResponse.json(
      { error: 'Failed to record dental record' },
      { status: 500 }
    );
  }
});
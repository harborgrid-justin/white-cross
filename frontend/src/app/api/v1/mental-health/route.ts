/**
 * Mental health API endpoints
 * Student mental health assessments and counseling records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/mental-health
 * Get mental health records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/mental-health');

    const data = await response.json();

    // Audit log mental health records access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'MentalHealth',
      details: `Mental health records accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching mental health records:', error);

    return NextResponse.json(
      { error: 'Failed to fetch mental health records' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/mental-health
 * Record mental health assessment/counseling
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/mental-health');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log mental health record creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'MentalHealth',
        resourceId: data.data.id,
        details: 'Mental health record created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording mental health record:', error);

    return NextResponse.json(
      { error: 'Failed to record mental health record' },
      { status: 500 }
    );
  }
});
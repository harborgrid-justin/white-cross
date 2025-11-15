/**
 * Physical exams API endpoints
 * Student physical examination records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/physical-exams
 * Get physical exam records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/physical-exams');

    const data = await response.json();

    // Audit log physical exam records access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'PhysicalExams',
      details: `Physical exam records accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching physical exam records:', error);

    return NextResponse.json(
      { error: 'Failed to fetch physical exam records' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/physical-exams
 * Record physical exam
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/physical-exams');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log physical exam recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'PhysicalExam',
        resourceId: data.data.id,
        details: 'Physical exam recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording physical exam:', error);

    return NextResponse.json(
      { error: 'Failed to record physical exam' },
      { status: 500 }
    );
  }
});
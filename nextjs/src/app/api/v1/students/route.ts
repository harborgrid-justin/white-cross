/**
 * Students API endpoints
 * List and create student records with HIPAA compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '../../middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, AUDIT_ACTIONS, createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/v1/students
 * List all students with filtering and pagination
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/api/v1/students', {
      cache: {
        revalidate: 60, // Cache for 60 seconds
        tags: ['students']
      }
    });

    const data = await response.json();

    // HIPAA: Audit log PHI access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Student',
      details: `Listed students, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching students:', error);

    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/v1/students
 * Create new student record
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/api/v1/students');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // HIPAA: Audit log PHI creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Student',
        resourceId: data.data.id,
        details: 'Student record created'
      });

      // Revalidate cache
      revalidateTag('students');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating student:', error);

    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
});

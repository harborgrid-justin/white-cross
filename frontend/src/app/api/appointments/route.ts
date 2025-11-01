/**
 * Appointments API endpoints
 * List and create appointments with caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /appointments
 * List all appointments
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const response = await proxyToBackend(request, '/appointments', {
      cache: {
        revalidate: 30,
        tags: ['appointments']
      }
    });

    const data = await response.json();

    // HIPAA: Audit log PHI access
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Appointment',
      details: `Listed appointments, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching appointments:', error);

    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
});

/**
 * POST /appointments
 * Create new appointment
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    const response = await proxyToBackend(request, '/appointments');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Appointment',
        resourceId: data.data.id,
        details: 'Appointment created'
      });

      revalidateTag('appointments');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating appointment:', error);

    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
});

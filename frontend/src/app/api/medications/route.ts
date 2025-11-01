/**
 * Medications API endpoints
 * List and create medication records with HIPAA compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';

/**
 * GET /medications
 * List all medications with filtering and pagination
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/medications', {
      cache: {
        revalidate: 30, // Cache for 30 seconds (sensitive healthcare data)
        tags: ['medications']
      }
    });

    const data = await response.json();

    // HIPAA: Audit log PHI access
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Medication',
      details: `Listed medications, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching medications:', error);

    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  }
});

/**
 * POST /medications
 * Create new medication record
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/medications');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // HIPAA: Audit log PHI creation
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Medication',
        resourceId: data.data.id,
        details: 'Medication record created'
      });

      // Revalidate cache
      revalidateTag('medications');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating medication:', error);

    return NextResponse.json(
      { error: 'Failed to create medication' },
      { status: 500 }
    );
  }
});

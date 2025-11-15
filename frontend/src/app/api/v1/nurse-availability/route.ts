/**
 * Nurse availability API endpoints
 * Nurse scheduling and availability management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/nurse-availability
 * Get nurse availability
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/nurse-availability');

    const data = await response.json();

    // Audit log nurse availability access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'NurseAvailability',
      details: `Nurse availability accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching nurse availability:', error);

    return NextResponse.json(
      { error: 'Failed to fetch nurse availability' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/nurse-availability
 * Update nurse availability
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/nurse-availability');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log nurse availability update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'NurseAvailability',
        details: 'Nurse availability updated'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating nurse availability:', error);

    return NextResponse.json(
      { error: 'Failed to update nurse availability' },
      { status: 500 }
    );
  }
});
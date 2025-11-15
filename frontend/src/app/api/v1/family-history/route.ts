/**
 * Family history API endpoints
 * Student family medical history records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/family-history
 * Get family history records
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/family-history');

    const data = await response.json();

    // Audit log family history access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'FamilyHistory',
      details: `Family history records accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching family history:', error);

    return NextResponse.json(
      { error: 'Failed to fetch family history' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/family-history
 * Record family history information
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/family-history');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log family history recording
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'FamilyHistory',
        resourceId: data.data.id,
        details: 'Family history recorded'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording family history:', error);

    return NextResponse.json(
      { error: 'Failed to record family history' },
      { status: 500 }
    );
  }
});
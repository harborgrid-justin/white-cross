/**
 * Budget API endpoints
 * Budget management, categories, transactions, analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/budget
 * Get budget data, categories, transactions, analytics
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/budget');

    const data = await response.json();

    // Audit log budget access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Budget',
      details: `Budget data accessed, contains financial information`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching budget data:', error);

    return NextResponse.json(
      { error: 'Failed to fetch budget data' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/budget
 * Create budget resource (category, transaction, etc.)
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/budget');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log budget creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Budget',
        resourceId: data.data.id,
        details: 'Budget resource created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating budget resource:', error);

    return NextResponse.json(
      { error: 'Failed to create budget resource' },
      { status: 500 }
    );
  }
});
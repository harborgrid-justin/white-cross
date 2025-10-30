/**
 * Audit Logs API endpoints
 * Retrieve audit logs for compliance reporting
 */

import { NextRequest, NextResponse } from 'next/server';
import { withMinimumRole } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';

/**
 * GET /compliance/audit-logs
 * List audit logs (requires ADMIN role or higher)
 */
export const GET = withMinimumRole('ADMIN', async (request: NextRequest, context, auth) => {
  try {
    const response = await proxyToBackend(request, '/compliance/audit-logs', {
      cache: {
        revalidate: 0, // No caching for audit logs
        tags: ['audit-logs']
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
});

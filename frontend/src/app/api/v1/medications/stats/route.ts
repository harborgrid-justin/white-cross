/**
 * Medications stats API endpoint
 * Get medication statistics for dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';

/**
 * GET /api/medications/stats
 * Get medication statistics
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    console.log(`[Medications Stats API] Processing stats request`);

    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/medications/stats', {
      cache: {
        revalidate: 60, // Cache for 1 minute
        tags: ['medication-stats', 'medications']
      }
    });

    console.log(`[Medications Stats API] Backend response status: ${response.status}`);

    const data = await response.json();

    if (response.status === 200) {
      // HIPAA: Audit log PHI access
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'VIEW',
        resource: 'MedicationStats',
        details: 'Viewed medication statistics'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching medication stats:', error);

    return NextResponse.json(
      { error: 'Failed to fetch medication statistics' },
      { status: 500 }
    );
  }
});
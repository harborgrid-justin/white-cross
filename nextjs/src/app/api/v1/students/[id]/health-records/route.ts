/**
 * Student health records API endpoints
 * Get health records for specific student
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../../middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';

/**
 * GET /api/v1/students/:id/health-records
 * Get all health records for a student
 */
export const GET = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend with caching
      const response = await proxyToBackend(request, `/api/v1/students/${id}/health-records`, {
        cache: {
          revalidate: 30, // Cache for 30 seconds (more sensitive data)
          tags: [`student-${id}-health-records`, `student-${id}`, 'health-records']
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI access
        const auditContext = createAuditContext(request, auth.user.id);
        await logPHIAccess({
          ...auditContext,
          action: 'VIEW',
          resource: 'HealthRecord',
          details: `Viewed health records for student ${id}`
        });
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error fetching student health records:', error);

      return NextResponse.json(
        { error: 'Failed to fetch health records' },
        { status: 500 }
      );
    }
  }
);

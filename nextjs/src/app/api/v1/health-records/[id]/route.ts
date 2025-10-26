/**
 * Individual health record API endpoints
 * Get, update, and delete specific health records
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '../../../middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';

/**
 * GET /api/v1/health-records/:id
 * Get health record by ID
 */
export const GET = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend with caching
      const response = await proxyToBackend(request, `/api/v1/health-records/${id}`, {
        cache: {
          revalidate: 30,
          tags: [`health-record-${id}`, 'health-records']
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
          resourceId: id,
          details: 'Health record viewed'
        });
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error fetching health record:', error);

      return NextResponse.json(
        { error: 'Failed to fetch health record' },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT /api/v1/health-records/:id
 * Update health record
 */
export const PUT = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/api/v1/health-records/${id}`);

      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI update
        const auditContext = createAuditContext(request, auth.user.id);
        await logPHIAccess({
          ...auditContext,
          action: 'UPDATE',
          resource: 'HealthRecord',
          resourceId: id,
          details: 'Health record updated'
        });

        // Revalidate cache
        revalidateTag('health-records');
        revalidateTag(`health-record-${id}`);
        if (data.data?.studentId) {
          revalidateTag(`student-${data.data.studentId}-health-records`);
        }
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error updating health record:', error);

      return NextResponse.json(
        { error: 'Failed to update health record' },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/v1/health-records/:id
 * Delete health record
 */
export const DELETE = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/api/v1/health-records/${id}`);

      const data = await response.json();

      if (response.status === 200 || response.status === 204) {
        // HIPAA: Audit log PHI deletion
        const auditContext = createAuditContext(request, auth.user.id);
        await logPHIAccess({
          ...auditContext,
          action: 'DELETE',
          resource: 'HealthRecord',
          resourceId: id,
          details: 'Health record deleted'
        });

        // Revalidate cache
        revalidateTag('health-records');
        revalidateTag(`health-record-${id}`);
      }

      return NextResponse.json(data || { success: true }, { status: response.status });
    } catch (error) {
      console.error('Error deleting health record:', error);

      return NextResponse.json(
        { error: 'Failed to delete health record' },
        { status: 500 }
      );
    }
  }
);

/**
 * PATCH /api/v1/health-records/:id
 * Partial update health record
 */
export const PATCH = PUT;

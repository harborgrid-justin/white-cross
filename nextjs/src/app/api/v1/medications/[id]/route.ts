/**
 * Individual medication API endpoints
 * Get, update, and delete specific medication records
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';

/**
 * GET /api/v1/medications/:id
 * Get medication by ID
 */
export const GET = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend with caching
      const response = await proxyToBackend(request, `/api/v1/medications/${id}`, {
        cache: {
          revalidate: 30,
          tags: [`medication-${id}`, 'medications']
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI access
        const auditContext = createAuditContext(request, auth.user.id);
        await logPHIAccess({
          ...auditContext,
          action: 'VIEW',
          resource: 'Medication',
          resourceId: id,
          details: 'Medication record viewed'
        });
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error fetching medication:', error);

      return NextResponse.json(
        { error: 'Failed to fetch medication' },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT /api/v1/medications/:id
 * Update medication record
 */
export const PUT = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/api/v1/medications/${id}`);

      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI update
        const auditContext = createAuditContext(request, auth.user.id);
        await logPHIAccess({
          ...auditContext,
          action: 'UPDATE',
          resource: 'Medication',
          resourceId: id,
          details: 'Medication record updated'
        });

        // Revalidate cache
        revalidateTag('medications');
        revalidateTag(`medication-${id}`);
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error updating medication:', error);

      return NextResponse.json(
        { error: 'Failed to update medication' },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/v1/medications/:id
 * Delete medication record
 */
export const DELETE = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/api/v1/medications/${id}`);

      const data = await response.json();

      if (response.status === 200 || response.status === 204) {
        // HIPAA: Audit log PHI deletion
        const auditContext = createAuditContext(request, auth.user.id);
        await logPHIAccess({
          ...auditContext,
          action: 'DELETE',
          resource: 'Medication',
          resourceId: id,
          details: 'Medication record deleted'
        });

        // Revalidate cache
        revalidateTag('medications');
        revalidateTag(`medication-${id}`);
      }

      return NextResponse.json(data || { success: true }, { status: response.status });
    } catch (error) {
      console.error('Error deleting medication:', error);

      return NextResponse.json(
        { error: 'Failed to delete medication' },
        { status: 500 }
      );
    }
  }
);

/**
 * PATCH /api/v1/medications/:id
 * Partial update medication record
 */
export const PATCH = PUT;

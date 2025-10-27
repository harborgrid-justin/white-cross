/**
 * Individual student API endpoints
 * Get, update, and delete specific student records
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';

/**
 * GET /api/v1/students/:id
 * Get student by ID
 */
export const GET = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend with caching
      const response = await proxyToBackend(request, `/api/v1/students/${id}`, {
        cache: {
          revalidate: 60,
          tags: [`student-${id}`, 'students']
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI access
        const auditContext = createAuditContext(request, auth.user.id);
        await logPHIAccess({
          ...auditContext,
          action: 'VIEW',
          resource: 'Student',
          resourceId: id,
          details: 'Student record viewed'
        });
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error fetching student:', error);

      return NextResponse.json(
        { error: 'Failed to fetch student' },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT /api/v1/students/:id
 * Update student record
 */
export const PUT = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/api/v1/students/${id}`);

      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI update
        const auditContext = createAuditContext(request, auth.user.id);
        await logPHIAccess({
          ...auditContext,
          action: 'UPDATE',
          resource: 'Student',
          resourceId: id,
          details: 'Student record updated'
        });

        // Revalidate cache
        revalidateTag('students');
        revalidateTag(`student-${id}`);
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error updating student:', error);

      return NextResponse.json(
        { error: 'Failed to update student' },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/v1/students/:id
 * Delete student record
 */
export const DELETE = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/api/v1/students/${id}`);

      const data = await response.json();

      if (response.status === 200 || response.status === 204) {
        // HIPAA: Audit log PHI deletion
        const auditContext = createAuditContext(request, auth.user.id);
        await logPHIAccess({
          ...auditContext,
          action: 'DELETE',
          resource: 'Student',
          resourceId: id,
          details: 'Student record deleted'
        });

        // Revalidate cache
        revalidateTag('students');
        revalidateTag(`student-${id}`);
      }

      return NextResponse.json(data || { success: true }, { status: response.status });
    } catch (error) {
      console.error('Error deleting student:', error);

      return NextResponse.json(
        { error: 'Failed to delete student' },
        { status: 500 }
      );
    }
  }
);

/**
 * PATCH /api/v1/students/:id
 * Partial update student record
 */
export const PATCH = PUT;

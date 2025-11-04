/**
 * Individual student API endpoints
 * Get, update, and delete specific student records
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';
import {
  getCacheConfig,
  generateCacheTags,
  getCacheControlHeader
} from '@/lib/cache/config';
import { invalidateStudentData } from '@/lib/cache/invalidation';

/**
 * Route segment configuration
 * Force dynamic rendering for authenticated routes with dynamic params
 */

/**
 * GET /api/students/:id
 * Get student by ID
 */
export const GET = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;
      const cacheConfig = getCacheConfig('students');
      const cacheTags = generateCacheTags('students', id);
      const cacheControl = getCacheControlHeader('students');

      // Proxy request to backend with enhanced caching
      const response = await proxyToBackend(request, `/students/${id}`, {
        cache: {
          revalidate: cacheConfig.revalidate,
          tags: cacheTags
        },
        cacheControl
      });

      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI access
        const auditContext = createAuditContext(request, auth.user.userId);
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
 * PUT /api/students/:id
 * Update student record
 */
export const PUT = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/students/${id}`);

      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI update
        const auditContext = createAuditContext(request, auth.user.userId);
        await logPHIAccess({
          ...auditContext,
          action: 'UPDATE',
          resource: 'Student',
          resourceId: id,
          details: 'Student record updated'
        });

        // Invalidate all student-related caches
        await invalidateStudentData(id);
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
 * DELETE /api/students/:id
 * Delete student record
 */
export const DELETE = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/students/${id}`);

      const data = await response.json();

      if (response.status === 200 || response.status === 204) {
        // HIPAA: Audit log PHI deletion
        const auditContext = createAuditContext(request, auth.user.userId);
        await logPHIAccess({
          ...auditContext,
          action: 'DELETE',
          resource: 'Student',
          resourceId: id,
          details: 'Student record deleted'
        });

        // Invalidate all student-related caches
        await invalidateStudentData(id);
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
 * PATCH /api/students/:id
 * Partial update student record
 */
export const PATCH = PUT;

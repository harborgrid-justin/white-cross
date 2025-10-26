/**
 * Individual incident API endpoints
 * Get, update, and delete specific incident reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '../../../middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

/**
 * GET /api/v1/incidents/:id
 * Get incident by ID
 */
export const GET = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend with caching
      const response = await proxyToBackend(request, `/api/v1/incidents/${id}`, {
        cache: {
          revalidate: 60,
          tags: [`incident-${id}`, 'incidents']
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        // Audit log
        const auditContext = createAuditContext(request, auth.user.id);
        await auditLog({
          ...auditContext,
          action: AUDIT_ACTIONS.VIEW_INCIDENT,
          resource: 'Incident',
          resourceId: id,
          details: 'Incident report viewed'
        });
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error fetching incident:', error);

      return NextResponse.json(
        { error: 'Failed to fetch incident' },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT /api/v1/incidents/:id
 * Update incident report
 */
export const PUT = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/api/v1/incidents/${id}`);

      const data = await response.json();

      if (response.status === 200) {
        // Audit log
        const auditContext = createAuditContext(request, auth.user.id);
        await auditLog({
          ...auditContext,
          action: AUDIT_ACTIONS.UPDATE_INCIDENT,
          resource: 'Incident',
          resourceId: id,
          details: 'Incident report updated'
        });

        // Revalidate cache
        revalidateTag('incidents');
        revalidateTag(`incident-${id}`);
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error updating incident:', error);

      return NextResponse.json(
        { error: 'Failed to update incident' },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/v1/incidents/:id
 * Delete incident report
 */
export const DELETE = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/api/v1/incidents/${id}`);

      const data = await response.json();

      if (response.status === 200 || response.status === 204) {
        // Audit log
        const auditContext = createAuditContext(request, auth.user.id);
        await auditLog({
          ...auditContext,
          action: AUDIT_ACTIONS.DELETE_INCIDENT,
          resource: 'Incident',
          resourceId: id,
          details: 'Incident report deleted'
        });

        // Revalidate cache
        revalidateTag('incidents');
        revalidateTag(`incident-${id}`);
      }

      return NextResponse.json(data || { success: true }, { status: response.status });
    } catch (error) {
      console.error('Error deleting incident:', error);

      return NextResponse.json(
        { error: 'Failed to delete incident' },
        { status: 500 }
      );
    }
  }
);

/**
 * PATCH /api/v1/incidents/:id
 * Partial update incident report
 */
export const PATCH = PUT;

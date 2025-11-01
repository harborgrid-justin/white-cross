/**
 * Individual appointment API endpoints
 * Get, update, and delete specific appointments
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

export const GET = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      const response = await proxyToBackend(request, `/appointments/${id}`, {
        cache: {
          revalidate: 30,
          tags: [`appointment-${id}`, 'appointments']
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI access
        const auditContext = createAuditContext(request, auth.user.userId);
        await logPHIAccess({
          ...auditContext,
          action: 'VIEW',
          resource: 'Appointment',
          resourceId: id,
          details: 'Appointment record viewed'
        });
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
    }
  }
);

export const PUT = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      const response = await proxyToBackend(request, `/appointments/${id}`);
      const data = await response.json();

      if (response.status === 200) {
        // HIPAA: Audit log PHI update
        const auditContext = createAuditContext(request, auth.user.userId);
        await logPHIAccess({
          ...auditContext,
          action: 'UPDATE',
          resource: 'Appointment',
          resourceId: id,
          details: 'Appointment record updated'
        });

        revalidateTag('appointments');
        revalidateTag(`appointment-${id}`);
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error updating appointment:', error);
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
  }
);

export const DELETE = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      const response = await proxyToBackend(request, `/appointments/${id}`);
      const data = await response.json();

      if (response.status === 200 || response.status === 204) {
        // HIPAA: Audit log PHI deletion
        const auditContext = createAuditContext(request, auth.user.userId);
        await logPHIAccess({
          ...auditContext,
          action: 'DELETE',
          resource: 'Appointment',
          resourceId: id,
          details: 'Appointment record deleted'
        });

        revalidateTag('appointments');
        revalidateTag(`appointment-${id}`);
      }

      return NextResponse.json(data || { success: true }, { status: response.status });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
    }
  }
);

export const PATCH = PUT;

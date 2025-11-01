/**
 * Medication administration API endpoint
 * Record medication administration for a student
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, AUDIT_ACTIONS, createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * POST /api/medications/:id/administer
 * Record medication administration
 */
export const POST = withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const { id } = params;

      // Proxy request to backend
      const response = await proxyToBackend(request, `/medications/${id}/administer`);

      const data = await response.json();

      if (response.status === 200 || response.status === 201) {
        // HIPAA: Audit log medication administration (critical PHI event)
        const auditContext = createAuditContext(request, auth.user.userId);
        await auditLog({
          ...auditContext,
          action: AUDIT_ACTIONS.ADMINISTER_MEDICATION,
          resource: 'Medication',
          resourceId: id,
          details: 'Medication administered',
          success: true
        });

        // Also log as PHI access
        await logPHIAccess({
          ...auditContext,
          action: 'UPDATE',
          resource: 'Medication',
          resourceId: id,
          details: 'Medication administration recorded'
        });

        // Revalidate cache
        revalidateTag('medications', {});
        revalidateTag(`medication-${id}`, {});
      }

      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error administering medication:', error);

      return NextResponse.json(
        { error: 'Failed to administer medication' },
        { status: 500 }
      );
    }
  }
);

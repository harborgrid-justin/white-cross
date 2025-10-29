/**
 * Broadcasts API endpoints
 * Send and manage broadcast messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth, withMinimumRole } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, createAuditContext } from '@/lib/audit';

/**
 * GET /api/v1/communications/broadcasts
 * List all broadcasts
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    const response = await proxyToBackend(request, '/api/v1/communications/broadcasts', {
      cache: {
        revalidate: 60,
        tags: ['broadcasts']
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching broadcasts:', error);
    return NextResponse.json({ error: 'Failed to fetch broadcasts' }, { status: 500 });
  }
});

/**
 * POST /api/v1/communications/broadcasts
 * Send new broadcast (requires NURSE role or higher)
 */
export const POST = withMinimumRole('NURSE', async (request: NextRequest, context, auth) => {
  try {
    const response = await proxyToBackend(request, '/api/v1/communications/broadcasts');
    const data = await response.json();

    if (response.status === 201 && data.data) {
      const auditContext = createAuditContext(request, auth.user.id);
      await auditLog({
        ...auditContext,
        action: 'SEND_BROADCAST',
        resource: 'Broadcast',
        resourceId: data.data.id,
        details: 'Broadcast message sent'
      });

      revalidateTag('broadcasts');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
});

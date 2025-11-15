/**
 * Individual Payment API endpoints
 * HIPAA-compliant payment management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';
import {
  getCacheConfig,
  generateCacheTags,
  getCacheControlHeader
} from '@/lib/cache/config';
import { invalidateResource } from '@/lib/cache/invalidation';

/**
 * GET /api/billing/payments/[id]
 * Get payment by ID
 */
export const GET = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;
    const cacheConfig = getCacheConfig('billing');
    const cacheTags = generateCacheTags('billing', id);
    const cacheControl = getCacheControlHeader('billing');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/billing/payments/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // HIPAA: Audit log payment access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BillingPayment',
      resourceId: id,
      details: 'Payment accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching payment:', error);

    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/billing/payments/[id]
 * Update payment
 */
export const PUT = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/billing/payments/${id}`, {
      method: 'PUT'
    });

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // HIPAA: Audit log payment update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'BillingPayment',
        resourceId: id,
        details: 'Payment updated'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating payment:', error);

    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/billing/payments/[id]
 * Delete payment
 */
export const DELETE = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/billing/payments/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      // HIPAA: Audit log payment deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'BillingPayment',
        resourceId: id,
        details: 'Payment deleted'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error deleting payment:', error);

    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    );
  }
});
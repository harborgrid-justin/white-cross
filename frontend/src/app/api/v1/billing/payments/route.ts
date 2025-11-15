/**
 * Billing Payments API endpoints
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
 * GET /api/billing/payments
 * List all payments with filtering and pagination
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('billing');
    const cacheTags = generateCacheTags('billing');
    const cacheControl = getCacheControlHeader('billing');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/billing/payments', {
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
      details: `Listed payments, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching payments:', error);

    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/billing/payments
 * Create new payment
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/billing/payments');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // HIPAA: Audit log payment creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'BillingPayment',
        resourceId: data.data.id,
        details: 'Payment created'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating payment:', error);

    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
});
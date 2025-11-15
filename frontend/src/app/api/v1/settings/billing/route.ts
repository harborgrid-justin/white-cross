/**
 * Billing settings API endpoint
 * User billing and payment settings
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
 * GET /api/settings/billing
 * Get user billing settings
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('billing');
    const cacheTags = generateCacheTags('billing', 'settings');
    const cacheControl = getCacheControlHeader('billing');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/settings/billing', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log billing settings access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BillingSettings',
      details: 'Billing settings accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching billing settings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch billing settings' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/settings/billing
 * Update user billing settings
 */
export const PUT = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings/billing');

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log billing settings update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'BillingSettings',
        details: 'Billing settings updated'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating billing settings:', error);

    return NextResponse.json(
      { error: 'Failed to update billing settings' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/settings/billing/payment-method
 * Add payment method
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/settings/billing/payment-method');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log payment method addition
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'PaymentMethod',
        resourceId: data.data.id,
        details: 'Payment method added'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error adding payment method:', error);

    return NextResponse.json(
      { error: 'Failed to add payment method' },
      { status: 500 }
    );
  }
});
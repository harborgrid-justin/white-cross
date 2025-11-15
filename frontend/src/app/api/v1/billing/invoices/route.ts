/**
 * Billing Invoices API endpoints
 * HIPAA-compliant billing and invoice management
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
 * Route segment configuration
 * Force dynamic rendering for authenticated routes
 */

/**
 * GET /api/billing/invoices
 * List all invoices with filtering and pagination
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('billing');
    const cacheTags = generateCacheTags('billing');
    const cacheControl = getCacheControlHeader('billing');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/billing/invoices', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // HIPAA: Audit log billing access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BillingInvoice',
      details: `Listed invoices, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching invoices:', error);

    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/billing/invoices
 * Create new invoice
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/billing/invoices');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // HIPAA: Audit log billing creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'BillingInvoice',
        resourceId: data.data.id,
        details: 'Invoice created'
      });

      // Invalidate cache using new utility
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating invoice:', error);

    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
});
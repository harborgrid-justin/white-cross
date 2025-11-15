/**
 * Budget Transactions API endpoints
 * Budget transaction management
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
 * GET /api/budget/transactions
 * List budget transactions
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('billing');
    const cacheTags = generateCacheTags('billing');
    const cacheControl = getCacheControlHeader('billing');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/budget/transactions', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log transactions access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BudgetTransactions',
      details: 'Budget transactions accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching budget transactions:', error);

    return NextResponse.json(
      { error: 'Failed to fetch budget transactions' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/budget/transactions
 * Create budget transaction
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/budget/transactions');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log transaction creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'BudgetTransactions',
        resourceId: data.data.id,
        details: 'Budget transaction created'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating budget transaction:', error);

    return NextResponse.json(
      { error: 'Failed to create budget transaction' },
      { status: 500 }
    );
  }
});
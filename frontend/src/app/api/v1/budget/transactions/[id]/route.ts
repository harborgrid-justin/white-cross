/**
 * Individual Budget Transaction API endpoints
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
 * GET /api/budget/transactions/[id]
 * Get budget transaction by ID
 */
export const GET = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;
    const cacheConfig = getCacheConfig('billing');
    const cacheTags = generateCacheTags('billing', id);
    const cacheControl = getCacheControlHeader('billing');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/budget/transactions/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log transaction access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BudgetTransactions',
      resourceId: id,
      details: 'Budget transaction accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching budget transaction:', error);

    return NextResponse.json(
      { error: 'Failed to fetch budget transaction' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/budget/transactions/[id]
 * Update budget transaction
 */
export const PUT = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/budget/transactions/${id}`, {
      method: 'PUT'
    });

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log transaction update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'BudgetTransactions',
        resourceId: id,
        details: 'Budget transaction updated'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating budget transaction:', error);

    return NextResponse.json(
      { error: 'Failed to update budget transaction' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/budget/transactions/[id]
 * Delete budget transaction
 */
export const DELETE = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/budget/transactions/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      // Audit log transaction deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'BudgetTransactions',
        resourceId: id,
        details: 'Budget transaction deleted'
      });

      // Invalidate cache
      await invalidateResource('billing');
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error deleting budget transaction:', error);

    return NextResponse.json(
      { error: 'Failed to delete budget transaction' },
      { status: 500 }
    );
  }
});
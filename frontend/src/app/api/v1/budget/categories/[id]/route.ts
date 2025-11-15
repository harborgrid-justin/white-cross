/**
 * Individual Budget Category API endpoints
 * Budget category management
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
 * GET /api/budget/categories/[id]
 * Get budget category by ID
 */
export const GET = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;
    const cacheConfig = getCacheConfig('configuration');
    const cacheTags = generateCacheTags('configuration', id);
    const cacheControl = getCacheControlHeader('configuration');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/budget/categories/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log category access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'BudgetCategories',
      resourceId: id,
      details: 'Budget category accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching budget category:', error);

    return NextResponse.json(
      { error: 'Failed to fetch budget category' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/budget/categories/[id]
 * Update budget category
 */
export const PUT = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/budget/categories/${id}`, {
      method: 'PUT'
    });

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // Audit log category update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'BudgetCategories',
        resourceId: id,
        details: 'Budget category updated'
      });

      // Invalidate cache
      await invalidateResource('configuration');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating budget category:', error);

    return NextResponse.json(
      { error: 'Failed to update budget category' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/budget/categories/[id]
 * Delete budget category
 */
export const DELETE = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/budget/categories/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      // Audit log category deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'BudgetCategories',
        resourceId: id,
        details: 'Budget category deleted'
      });

      // Invalidate cache
      await invalidateResource('configuration');
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error deleting budget category:', error);

    return NextResponse.json(
      { error: 'Failed to delete budget category' },
      { status: 500 }
    );
  }
});
/**
 * Individual Immunization API endpoints
 * Immunization record management
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
 * GET /api/immunizations/[id]
 * Get immunization by ID
 */
export const GET = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;
    const cacheConfig = getCacheConfig('medications');
    const cacheTags = generateCacheTags('medications', id);
    const cacheControl = getCacheControlHeader('medications');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, `/vaccinations/${id}`, {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // HIPAA: Audit log PHI access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Immunizations',
      resourceId: id,
      details: 'Immunization accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching immunization:', error);

    return NextResponse.json(
      { error: 'Failed to fetch immunization' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/immunizations/[id]
 * Update immunization
 */
export const PUT = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/vaccinations/${id}`);

    const data = await response.json();

    if (response.status === 200 && data.data) {
      // HIPAA: Audit log PHI update
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'Immunizations',
        resourceId: id,
        details: 'Immunization updated'
      });

      // Invalidate cache
      await invalidateResource('medications');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating immunization:', error);

    return NextResponse.json(
      { error: 'Failed to update immunization' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/immunizations/[id]
 * Delete immunization
 */
export const DELETE = withAuth(async (request: NextRequest, { params }, auth) => {
  try {
    const { id } = params;

    // Proxy request to backend
    const response = await proxyToBackend(request, `/vaccinations/${id}`);

    if (response.status === 204) {
      // HIPAA: Audit log PHI deletion
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'Immunizations',
        resourceId: id,
        details: 'Immunization deleted'
      });

      // Invalidate cache
      await invalidateResource('medications');
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error deleting immunization:', error);

    return NextResponse.json(
      { error: 'Failed to delete immunization' },
      { status: 500 }
    );
  }
});
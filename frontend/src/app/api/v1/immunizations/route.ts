/**
 * Immunizations API endpoints
 * Vaccination and immunization management
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
 * GET /api/immunizations
 * List immunizations
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('medications');
    const cacheTags = generateCacheTags('medications');
    const cacheControl = getCacheControlHeader('medications');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/vaccinations', {
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
      details: `Immunizations accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching immunizations:', error);

    return NextResponse.json(
      { error: 'Failed to fetch immunizations' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/immunizations
 * Create immunization record
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/vaccinations');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // HIPAA: Audit log PHI creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Immunizations',
        resourceId: data.data.id,
        details: 'Immunization record created'
      });

      // Invalidate cache
      await invalidateResource('medications');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating immunization:', error);

    return NextResponse.json(
      { error: 'Failed to create immunization' },
      { status: 500 }
    );
  }
});
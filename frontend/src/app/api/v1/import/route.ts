/**
 * Import API endpoints
 * Data import and bulk operations
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
 * GET /api/import
 * Get import jobs and status
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('documents');
    const cacheTags = generateCacheTags('documents', 'import');
    const cacheControl = getCacheControlHeader('documents');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/import', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log import access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ImportJobs',
      details: `Import jobs accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching import jobs:', error);

    return NextResponse.json(
      { error: 'Failed to fetch import jobs' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/import
 * Start new import job
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/import');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log import job creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'ImportJob',
        resourceId: data.data.id,
        details: 'Import job started'
      });

      // Invalidate cache
      await invalidateResource('documents');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error starting import job:', error);

    return NextResponse.json(
      { error: 'Failed to start import job' },
      { status: 500 }
    );
  }
});
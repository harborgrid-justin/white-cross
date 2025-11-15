/**
 * Export API endpoints
 * Data export and download operations
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
 * GET /api/export
 * Get export jobs and status
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('documents');
    const cacheTags = generateCacheTags('documents', 'export');
    const cacheControl = getCacheControlHeader('documents');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/export', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log export access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ExportJobs',
      details: `Export jobs accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching export jobs:', error);

    return NextResponse.json(
      { error: 'Failed to fetch export jobs' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/export
 * Start new export job
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/export');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log export job creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'ExportJob',
        resourceId: data.data.id,
        details: 'Export job started'
      });

      // Invalidate cache
      await invalidateResource('documents');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error starting export job:', error);

    return NextResponse.json(
      { error: 'Failed to start export job' },
      { status: 500 }
    );
  }
});
/**
 * Forms API endpoints
 * Form management and submission
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
 * GET /api/forms
 * List forms
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('configuration');
    const cacheTags = generateCacheTags('configuration');
    const cacheControl = getCacheControlHeader('configuration');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/forms', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log forms access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Forms',
      details: 'Forms accessed'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching forms:', error);

    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/forms
 * Create form
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/forms');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log form creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Forms',
        resourceId: data.data.id,
        details: 'Form created'
      });

      // Invalidate cache
      await invalidateResource('configuration');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating form:', error);

    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    );
  }
});
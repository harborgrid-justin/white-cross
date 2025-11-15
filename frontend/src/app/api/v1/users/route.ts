/**
 * Users API endpoints
 * User management and profiles
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
 * GET /api/users
 * Get users list
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('students'); // Using students cache config for user data
    const cacheTags = generateCacheTags('students', 'users');
    const cacheControl = getCacheControlHeader('students');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/users', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log users access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Users',
      details: `Users accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching users:', error);

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/users
 * Create new user
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/users');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log user creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'User',
        resourceId: data.data.id,
        details: 'User created'
      });

      // Invalidate cache
      await invalidateResource('students');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating user:', error);

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
});
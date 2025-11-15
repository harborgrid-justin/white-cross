/**
 * Templates API endpoints
 * Message and document templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/templates
 * Get templates
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/templates');

    const data = await response.json();

    // Audit log templates access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'Templates',
      details: `Templates accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching templates:', error);

    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/templates
 * Create template
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/templates');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log template creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Template',
        resourceId: data.data.id,
        details: 'Template created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating template:', error);

    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
});
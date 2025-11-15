/**
 * Forms templates API endpoint
 * Get form templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/forms/templates
 * Get form templates
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/forms/templates');

    const data = await response.json();

    // Audit log form templates access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'FormTemplates',
      details: `Form templates accessed`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching form templates:', error);

    return NextResponse.json(
      { error: 'Failed to fetch form templates' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/forms/templates
 * Create form template
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/forms/templates');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log form template creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'FormTemplate',
        resourceId: data.data.id,
        details: 'Form template created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating form template:', error);

    return NextResponse.json(
      { error: 'Failed to create form template' },
      { status: 500 }
    );
  }
});
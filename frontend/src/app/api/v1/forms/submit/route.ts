/**
 * Forms submit API endpoint
 * Submit forms
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * POST /api/forms/submit
 * Submit a form
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/forms/submit');

    const data = await response.json();

    // Audit log form submission
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'CREATE',
      resource: 'FormSubmission',
      details: `Form submitted, may contain PHI`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error submitting form:', error);

    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
});
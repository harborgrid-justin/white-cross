/**
 * Emergency contacts API endpoints
 * Student emergency contact management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/emergency-contacts
 * Get emergency contacts
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/emergency-contacts');

    const data = await response.json();

    // Audit log emergency contacts access
    const auditContext = createAuditContext(request, auth.user.id);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'EmergencyContacts',
      details: `Emergency contacts accessed, count: ${data.data?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);

    return NextResponse.json(
      { error: 'Failed to fetch emergency contacts' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/emergency-contacts
 * Create emergency contact
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/emergency-contacts');

    const data = await response.json();

    if (response.status === 201 && data.data) {
      // Audit log emergency contact creation
      const auditContext = createAuditContext(request, auth.user.id);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'EmergencyContact',
        resourceId: data.data.id,
        details: 'Emergency contact created'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating emergency contact:', error);

    return NextResponse.json(
      { error: 'Failed to create emergency contact' },
      { status: 500 }
    );
  }
});
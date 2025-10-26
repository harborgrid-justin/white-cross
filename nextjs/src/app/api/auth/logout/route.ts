/**
 * Logout API endpoint
 * Invalidates user session and logs audit trail
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middleware/withAuth';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Audit log
    const auditContext = createAuditContext(request, auth.user.id);
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.LOGOUT,
      resource: 'User',
      resourceId: auth.user.id,
      success: true
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);

    return NextResponse.json(
      { error: 'Logout failed', message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
});

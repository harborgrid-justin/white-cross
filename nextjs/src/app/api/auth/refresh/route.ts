/**
 * Token refresh endpoint
 * Generates new access token from refresh token
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    // Proxy refresh request to backend
    const response = await proxyToBackend(request, '/api/v1/auth/refresh');

    const data = await response.json();

    // Audit log
    const auditContext = createAuditContext(request);
    if (response.status === 200 && data.data?.user) {
      await auditLog({
        ...auditContext,
        userId: data.data.user.id,
        action: AUDIT_ACTIONS.TOKEN_REFRESH,
        resource: 'User',
        resourceId: data.data.user.id,
        success: true
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Token refresh error:', error);

    return NextResponse.json(
      { error: 'Refresh failed', message: 'Invalid or expired refresh token' },
      { status: 401 }
    );
  }
}

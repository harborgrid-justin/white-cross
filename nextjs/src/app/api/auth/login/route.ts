/**
 * Login API endpoint
 * Authenticates user credentials and returns JWT token
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { withRateLimit } from '../../middleware/withRateLimit';
import { RATE_LIMITS } from '@/lib/rateLimit';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

async function loginHandler(request: NextRequest) {
  try {
    // Proxy login request to backend
    const response = await proxyToBackend(request, '/api/v1/auth/login', {
      forwardAuth: false
    });

    // Parse response to extract user info for audit
    const data = await response.json();

    // Audit log
    const auditContext = createAuditContext(request);
    if (response.status === 200 && data.data?.user) {
      await auditLog({
        ...auditContext,
        userId: data.data.user.id,
        action: AUDIT_ACTIONS.LOGIN,
        resource: 'User',
        resourceId: data.data.user.id,
        success: true
      });
    } else {
      await auditLog({
        ...auditContext,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        resource: 'User',
        success: false,
        errorMessage: data.error || 'Login failed'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login error:', error);

    // Audit failed login
    const auditContext = createAuditContext(request);
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.LOGIN_FAILED,
      resource: 'User',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Login failed', message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

// Apply rate limiting to prevent brute force attacks
export const POST = withRateLimit(RATE_LIMITS.AUTH, loginHandler);

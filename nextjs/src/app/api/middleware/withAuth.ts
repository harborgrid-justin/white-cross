/**
 * Authentication middleware for Next.js API routes
 * Validates JWT tokens and provides user context to handlers
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, AuthenticatedUser, hasRole, hasMinimumRole } from '@/lib/auth';

/**
 * Request context with authenticated user
 */
export interface AuthenticatedContext {
  user: AuthenticatedUser;
}

/**
 * Route handler with authentication
 */
export type AuthenticatedHandler = (
  request: NextRequest,
  context: any,
  auth: AuthenticatedContext
) => Promise<NextResponse>;

/**
 * Wrap route handler with authentication
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context: any) => {
    const user = authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Pass user context to handler
    return handler(request, context, { user });
  };
}

/**
 * Wrap route handler with role-based authorization
 */
export function withRole(requiredRole: string | string[], handler: AuthenticatedHandler) {
  return withAuth(async (request: NextRequest, context: any, auth: AuthenticatedContext) => {
    if (!hasRole(auth.user, requiredRole)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: `Required role: ${Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}`
        },
        { status: 403 }
      );
    }

    return handler(request, context, auth);
  });
}

/**
 * Wrap route handler with minimum role requirement
 */
export function withMinimumRole(minimumRole: string, handler: AuthenticatedHandler) {
  return withAuth(async (request: NextRequest, context: any, auth: AuthenticatedContext) => {
    if (!hasMinimumRole(auth.user, minimumRole)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: `Minimum role required: ${minimumRole}`
        },
        { status: 403 }
      );
    }

    return handler(request, context, auth);
  });
}

/**
 * Optional authentication - provides user if authenticated, but doesn't require it
 */
export function withOptionalAuth(
  handler: (
    request: NextRequest,
    context: any,
    auth: AuthenticatedContext | null
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: any) => {
    const user = authenticateRequest(request);

    if (user) {
      return handler(request, context, { user });
    }

    return handler(request, context, null);
  };
}

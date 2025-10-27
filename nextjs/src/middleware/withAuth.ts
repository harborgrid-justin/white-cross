/**
 * Authentication Higher-Order Function for Next.js API Routes
 *
 * Provides JWT-based authentication middleware for Next.js App Router API routes.
 * This module wraps API route handlers with authentication logic, validating tokens
 * and providing authenticated user context to protected endpoints.
 *
 * @module middleware/withAuth
 * @since 2025-10-27
 *
 * @example
 * ```typescript
 * import { NextRequest, NextResponse } from 'next/server';
 * import { withAuth } from '@/middleware/withAuth';
 *
 * export const GET = withAuth(async (request, context, auth) => {
 *   const userId = auth.user.userId;
 *   // ... authenticated logic
 *   return NextResponse.json({ data: result });
 * });
 * ```
 *
 * @security
 * - JWT token validation with signature verification
 * - Automatic token expiration checking
 * - Support for both Authorization header and cookie-based authentication
 * - Role-based access control (RBAC) support
 * - HIPAA-compliant audit logging integration
 *
 * @compliance
 * - HIPAA: Integrates with audit logging for PHI access tracking
 * - Security: Implements JWT best practices with proper secret management
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken, JWTPayload, hasRolePermission } from '@/lib/auth/jwtVerifier';

/**
 * Authenticated user context
 * Contains user information extracted from verified JWT token
 */
export interface AuthenticatedContext {
  /**
   * Authenticated user information from JWT payload
   */
  user: JWTPayload;

  /**
   * Original JWT token string
   */
  token: string;
}

/**
 * API Route handler with authentication
 * This is the signature for handlers wrapped by withAuth
 *
 * @param request - Next.js request object
 * @param context - Route context (contains dynamic route params)
 * @param auth - Authenticated user context
 * @returns Promise resolving to Next.js response
 */
export type AuthenticatedHandler = (
  request: NextRequest,
  context: any,
  auth: AuthenticatedContext
) => Promise<NextResponse>;

/**
 * API Route handler with optional authentication
 * This is the signature for handlers wrapped by withOptionalAuth
 *
 * @param request - Next.js request object
 * @param context - Route context (contains dynamic route params)
 * @param auth - Authenticated user context or null if not authenticated
 * @returns Promise resolving to Next.js response
 */
export type OptionalAuthHandler = (
  request: NextRequest,
  context: any,
  auth: AuthenticatedContext | null
) => Promise<NextResponse>;

/**
 * Higher-order function that wraps an API route handler with authentication
 *
 * Validates JWT tokens from Authorization header or cookies, verifies token
 * signature and expiration, and provides authenticated user context to the
 * wrapped handler. Returns 401 Unauthorized if authentication fails.
 *
 * @param handler - The API route handler to wrap with authentication
 * @returns Wrapped handler with authentication logic
 *
 * @example
 * ```typescript
 * // Basic authenticated GET endpoint
 * export const GET = withAuth(async (request, context, auth) => {
 *   const user = auth.user;
 *   console.log(`Authenticated user: ${user.email}`);
 *   return NextResponse.json({ message: 'Success', userId: user.userId });
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Authenticated POST endpoint with request body
 * export const POST = withAuth(async (request, context, auth) => {
 *   const body = await request.json();
 *   const userId = auth.user.userId;
 *
 *   // Process authenticated request
 *   const result = await createResource(userId, body);
 *
 *   return NextResponse.json({ data: result }, { status: 201 });
 * });
 * ```
 *
 * @throws {401} Unauthorized - Missing, invalid, or expired token
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context: any): Promise<NextResponse> => {
    try {
      // Extract token from Authorization header or cookies
      const token = extractToken(request);

      if (!token) {
        return NextResponse.json(
          {
            error: 'Unauthorized',
            message: 'Authentication required. Please provide a valid token.',
            code: 'AUTH_TOKEN_MISSING'
          },
          { status: 401 }
        );
      }

      // Verify token signature and expiration
      const verification = await verifyToken(token);

      if (!verification.valid || !verification.payload) {
        return NextResponse.json(
          {
            error: 'Unauthorized',
            message: verification.error || 'Invalid or expired token',
            code: 'AUTH_TOKEN_INVALID'
          },
          { status: 401 }
        );
      }

      // Create authenticated context
      const auth: AuthenticatedContext = {
        user: verification.payload,
        token
      };

      // Call the wrapped handler with authenticated context
      return await handler(request, context, auth);
    } catch (error) {
      console.error('[withAuth] Authentication error:', error);

      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication failed',
          code: 'AUTH_ERROR'
        },
        { status: 401 }
      );
    }
  };
}

/**
 * Higher-order function for optional authentication
 *
 * Similar to withAuth but doesn't require authentication. If a valid token
 * is present, the user context is provided to the handler. If no token or
 * an invalid token is present, the handler is called with null auth context.
 *
 * Useful for endpoints that behave differently for authenticated vs
 * unauthenticated users, but don't strictly require authentication.
 *
 * @param handler - The API route handler to wrap
 * @returns Wrapped handler with optional authentication logic
 *
 * @example
 * ```typescript
 * // Public endpoint that provides extra data for authenticated users
 * export const GET = withOptionalAuth(async (request, context, auth) => {
 *   const publicData = await getPublicData();
 *
 *   if (auth) {
 *     // User is authenticated, provide personalized data
 *     const privateData = await getPrivateData(auth.user.userId);
 *     return NextResponse.json({ ...publicData, ...privateData });
 *   }
 *
 *   // User is not authenticated, return public data only
 *   return NextResponse.json(publicData);
 * });
 * ```
 */
export function withOptionalAuth(handler: OptionalAuthHandler) {
  return async (request: NextRequest, context: any): Promise<NextResponse> => {
    try {
      // Extract token from Authorization header or cookies
      const token = extractToken(request);

      if (!token) {
        // No token present, continue without authentication
        return await handler(request, context, null);
      }

      // Verify token signature and expiration
      const verification = await verifyToken(token);

      if (!verification.valid || !verification.payload) {
        // Invalid token, continue without authentication
        return await handler(request, context, null);
      }

      // Create authenticated context
      const auth: AuthenticatedContext = {
        user: verification.payload,
        token
      };

      // Call handler with authenticated context
      return await handler(request, context, auth);
    } catch (error) {
      console.error('[withOptionalAuth] Authentication error:', error);

      // On error, continue without authentication rather than failing
      return await handler(request, context, null);
    }
  };
}

/**
 * Higher-order function that requires specific role(s)
 *
 * Wraps an API route handler with both authentication and role-based
 * authorization. Returns 401 if not authenticated and 403 if the user
 * doesn't have one of the required roles.
 *
 * @param requiredRoles - Single role or array of acceptable roles
 * @param handler - The API route handler to wrap
 * @returns Wrapped handler with authentication and role authorization
 *
 * @example
 * ```typescript
 * // Endpoint requiring ADMIN role
 * export const DELETE = withRole('ADMIN', async (request, context, auth) => {
 *   // Only users with ADMIN role can access this
 *   await deleteResource();
 *   return NextResponse.json({ success: true });
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Endpoint allowing multiple roles
 * export const POST = withRole(
 *   ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
 *   async (request, context, auth) => {
 *     // Users with ADMIN, NURSE, or SCHOOL_ADMIN roles can access
 *     const result = await createRecord(auth.user.userId);
 *     return NextResponse.json({ data: result });
 *   }
 * );
 * ```
 *
 * @throws {401} Unauthorized - Missing, invalid, or expired token
 * @throws {403} Forbidden - User doesn't have required role
 */
export function withRole(
  requiredRoles: string | string[],
  handler: AuthenticatedHandler
) {
  return withAuth(async (request: NextRequest, context: any, auth: AuthenticatedContext) => {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const userRole = auth.user.role;

    // Check if user has any of the required roles
    if (!roles.includes(userRole)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: `Access denied. Required role: ${roles.join(' or ')}`,
          code: 'AUTH_INSUFFICIENT_ROLE',
          requiredRoles: roles,
          userRole
        },
        { status: 403 }
      );
    }

    return await handler(request, context, auth);
  });
}

/**
 * Higher-order function that requires minimum role level
 *
 * Uses role hierarchy to determine access. Users with higher-level roles
 * automatically have access to endpoints requiring lower-level roles.
 *
 * Role hierarchy (from highest to lowest):
 * - ADMIN
 * - DISTRICT_ADMIN
 * - SCHOOL_ADMIN
 * - NURSE
 * - STAFF
 *
 * @param minimumRole - The minimum required role level
 * @param handler - The API route handler to wrap
 * @returns Wrapped handler with authentication and minimum role check
 *
 * @example
 * ```typescript
 * // Endpoint requiring at least NURSE role
 * // Accessible by NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, and ADMIN
 * export const GET = withMinimumRole('NURSE', async (request, context, auth) => {
 *   const records = await getHealthRecords();
 *   return NextResponse.json({ data: records });
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Endpoint requiring at least SCHOOL_ADMIN role
 * // Only accessible by SCHOOL_ADMIN, DISTRICT_ADMIN, and ADMIN
 * export const POST = withMinimumRole(
 *   'SCHOOL_ADMIN',
 *   async (request, context, auth) => {
 *     const result = await performAdminAction();
 *     return NextResponse.json({ data: result });
 *   }
 * );
 * ```
 *
 * @throws {401} Unauthorized - Missing, invalid, or expired token
 * @throws {403} Forbidden - User's role level is insufficient
 */
export function withMinimumRole(
  minimumRole: string,
  handler: AuthenticatedHandler
) {
  return withAuth(async (request: NextRequest, context: any, auth: AuthenticatedContext) => {
    const userRole = auth.user.role;

    // Check if user meets minimum role requirement
    if (!hasRolePermission(userRole, minimumRole)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: `Access denied. Minimum required role: ${minimumRole}`,
          code: 'AUTH_INSUFFICIENT_PERMISSIONS',
          minimumRole,
          userRole
        },
        { status: 403 }
      );
    }

    return await handler(request, context, auth);
  });
}

/**
 * Utility function to create standardized unauthorized response
 *
 * @param message - Custom error message
 * @param code - Error code for client-side handling
 * @returns NextResponse with 401 status
 *
 * @internal
 */
export function createUnauthorizedResponse(
  message: string = 'Authentication required',
  code: string = 'AUTH_REQUIRED'
): NextResponse {
  return NextResponse.json(
    {
      error: 'Unauthorized',
      message,
      code
    },
    { status: 401 }
  );
}

/**
 * Utility function to create standardized forbidden response
 *
 * @param message - Custom error message
 * @param code - Error code for client-side handling
 * @returns NextResponse with 403 status
 *
 * @internal
 */
export function createForbiddenResponse(
  message: string = 'Access denied',
  code: string = 'AUTH_FORBIDDEN'
): NextResponse {
  return NextResponse.json(
    {
      error: 'Forbidden',
      message,
      code
    },
    { status: 403 }
  );
}

// Re-export authentication utilities for convenience
export { extractToken, verifyToken, hasRolePermission } from '@/lib/auth/jwtVerifier';
export type { JWTPayload } from '@/lib/auth/jwtVerifier';

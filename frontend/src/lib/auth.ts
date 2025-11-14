/**
 * Authentication Facade for Next.js v16
 * 
 * IMPORTANT: This is a facade/proxy that forwards all authentication functionality
 * to the centralized identity-access module. All actual implementation should be
 * in /identity-access/ - this file exists only for backward compatibility.
 *
 * @deprecated Prefer importing directly from '@/identity-access' instead
 * @module lib/auth
 * @version 3.0.0 - Refactored as facade to identity-access
 */

// ==========================================
// FORWARD TO CENTRALIZED IDENTITY-ACCESS
// ==========================================

// Core authentication functions from identity-access
export {
  type TokenPayload,
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  decodeToken
} from '@/identity-access/lib/server/auth';

// Role and permission utilities
export {
  type UserRole,
  ROLE_HIERARCHY,
  hasMinimumRole,
  compareRoles,
  getRoleLevel,
  isValidRole,
  getRolesAbove,
  getRolesBelow,
  formatRoleName
} from '@/identity-access/lib/config/roles';

// Permission checking
export * as PermissionLib from '@/identity-access/lib/permissions';

// Import for local use
import { verifyAccessToken, type TokenPayload } from '@/identity-access/lib/server/auth';
import { hasMinimumRole } from '@/identity-access/lib/config/roles';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// ==========================================
// ENHANCED NEXT.JS V16 AUTH PATTERNS
// ==========================================

/**
 * Authenticated user interface (backward compatibility)
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Extract JWT token from request (Next.js v16 enhanced)
 * 
 * @param request - Next.js request object
 * @returns Extracted token or null
 */
export function extractToken(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    return authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
  }

  // Try HTTP-only cookie
  return request.cookies.get('access_token')?.value || null;
}

/**
 * Server-side token extraction for Server Components (Next.js v16)
 */
export async function extractTokenServer(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('access_token')?.value || null;
  } catch (error) {
    console.warn('Failed to extract token from cookies:', error);
    return null;
  }
}

/**
 * Authenticate request (middleware/API routes)
 * 
 * @deprecated Use authenticateServerComponent for Server Components
 */
export async function authenticateRequest(request?: NextRequest): Promise<AuthenticatedUser | null> {
  if (!request) {
    console.warn('authenticateRequest called without request. Use authenticateServerComponent for server components.');
    return null;
  }

  try {
    const token = extractToken(request);
    if (!token) return null;

    const payload = await verifyAccessToken(token);
    return transformTokenToUser(payload);
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

/**
 * Server Component authentication (Next.js v16)
 */
export async function authenticateServerComponent(): Promise<AuthenticatedUser | null> {
  try {
    const token = await extractTokenServer();
    if (!token) return null;

    const payload = await verifyAccessToken(token);
    return transformTokenToUser(payload);
  } catch (error) {
    console.error('Server component authentication failed:', error);
    return null;
  }
}

/**
 * Middleware authentication helper (Next.js v16)
 */
export async function authenticateMiddleware(request: NextRequest): Promise<{
  user: AuthenticatedUser | null;
  unauthorized: () => Response;
}> {
  const user = await authenticateRequest(request);
  
  const unauthorized = () => {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return Response.redirect(loginUrl, 302);
  };

  return { user, unauthorized };
}

/**
 * Transform token payload to user object (backward compatibility)
 */
function transformTokenToUser(payload: TokenPayload): AuthenticatedUser {
  const user = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    firstName: payload.firstName,
    lastName: payload.lastName,
    organizationId: payload.organizationId
  };

  return {
    ...user,
    user // Nested user object for backward compatibility
  };
}

/**
 * Check if user has required role(s)
 */
export function hasRole(user: AuthenticatedUser, requiredRole: string | string[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(user.role);
}

/**
 * Check if user has minimum role level
 * 
 * @deprecated Use hasMinimumRole from @/identity-access/lib/config/roles directly
 */
export function hasMinimumRoleForUser(user: AuthenticatedUser, minimumRole: string): boolean {
  return hasMinimumRole(user.role, minimumRole);
}

/**
 * Alias for authenticateRequest (backward compatibility)
 */
export const auth = authenticateRequest;

// ==========================================
// MIGRATION NOTICE
// ==========================================

if (process.env.NODE_ENV === 'development') {
  console.warn(
    '🔄 MIGRATION NOTICE: @/lib/auth is now a facade. ' +
    'Consider importing directly from @/identity-access for new code.'
  );
}

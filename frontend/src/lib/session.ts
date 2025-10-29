/**
 * Server-side session management for Next.js Server Actions & Components
 *
 * Provides comprehensive authentication context for:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 * - Middleware
 *
 * @module lib/session
 * @example
 * ```typescript
 * // In a server component
 * import { getServerSession } from '@/lib/session';
 *
 * export default async function Page() {
 *   const session = await getServerSession();
 *   if (!session) redirect('/login');
 *   return <div>Welcome {session.user.email}</div>;
 * }
 *
 * // In a server action with role enforcement
 * 'use server'
 * import { requireMinimumRole } from '@/lib/session';
 *
 * export async function deleteStudent(id: string) {
 *   const user = await requireMinimumRole('NURSE');
 *   // ... delete logic
 * }
 * ```
 */

import { cookies, headers } from 'next/headers';
import { verifyAccessToken, type TokenPayload } from './auth';

/**
 * Authenticated session user
 */
export interface SessionUser {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Session information
 */
export interface Session {
  user: SessionUser;
  token: string;
  expiresAt?: Date;
  issuedAt?: Date;
}

/**
 * Session options for creation
 */
export interface SessionOptions {
  maxAge?: number; // in seconds, default 24 hours
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
}

/**
 * Session cookie configuration
 */
const SESSION_CONFIG = {
  tokenName: 'authToken',
  refreshName: 'refreshToken',
  maxAge: 24 * 60 * 60, // 24 hours in seconds
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
} as const;

/**
 * Get authenticated session from server context
 * Works in Next.js Server Actions and Route Handlers
 *
 * @returns Session object if authenticated, null otherwise
 *
 * @example
 * ```typescript
 * export async function myServerAction() {
 *   const session = await getServerSession();
 *   if (!session) {
 *     throw new Error('Unauthorized');
 *   }
 *   // Use session.user.id, session.user.role, etc.
 * }
 * ```
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();

    // Try to get token from cookie first (primary method)
    let token = cookieStore.get(SESSION_CONFIG.tokenName)?.value;

    // If not in cookie, try to get from headers (for API clients)
    if (!token) {
      try {
        const headersList = await headers();
        const authHeader = headersList.get('authorization');

        if (authHeader) {
          // Support both "Bearer <token>" and "<token>" formats
          token = authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : authHeader;
        }
      } catch (error) {
        // headers() might throw in some contexts (e.g., static pages)
        // This is expected, continue with null token
      }
    }

    if (!token) {
      return null;
    }

    // Verify and decode the token
    const payload: TokenPayload = verifyAccessToken(token);

    return {
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      },
      token,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : undefined,
      issuedAt: payload.iat ? new Date(payload.iat * 1000) : undefined,
    };
  } catch (error) {
    // Token verification failed or other error
    console.error('[Session] Retrieval failed:', error);
    return null;
  }
}

/**
 * Require authenticated session or throw error
 * Convenience wrapper for actions that always need auth
 *
 * @throws Error if not authenticated
 * @returns Session object
 *
 * @example
 * ```typescript
 * export async function protectedAction() {
 *   const session = await requireSession();
 *   // session is guaranteed to exist here
 * }
 * ```
 */
export async function requireSession(): Promise<Session> {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Authentication required');
  }

  return session;
}

/**
 * Get user ID from session
 * Convenience function for quick user ID access
 *
 * @returns User ID if authenticated, null otherwise
 */
export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user.id || null;
}

/**
 * Get authenticated user for server actions (alias for requireSession)
 *
 * Similar to getServerSession but returns just the user object.
 * Throws an error if not authenticated.
 *
 * **Use this in Server Actions** to enforce authentication.
 *
 * @throws Error if user is not authenticated
 * @returns Authenticated user information
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function updateProfile(formData: FormData) {
 *   const user = await getServerAuth();
 *
 *   // user is guaranteed to exist here
 *   await db.user.update({
 *     where: { id: user.id },
 *     data: { name: formData.get('name') }
 *   });
 * }
 * ```
 */
export async function getServerAuth(): Promise<SessionUser> {
  const session = await requireSession();
  return session.user;
}

/**
 * Get authenticated user or null (non-throwing version)
 *
 * Similar to getServerAuth but returns null instead of throwing.
 * Useful when authentication is optional.
 *
 * @returns User information or null
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function getPublicData() {
 *   const user = await getServerAuthOptional();
 *
 *   if (user) {
 *     // Return personalized data
 *     return getPersonalizedData(user.id);
 *   } else {
 *     // Return public data
 *     return getPublicData();
 *   }
 * }
 * ```
 */
export async function getServerAuthOptional(): Promise<SessionUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}

/**
 * Role hierarchy for permission checking
 */
const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  SCHOOL_ADMIN: 80,
  NURSE: 70,
  COUNSELOR: 60,
  VIEWER: 50,
  PARENT: 40,
  STUDENT: 30,
};

/**
 * Require specific role for server actions
 *
 * Validates that the authenticated user has the required role.
 * Throws an error if the user doesn't have the required role.
 *
 * @param requiredRole - Role name or array of role names
 * @throws Error if user doesn't have required role
 * @returns Authenticated user
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function deleteStudent(id: string) {
 *   const user = await requireRole(['ADMIN', 'SCHOOL_ADMIN', 'NURSE']);
 *
 *   // Only admins and nurses can delete students
 *   await db.student.delete({ where: { id } });
 * }
 * ```
 */
export async function requireRole(requiredRole: string | string[]): Promise<SessionUser> {
  const user = await getServerAuth();

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!roles.includes(user.role)) {
    throw new Error(`Forbidden: Required role(s): ${roles.join(', ')}`);
  }

  return user;
}

/**
 * Require minimum role level for server actions
 *
 * Validates that the authenticated user has at least the minimum role level.
 * Uses role hierarchy for comparison.
 *
 * @param minimumRole - Minimum required role
 * @throws Error if user doesn't meet minimum role level
 * @returns Authenticated user
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function viewHealthRecords(studentId: string) {
 *   const user = await requireMinimumRole('NURSE');
 *
 *   // Only nurses and above can view health records
 *   return getHealthRecords(studentId);
 * }
 * ```
 */
export async function requireMinimumRole(minimumRole: string): Promise<SessionUser> {
  const user = await getServerAuth();

  const userLevel = ROLE_HIERARCHY[user.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;

  if (userLevel < requiredLevel) {
    throw new Error(`Forbidden: Minimum role required: ${minimumRole}`);
  }

  return user;
}

/**
 * Check if user has specific role
 *
 * Non-throwing version of requireRole.
 *
 * @param requiredRole - Role name or array of role names
 * @returns true if user has required role
 */
export async function hasRole(requiredRole: string | string[]): Promise<boolean> {
  try {
    await requireRole(requiredRole);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if user has minimum role level
 *
 * Non-throwing version of requireMinimumRole.
 *
 * @param minimumRole - Minimum required role
 * @returns true if user meets minimum role level
 */
export async function hasMinimumRole(minimumRole: string): Promise<boolean> {
  try {
    await requireMinimumRole(minimumRole);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create session cookies from JWT token
 *
 * Sets the session token as an HTTP-only cookie.
 * Called after successful login.
 *
 * @param token - JWT access token
 * @param options - Optional session configuration
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function login(email: string, password: string) {
 *   const { token } = await authenticateUser(email, password);
 *
 *   await createSession(token);
 *
 *   redirect('/dashboard');
 * }
 * ```
 */
export async function createSession(
  token: string,
  options: SessionOptions = {}
): Promise<void> {
  const cookieStore = await cookies();

  const cookieOptions = {
    httpOnly: options.httpOnly ?? SESSION_CONFIG.httpOnly,
    secure: options.secure ?? SESSION_CONFIG.secure,
    sameSite: options.sameSite ?? SESSION_CONFIG.sameSite,
    path: options.path ?? SESSION_CONFIG.path,
    maxAge: options.maxAge ?? SESSION_CONFIG.maxAge,
  };

  cookieStore.set(SESSION_CONFIG.tokenName, token, cookieOptions);
}

/**
 * Create session with refresh token
 *
 * Sets both access and refresh tokens as cookies.
 *
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 * @param options - Optional session configuration
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function login(email: string, password: string) {
 *   const { accessToken, refreshToken } = await authenticateUser(email, password);
 *
 *   await createSessionWithRefresh(accessToken, refreshToken);
 *
 *   redirect('/dashboard');
 * }
 * ```
 */
export async function createSessionWithRefresh(
  accessToken: string,
  refreshToken: string,
  options: SessionOptions = {}
): Promise<void> {
  const cookieStore = await cookies();

  const accessCookieOptions = {
    httpOnly: options.httpOnly ?? SESSION_CONFIG.httpOnly,
    secure: options.secure ?? SESSION_CONFIG.secure,
    sameSite: options.sameSite ?? SESSION_CONFIG.sameSite,
    path: options.path ?? SESSION_CONFIG.path,
    maxAge: options.maxAge ?? SESSION_CONFIG.maxAge,
  };

  const refreshCookieOptions = {
    ...accessCookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
  };

  cookieStore.set(SESSION_CONFIG.tokenName, accessToken, accessCookieOptions);
  cookieStore.set(SESSION_CONFIG.refreshName, refreshToken, refreshCookieOptions);
}

/**
 * Destroy session and clear cookies
 *
 * Removes session tokens from cookies.
 * Called during logout.
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function logout() {
 *   await destroySession();
 *   redirect('/login');
 * }
 * ```
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_CONFIG.tokenName);
  cookieStore.delete(SESSION_CONFIG.refreshName);
}

/**
 * Refresh session expiration
 *
 * Extends the session cookie expiration time.
 * Useful for keeping active users logged in.
 *
 * @param options - Optional session configuration
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function keepAlive() {
 *   const session = await getServerSession();
 *   if (session) {
 *     await refreshSession();
 *   }
 * }
 * ```
 */
export async function refreshSession(options: SessionOptions = {}): Promise<void> {
  const session = await getServerSession();

  if (!session) {
    throw new Error('No active session to refresh');
  }

  await createSession(session.token, options);
}

/**
 * Check if session exists (without full validation)
 *
 * Quick check for session cookie existence without full JWT validation.
 * Useful for client-side checks.
 *
 * @returns true if session cookie exists
 */
export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(SESSION_CONFIG.tokenName);
}

/**
 * Get session expiration time
 *
 * Returns the expiration time of the current session.
 *
 * @returns Expiration date or null if no session
 *
 * @example
 * ```typescript
 * const expiration = await getSessionExpiration();
 * if (expiration && expiration < new Date(Date.now() + 5 * 60 * 1000)) {
 *   // Session expires in less than 5 minutes, refresh it
 *   await refreshSession();
 * }
 * ```
 */
export async function getSessionExpiration(): Promise<Date | null> {
  const session = await getServerSession();
  return session?.expiresAt ?? null;
}

/**
 * Validate session and return user or redirect
 *
 * Helper function that validates session and redirects to login if invalid.
 * Useful for protecting pages.
 *
 * @param redirectUrl - URL to redirect to if not authenticated (default: '/login')
 * @returns Authenticated user
 *
 * @example
 * ```typescript
 * export default async function ProtectedPage() {
 *   const user = await validateSessionOrRedirect();
 *
 *   return <div>Welcome {user.email}</div>;
 * }
 * ```
 */
export async function validateSessionOrRedirect(
  redirectUrl: string = '/login'
): Promise<SessionUser> {
  const session = await getServerSession();

  if (!session) {
    const { redirect } = await import('next/navigation');
    redirect(redirectUrl);
  }

  return session.user;
}

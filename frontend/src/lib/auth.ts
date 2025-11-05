/**
 * Authentication Utilities for Next.js API Routes
 *
 * Provides comprehensive JWT validation, token verification, and user authentication
 * for Next.js API routes and server components. Includes role-based access control
 * and security validation at module load time.
 *
 * **Security Features**:
 * - JWT token validation with issuer/audience verification
 * - Separate access and refresh token handling
 * - Role-based permission checking
 * - Module-level secret validation (fails fast on missing secrets)
 *
 * @module lib/auth
 */

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// CRITICAL: Validate JWT secrets at module load time
// This prevents the application from starting with missing or empty secrets
if (!process.env.JWT_SECRET) {
  throw new Error(
    'FATAL: JWT_SECRET environment variable is not set. ' +
    'This is a critical security requirement. The application cannot start without it. ' +
    'Please configure JWT_SECRET in your environment variables.'
  );
}

if (!process.env.JWT_REFRESH_SECRET) {
  console.warn(
    'WARNING: JWT_REFRESH_SECRET not set, falling back to JWT_SECRET. ' +
    'For production environments, use separate secrets for access and refresh tokens.'
  );
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

/**
 * JWT token payload structure.
 *
 * Represents the decoded JWT token contents including user identity,
 * role, and token metadata.
 *
 * @property {string} id - User unique identifier
 * @property {string} email - User email address
 * @property {string} role - User role (e.g., 'admin', 'nurse', 'parent')
 * @property {'access' | 'refresh'} [type] - Token type designation
 * @property {number} [iat] - Issued at timestamp (Unix epoch)
 * @property {number} [exp] - Expiration timestamp (Unix epoch)
 * @property {string} [jti] - JWT ID for token tracking/revocation
 */
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
  jti?: string;
}

/**
 * Authenticated user representation.
 *
 * Represents a successfully authenticated user with their identity and role information.
 * Used throughout the application for access control and personalization.
 *
 * @property {string} id - User unique identifier
 * @property {string} email - User email address
 * @property {string} role - User role for permission checking
 * @property {Object} [user] - Nested user object for backward compatibility
 * @property {string} user.id - User unique identifier (nested)
 * @property {string} user.email - User email address (nested)
 * @property {string} user.role - User role (nested)
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Extracts JWT token from request Authorization header.
 *
 * Supports both "Bearer <token>" and "<token>" header formats.
 * Returns null if no Authorization header is present.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {string | null} Extracted token or null if not found
 *
 * @example
 * ```typescript
 * // With Bearer prefix
 * // Header: "Authorization: Bearer abc123xyz"
 * const token = extractToken(request); // 'abc123xyz'
 *
 * // Without Bearer prefix
 * // Header: "Authorization: abc123xyz"
 * const token = extractToken(request); // 'abc123xyz'
 *
 * // No Authorization header
 * const token = extractToken(request); // null
 * ```
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return null;
  }

  // Support both "Bearer <token>" and "<token>" formats
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Verifies and decodes a JWT access token.
 *
 * Validates the token signature, expiration, issuer, and audience.
 * Also verifies the token type is 'access' if specified.
 *
 * @param {string} token - JWT access token to verify
 * @returns {TokenPayload} Decoded and verified token payload
 * @throws {Error} If token is invalid, expired, or wrong type
 *
 * @example
 * ```typescript
 * try {
 *   const payload = verifyAccessToken(token);
 *   console.log(`User: ${payload.email}, Role: ${payload.role}`);
 * } catch (error) {
 *   console.error('Invalid token:', error.message);
 *   // Redirect to login
 * }
 * ```
 *
 * @see {@link verifyRefreshToken} for refresh token verification
 */
export function verifyAccessToken(token: string): TokenPayload {
  // Note: JWT_SECRET is validated at module load time, guaranteed to exist
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'white-cross-healthcare',
      audience: 'white-cross-api'
    }) as TokenPayload;

    // Verify token type
    if (decoded.type && decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    throw error;
  }
}

/**
 * Verifies and decodes a JWT refresh token.
 *
 * Validates the token signature, expiration, and issuer.
 * Also verifies the token type is 'refresh' if specified.
 * Refresh tokens typically have longer expiration times than access tokens.
 *
 * @param {string} token - JWT refresh token to verify
 * @returns {TokenPayload} Decoded and verified token payload
 * @throws {Error} If token is invalid, expired, or wrong type
 *
 * @example
 * ```typescript
 * try {
 *   const payload = verifyRefreshToken(refreshToken);
 *   // Generate new access token for user
 *   const newAccessToken = generateAccessToken(payload.id);
 * } catch (error) {
 *   console.error('Invalid refresh token:', error.message);
 *   // Require re-authentication
 * }
 * ```
 *
 * @see {@link verifyAccessToken} for access token verification
 */
export function verifyRefreshToken(token: string): TokenPayload {
  // Note: JWT_REFRESH_SECRET is validated at module load time, guaranteed to exist
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'white-cross-healthcare'
    }) as TokenPayload;

    // Verify token type
    if (decoded.type && decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    }
    throw error;
  }
}

/**
 * Authenticates a request and extracts user information from JWT token.
 *
 * Performs complete authentication flow:
 * 1. Extracts token from Authorization header
 * 2. Verifies token signature and expiration
 * 3. Returns authenticated user object
 *
 * Returns null if no token present, token is invalid, or verification fails.
 * Errors are logged but not thrown to allow graceful handling.
 *
 * @param {NextRequest} [request] - Next.js request object (optional for server components)
 * @returns {AuthenticatedUser | null} Authenticated user or null if authentication fails
 *
 * @example
 * ```typescript
 * // In API route
 * export async function GET(request: NextRequest) {
 *   const user = authenticateRequest(request);
 *
 *   if (!user) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 *
 *   // User is authenticated
 *   console.log(`Request from: ${user.email}`);
 * }
 * ```
 *
 * @see {@link extractToken} for token extraction
 * @see {@link verifyAccessToken} for token verification
 */
export function authenticateRequest(request?: NextRequest): AuthenticatedUser | null {
  if (!request) {
    // Server component context - create mock authenticated user
    // In production, this should use next-auth or similar
    return null;
  }

  try {
    const token = extractToken(request);

    if (!token) {
      return null;
    }

    const payload = verifyAccessToken(token);

    const user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };

    return {
      ...user,
      user // Also expose as nested .user for compatibility
    };
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

/**
 * Checks if user has one of the required roles.
 *
 * Performs exact role matching (case-sensitive).
 * Accepts either a single role or array of roles.
 *
 * @param {AuthenticatedUser} user - Authenticated user to check
 * @param {string | string[]} requiredRole - Required role(s) - user must have one
 * @returns {boolean} True if user has one of the required roles
 *
 * @example
 * ```typescript
 * // Single role check
 * if (hasRole(user, 'admin')) {
 *   // User is admin
 * }
 *
 * // Multiple roles check (user needs to be one of these)
 * if (hasRole(user, ['admin', 'nurse', 'doctor'])) {
 *   // User is admin, nurse, or doctor
 * }
 * ```
 *
 * @see {@link hasMinimumRole} for hierarchical role checking
 */
export function hasRole(user: AuthenticatedUser, requiredRole: string | string[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(user.role);
}

/**
 * Role hierarchy for permission checking
 * @deprecated Import from @/identity-access/lib/config/roles instead
 *
 * This is maintained for backward compatibility only.
 * New code should use the centralized role configuration.
 */
import { ROLE_HIERARCHY as CENTRALIZED_ROLE_HIERARCHY, hasMinimumRole as hasMinimumRoleLevel } from '@/identity-access/lib/config/roles';

const ROLE_HIERARCHY = CENTRALIZED_ROLE_HIERARCHY;

/**
 * Checks if user has minimum role level based on role hierarchy.
 *
 * Uses hierarchical role comparison where higher-level roles
 * automatically satisfy requirements for lower-level roles.
 * For example, 'admin' satisfies 'nurse' requirements.
 *
 * @deprecated Use hasMinimumRoleLevel from @/identity-access/lib/config/roles instead.
 *             This function is maintained for backward compatibility only.
 *
 * @param {AuthenticatedUser} user - Authenticated user to check
 * @param {string} minimumRole - Minimum required role level
 * @returns {boolean} True if user's role meets or exceeds minimum role
 *
 * @example
 * ```typescript
 * // Admin checking nurse requirement
 * hasMinimumRole(adminUser, 'nurse') // true (admin > nurse in hierarchy)
 *
 * // Nurse checking admin requirement
 * hasMinimumRole(nurseUser, 'admin') // false (nurse < admin in hierarchy)
 * ```
 *
 * @see {@link hasRole} for exact role matching
 */
export function hasMinimumRole(user: AuthenticatedUser, minimumRole: string): boolean {
  return hasMinimumRoleLevel(user.role, minimumRole);
}

/**
 * Auth function - alias for authenticateRequest.
 *
 * Provided for backward compatibility and convenience.
 * Identical to authenticateRequest in functionality.
 *
 * @function auth
 * @type {typeof authenticateRequest}
 *
 * @example
 * ```typescript
 * // Can use either name
 * const user1 = auth(request);
 * const user2 = authenticateRequest(request);
 * // Both do the same thing
 * ```
 *
 * @see {@link authenticateRequest} for full documentation
 */
export const auth = authenticateRequest;

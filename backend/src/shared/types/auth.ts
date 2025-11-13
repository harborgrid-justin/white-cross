/**
 * @fileoverview Authentication and Authorization Types
 * @module shared/types/auth
 * @description Type definitions for authenticated users and authorization
 */

import { UserRole } from '@/database/models';

/**
 * Authenticated User Interface
 *
 * Represents an authenticated user in the system.
 * Used in request handlers, services, and middleware.
 *
 * @example
 * ```typescript
 * function handleRequest(user: AuthenticatedUser) {
 *   if (user.role === UserRole.NURSE) {
 *     // Nurse-specific logic
 *   }
 * }
 * ```
 */
export interface AuthenticatedUser {
  /** User's unique identifier (UUID) */
  id: string;

  /** User's email address */
  email: string;

  /** User's role in the system */
  role: UserRole;

  /** User's first name */
  firstName?: string;

  /** User's last name */
  lastName?: string;

  /** User's full name (computed or stored) */
  fullName?: string;

  /** User's school/district ID */
  schoolId?: string;

  /** User's district ID */
  districtId?: string;

  /** Whether the user account is active */
  isActive: boolean;

  /** User's granted permissions (optional - for fine-grained access control) */
  permissions?: string[];

  /** Session/token metadata */
  sessionId?: string;

  /** Token expiration timestamp */
  tokenExp?: number;
}

/**
 * JWT Token Payload
 *
 * Payload structure for JWT tokens.
 * Contains minimal user information for token validation.
 */
export interface JwtPayload {
  /** User ID */
  sub: string;

  /** User email */
  email: string;

  /** User role */
  role: UserRole;

  /** Token issued at timestamp */
  iat: number;

  /** Token expiration timestamp */
  exp: number;
}

/**
 * Authentication Response
 *
 * Response structure after successful authentication.
 */
export interface AuthenticationResponse {
  /** Access token (JWT) */
  accessToken: string;

  /** Refresh token (optional) */
  refreshToken?: string;

  /** Token type (usually 'Bearer') */
  tokenType: string;

  /** Token expiration in seconds */
  expiresIn: number;

  /** Authenticated user information */
  user: AuthenticatedUser;
}

/**
 * Permission Check Context
 *
 * Context information for permission checks.
 */
export interface PermissionContext {
  /** User requesting access */
  user: AuthenticatedUser;

  /** Resource being accessed */
  resource?: string;

  /** Action being performed */
  action?: string;

  /** Resource owner ID (for ownership checks) */
  resourceOwnerId?: string;
}

/**
 * Type guard to check if an object is an AuthenticatedUser
 */
export function isAuthenticatedUser(obj: unknown): obj is AuthenticatedUser {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const user = obj as Record<string, unknown>;

  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.role === 'string' &&
    typeof user.isActive === 'boolean'
  );
}

/**
 * Type guard to check if a user has a specific role
 */
export function hasRole(user: AuthenticatedUser, role: UserRole): boolean {
  return user.role === role;
}

/**
 * Type guard to check if a user has any of the specified roles
 */
export function hasAnyRole(
  user: AuthenticatedUser,
  roles: UserRole[],
): boolean {
  return roles.includes(user.role);
}

/**
 * Type guard to check if a user has a specific permission
 */
export function hasPermission(
  user: AuthenticatedUser,
  permission: string,
): boolean {
  if (!user.permissions || user.permissions.length === 0) {
    return false;
  }
  return user.permissions.includes(permission);
}

/**
 * Type guard to check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  user: AuthenticatedUser,
  permissions: string[],
): boolean {
  if (!user.permissions || user.permissions.length === 0) {
    return false;
  }
  return permissions.every((permission) =>
    user.permissions!.includes(permission),
  );
}

/**
 * Type guard to check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  user: AuthenticatedUser,
  permissions: string[],
): boolean {
  if (!user.permissions || user.permissions.length === 0) {
    return false;
  }
  return permissions.some((permission) =>
    user.permissions!.includes(permission),
  );
}

/**
 * Middleware Utilities and Types
 *
 * Shared types and utilities for middleware functions.
 */

/**
 * User roles in the system
 */
export enum UserRole {
  ADMIN = 'admin',
  NURSE = 'nurse',
  TEACHER = 'teacher',
  PARENT = 'parent',
  STUDENT = 'student',
  STAFF = 'staff'
}

/**
 * Permission levels
 */
export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin'
}

// Export authentication middleware (moved to identity-access)
// @deprecated Import from @/identity-access/middleware instead
export {
  withAuth,
  withOptionalAuth,
  withRole,
  withMinimumRole,
  createUnauthorizedResponse,
  createForbiddenResponse,
  type AuthenticatedContext,
  type AuthenticatedHandler,
  type OptionalAuthHandler
} from '@/identity-access/middleware/withAuth';

export default {
  UserRole,
  Permission
}

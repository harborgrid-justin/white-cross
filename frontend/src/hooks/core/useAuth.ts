'use client';

/**
 * Auth Hooks - Centralized Authentication and Authorization
 *
 * Re-exports all authentication and authorization hooks from modular files.
 * This is the main entry point for consuming auth hooks in the application.
 *
 * @module hooks/core/useAuth
 */

// Export permission definitions and types
export { PERMISSIONS, ROLE_HIERARCHY, type Permission } from './auth-permissions';

// Export permission checking hooks
export {
  useHasPermission,
  useHasRole,
  useHasMinRole,
  useHasAllPermissions,
  useHasAnyPermission,
  useUserPermissions,
} from './auth-permission-hooks';

// Export auth guard hooks
export {
  useRequireAuth,
  useRequirePermission,
  useRequireRole,
} from './auth-guards';

/**
 * @fileoverview Role-Based Access Control Utilities
 * @module core/auth/rbac
 *
 * Production-ready RBAC permission checking and role management with
 * Sequelize integration for enterprise applications.
 *
 * @example Basic RBAC usage
 * ```typescript
 * import { checkPermission, hasAnyRole, getUserPermissions } from '@reuse/core/auth/rbac';
 *
 * // Check if user has specific permission
 * const canDelete = await checkPermission(
 *   userId,
 *   'patient:delete',
 *   UserRole,
 *   RolePermission,
 *   Permission
 * );
 *
 * // Check if user has any of specified roles
 * const isDoctor = await hasAnyRole(
 *   userId,
 *   ['doctor', 'senior-doctor'],
 *   UserRole,
 *   Role
 * );
 *
 * // Get all user permissions
 * const permissions = await getUserPermissions(
 *   userId,
 *   UserRole,
 *   RolePermission,
 *   Permission
 * );
 * ```
 */

// ============================================================================
// RBAC FUNCTIONS
// ============================================================================

// Re-export RBAC permission checking functions
export {
  checkPermission,
  hasAnyRole,
  hasAllRoles,
  getUserRoles,
  getUserPermissions,
  assignRoleToUser,
  revokeRoleFromUser,
} from '../../../auth-rbac-kit';

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

// Re-export RBAC Sequelize models
export {
  defineRoleModel,
  defineUserRoleModel,
  definePermissionModel,
  defineRolePermissionModel,
} from '../../../auth-rbac-kit';

// ============================================================================
// NESTJS DECORATORS
// ============================================================================

// Re-export RBAC decorators for NestJS
export {
  Roles,
  Permissions,
} from '../../../auth-rbac-kit';

// ============================================================================
// NESTJS GUARDS
// ============================================================================

// Re-export RBAC guards for NestJS
export {
  RolesGuard,
  PermissionsGuard,
} from '../../../auth-rbac-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Re-export RBAC types
export type {
  RoleHierarchy,
  PermissionDefinition,
  RoleModel,
  UserRoleModel,
  PermissionModel,
  RolePermissionModel,
} from '../../../auth-rbac-kit';

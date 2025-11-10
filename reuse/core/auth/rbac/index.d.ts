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
export { checkPermission, hasAnyRole, hasAllRoles, getUserRoles, getUserPermissions, assignRoleToUser, revokeRoleFromUser, } from '../../../auth-rbac-kit';
export { defineRoleModel, defineUserRoleModel, definePermissionModel, defineRolePermissionModel, } from '../../../auth-rbac-kit';
export { Roles, Permissions, } from '../../../auth-rbac-kit';
export { RolesGuard, PermissionsGuard, } from '../../../auth-rbac-kit';
export type { RoleHierarchy, PermissionDefinition, RoleModel, UserRoleModel, PermissionModel, RolePermissionModel, } from '../../../auth-rbac-kit';
//# sourceMappingURL=index.d.ts.map
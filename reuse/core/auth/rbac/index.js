"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = exports.RolesGuard = exports.Permissions = exports.Roles = exports.defineRolePermissionModel = exports.definePermissionModel = exports.defineUserRoleModel = exports.defineRoleModel = exports.revokeRoleFromUser = exports.assignRoleToUser = exports.getUserPermissions = exports.getUserRoles = exports.hasAllRoles = exports.hasAnyRole = exports.checkPermission = void 0;
// ============================================================================
// RBAC FUNCTIONS
// ============================================================================
// Re-export RBAC permission checking functions
var auth_rbac_kit_1 = require("../../../auth-rbac-kit");
Object.defineProperty(exports, "checkPermission", { enumerable: true, get: function () { return auth_rbac_kit_1.checkPermission; } });
Object.defineProperty(exports, "hasAnyRole", { enumerable: true, get: function () { return auth_rbac_kit_1.hasAnyRole; } });
Object.defineProperty(exports, "hasAllRoles", { enumerable: true, get: function () { return auth_rbac_kit_1.hasAllRoles; } });
Object.defineProperty(exports, "getUserRoles", { enumerable: true, get: function () { return auth_rbac_kit_1.getUserRoles; } });
Object.defineProperty(exports, "getUserPermissions", { enumerable: true, get: function () { return auth_rbac_kit_1.getUserPermissions; } });
Object.defineProperty(exports, "assignRoleToUser", { enumerable: true, get: function () { return auth_rbac_kit_1.assignRoleToUser; } });
Object.defineProperty(exports, "revokeRoleFromUser", { enumerable: true, get: function () { return auth_rbac_kit_1.revokeRoleFromUser; } });
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
// Re-export RBAC Sequelize models
var auth_rbac_kit_2 = require("../../../auth-rbac-kit");
Object.defineProperty(exports, "defineRoleModel", { enumerable: true, get: function () { return auth_rbac_kit_2.defineRoleModel; } });
Object.defineProperty(exports, "defineUserRoleModel", { enumerable: true, get: function () { return auth_rbac_kit_2.defineUserRoleModel; } });
Object.defineProperty(exports, "definePermissionModel", { enumerable: true, get: function () { return auth_rbac_kit_2.definePermissionModel; } });
Object.defineProperty(exports, "defineRolePermissionModel", { enumerable: true, get: function () { return auth_rbac_kit_2.defineRolePermissionModel; } });
// ============================================================================
// NESTJS DECORATORS
// ============================================================================
// Re-export RBAC decorators for NestJS
var auth_rbac_kit_3 = require("../../../auth-rbac-kit");
Object.defineProperty(exports, "Roles", { enumerable: true, get: function () { return auth_rbac_kit_3.Roles; } });
Object.defineProperty(exports, "Permissions", { enumerable: true, get: function () { return auth_rbac_kit_3.Permissions; } });
// ============================================================================
// NESTJS GUARDS
// ============================================================================
// Re-export RBAC guards for NestJS
var auth_rbac_kit_4 = require("../../../auth-rbac-kit");
Object.defineProperty(exports, "RolesGuard", { enumerable: true, get: function () { return auth_rbac_kit_4.RolesGuard; } });
Object.defineProperty(exports, "PermissionsGuard", { enumerable: true, get: function () { return auth_rbac_kit_4.PermissionsGuard; } });
//# sourceMappingURL=index.js.map
/**
 * @fileoverview Permissions Module - RBAC System
 * @module shared/permissions
 * @description Exports all permission-related utilities
 */

export {
  Role,
  Resource,
  Action,
  Permission,
  PermissionCondition,
  PermissionContext,
  PermissionResult,
  PERMISSION_MATRIX,
  PermissionChecker,
  permissionChecker,
  checkPermission,
  can,
  getAllowedActions,
  getAllowedResources,
  isRole,
  isResource,
  isAction,
} from './Permission';

export {
  RequirePermissionOptions,
  requirePermission,
  checkUserPermission,
  assertUserPermission,
  getUserRole,
  getUserId,
  hasAnyRole,
  hasAllRoles,
  requireRole,
} from './middleware';

export { default as PermissionModule } from './Permission';
export { default as PermissionMiddleware } from './middleware';

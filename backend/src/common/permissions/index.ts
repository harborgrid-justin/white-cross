/**
 * @fileoverview Permissions Module - RBAC System
 * @module shared/permissions
 * @description Exports all permission-related utilities
 */

export {
  Role,
  Resource,
  Action,
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

export type {
  Permission,
  PermissionCondition,
  PermissionContext,
  PermissionResult,
} from './Permission';

export {
  requirePermission,
  checkUserPermission,
  assertUserPermission,
  getUserRole,
  getUserId,
  hasAnyRole,
  hasAllRoles,
  requireRole,
} from './middleware';

export type { RequirePermissionOptions } from './middleware';

export { default as PermissionModule } from './Permission';
export { default as PermissionMiddleware } from './middleware';

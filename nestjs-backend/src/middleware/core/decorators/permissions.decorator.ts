/**
 * @fileoverview Permissions Decorator for NestJS
 * @module middleware/core/decorators/permissions
 * @description Custom decorator for specifying required permissions on routes.
 */

import { SetMetadata } from '@nestjs/common';
import { Permission } from '../types/rbac.types';

export const PERMISSIONS_KEY = 'permissions';
export const PERMISSIONS_MODE_KEY = 'permissions_mode';

export type PermissionsMode = 'all' | 'any';

/**
 * Decorator to specify required permissions for a route
 *
 * @decorator RequirePermissions
 * @param {Permission[]} permissions - Array of required permissions
 * @param {PermissionsMode} mode - 'all' (AND logic) or 'any' (OR logic), defaults to 'all'
 *
 * @example
 * // Require ALL permissions
 * @RequirePermissions([Permission.READ_HEALTH_RECORDS, Permission.UPDATE_HEALTH_RECORDS])
 * async updateHealthRecord() {}
 *
 * @example
 * // Require ANY permission
 * @RequirePermissions([Permission.MANAGE_USERS, Permission.MANAGE_SCHOOLS], 'any')
 * async accessAdminPanel() {}
 */
export const RequirePermissions = (permissions: Permission[], mode: PermissionsMode = 'all') => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    SetMetadata(PERMISSIONS_KEY, permissions)(target, propertyKey, descriptor);
    SetMetadata(PERMISSIONS_MODE_KEY, mode)(target, propertyKey, descriptor);
  };
};

/**
 * Decorator to specify a single required permission for a route
 *
 * @decorator RequirePermission
 * @param {Permission} permission - Required permission
 *
 * @example
 * @RequirePermission(Permission.ADMINISTER_MEDICATIONS)
 * async administerMedication() {}
 */
export const RequirePermission = (permission: Permission) => {
  return RequirePermissions([permission], 'all');
};

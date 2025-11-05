/**
 * @fileoverview Identity Access - Hooks Barrel Export
 * @module identity-access/hooks
 * 
 * Note: Some hooks are exported via namespace to avoid naming conflicts
 */

export * from './auth-guards';
export * from './auth-permissions';
export * from './auth-permission-hooks';
// Namespace export to avoid conflict with useUserPermissions
export * as PermissionHooks from './permissions';
export * from './permission-checks';
export * from './roles';

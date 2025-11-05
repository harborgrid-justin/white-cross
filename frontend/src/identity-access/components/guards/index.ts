/**
 * Guard Components - Barrel Export
 *
 * Exports all guard components for role-based and permission-based access control.
 *
 * @module components/guards
 */

export { PermissionGate } from './PermissionGate';
export type { PermissionGateProps } from './PermissionGate';

export { RoleGuard } from './RoleGuard';
export type { RoleGuardProps } from './RoleGuard';

export { AuthGuard } from './AuthGuard';
export type { AuthGuardProps } from './AuthGuard';

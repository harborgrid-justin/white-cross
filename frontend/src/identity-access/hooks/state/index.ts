/**
 * @fileoverview State Hooks Barrel Export
 * @module identity-access/hooks/state
 *
 * Exports all granular state selector hooks for easy importing.
 */

export { useAuthUser } from './useAuthUser';
export { useAuthStatus, type AuthStatus } from './useAuthStatus';
export { usePermissions } from './usePermissions';
export { useHasRole } from './useHasRole';
export { useHasPermission } from './useHasPermission';
export { useSessionActivity, type SessionActivity } from './useSessionActivity';

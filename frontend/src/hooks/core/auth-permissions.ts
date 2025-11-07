/**
 * Auth Permissions Re-export
 *
 * Re-exports permission definitions from the identity-access module.
 * This file exists for backward compatibility with older import paths.
 *
 * @module hooks/core/auth-permissions
 * @deprecated Import directly from @/identity-access/hooks/auth-permissions instead
 */

// Re-export all permission definitions and types from the identity-access module
export {
  PERMISSIONS,
  ROLE_HIERARCHY,
  type Permission,
} from '@/identity-access/hooks/auth-permissions';

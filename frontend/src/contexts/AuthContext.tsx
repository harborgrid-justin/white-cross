/**
 * AuthContext Re-export
 *
 * Re-exports authentication context from the identity-access module.
 * This file exists for backward compatibility with older import paths.
 *
 * @module contexts/AuthContext
 * @deprecated Import directly from @/identity-access/contexts/AuthContext instead
 */

'use client';

// Re-export all authentication context exports
export {
  AuthProvider,
  useAuthContext,
  type AuthContextValue,
} from '@/identity-access/contexts/AuthContext';

// Re-export auth hooks for convenience
export {
  useAuth,
  useHasPermission,
  useHasRole,
  useRequireAuth,
} from '@/identity-access/hooks';

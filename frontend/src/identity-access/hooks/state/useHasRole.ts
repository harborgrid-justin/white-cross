/**
 * @fileoverview useHasRole Hook - Role Checking with Memoization
 * @module identity-access/hooks/state/useHasRole
 *
 * Performance-optimized hook for checking if user has specific role(s).
 * Returns a memoized function that checks role membership.
 *
 * @example
 * ```tsx
 * import { useHasRole } from '@/identity-access/hooks/state/useHasRole';
 *
 * function AdminPanel() {
 *   const hasRole = useHasRole();
 *
 *   if (!hasRole(['admin', 'superadmin'])) {
 *     return <AccessDenied />;
 *   }
 *
 *   return <div>Admin content...</div>;
 * }
 *
 * // Alternative: get boolean directly
 * const isAdmin = useHasRole('admin');
 * const isAdminOrModerator = useHasRole(['admin', 'moderator']);
 * ```
 */

import { useSelector } from 'react-redux';
import { useMemo, useCallback } from 'react';
import type { RootState } from '@/stores/store';

/**
 * Hook to check if user has specific role(s)
 *
 * @param role - Optional role or array of roles to check
 * @returns If role provided: boolean indicating membership, otherwise: function to check role
 *
 * @example Direct boolean check
 * ```tsx
 * const isAdmin = useHasRole('admin');
 * ```
 *
 * @example Function for dynamic checks
 * ```tsx
 * const hasRole = useHasRole();
 * const canAccess = hasRole(['admin', 'moderator']);
 * ```
 */
export function useHasRole(): (role: string | string[]) => boolean;
export function useHasRole(role: string): boolean;
export function useHasRole(role: string[]): boolean;
export function useHasRole(role?: string | string[]): boolean | ((role: string | string[]) => boolean) {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  // Memoized role checking function
  const checkRole = useCallback(
    (roleToCheck: string | string[]): boolean => {
      if (!userRole) return false;

      const roles = Array.isArray(roleToCheck) ? roleToCheck : [roleToCheck];
      return roles.includes(userRole);
    },
    [userRole]
  );

  // If role provided, return boolean directly
  if (role !== undefined) {
    return useMemo(() => checkRole(role), [role, checkRole]);
  }

  // Otherwise return the checking function
  return checkRole;
}

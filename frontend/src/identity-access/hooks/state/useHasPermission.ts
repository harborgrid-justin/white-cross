/**
 * @fileoverview useHasPermission Hook - Permission Checking with Memoization
 * @module identity-access/hooks/state/useHasPermission
 *
 * Performance-optimized hook for checking if user has specific permission(s).
 * Returns a memoized function that checks permission membership.
 *
 * @example
 * ```tsx
 * import { useHasPermission } from '@/identity-access/hooks/state/useHasPermission';
 *
 * function EditButton() {
 *   const hasPermission = useHasPermission();
 *
 *   if (!hasPermission('students:edit')) {
 *     return null;
 *   }
 *
 *   return <button>Edit Student</button>;
 * }
 *
 * // Alternative: get boolean directly
 * const canEdit = useHasPermission('students:edit');
 * const canDelete = useHasPermission('students:delete');
 * ```
 */

import { useSelector } from 'react-redux';
import { useMemo, useCallback } from 'react';
import type { RootState } from '@/stores/store';

/**
 * Hook to check if user has specific permission(s)
 *
 * @param permission - Optional permission string to check
 * @returns If permission provided: boolean indicating membership, otherwise: function to check permission
 *
 * @example Direct boolean check
 * ```tsx
 * const canEdit = useHasPermission('students:edit');
 * ```
 *
 * @example Function for dynamic checks
 * ```tsx
 * const hasPermission = useHasPermission();
 * const canAccess = hasPermission('health-records:view');
 * ```
 */
export function useHasPermission(): (permission: string) => boolean;
export function useHasPermission(permission: string): boolean;
export function useHasPermission(
  permission?: string
): boolean | ((permission: string) => boolean) {
  const userPermissions = useSelector(
    (state: RootState) => state.auth.user?.permissions ?? []
  );

  // Memoized permission checking function
  const checkPermission = useCallback(
    (permissionToCheck: string): boolean => {
      return userPermissions.includes(permissionToCheck);
    },
    [userPermissions]
  );

  // If permission provided, return boolean directly
  if (permission !== undefined) {
    return useMemo(() => checkPermission(permission), [permission, checkPermission]);
  }

  // Otherwise return the checking function
  return checkPermission;
}

/**
 * @fileoverview usePermissions Hook - User Permissions Selector
 * @module identity-access/hooks/state/usePermissions
 *
 * Performance-optimized hook for accessing user permissions array.
 * Returns an empty array if user is not authenticated or has no permissions.
 *
 * @example
 * ```tsx
 * import { usePermissions } from '@/identity-access/hooks/state/usePermissions';
 *
 * function FeatureButton() {
 *   const permissions = usePermissions();
 *
 *   if (!permissions.includes('feature:create')) {
 *     return null;
 *   }
 *
 *   return <button>Create Feature</button>;
 * }
 * ```
 */

import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/store';

/**
 * Hook to access user permissions array
 *
 * @returns Array of permission strings, or empty array if not authenticated
 *
 * Performance: Direct selector to user.permissions prevents unnecessary
 * re-renders when other user properties change.
 */
export function usePermissions(): string[] {
  return useSelector((state: RootState) => state.auth.user?.permissions ?? []);
}

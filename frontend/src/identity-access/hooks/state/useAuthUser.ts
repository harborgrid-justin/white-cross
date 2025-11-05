/**
 * @fileoverview useAuthUser Hook - Granular Auth User Selector
 * @module identity-access/hooks/state/useAuthUser
 *
 * Performance-optimized hook for accessing ONLY the authenticated user.
 * Components using this hook will only re-render when the user object changes,
 * not when other auth state (like lastActivityAt) changes.
 *
 * @example
 * ```tsx
 * import { useAuthUser } from '@/identity-access/hooks/state/useAuthUser';
 *
 * function UserProfile() {
 *   const user = useAuthUser();
 *
 *   if (!user) return null;
 *
 *   return (
 *     <div>
 *       <h1>{user.firstName} {user.lastName}</h1>
 *       <p>{user.email}</p>
 *       <p>Role: {user.role}</p>
 *     </div>
 *   );
 * }
 * ```
 */

import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/store';
import type { User } from '@/types';

/**
 * Hook to access the authenticated user object
 *
 * @returns The current authenticated user or null if not logged in
 *
 * Performance: This hook uses a direct selector to the user property,
 * so components only re-render when the user object actually changes.
 */
export function useAuthUser(): User | null {
  return useSelector((state: RootState) => state.auth.user);
}

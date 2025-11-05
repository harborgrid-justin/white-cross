/**
 * @fileoverview useAuthStatus Hook - Granular Auth Status Selector
 * @module identity-access/hooks/state/useAuthStatus
 *
 * Performance-optimized hook for accessing authentication status.
 * Uses shallow equality to prevent unnecessary re-renders when the object
 * reference changes but values remain the same.
 *
 * @example
 * ```tsx
 * import { useAuthStatus } from '@/identity-access/hooks/state/useAuthStatus';
 *
 * function ProtectedRoute({ children }) {
 *   const { isAuthenticated, sessionExpiresAt } = useAuthStatus();
 *
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" />;
 *   }
 *
 *   if (sessionExpiresAt && Date.now() >= sessionExpiresAt) {
 *     return <Navigate to="/session-expired" />;
 *   }
 *
 *   return children;
 * }
 * ```
 */

import { useSelector, shallowEqual } from 'react-redux';
import type { RootState } from '@/stores/store';

/**
 * Authentication status interface
 */
export interface AuthStatus {
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
}

/**
 * Hook to access authentication status
 *
 * @returns Authentication status object with isAuthenticated and sessionExpiresAt
 *
 * Performance: Uses shallowEqual to prevent re-renders when the object
 * reference changes but the values remain the same.
 */
export function useAuthStatus(): AuthStatus {
  return useSelector(
    (state: RootState) => ({
      isAuthenticated: state.auth.isAuthenticated,
      sessionExpiresAt: state.auth.sessionExpiresAt,
    }),
    shallowEqual
  );
}

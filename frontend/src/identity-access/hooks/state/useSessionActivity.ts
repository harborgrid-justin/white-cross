/**
 * @fileoverview useSessionActivity Hook - Access Session Activity Context
 * @module identity-access/hooks/state/useSessionActivity
 *
 * Hook for accessing session activity tracking state and functions.
 * This state is isolated in its own context to prevent widespread re-renders
 * when lastActivityAt updates on every mouse movement.
 *
 * @example
 * ```tsx
 * import { useSessionActivity } from '@/identity-access/hooks/state/useSessionActivity';
 *
 * function ActivityTracker() {
 *   const { lastActivityAt, updateActivity } = useSessionActivity();
 *
 *   return (
 *     <div onClick={updateActivity}>
 *       Last activity: {new Date(lastActivityAt).toLocaleTimeString()}
 *     </div>
 *   );
 * }
 * ```
 */

import { useContext } from 'react';
import { SessionActivityContext } from '@/identity-access/contexts/SessionActivityContext';

/**
 * Session activity interface
 */
export interface SessionActivity {
  lastActivityAt: number;
  updateActivity: () => void;
  checkSession: () => boolean;
  isSessionWarningVisible: boolean;
}

/**
 * Hook to access session activity tracking
 *
 * @returns Session activity state and functions
 * @throws Error if used outside SessionActivityProvider
 *
 * Performance: This context updates frequently (on mouse activity) but is
 * isolated so only components using this hook re-render, not all auth consumers.
 */
export function useSessionActivity(): SessionActivity {
  const context = useContext(SessionActivityContext);

  if (context === undefined) {
    throw new Error('useSessionActivity must be used within a SessionActivityProvider');
  }

  return context;
}

/**
 * @fileoverview Redux Store Utilities - Backwards compatibility and cleanup functions
 * @module stores/reduxStore
 * @category Store
 *
 * Provides re-exports from the main store module for backwards compatibility,
 * plus utility functions for state cleanup during logout and session management.
 *
 * Compatibility Notes:
 * - This file provides backwards-compatible exports for code that imports from './reduxStore'
 * - New code should import directly from './store' for better clarity
 * - Cleanup functions are used during logout to ensure HIPAA compliance
 *
 * @example
 * ```typescript
 * // Legacy import (still supported)
 * import { store, clearPersistedState } from '@/stores/reduxStore';
 *
 * // Preferred import for new code
 * import { store, clearPersistedState } from '@/stores/store';
 * ```
 *
 * @see {@link ./store} for primary store configuration
 */

// Re-export store, types, and utilities from the main store file
export { store, type RootState, type AppDispatch, type AppStore, isValidRootState, getStorageStats, clearPersistedState as clearPersistedStateFromStore } from './store';

/**
 * Clear all persisted Redux state from localStorage.
 *
 * Removes all Redux-related keys from localStorage and sessionStorage, including
 * redux-persist keys. Called during logout to ensure clean state and HIPAA compliance.
 *
 * @deprecated Use clearPersistedStateFromStore from './store' instead for consistency
 *
 * @function clearPersistedState
 * @returns {void}
 *
 * @example
 * ```typescript
 * import { clearPersistedState } from '@/stores/reduxStore';
 *
 * // Call during logout
 * const handleLogout = async () => {
 *   clearPersistedState();
 *   await api.post('/auth/logout');
 *   router.push('/login');
 * };
 * ```
 *
 * @remarks
 * - Removes all keys starting with 'persist:' or 'redux:' from localStorage
 * - Also clears sessionStorage keys with same prefixes
 * - Safe to call even if no persisted state exists
 * - Called automatically by auth logout flow
 * - For server-side rendering, this is a no-op (typeof window === 'undefined')
 *
 * HIPAA Compliance:
 * - Essential for clearing PHI from browser storage
 * - Ensures no patient data remains after logout
 * - Prevents unauthorized access to stored state
 */
export function clearPersistedState(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Remove all persist: prefixed keys (redux-persist convention)
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('persist:') || key.startsWith('redux:'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('persist:') || key.startsWith('redux:'))) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Failed to clear persisted state:', error);
  }
}

/**
 * Clear a specific Redux slice from persisted state.
 *
 * Removes a single slice's persisted data from localStorage and sessionStorage,
 * useful for selective cache invalidation or partial logout scenarios.
 *
 * @function clearPersistedSlice
 * @param {string} sliceName - Name of the slice to clear (e.g., 'students', 'auth')
 * @returns {void}
 *
 * @example
 * ```typescript
 * import { clearPersistedSlice } from '@/stores/reduxStore';
 *
 * // Clear only the auth slice
 * clearPersistedSlice('auth');
 *
 * // Clear student data when switching schools
 * const handleSchoolSwitch = (newSchoolId: string) => {
 *   clearPersistedSlice('students');
 *   clearPersistedSlice('healthRecords');
 *   loadSchoolData(newSchoolId);
 * };
 * ```
 *
 * @remarks
 * - Only clears persisted state, does not reset Redux state in memory
 * - To reset in-memory state, dispatch a reset action for that slice
 * - Uses redux-persist naming convention: `persist:${sliceName}`
 * - Safe to call even if slice was never persisted
 * - No-op on server side (typeof window === 'undefined')
 */
export function clearPersistedSlice(sliceName: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`persist:${sliceName}`);
    sessionStorage.removeItem(`persist:${sliceName}`);
  } catch (error) {
    console.error(`Failed to clear persisted slice ${sliceName}:`, error);
  }
}

/**
 * Redux Store Utilities
 *
 * Re-exports store types and utilities for backwards compatibility
 * Provides cleanup functions for logout and session management
 */

// Re-export store, types, and utilities from the main store file
export { store, type RootState, type AppDispatch, type AppStore, isValidRootState, getStorageStats, clearPersistedState as clearPersistedStateFromStore } from './store';

/**
 * Clear all persisted Redux state from localStorage
 * Called during logout to ensure clean state
 * @deprecated Use clearPersistedStateFromStore from './store' instead
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
 * Clear specific slice from persisted state
 * @param sliceName - Name of the slice to clear
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

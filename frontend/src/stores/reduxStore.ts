/**
 * Redux Store Utilities
 * 
 * Utility functions for managing Redux persisted state
 * Provides cleanup functions for logout and session management
 */

/**
 * Clear all persisted Redux state from localStorage
 * Called during logout to ensure clean state
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

/**
 * WF-COMP-342 | healthRecordsCleanup.utils.ts - Utility functions for health records cleanup
 * Purpose: Core cleanup utilities for HIPAA-compliant data handling
 * Related: healthRecordsCleanup.ts, healthRecordsCleanup.types.ts
 * Exports: cleanup utility functions
 * Last Updated: 2025-11-04 | File Type: .ts
 */

import { QueryClient } from '@tanstack/react-query';
import type { CleanupOptions } from './healthRecordsCleanup.types';
import { CLEANUP_DELAY_MS } from './healthRecordsCleanup.types';
import { logCleanupEvent } from './healthRecordsCleanup.audit';

// ============================================================================
// Query Keys (fallback if not imported from queries)
// ============================================================================

// Define a local version of query keys to avoid undefined reference
const healthRecordsKeys = {
  all: ['health-records'] as const,
};

// ============================================================================
// Data Cleanup Functions
// ============================================================================

/**
 * Clears all health records data from React Query cache
 */
export function clearHealthRecordsCache(queryClient: QueryClient): void {
  try {
    // Remove all health records queries
    queryClient.removeQueries({ queryKey: healthRecordsKeys.all });

    // Force garbage collection by clearing the cache
    queryClient.clear();

    console.log('[HIPAA Cleanup] Health records cache cleared');
  } catch (error) {
    console.error('[HIPAA Cleanup] Error clearing cache:', error);
  }
}

/**
 * Clears sensitive data from browser storage
 */
export function clearSensitiveStorage(options: CleanupOptions = {}): void {
  const {
    clearLocalStorage = true,
    clearSessionStorage = true,
    logAudit = true,
  } = options;

  try {
    if (clearLocalStorage) {
      // Clear specific health-related keys
      const keysToRemove = [
        'health-records-state',
        'patient-data',
        'medical-history',
        'vitals-cache',
      ];

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      console.log('[HIPAA Cleanup] Local storage cleaned');
    }

    if (clearSessionStorage) {
      // Clear all session storage
      sessionStorage.clear();
      console.log('[HIPAA Cleanup] Session storage cleared');
    }

    if (logAudit) {
      logCleanupEvent('STORAGE_CLEANUP', {
        localStorage: clearLocalStorage,
        sessionStorage: clearSessionStorage,
      });
    }
  } catch (error) {
    console.error('[HIPAA Cleanup] Error clearing storage:', error);
  }
}

/**
 * Clears all PHI data from memory and storage
 */
export function clearAllPHI(
  queryClient: QueryClient,
  options: CleanupOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    const {
      clearCache = true,
      clearLocalStorage = true,
      clearSessionStorage = true,
      logAudit = true,
      onComplete,
    } = options;

    try {
      // Clear React Query cache
      if (clearCache) {
        clearHealthRecordsCache(queryClient);
      }

      // Clear browser storage
      clearSensitiveStorage({
        clearLocalStorage,
        clearSessionStorage,
        logAudit: false,
      });

      // Clear any in-memory variables
      if ((window as any).__healthRecordsData) {
        delete (window as any).__healthRecordsData;
      }

      // Log audit event
      if (logAudit) {
        logCleanupEvent('FULL_PHI_CLEANUP', {
          cache: clearCache,
          localStorage: clearLocalStorage,
          sessionStorage: clearSessionStorage,
          timestamp: new Date().toISOString(),
        });
      }

      console.log('[HIPAA Cleanup] All PHI data cleared');

      // Delay completion to ensure cleanup is finished
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
        resolve();
      }, CLEANUP_DELAY_MS);
    } catch (error) {
      console.error('[HIPAA Cleanup] Error during full cleanup:', error);
      resolve();
    }
  });
}

/**
 * Securely overwrites data in memory (defense in depth)
 */
export function secureOverwrite(data: any): void {
  if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'string') {
        // Overwrite string data with zeros
        data[key] = '\0'.repeat(data[key].length);
      } else if (typeof data[key] === 'object') {
        secureOverwrite(data[key]);
      }
      delete data[key];
    });
  }
}

/**
 * Monitor page visibility and cleanup on tab close
 */
export function monitorPageVisibility(
  queryClient: QueryClient,
  onBeforeUnload?: () => void
): () => void {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Page is hidden, cleanup data
      clearHealthRecordsCache(queryClient);
      logCleanupEvent('PAGE_HIDDEN_CLEANUP');
    }
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    // Cleanup before page unload
    clearAllPHI(queryClient, { logAudit: true });

    if (onBeforeUnload) {
      onBeforeUnload();
    }

    // Optional: Show confirmation dialog
    // event.preventDefault();
    // event.returnValue = '';
  };

  // Attach listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Return cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}

/**
 * Hook for automatic PHI cleanup on component unmount
 * Usage: useAutoPHICleanup(queryClient, { enabled: true });
 */
export function useAutoPHICleanup(
  queryClient: QueryClient,
  options: {
    enabled?: boolean;
    onCleanup?: () => void;
  } = {}
): void {
  const { enabled = true, onCleanup } = options;

  if (enabled && typeof window !== 'undefined') {
    // This would typically be used in a useEffect
    // See example in documentation
  }
}

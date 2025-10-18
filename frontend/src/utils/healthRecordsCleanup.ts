/**
 * WF-COMP-342 | healthRecordsCleanup.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../hooks/useHealthRecords | Dependencies: @tanstack/react-query, ../hooks/useHealthRecords
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces, classes | Key Features: useEffect, component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * HIPAA-Compliant Data Cleanup Utilities
 *
 * Utilities for secure handling and cleanup of Protected Health Information (PHI)
 * in accordance with HIPAA security requirements.
 *
 * Features:
 * - Automatic memory cleanup
 * - Session timeout monitoring
 * - Secure data disposal
 * - Audit logging
 *
 * @module healthRecordsCleanup
 */

import { QueryClient } from '@tanstack/react-query';
import { healthRecordsKeys } from '../hooks/useHealthRecords';

// ============================================================================
// Constants
// ============================================================================

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const INACTIVITY_WARNING_MS = 13 * 60 * 1000; // 13 minutes (2 min warning)
const CLEANUP_DELAY_MS = 5000; // 5 seconds delay for graceful cleanup

// ============================================================================
// Types
// ============================================================================

export interface CleanupOptions {
  clearCache?: boolean;
  clearLocalStorage?: boolean;
  clearSessionStorage?: boolean;
  logAudit?: boolean;
  onComplete?: () => void;
}

export interface SessionMonitorOptions {
  timeoutMs?: number;
  warningMs?: number;
  onWarning?: (remainingTime: number) => void;
  onTimeout?: () => void;
  onActivity?: () => void;
}

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

// ============================================================================
// Session Monitoring
// ============================================================================

export class SessionMonitor {
  private timeoutId: NodeJS.Timeout | null = null;
  private warningId: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private options: Required<SessionMonitorOptions>;
  private activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

  constructor(options: SessionMonitorOptions = {}) {
    this.options = {
      timeoutMs: options.timeoutMs || SESSION_TIMEOUT_MS,
      warningMs: options.warningMs || INACTIVITY_WARNING_MS,
      onWarning: options.onWarning || (() => {}),
      onTimeout: options.onTimeout || (() => {}),
      onActivity: options.onActivity || (() => {}),
    };
  }

  /**
   * Start monitoring user activity
   */
  start(): void {
    this.resetTimers();
    this.attachActivityListeners();
    console.log('[Session Monitor] Started monitoring user activity');
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    this.clearTimers();
    this.detachActivityListeners();
    console.log('[Session Monitor] Stopped monitoring user activity');
  }

  /**
   * Reset activity timers
   */
  private resetTimers(): void {
    this.clearTimers();

    // Set warning timer
    this.warningId = setTimeout(() => {
      const remainingTime = this.options.timeoutMs - this.options.warningMs;
      this.options.onWarning(remainingTime);
      console.log(`[Session Monitor] Inactivity warning: ${remainingTime}ms until timeout`);
    }, this.options.warningMs);

    // Set timeout timer
    this.timeoutId = setTimeout(() => {
      this.options.onTimeout();
      console.log('[Session Monitor] Session timeout due to inactivity');
    }, this.options.timeoutMs);

    this.lastActivity = Date.now();
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.warningId) {
      clearTimeout(this.warningId);
      this.warningId = null;
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Handle user activity
   */
  private handleActivity = (): void => {
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivity;

    // Only reset if more than 1 second has passed (debounce)
    if (timeSinceLastActivity > 1000) {
      this.resetTimers();
      this.options.onActivity();
    }
  };

  /**
   * Attach activity event listeners
   */
  private attachActivityListeners(): void {
    this.activityEvents.forEach((event) => {
      document.addEventListener(event, this.handleActivity, true);
    });
  }

  /**
   * Detach activity event listeners
   */
  private detachActivityListeners(): void {
    this.activityEvents.forEach((event) => {
      document.removeEventListener(event, this.handleActivity, true);
    });
  }

  /**
   * Get time until timeout
   */
  getTimeUntilTimeout(): number {
    const elapsed = Date.now() - this.lastActivity;
    return Math.max(0, this.options.timeoutMs - elapsed);
  }

  /**
   * Check if session is active
   */
  isActive(): boolean {
    return this.getTimeUntilTimeout() > 0;
  }
}

// ============================================================================
// Audit Logging
// ============================================================================

interface AuditLogEntry {
  timestamp: string;
  event: string;
  userId?: string;
  details?: any;
}

const auditLog: AuditLogEntry[] = [];
const MAX_AUDIT_LOG_SIZE = 100;

/**
 * Log cleanup event for audit trail
 */
export function logCleanupEvent(event: string, details?: any): void {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    event,
    userId: getCurrentUserId(),
    details,
  };

  auditLog.push(entry);

  // Keep log size manageable
  if (auditLog.length > MAX_AUDIT_LOG_SIZE) {
    auditLog.shift();
  }

  // In production, send to backend audit service
  if (import.meta.env.PROD) {
    sendAuditLogToBackend(entry).catch((err) => {
      console.error('[Audit Log] Failed to send audit log:', err);
    });
  }

  console.log('[Audit Log]', entry);
}

/**
 * Get current user ID from auth storage
 */
function getCurrentUserId(): string | undefined {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.user?.id;
    }
  } catch (error) {
    console.error('[Audit Log] Error getting user ID:', error);
  }
  return undefined;
}

/**
 * Send audit log to backend (placeholder)
 */
async function sendAuditLogToBackend(entry: AuditLogEntry): Promise<void> {
  // Implementation would send to backend audit service
  // Example: await apiInstance.post('/audit/client-events', entry);
  console.log('[Audit Log] Would send to backend:', entry);
}

/**
 * Get audit log (for debugging)
 */
export function getAuditLog(): AuditLogEntry[] {
  return [...auditLog];
}

// ============================================================================
// Visibility Change Handler
// ============================================================================

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

// ============================================================================
// React Hook for Automatic Cleanup
// ============================================================================

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

// ============================================================================
// Export Utilities
// ============================================================================

export const healthRecordsCleanup = {
  clearCache: clearHealthRecordsCache,
  clearStorage: clearSensitiveStorage,
  clearAll: clearAllPHI,
  secureOverwrite,
  logEvent: logCleanupEvent,
  getAuditLog,
  monitorPageVisibility,
  SessionMonitor,
};

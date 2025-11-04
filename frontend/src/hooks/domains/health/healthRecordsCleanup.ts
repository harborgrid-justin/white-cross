/**
 * WF-COMP-342 | healthRecordsCleanup.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../hooks/useHealthRecords | Dependencies: @tanstack/react-query, ../hooks/useHealthRecords
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces, classes | Key Features: useEffect, component
 * Last Updated: 2025-11-04 | File Type: .ts
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

// ============================================================================
// Re-export all types
// ============================================================================

export type {
  CleanupOptions,
  SessionMonitorOptions,
  AuditLogEntry,
} from './healthRecordsCleanup.types';

export {
  SESSION_TIMEOUT_MS,
  INACTIVITY_WARNING_MS,
  CLEANUP_DELAY_MS,
} from './healthRecordsCleanup.types';

// ============================================================================
// Re-export all utility functions
// ============================================================================

export {
  clearHealthRecordsCache,
  clearSensitiveStorage,
  clearAllPHI,
  secureOverwrite,
  monitorPageVisibility,
  useAutoPHICleanup,
} from './healthRecordsCleanup.utils';

// ============================================================================
// Re-export session monitoring
// ============================================================================

export { SessionMonitor } from './healthRecordsCleanup.session';

// ============================================================================
// Re-export audit logging
// ============================================================================

export { logCleanupEvent, getAuditLog } from './healthRecordsCleanup.audit';

// ============================================================================
// Export Convenience Object (Backwards Compatibility)
// ============================================================================

import { clearHealthRecordsCache, clearSensitiveStorage, clearAllPHI, secureOverwrite, monitorPageVisibility } from './healthRecordsCleanup.utils';
import { SessionMonitor } from './healthRecordsCleanup.session';
import { logCleanupEvent, getAuditLog } from './healthRecordsCleanup.audit';

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

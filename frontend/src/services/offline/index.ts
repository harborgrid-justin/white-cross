/**
 * Offline Service Module
 *
 * Modular offline functionality for the White Cross platform
 */

// Core service
export { OfflineService } from './OfflineService';

// Component managers
export { BasicOfflineManager } from './BasicOfflineManager';
export { ConnectionMonitor } from './ConnectionMonitor';
export { OfflineQueueManager } from './OfflineQueueManager';

// Types
export type {
  ConnectionState,
  ConnectionQuality,
  QueuedRequest,
  SyncProgress,
  SyncResult,
  OfflineConfig,
} from './types';

// Legacy exports for backward compatibility
export { ConnectionMonitor as connectionMonitor } from './ConnectionMonitor';
export { OfflineQueueManager as offlineQueue } from './OfflineQueueManager';
/**
 * Sync Conflict Entity (Integration Module)
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and types
export { SyncConflict } from '../../database/models/sync-conflict.model';

export type {
  SyncStatus,
  ConflictVersion,
} from '../../database/models/sync-conflict.model';

// Re-export ConflictResolution from sync-queue-item model
export { ConflictResolution } from '../../database/models/sync-queue-item.model';

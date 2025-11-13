/**
 * Sync Conflict Entity (Integration Module)
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and types
export { } from '@/database/models';

export type {
  SyncStatus,
  ConflictVersion,
} from '@/database/models';

// Re-export ConflictResolution from sync-queue-item model
export { } from '@/database/models';

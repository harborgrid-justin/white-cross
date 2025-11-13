import { SyncEntityType, SyncStatus } from '../enums';

/**
 * Sync Statistics Response Interface
 */
export interface SyncStatistics {
  deviceId: string;
  lastSyncAt?: Date;
  queuedItems: number;
  pendingItems: number;
  syncedItems: number;
  failedItems: number;
  conflictsDetected: number;
  conflictsResolved: number;
  conflictsPending: number;
}

/**
 * Sync Result Interface
 */
export interface SyncResult {
  synced: number;
  failed: number;
  conflicts: number;
  errors: string[];
}

/**
 * Entity Version Interface
 * Tracks entity versions for conflict detection
 */
export interface EntityVersion {
  id: string;
  version: number;
  updatedAt: Date;
  updatedBy: string;
  checksum?: string;
}

/**
 * Sync Watermark Interface
 * Tracks last successful sync point per device and entity type
 */
export interface SyncWatermark {
  deviceId: string;
  entityType: SyncEntityType;
  lastSyncTimestamp: Date;
  lastEntityVersion: number;
}

/**
 * Entity Service Interface
 * All entity services must implement this interface for sync operations
 */
export interface IEntitySyncService<T = unknown> {
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>, userId: string): Promise<T>;
  update(id: string, data: Partial<T>, userId: string): Promise<T>;
  delete(id: string, userId: string): Promise<void>;
  getVersion(id: string): Promise<EntityVersion | null>;
  validateData(data: Partial<T>): Promise<boolean>;
}

/**
 * Client Version Information
 * Used in conflict resolution
 */
export interface ClientVersion {
  data: Record<string, unknown>;
  timestamp: Date;
  userId: string;
}

/**
 * Server Version Information
 * Used in conflict resolution
 */
export interface ServerVersion {
  data: Record<string, unknown> | { _deleted: boolean };
  timestamp: Date;
  userId: string;
}

/**
 * Conflict Data Interface
 * Structure for creating conflict records
 */
export interface ConflictData {
  queueItemId: string;
  entityType: SyncEntityType;
  entityId: string;
  clientVersion: ClientVersion;
  serverVersion: ServerVersion;
  status: SyncStatus;
}

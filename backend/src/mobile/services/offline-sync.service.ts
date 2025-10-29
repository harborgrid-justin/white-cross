import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model, Op, Transaction } from 'sequelize';
import { SyncQueueItem } from '../../database/models/sync-queue-item.model';
import { SyncConflict } from '../../database/models/sync-conflict.model';
import { QueueSyncActionDto, SyncOptionsDto, ResolveConflictDto } from '../dto';
import { SyncActionType, SyncEntityType, SyncPriority, ConflictResolution, SyncStatus } from '../enums';

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
export interface IEntitySyncService {
  findById(id: string): Promise<any>;
  create(data: any, userId: string): Promise<any>;
  update(id: string, data: any, userId: string): Promise<any>;
  delete(id: string, userId: string): Promise<void>;
  getVersion(id: string): Promise<EntityVersion | null>;
  validateData(data: any): Promise<boolean>;
}

/**
 * Offline Sync Service
 * Handles offline data synchronization with conflict resolution
 *
 * @description
 * This service provides comprehensive offline synchronization capabilities including:
 * - Timestamp-based conflict detection
 * - Entity version tracking
 * - Intelligent merge strategies
 * - Batch synchronization with transaction support
 * - Sync watermark management for incremental syncs
 *
 * @example
 * ```typescript
 * // Queue an offline action
 * const queueItem = await syncService.queueAction(userId, {
 *   deviceId: 'device-123',
 *   actionType: SyncActionType.UPDATE,
 *   entityType: SyncEntityType.STUDENT,
 *   entityId: 'student-456',
 *   data: { name: 'John Doe' },
 *   priority: SyncPriority.HIGH
 * });
 *
 * // Sync pending actions
 * const result = await syncService.syncPendingActions(userId, 'device-123', {
 *   batchSize: 50,
 *   conflictStrategy: ConflictResolution.NEWEST_WINS
 * });
 * ```
 */
@Injectable()
export class OfflineSyncService {
  private readonly logger = new Logger(OfflineSyncService.name);
  private readonly entityServiceRegistry: Map<SyncEntityType, IEntitySyncService> = new Map();
  private readonly syncWatermarks: Map<string, SyncWatermark> = new Map();

  /**
   * Maximum number of sync attempts before marking an item as permanently failed
   * This should match the default maxAttempts value in SyncQueueItem model
   */
  private readonly MAX_SYNC_ATTEMPTS = 3;

  constructor(
    @InjectModel(SyncQueueItem)
    private readonly queueModel: typeof SyncQueueItem,
    @InjectModel(SyncConflict)
    private readonly conflictModel: typeof SyncConflict,
  ) {
    this.logger.log('OfflineSyncService initialized');
  }

  /**
   * Register an entity service for sync operations
   *
   * @param entityType - The entity type to register
   * @param service - The service implementing IEntitySyncService
   *
   * @example
   * ```typescript
   * syncService.registerEntityService(SyncEntityType.STUDENT, studentService);
   * ```
   */
  registerEntityService(entityType: SyncEntityType, service: IEntitySyncService): void {
    this.entityServiceRegistry.set(entityType, service);
    this.logger.log(`Registered entity service for ${entityType}`);
  }

  /**
   * Get the entity service for a given entity type
   *
   * @param entityType - The entity type
   * @returns The entity service
   * @throws NotFoundException if service not registered
   */
  private getEntityService(entityType: SyncEntityType): IEntitySyncService {
    const service = this.entityServiceRegistry.get(entityType);
    if (!service) {
      throw new NotFoundException(
        `No entity service registered for ${entityType}. ` +
        `Please register the service using registerEntityService()`
      );
    }
    return service;
  }

  /**
   * Queue a sync action for offline processing
   */
  async queueAction(userId: string, dto: QueueSyncActionDto): Promise<SyncQueueItem> {
    try {
      const queueItem = await this.queueModel.create({
        deviceId: dto.deviceId,
        userId,
        actionType: dto.actionType,
        entityType: dto.entityType,
        entityId: dto.entityId,
        data: dto.data,
        timestamp: new Date(),
        synced: false,
        attempts: 0,
        maxAttempts: 3,
        conflictDetected: false,
        priority: dto.priority || SyncPriority.NORMAL,
        requiresOnline: true,
      } as any);

      this.logger.log(`Sync action queued: ${queueItem.id} - ${dto.actionType} ${dto.entityType}`);

      return queueItem;
    } catch (error) {
      this.logger.error('Error queueing sync action', error);
      throw error;
    }
  }

  /**
   * Sync pending actions for a device
   */
  async syncPendingActions(
    userId: string,
    deviceId: string,
    options?: SyncOptionsDto
  ): Promise<SyncResult> {
    try {
      const batchSize = options?.batchSize || 50;

      // Get pending items
      const whereCondition: any = {
        deviceId,
        userId,
        synced: false,
      };

      if (options?.retryFailed) {
        whereCondition.attempts = { [Op.lt]: this.MAX_SYNC_ATTEMPTS };
      }

      const pendingItems = await this.queueModel.findAll({
        where: whereCondition,
        order: [
          ['priority', 'ASC'],
          ['timestamp', 'ASC']
        ],
        limit: batchSize,
      });

      const result: SyncResult = {
        synced: 0,
        failed: 0,
        conflicts: 0,
        errors: []
      };

      for (const item of pendingItems) {
        try {
          item.attempts++;

          // Check for conflicts
          const conflict = await this.detectConflict(item);

          if (conflict) {
            item.conflictDetected = true;
            await item.save();

            const savedConflict = await this.conflictModel.create(conflict);
            result.conflicts++;

            // Auto-resolve if strategy provided
            if (options?.conflictStrategy && options.conflictStrategy !== ConflictResolution.MANUAL) {
              await this.resolveConflict(
                userId,
                savedConflict.id,
                {
                  resolution: options.conflictStrategy === ConflictResolution.NEWEST_WINS
                    ? ConflictResolution.CLIENT_WINS
                    : options.conflictStrategy
                }
              );

              await this.applySyncAction(item);
              item.synced = true;
              item.syncedAt = new Date();
              await item.save();
              result.synced++;
            }
          } else {
            // No conflict, apply sync action
            await this.applySyncAction(item);
            item.synced = true;
            item.syncedAt = new Date();
            await item.save();
            result.synced++;
          }
        } catch (error) {
          item.lastError = String(error);
          await item.save();
          result.failed++;
          result.errors.push(`Item ${item.id}: ${error}`);
          this.logger.error('Error syncing item', error);
        }
      }

      this.logger.log(
        `Sync completed for device ${deviceId}: ${result.synced} synced, ${result.failed} failed, ${result.conflicts} conflicts`
      );

      return result;
    } catch (error) {
      this.logger.error('Error syncing pending actions', error);
      throw error;
    }
  }

  /**
   * Get sync statistics for a device
   */
  async getStatistics(userId: string, deviceId: string): Promise<SyncStatistics> {
    const entityIds = await this.getEntityIds(deviceId, userId);

    const queuedItems = await this.queueModel.count({
      where: { deviceId, userId }
    });

    const pendingItems = await this.queueModel.count({
      where: { deviceId, userId, synced: false }
    });

    const syncedItems = await this.queueModel.count({
      where: { deviceId, userId, synced: true }
    });

    const failedItems = await this.queueModel.count({
      where: {
        deviceId,
        userId,
        synced: false,
        attempts: { [Op.gte]: this.MAX_SYNC_ATTEMPTS }
      }
    });

    const conflictsDetected = await this.conflictModel.count({
      where: { entityId: { [Op.in]: entityIds } }
    });

    const conflictsResolved = await this.conflictModel.count({
      where: {
        entityId: { [Op.in]: entityIds },
        status: SyncStatus.RESOLVED
      }
    });

    const conflictsPending = await this.conflictModel.count({
      where: {
        entityId: { [Op.in]: entityIds },
        status: SyncStatus.PENDING
      }
    });

    // Get last sync time
    const lastSyncedItem = await this.queueModel.findOne({
      where: { deviceId, userId, synced: true },
      order: [['syncedAt', 'DESC']],
    });

    return {
      deviceId,
      lastSyncAt: lastSyncedItem?.syncedAt,
      queuedItems,
      pendingItems,
      syncedItems,
      failedItems,
      conflictsDetected,
      conflictsResolved,
      conflictsPending
    };
  }

  /**
   * List conflicts for a device
   */
  async listConflicts(userId: string, deviceId: string): Promise<SyncConflict[]> {
    const entityIds = await this.getEntityIds(deviceId, userId);

    return this.conflictModel.findAll({
      where: {
        entityId: { [Op.in]: entityIds },
        status: SyncStatus.PENDING
      },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Resolve a sync conflict
   */
  async resolveConflict(
    userId: string,
    conflictId: string,
    dto: ResolveConflictDto
  ): Promise<SyncConflict> {
    const conflict = await this.conflictModel.findOne({
      where: { id: conflictId }
    });

    if (!conflict) {
      throw new NotFoundException('Conflict not found');
    }

    conflict.resolution = dto.resolution;
    conflict.resolvedAt = new Date();
    conflict.resolvedBy = userId;
    conflict.status = SyncStatus.RESOLVED;

    // Apply resolution strategy
    switch (dto.resolution) {
      case ConflictResolution.CLIENT_WINS:
        conflict.mergedData = conflict.clientVersion.data;
        break;

      case ConflictResolution.SERVER_WINS:
        conflict.mergedData = conflict.serverVersion.data;
        break;

      case ConflictResolution.MERGE:
        conflict.mergedData = dto.mergedData || this.mergeData(
          conflict.clientVersion.data,
          conflict.serverVersion.data
        );
        break;

      case ConflictResolution.MANUAL:
        conflict.mergedData = dto.mergedData;
        break;
    }

    const resolved = await conflict.save();

    // Update the queue item
    await this.queueModel.update(
      { conflictResolution: dto.resolution },
      { where: { id: conflict.queueItemId } }
    );

    this.logger.log(`Conflict resolved: ${conflictId} using ${dto.resolution}`);

    return resolved;
  }

  /**
   * Detect conflicts for a queue item based on timestamps and versions
   *
   * @param item - The sync queue item to check for conflicts
   * @returns A conflict object if detected, null otherwise
   *
   * @description
   * Conflict detection strategy:
   * 1. Fetch current server version of the entity
   * 2. Compare timestamps between client and server
   * 3. Check version numbers if available
   * 4. Calculate data checksums for deep comparison
   * 5. Create conflict record if modifications detected
   */
  private async detectConflict(item: SyncQueueItem): Promise<SyncConflict | null> {
    try {
      // Skip conflict detection for CREATE operations (no existing entity)
      if (item.actionType === SyncActionType.CREATE) {
        return null;
      }

      // Skip conflict detection for READ operations
      if (item.actionType === SyncActionType.READ) {
        return null;
      }

      // Get the entity service
      const entityService = this.getEntityService(item.entityType);

      // Fetch current server version
      const serverEntity = await entityService.findById(item.entityId);

      // If entity doesn't exist on server, no conflict (may have been deleted)
      if (!serverEntity) {
        // For UPDATE operations, this is a conflict (entity was deleted)
        if (item.actionType === SyncActionType.UPDATE) {
          return this.createConflict(item, null, {
            id: item.entityId,
            version: 0,
            updatedAt: new Date(),
            updatedBy: 'system',
          });
        }
        return null;
      }

      // Get version information
      const serverVersion = await entityService.getVersion(item.entityId);

      if (!serverVersion) {
        // No version tracking available, use timestamp comparison
        return this.detectTimestampConflict(item, serverEntity);
      }

      // Check if server version was modified after client timestamp
      if (serverVersion.updatedAt > item.timestamp) {
        // Conflict detected: server has newer changes
        return this.createConflict(item, serverEntity, serverVersion);
      }

      // Check version numbers if available
      const clientVersion = (item.data as any).version;
      if (clientVersion !== undefined && clientVersion < serverVersion.version) {
        // Conflict detected: version mismatch
        return this.createConflict(item, serverEntity, serverVersion);
      }

      // Check data checksums for deep comparison
      if (serverVersion.checksum) {
        const clientChecksum = this.calculateChecksum(item.data);
        const serverChecksum = serverVersion.checksum;

        if (clientChecksum !== serverChecksum) {
          // Data has changed, but timestamps are close - potential conflict
          const timeDiff = Math.abs(serverVersion.updatedAt.getTime() - item.timestamp.getTime());
          if (timeDiff < 5000) { // Within 5 seconds, consider it a conflict
            return this.createConflict(item, serverEntity, serverVersion);
          }
        }
      }

      // No conflict detected
      return null;
    } catch (error) {
      this.logger.error(`Error detecting conflict for item ${item.id}`, error);
      // Don't throw - return null to allow sync to proceed
      return null;
    }
  }

  /**
   * Detect conflicts based on timestamp comparison
   *
   * @param item - The sync queue item
   * @param serverEntity - The current server entity
   * @returns A conflict object if detected, null otherwise
   */
  private detectTimestampConflict(item: SyncQueueItem, serverEntity: any): SyncConflict | null {
    const serverUpdatedAt = serverEntity.updatedAt || serverEntity.updated_at;

    if (!serverUpdatedAt) {
      // No timestamp available, assume no conflict
      return null;
    }

    const serverDate = new Date(serverUpdatedAt);
    const clientDate = new Date(item.timestamp);

    // If server was modified after client timestamp, we have a conflict
    if (serverDate > clientDate) {
      return this.createConflict(item, serverEntity, {
        id: item.entityId,
        version: (serverEntity as any).version || 0,
        updatedAt: serverDate,
        updatedBy: (serverEntity as any).updatedBy || 'unknown',
      });
    }

    return null;
  }

  /**
   * Create a conflict record
   *
   * @param item - The sync queue item
   * @param serverEntity - The current server entity (null if deleted)
   * @param serverVersion - The server version info
   * @returns Conflict data object for creation
   */
  private createConflict(
    item: SyncQueueItem,
    serverEntity: any | null,
    serverVersion: EntityVersion,
  ): any {
    const conflictData = {
      queueItemId: item.id,
      entityType: item.entityType,
      entityId: item.entityId,
      clientVersion: {
        data: item.data,
        timestamp: item.timestamp,
        userId: item.userId,
      },
      serverVersion: {
        data: serverEntity || { _deleted: true },
        timestamp: serverVersion.updatedAt,
        userId: serverVersion.updatedBy,
      },
      status: SyncStatus.PENDING,
    };

    this.logger.warn(
      `Conflict detected for ${item.entityType}:${item.entityId} - ` +
      `Client: ${item.timestamp.toISOString()}, Server: ${serverVersion.updatedAt.toISOString()}`
    );

    return conflictData;
  }

  /**
   * Calculate a simple checksum for data comparison
   *
   * @param data - The data to checksum
   * @returns A checksum string
   */
  private calculateChecksum(data: any): string {
    const str = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Apply sync action to the server using the registered entity service
   *
   * @param item - The sync queue item to apply
   * @throws Error if the action fails or validation fails
   *
   * @description
   * Routes the sync action to the appropriate entity service and applies it:
   * - CREATE: Creates a new entity
   * - UPDATE: Updates an existing entity
   * - DELETE: Deletes an entity
   * - READ: Fetches entity (for sync validation)
   */
  private async applySyncAction(item: SyncQueueItem): Promise<void> {
    const entityService = this.getEntityService(item.entityType);

    try {
      this.logger.log(
        `Applying sync action: ${item.actionType} on ${item.entityType} (${item.entityId})`
      );

      // Validate data before applying
      const isValid = await entityService.validateData(item.data);
      if (!isValid) {
        throw new Error('Data validation failed');
      }

      switch (item.actionType) {
        case SyncActionType.CREATE:
          await entityService.create(item.data, item.userId);
          this.logger.log(`Created ${item.entityType}:${item.entityId}`);
          break;

        case SyncActionType.UPDATE:
          await entityService.update(item.entityId, item.data, item.userId);
          this.logger.log(`Updated ${item.entityType}:${item.entityId}`);
          break;

        case SyncActionType.DELETE:
          await entityService.delete(item.entityId, item.userId);
          this.logger.log(`Deleted ${item.entityType}:${item.entityId}`);
          break;

        case SyncActionType.READ:
          // Just fetch to validate
          await entityService.findById(item.entityId);
          this.logger.log(`Validated ${item.entityType}:${item.entityId}`);
          break;

        default:
          throw new Error(`Unknown sync action type: ${item.actionType}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to apply sync action for ${item.entityType}:${item.entityId}`,
        error
      );
      throw error;
    }
  }

  /**
   * Batch sync operations with transaction support
   *
   * @param userId - The user ID
   * @param deviceId - The device ID
   * @param items - Array of queue items to sync
   * @param options - Sync options
   * @returns Sync result with transaction rollback on failure
   *
   * @description
   * Performs batch synchronization with ACID guarantees:
   * - All operations in a transaction
   * - Rollback on any failure
   * - Atomic batch processing
   */
  async batchSync(
    userId: string,
    deviceId: string,
    items: SyncQueueItem[],
    options?: SyncOptionsDto
  ): Promise<SyncResult> {
    const transaction = await this.queueModel.sequelize!.transaction();

    const result: SyncResult = {
      synced: 0,
      failed: 0,
      conflicts: 0,
      errors: []
    };

    try {
      for (const item of items) {
        try {
          // Check for conflicts
          const conflict = await this.detectConflict(item);

          if (conflict) {
            item.conflictDetected = true;
            await item.save({ transaction });

            const savedConflict = await this.conflictModel.create(conflict, { transaction });
            result.conflicts++;

            // Auto-resolve if strategy provided
            if (options?.conflictStrategy && options.conflictStrategy !== ConflictResolution.MANUAL) {
              await this.resolveConflict(
                userId,
                savedConflict.id,
                {
                  resolution: options.conflictStrategy === ConflictResolution.NEWEST_WINS
                    ? ConflictResolution.CLIENT_WINS
                    : options.conflictStrategy
                }
              );

              await this.applySyncAction(item);
              item.synced = true;
              item.syncedAt = new Date();
              await item.save({ transaction });
              result.synced++;
            }
          } else {
            // No conflict, apply sync action
            await this.applySyncAction(item);
            item.synced = true;
            item.syncedAt = new Date();
            await item.save({ transaction });
            result.synced++;
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Item ${item.id}: ${error}`);
          this.logger.error('Error in batch sync item', error);

          // Rollback transaction on error
          await transaction.rollback();
          throw error;
        }
      }

      // Commit transaction if all successful
      await transaction.commit();

      this.logger.log(
        `Batch sync completed: ${result.synced} synced, ${result.failed} failed, ${result.conflicts} conflicts`
      );

      return result;
    } catch (error) {
      this.logger.error('Batch sync failed, transaction rolled back', error);
      throw error;
    }
  }

  /**
   * Get or create sync watermark for a device and entity type
   *
   * @param deviceId - The device ID
   * @param entityType - The entity type
   * @returns The sync watermark
   */
  async getSyncWatermark(deviceId: string, entityType: SyncEntityType): Promise<SyncWatermark> {
    const key = `${deviceId}:${entityType}`;
    let watermark = this.syncWatermarks.get(key);

    if (!watermark) {
      // Load from last successful sync
      const lastSync = await this.queueModel.findOne({
        where: { deviceId, entityType, synced: true },
        order: [['syncedAt', 'DESC']],
      });

      watermark = {
        deviceId,
        entityType,
        lastSyncTimestamp: lastSync?.syncedAt || new Date(0),
        lastEntityVersion: 0,
      };

      this.syncWatermarks.set(key, watermark);
    }

    return watermark;
  }

  /**
   * Update sync watermark after successful sync
   *
   * @param deviceId - The device ID
   * @param entityType - The entity type
   * @param timestamp - The new watermark timestamp
   */
  async updateSyncWatermark(
    deviceId: string,
    entityType: SyncEntityType,
    timestamp: Date
  ): Promise<void> {
    const key = `${deviceId}:${entityType}`;
    const watermark = await this.getSyncWatermark(deviceId, entityType);

    watermark.lastSyncTimestamp = timestamp;
    this.syncWatermarks.set(key, watermark);

    this.logger.log(
      `Updated sync watermark for ${deviceId}:${entityType} to ${timestamp.toISOString()}`
    );
  }

  /**
   * Get entities changed since last sync (incremental sync)
   *
   * @param deviceId - The device ID
   * @param entityType - The entity type
   * @returns Array of changed entity IDs
   *
   * @description
   * Uses watermarks to determine which entities have changed since last sync,
   * enabling efficient incremental synchronization.
   */
  async getChangedEntities(
    deviceId: string,
    entityType: SyncEntityType
  ): Promise<string[]> {
    const watermark = await this.getSyncWatermark(deviceId, entityType);

    const items = await this.queueModel.findAll({
      where: {
        entityType,
        synced: true,
      },
      attributes: ['entityId', 'syncedAt'],
      order: [['syncedAt', 'DESC']],
    });

    // Filter entities modified after watermark
    const changedEntityIds = items
      .filter(item => item.syncedAt! > watermark.lastSyncTimestamp)
      .map(item => item.entityId);

    return [...new Set(changedEntityIds)]; // Unique IDs
  }

  /**
   * Get entity IDs for a device
   */
  private async getEntityIds(deviceId: string, userId: string): Promise<string[]> {
    const items = await this.queueModel.findAll({
      where: { deviceId, userId },
      attributes: ['entityId']
    });

    return items.map(item => item.entityId);
  }

  /**
   * Merge client and server data intelligently
   */
  private mergeData(clientData: any, serverData: any): any {
    const merged = { ...serverData };

    for (const key in clientData) {
      const clientValue = clientData[key];
      const serverValue = serverData[key];

      // If server doesn't have this field, use client value
      if (serverValue === null || serverValue === undefined) {
        merged[key] = clientValue;
      }
      // For date fields, use the newer value
      else if (key.includes('Date') || key.includes('At')) {
        const clientDate = new Date(clientValue);
        const serverDate = new Date(serverValue);
        if (clientDate > serverDate) {
          merged[key] = clientValue;
        }
      }
      // For arrays, merge uniquely
      else if (Array.isArray(clientValue) && Array.isArray(serverValue)) {
        merged[key] = [...new Set([...serverValue, ...clientValue])];
      }
    }

    return merged;
  }
}

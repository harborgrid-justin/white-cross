import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SyncQueueItem } from '../../../database/models';
import { SyncConflict } from '../../../database/models';
import { QueueSyncActionDto, ResolveConflictDto, SyncOptionsDto } from '../dto';
import { ConflictResolution, SyncActionType } from '../enums';
import {
  SyncStatistics,
  SyncResult,
  SyncWatermark,
  IEntitySyncService,
} from './offline-sync-types.interface';
import { SyncEntityType } from '../enums';
import { OfflineSyncEntityRegistryService } from './offline-sync-entity-registry.service';
import { OfflineSyncWatermarkService } from './offline-sync-watermark.service';
import { OfflineSyncQueueService } from './offline-sync-queue.service';
import { OfflineSyncConflictService } from './offline-sync-conflict.service';

import { BaseService } from '../../../common/base';
/**
 * Offline Sync Service - Main orchestrator for offline data synchronization
 *
 * Coordinates entity registry, watermark, queue, and conflict services to provide:
 * - Conflict detection and resolution
 * - Batch synchronization with transactions
 * - Incremental sync with watermarks
 */
@Injectable()
export class OfflineSyncService extends BaseService {
  constructor(
    @InjectModel(SyncQueueItem)
    private readonly queueModel: typeof SyncQueueItem,
    @InjectModel(SyncConflict)
    private readonly conflictModel: typeof SyncConflict,
    private readonly entityRegistry: OfflineSyncEntityRegistryService,
    private readonly watermarkService: OfflineSyncWatermarkService,
    private readonly queueService: OfflineSyncQueueService,
    private readonly conflictService: OfflineSyncConflictService,
  ) {
    super('OfflineSyncService');
  }

  /** Register an entity service for sync operations */
  registerEntityService(
    entityType: SyncEntityType,
    service: IEntitySyncService,
  ): void {
    this.entityRegistry.registerEntityService(entityType, service);
  }

  /** Queue a sync action for offline processing */
  async queueAction(
    userId: string,
    dto: QueueSyncActionDto,
  ): Promise<SyncQueueItem> {
    return this.queueService.queueAction(userId, dto);
  }

  /** Get sync statistics for a device */
  async getStatistics(
    userId: string,
    deviceId: string,
  ): Promise<SyncStatistics> {
    return this.queueService.getStatistics(userId, deviceId);
  }

  /** List conflicts for a device */
  async listConflicts(
    userId: string,
    deviceId: string,
  ): Promise<SyncConflict[]> {
    return this.queueService.listConflicts(userId, deviceId);
  }

  /** Resolve a sync conflict */
  async resolveConflict(
    userId: string,
    conflictId: string,
    dto: ResolveConflictDto,
  ): Promise<SyncConflict> {
    const resolved = await this.conflictService.resolveConflict(
      userId,
      conflictId,
      dto,
    );
    await this.queueService.updateConflictResolution(
      resolved.queueItemId,
      dto.resolution,
    );
    return resolved;
  }

  /** Get or create sync watermark for a device and entity type */
  async getSyncWatermark(
    deviceId: string,
    entityType: SyncEntityType,
  ): Promise<SyncWatermark> {
    return this.watermarkService.getSyncWatermark(deviceId, entityType);
  }

  /** Update sync watermark after successful sync */
  async updateSyncWatermark(
    deviceId: string,
    entityType: SyncEntityType,
    timestamp: Date,
  ): Promise<void> {
    return this.watermarkService.updateSyncWatermark(
      deviceId,
      entityType,
      timestamp,
    );
  }

  /** Get entities changed since last sync (incremental sync) */
  async getChangedEntities(
    deviceId: string,
    entityType: SyncEntityType,
  ): Promise<string[]> {
    return this.watermarkService.getChangedEntities(deviceId, entityType);
  }

  /** Sync pending actions for a device */
  async syncPendingActions(
    userId: string,
    deviceId: string,
    options?: SyncOptionsDto,
  ): Promise<SyncResult> {
    try {
      const batchSize = options?.batchSize || 50;
      const retryFailed = options?.retryFailed || false;

      // Get pending items from queue service
      const pendingItems = await this.queueService.getPendingItems(
        userId,
        deviceId,
        batchSize,
        retryFailed,
      );

      const result: SyncResult = {
        synced: 0,
        failed: 0,
        conflicts: 0,
        errors: [],
      };

      for (const item of pendingItems) {
        try {
          // Increment attempts
          await this.queueService.updateAttempts(item.id, item.attempts + 1);

          // Check for conflicts using conflict service
          const conflictData = await this.conflictService.detectConflict(item);

          if (conflictData) {
            await this.queueService.markConflictDetected(item.id);

            const savedConflict = await this.conflictService.createConflict(
              conflictData,
            );
            result.conflicts++;

            // Auto-resolve if strategy provided
            if (
              options?.conflictStrategy &&
              options.conflictStrategy !== ConflictResolution.MANUAL
            ) {
              const resolution =
                options.conflictStrategy === ConflictResolution.NEWEST_WINS
                  ? ConflictResolution.CLIENT_WINS
                  : options.conflictStrategy;

              await this.resolveConflict(userId, savedConflict.id, {
                resolution,
              });

              await this.applySyncAction(item);
              await this.queueService.markAsSynced(item.id);
              result.synced++;
            }
          } else {
            // No conflict, apply sync action
            await this.applySyncAction(item);
            await this.queueService.markAsSynced(item.id);
            result.synced++;
          }
        } catch (error) {
          await this.queueService.updateAttempts(
            item.id,
            item.attempts + 1,
            String(error),
          );
          result.failed++;
          result.errors.push(`Item ${item.id}: ${error}`);
          this.logError('Error syncing item', error);
        }
      }

      this.logInfo(
        `Sync completed for device ${deviceId}: ${result.synced} synced, ${result.failed} failed, ${result.conflicts} conflicts`,
      );

      return result;
    } catch (error) {
      this.logError('Error syncing pending actions', error);
      throw error;
    }
  }

  /** Apply sync action to the server using the registered entity service */
  private async applySyncAction(item: SyncQueueItem): Promise<void> {
    const entityService = this.entityRegistry.getEntityService(item.entityType);

    try {
      this.logInfo(
        `Applying sync action: ${item.actionType} on ${item.entityType} (${item.entityId})`,
      );

      // Validate data before applying
      const isValid = await entityService.validateData(
        item.data as Record<string, unknown>,
      );
      if (!isValid) {
        throw new Error('Data validation failed');
      }

      switch (item.actionType) {
        case SyncActionType.CREATE:
          await entityService.create(
            item.data as Record<string, unknown>,
            item.userId,
          );
          this.logInfo(`Created ${item.entityType}:${item.entityId}`);
          break;

        case SyncActionType.UPDATE:
          await entityService.update(
            item.entityId,
            item.data as Record<string, unknown>,
            item.userId,
          );
          this.logInfo(`Updated ${item.entityType}:${item.entityId}`);
          break;

        case SyncActionType.DELETE:
          await entityService.delete(item.entityId, item.userId);
          this.logInfo(`Deleted ${item.entityType}:${item.entityId}`);
          break;

        case SyncActionType.READ:
          // Just fetch to validate
          await entityService.findById(item.entityId);
          this.logInfo(`Validated ${item.entityType}:${item.entityId}`);
          break;

        default:
          throw new Error(`Unknown sync action type: ${item.actionType}`);
      }
    } catch (error) {
      this.logError(
        `Failed to apply sync action for ${item.entityType}:${item.entityId}`,
        error,
      );
      throw error;
    }
  }

  /** Batch sync operations with transaction support and ACID guarantees */
  async batchSync(
    userId: string,
    deviceId: string,
    items: SyncQueueItem[],
    options?: SyncOptionsDto,
  ): Promise<SyncResult> {
    const transaction = await this.queueModel.sequelize!.transaction();

    const result: SyncResult = {
      synced: 0,
      failed: 0,
      conflicts: 0,
      errors: [],
    };

    try {
      for (const item of items) {
        try {
          // Check for conflicts
          const conflictData = await this.conflictService.detectConflict(item);

          if (conflictData) {
            await this.queueModel.update(
              { conflictDetected: true },
              { where: { id: item.id }, transaction },
            );

            const savedConflict = await this.conflictModel.create(
              conflictData,
              { transaction },
            );
            result.conflicts++;

            // Auto-resolve if strategy provided
            if (
              options?.conflictStrategy &&
              options.conflictStrategy !== ConflictResolution.MANUAL
            ) {
              const resolution =
                options.conflictStrategy === ConflictResolution.NEWEST_WINS
                  ? ConflictResolution.CLIENT_WINS
                  : options.conflictStrategy;

              await this.conflictService.resolveConflict(
                userId,
                savedConflict.id,
                { resolution },
              );

              await this.applySyncAction(item);
              await this.queueModel.update(
                { synced: true, syncedAt: new Date() },
                { where: { id: item.id }, transaction },
              );
              result.synced++;
            }
          } else {
            // No conflict, apply sync action
            await this.applySyncAction(item);
            await this.queueModel.update(
              { synced: true, syncedAt: new Date() },
              { where: { id: item.id }, transaction },
            );
            result.synced++;
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Item ${item.id}: ${error}`);
          this.logError('Error in batch sync item', error);

          // Rollback transaction on error
          await transaction.rollback();
          throw error;
        }
      }

      // Commit transaction if all successful
      await transaction.commit();

      this.logInfo(
        `Batch sync completed: ${result.synced} synced, ${result.failed} failed, ${result.conflicts} conflicts`,
      );

      return result;
    } catch (error) {
      this.logError('Batch sync failed, transaction rolled back', error);
      throw error;
    }
  }
}

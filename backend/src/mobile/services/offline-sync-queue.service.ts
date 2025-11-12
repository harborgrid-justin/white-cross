import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SyncQueueItem } from '../../database/models/sync-queue-item.model';
import { SyncConflict } from '../../database/models/sync-conflict.model';
import { QueueSyncActionDto } from '../dto';
import { SyncPriority, SyncStatus } from '../enums';
import { SyncStatistics } from './offline-sync-types.interface';

/**
 * Queue Management Service
 * Handles sync queue operations and statistics
 *
 * @description
 * This service manages the sync queue, including:
 * - Queueing offline actions for later synchronization
 * - Tracking sync statistics per device
 * - Managing conflict lists
 * - Retrieving pending items for sync
 *
 * @example
 * ```typescript
 * // Queue an action
 * const queueItem = await queueService.queueAction(userId, {
 *   deviceId: 'device-123',
 *   actionType: SyncActionType.UPDATE,
 *   entityType: SyncEntityType.STUDENT,
 *   entityId: 'student-456',
 *   data: { name: 'John Doe' },
 *   priority: SyncPriority.HIGH
 * });
 *
 * // Get statistics
 * const stats = await queueService.getStatistics(userId, 'device-123');
 * ```
 */
@Injectable()
export class OfflineSyncQueueService {
  private readonly logger = new Logger(OfflineSyncQueueService.name);

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
    this.logger.log('OfflineSyncQueueService initialized');
  }

  /**
   * Queue a sync action for offline processing
   *
   * @param userId - The user ID
   * @param dto - The queue sync action data
   * @returns The created queue item
   */
  async queueAction(
    userId: string,
    dto: QueueSyncActionDto,
  ): Promise<SyncQueueItem> {
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
      });

      this.logger.log(
        `Sync action queued: ${queueItem.id} - ${dto.actionType} ${dto.entityType}`,
      );

      return queueItem;
    } catch (error) {
      this.logger.error('Error queueing sync action', error);
      throw error;
    }
  }

  /**
   * Get sync statistics for a device
   *
   * @param userId - The user ID
   * @param deviceId - The device ID
   * @returns Sync statistics
   */
  async getStatistics(
    userId: string,
    deviceId: string,
  ): Promise<SyncStatistics> {
    const entityIds = await this.getEntityIds(deviceId, userId);

    const queuedItems = await this.queueModel.count({
      where: { deviceId, userId },
    });

    const pendingItems = await this.queueModel.count({
      where: { deviceId, userId, synced: false },
    });

    const syncedItems = await this.queueModel.count({
      where: { deviceId, userId, synced: true },
    });

    const failedItems = await this.queueModel.count({
      where: {
        deviceId,
        userId,
        synced: false,
        attempts: { [Op.gte]: this.MAX_SYNC_ATTEMPTS },
      },
    });

    const conflictsDetected = await this.conflictModel.count({
      where: { entityId: { [Op.in]: entityIds } },
    });

    const conflictsResolved = await this.conflictModel.count({
      where: {
        entityId: { [Op.in]: entityIds },
        status: SyncStatus.RESOLVED,
      },
    });

    const conflictsPending = await this.conflictModel.count({
      where: {
        entityId: { [Op.in]: entityIds },
        status: SyncStatus.PENDING,
      },
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
      conflictsPending,
    };
  }

  /**
   * List conflicts for a device
   *
   * @param userId - The user ID
   * @param deviceId - The device ID
   * @returns Array of pending conflicts
   */
  async listConflicts(
    userId: string,
    deviceId: string,
  ): Promise<SyncConflict[]> {
    const entityIds = await this.getEntityIds(deviceId, userId);

    return this.conflictModel.findAll({
      where: {
        entityId: { [Op.in]: entityIds },
        status: SyncStatus.PENDING,
      },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Get pending sync items for a device
   *
   * @param userId - The user ID
   * @param deviceId - The device ID
   * @param batchSize - Maximum number of items to return
   * @param retryFailed - Whether to include failed items that can be retried
   * @returns Array of pending sync queue items
   */
  async getPendingItems(
    userId: string,
    deviceId: string,
    batchSize: number = 50,
    retryFailed: boolean = false,
  ): Promise<SyncQueueItem[]> {
    const whereCondition: Record<string, unknown> = {
      deviceId,
      userId,
      synced: false,
    };

    if (retryFailed) {
      whereCondition.attempts = { [Op.lt]: this.MAX_SYNC_ATTEMPTS };
    }

    return this.queueModel.findAll({
      where: whereCondition,
      order: [
        ['priority', 'ASC'],
        ['timestamp', 'ASC'],
      ],
      limit: batchSize,
    });
  }

  /**
   * Mark a queue item as synced
   *
   * @param itemId - The queue item ID
   * @param syncedAt - The sync timestamp
   */
  async markAsSynced(itemId: string, syncedAt: Date = new Date()): Promise<void> {
    await this.queueModel.update(
      { synced: true, syncedAt },
      { where: { id: itemId } },
    );
    this.logger.log(`Queue item ${itemId} marked as synced`);
  }

  /**
   * Update queue item attempts and error
   *
   * @param itemId - The queue item ID
   * @param attempts - The number of attempts
   * @param error - The error message (optional)
   */
  async updateAttempts(
    itemId: string,
    attempts: number,
    error?: string,
  ): Promise<void> {
    const updateData: Record<string, unknown> = { attempts };
    if (error) {
      updateData.lastError = error;
    }
    await this.queueModel.update(updateData, { where: { id: itemId } });
  }

  /**
   * Mark a queue item as having a conflict
   *
   * @param itemId - The queue item ID
   */
  async markConflictDetected(itemId: string): Promise<void> {
    await this.queueModel.update(
      { conflictDetected: true },
      { where: { id: itemId } },
    );
  }

  /**
   * Update conflict resolution for a queue item
   *
   * @param itemId - The queue item ID
   * @param resolution - The conflict resolution strategy
   */
  async updateConflictResolution(
    itemId: string,
    resolution: string,
  ): Promise<void> {
    await this.queueModel.update(
      { conflictResolution: resolution },
      { where: { id: itemId } },
    );
  }

  /**
   * Get entity IDs for a device
   *
   * @param deviceId - The device ID
   * @param userId - The user ID
   * @returns Array of entity IDs
   */
  private async getEntityIds(
    deviceId: string,
    userId: string,
  ): Promise<string[]> {
    const items = await this.queueModel.findAll({
      where: { deviceId, userId },
      attributes: ['entityId'],
    });

    return items.map((item) => item.entityId);
  }
}

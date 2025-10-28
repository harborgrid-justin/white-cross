import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SyncQueueItem, SyncConflict } from '../entities';
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
 * Offline Sync Service
 * Handles offline data synchronization with conflict resolution
 */
@Injectable()
export class OfflineSyncService {
  private readonly logger = new Logger(OfflineSyncService.name);

  constructor(
    @InjectRepository(SyncQueueItem)
    private readonly queueRepository: Repository<SyncQueueItem>,
    @InjectRepository(SyncConflict)
    private readonly conflictRepository: Repository<SyncConflict>,
  ) {}

  /**
   * Queue a sync action for offline processing
   */
  async queueAction(userId: string, dto: QueueSyncActionDto): Promise<SyncQueueItem> {
    try {
      const queueItem = this.queueRepository.create({
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

      const saved = await this.queueRepository.save(queueItem);

      this.logger.log(`Sync action queued: ${saved.id} - ${dto.actionType} ${dto.entityType}`);

      return saved;
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
      let queryBuilder = this.queueRepository
        .createQueryBuilder('item')
        .where('item.deviceId = :deviceId', { deviceId })
        .andWhere('item.userId = :userId', { userId })
        .andWhere('item.synced = :synced', { synced: false });

      if (options?.retryFailed) {
        queryBuilder = queryBuilder.andWhere('item.attempts < item.maxAttempts');
      }

      // Sort by priority and timestamp
      const pendingItems = await queryBuilder
        .orderBy({
          'item.priority': 'ASC', // HIGH=0, NORMAL=1, LOW=2 (enum order)
          'item.timestamp': 'ASC'
        })
        .take(batchSize)
        .getMany();

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
            await this.queueRepository.save(item);

            const savedConflict = await this.conflictRepository.save(conflict);
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
              await this.queueRepository.save(item);
              result.synced++;
            }
          } else {
            // No conflict, apply sync action
            await this.applySyncAction(item);
            item.synced = true;
            item.syncedAt = new Date();
            await this.queueRepository.save(item);
            result.synced++;
          }
        } catch (error) {
          item.lastError = String(error);
          await this.queueRepository.save(item);
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
    const queuedItems = await this.queueRepository.count({
      where: { deviceId, userId }
    });

    const pendingItems = await this.queueRepository.count({
      where: { deviceId, userId, synced: false }
    });

    const syncedItems = await this.queueRepository.count({
      where: { deviceId, userId, synced: true }
    });

    const failedItems = await this.queueRepository
      .createQueryBuilder('item')
      .where('item.deviceId = :deviceId', { deviceId })
      .andWhere('item.userId = :userId', { userId })
      .andWhere('item.attempts >= item.maxAttempts')
      .andWhere('item.synced = :synced', { synced: false })
      .getCount();

    const conflictsDetected = await this.conflictRepository.count({
      where: { entityId: In(await this.getEntityIds(deviceId, userId)) }
    });

    const conflictsResolved = await this.conflictRepository.count({
      where: {
        entityId: In(await this.getEntityIds(deviceId, userId)),
        status: SyncStatus.RESOLVED
      }
    });

    const conflictsPending = await this.conflictRepository.count({
      where: {
        entityId: In(await this.getEntityIds(deviceId, userId)),
        status: SyncStatus.PENDING
      }
    });

    // Get last sync time
    const lastSyncedItem = await this.queueRepository.findOne({
      where: { deviceId, userId, synced: true },
      order: { syncedAt: 'DESC' }
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

    return this.conflictRepository.find({
      where: {
        entityId: In(entityIds),
        status: SyncStatus.PENDING
      },
      order: { createdAt: 'DESC' }
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
    const conflict = await this.conflictRepository.findOne({
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

    const resolved = await this.conflictRepository.save(conflict);

    // Update the queue item
    await this.queueRepository.update(
      { id: conflict.queueItemId },
      { conflictResolution: dto.resolution }
    );

    this.logger.log(`Conflict resolved: ${conflictId} using ${dto.resolution}`);

    return resolved;
  }

  /**
   * Detect conflicts for a queue item
   * TODO: Implement actual conflict detection logic based on entity type
   */
  private async detectConflict(item: SyncQueueItem): Promise<SyncConflict | null> {
    // Placeholder: In production, this would check server state against client state
    // For now, return null (no conflict)
    return null;
  }

  /**
   * Apply sync action to the server
   * TODO: Implement actual sync logic for each entity type
   */
  private async applySyncAction(item: SyncQueueItem): Promise<void> {
    // Placeholder: This would apply the actual sync action based on entity type
    // For now, just log the action
    this.logger.log(
      `Applying sync action: ${item.actionType} on ${item.entityType} (${item.entityId})`
    );

    // In production, this would:
    // 1. Route to appropriate service based on entityType
    // 2. Apply the action (CREATE, UPDATE, DELETE)
    // 3. Handle any errors
  }

  /**
   * Get entity IDs for a device
   */
  private async getEntityIds(deviceId: string, userId: string): Promise<string[]> {
    const items = await this.queueRepository.find({
      where: { deviceId, userId },
      select: ['entityId']
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

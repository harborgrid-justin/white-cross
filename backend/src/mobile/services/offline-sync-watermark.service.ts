import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SyncQueueItem } from '../../database/models/sync-queue-item.model';
import { SyncEntityType } from '../enums';
import { SyncWatermark } from './offline-sync-types.interface';

import { BaseService } from '../../../common/base';
/**
 * Watermark Service
 * Manages sync watermarks for incremental synchronization
 *
 * @description
 * Watermarks track the last successful sync point for each device and entity type,
 * enabling efficient incremental synchronization by only processing changes since
 * the last sync.
 *
 * @example
 * ```typescript
 * // Get current watermark
 * const watermark = await watermarkService.getSyncWatermark('device-123', SyncEntityType.STUDENT);
 *
 * // Update after successful sync
 * await watermarkService.updateSyncWatermark('device-123', SyncEntityType.STUDENT, new Date());
 *
 * // Get changed entities since last sync
 * const changedIds = await watermarkService.getChangedEntities('device-123', SyncEntityType.STUDENT);
 * ```
 */
@Injectable()
export class OfflineSyncWatermarkService extends BaseService {
  private readonly syncWatermarks: Map<string, SyncWatermark> = new Map();

  constructor(
    @InjectModel(SyncQueueItem)
    private readonly queueModel: typeof SyncQueueItem,
  ) {
    this.logInfo('OfflineSyncWatermarkService initialized');
  }

  /**
   * Get or create sync watermark for a device and entity type
   *
   * @param deviceId - The device ID
   * @param entityType - The entity type
   * @returns The sync watermark
   */
  async getSyncWatermark(
    deviceId: string,
    entityType: SyncEntityType,
  ): Promise<SyncWatermark> {
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
    timestamp: Date,
  ): Promise<void> {
    const key = `${deviceId}:${entityType}`;
    const watermark = await this.getSyncWatermark(deviceId, entityType);

    watermark.lastSyncTimestamp = timestamp;
    this.syncWatermarks.set(key, watermark);

    this.logInfo(
      `Updated sync watermark for ${deviceId}:${entityType} to ${timestamp.toISOString()}`,
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
    entityType: SyncEntityType,
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
      .filter((item) => item.syncedAt! > watermark.lastSyncTimestamp)
      .map((item) => item.entityId);

    return [...new Set(changedEntityIds)]; // Unique IDs
  }

  /**
   * Clear watermark cache for a specific device and entity type
   *
   * @param deviceId - The device ID
   * @param entityType - The entity type (optional, clears all if not provided)
   */
  clearWatermark(deviceId: string, entityType?: SyncEntityType): void {
    if (entityType) {
      const key = `${deviceId}:${entityType}`;
      this.syncWatermarks.delete(key);
      this.logInfo(`Cleared watermark for ${key}`);
    } else {
      // Clear all watermarks for device
      const keysToDelete: string[] = [];
      this.syncWatermarks.forEach((_, key) => {
        if (key.startsWith(`${deviceId}:`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => this.syncWatermarks.delete(key));
      this.logInfo(`Cleared all watermarks for device ${deviceId}`);
    }
  }

  /**
   * Clear all watermarks from cache
   * Mainly for testing purposes
   */
  clearAllWatermarks(): void {
    this.syncWatermarks.clear();
    this.logInfo('All watermarks cleared from cache');
  }
}

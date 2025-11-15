import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SyncQueueItem } from '../../../database/models';
import { SyncConflict } from '../../../database/models';
import { ResolveConflictDto } from '../dto';
import { ConflictResolution, SyncActionType, SyncStatus } from '../enums';
import {
  EntityVersion,
  ConflictData,
  ClientVersion,
  ServerVersion,
} from './offline-sync-types.interface';
import { OfflineSyncEntityRegistryService } from './offline-sync-entity-registry.service';

import { BaseService } from '../../../common/base';
/**
 * Conflict Resolution Service
 * Handles conflict detection and resolution for offline sync
 *
 * @description
 * This service provides comprehensive conflict management including:
 * - Timestamp-based conflict detection
 * - Version-based conflict detection
 * - Checksum-based deep comparison
 * - Multiple resolution strategies (CLIENT_WINS, SERVER_WINS, MERGE, MANUAL)
 * - Intelligent data merging
 *
 * @example
 * ```typescript
 * // Detect conflicts
 * const conflict = await conflictService.detectConflict(queueItem);
 *
 * // Resolve conflict
 * await conflictService.resolveConflict(userId, conflictId, {
 *   resolution: ConflictResolution.CLIENT_WINS
 * });
 * ```
 */
@Injectable()
export class OfflineSyncConflictService extends BaseService {
  constructor(
    @InjectModel(SyncConflict)
    private readonly conflictModel: typeof SyncConflict,
    private readonly entityRegistry: OfflineSyncEntityRegistryService,
  ) {
    super('OfflineSyncConflictService');
  }

  /**
   * Detect conflicts for a queue item based on timestamps and versions
   *
   * @param item - The sync queue item to check for conflicts
   * @returns A conflict data object if detected, null otherwise
   *
   * @description
   * Conflict detection strategy:
   * 1. Fetch current server version of the entity
   * 2. Compare timestamps between client and server
   * 3. Check version numbers if available
   * 4. Calculate data checksums for deep comparison
   * 5. Create conflict record if modifications detected
   */
  async detectConflict(item: SyncQueueItem): Promise<ConflictData | null> {
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
      const entityService = this.entityRegistry.getEntityService(item.entityType);

      // Fetch current server version
      const serverEntity = await entityService.findById(item.entityId);

      // If entity doesn't exist on server, no conflict (may have been deleted)
      if (!serverEntity) {
        // For UPDATE operations, this is a conflict (entity was deleted)
        if (item.actionType === SyncActionType.UPDATE) {
          return this.createConflictData(item, null, {
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
        return this.createConflictData(item, serverEntity, serverVersion);
      }

      // Check version numbers if available
      const clientData = item.data as Record<string, unknown>;
      const clientVersion = clientData.version;
      if (
        clientVersion !== undefined &&
        typeof clientVersion === 'number' &&
        clientVersion < serverVersion.version
      ) {
        // Conflict detected: version mismatch
        return this.createConflictData(item, serverEntity, serverVersion);
      }

      // Check data checksums for deep comparison
      if (serverVersion.checksum) {
        const clientChecksum = this.calculateChecksum(clientData);
        const serverChecksum = serverVersion.checksum;

        if (clientChecksum !== serverChecksum) {
          // Data has changed, but timestamps are close - potential conflict
          const timeDiff = Math.abs(
            serverVersion.updatedAt.getTime() - item.timestamp.getTime(),
          );
          if (timeDiff < 5000) {
            // Within 5 seconds, consider it a conflict
            return this.createConflictData(item, serverEntity, serverVersion);
          }
        }
      }

      // No conflict detected
      return null;
    } catch (error) {
      this.logError(`Error detecting conflict for item ${item.id}`, error);
      // Don't throw - return null to allow sync to proceed
      return null;
    }
  }

  /**
   * Detect conflicts based on timestamp comparison
   *
   * @param item - The sync queue item
   * @param serverEntity - The current server entity
   * @returns A conflict data object if detected, null otherwise
   */
  detectTimestampConflict(
    item: SyncQueueItem,
    serverEntity: Record<string, unknown>,
  ): ConflictData | null {
    const serverUpdatedAt = serverEntity.updatedAt || serverEntity.updated_at;

    if (!serverUpdatedAt) {
      // No timestamp available, assume no conflict
      return null;
    }

    const serverDate = new Date(serverUpdatedAt as string | Date);
    const clientDate = new Date(item.timestamp);

    // If server was modified after client timestamp, we have a conflict
    if (serverDate > clientDate) {
      return this.createConflictData(item, serverEntity, {
        id: item.entityId,
        version: (serverEntity.version as number) || 0,
        updatedAt: serverDate,
        updatedBy: (serverEntity.updatedBy as string) || 'unknown',
      });
    }

    return null;
  }

  /**
   * Create a conflict data object
   *
   * @param item - The sync queue item
   * @param serverEntity - The current server entity (null if deleted)
   * @param serverVersion - The server version info
   * @returns Conflict data object
   */
  private createConflictData(
    item: SyncQueueItem,
    serverEntity: Record<string, unknown> | null,
    serverVersion: EntityVersion,
  ): ConflictData {
    const clientVersion: ClientVersion = {
      data: item.data as Record<string, unknown>,
      timestamp: item.timestamp,
      userId: item.userId,
    };

    const serverVersionData: ServerVersion = {
      data: serverEntity || { _deleted: true },
      timestamp: serverVersion.updatedAt,
      userId: serverVersion.updatedBy,
    };

    const conflictData: ConflictData = {
      queueItemId: item.id,
      entityType: item.entityType,
      entityId: item.entityId,
      clientVersion,
      serverVersion: serverVersionData,
      status: SyncStatus.PENDING,
    };

    this.logWarning(
      `Conflict detected for ${item.entityType}:${item.entityId} - ` +
        `Client: ${item.timestamp.toISOString()}, Server: ${serverVersion.updatedAt.toISOString()}`,
    );

    return conflictData;
  }

  /**
   * Resolve a sync conflict
   *
   * @param userId - The user ID resolving the conflict
   * @param conflictId - The conflict ID
   * @param dto - The resolution data
   * @returns The resolved conflict
   */
  async resolveConflict(
    userId: string,
    conflictId: string,
    dto: ResolveConflictDto,
  ): Promise<SyncConflict> {
    const conflict = await this.conflictModel.findOne({
      where: { id: conflictId },
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
        conflict.mergedData =
          dto.mergedData ||
          this.mergeData(
            conflict.clientVersion.data as Record<string, unknown>,
            conflict.serverVersion.data as Record<string, unknown>,
          );
        break;

      case ConflictResolution.MANUAL:
        if (!dto.mergedData) {
          throw new Error('Manual resolution requires mergedData');
        }
        conflict.mergedData = dto.mergedData;
        break;

      default:
        throw new Error(`Unknown conflict resolution: ${dto.resolution}`);
    }

    const resolved = await conflict.save();

    this.logInfo(`Conflict resolved: ${conflictId} using ${dto.resolution}`);

    return resolved;
  }

  /**
   * Calculate a simple checksum for data comparison
   *
   * @param data - The data to checksum
   * @returns A checksum string
   */
  calculateChecksum(data: Record<string, unknown>): string {
    const str = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Merge client and server data intelligently
   *
   * @param clientData - The client data
   * @param serverData - The server data
   * @returns Merged data
   *
   * @description
   * Merge strategy:
   * - Use server value as base
   * - Override with client values if server is null/undefined
   * - For date fields, use the newer value
   * - For arrays, merge uniquely
   */
  mergeData(
    clientData: Record<string, unknown>,
    serverData: Record<string, unknown>,
  ): Record<string, unknown> {
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
        const clientDate = new Date(clientValue as string | Date);
        const serverDate = new Date(serverValue as string | Date);
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

  /**
   * Create a conflict record in the database
   *
   * @param conflictData - The conflict data
   * @returns The created conflict
   */
  async createConflict(conflictData: ConflictData): Promise<SyncConflict> {
    return this.conflictModel.create(conflictData as any);
  }

  /**
   * Get conflict by ID
   *
   * @param conflictId - The conflict ID
   * @returns The conflict or null
   */
  async getConflictById(conflictId: string): Promise<SyncConflict | null> {
    return this.conflictModel.findOne({ where: { id: conflictId } });
  }
}

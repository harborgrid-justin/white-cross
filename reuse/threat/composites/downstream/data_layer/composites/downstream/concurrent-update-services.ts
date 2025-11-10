/**
 * LOC: CONCURRENT001
 * File: concurrent-update-services.ts
 * Purpose: Concurrent data updates with optimistic/pessimistic locking and conflict resolution
 */

import { Injectable, Logger } from "@nestjs/common";
import { AtomicOperationsService } from "../atomic-operations-kit";
import { TransactionOperationsService } from "../transaction-operations-kit";

export enum LockType {
  OPTIMISTIC = "OPTIMISTIC",
  PESSIMISTIC = "PESSIMISTIC",
}

export enum ConflictResolution {
  LAST_WRITE_WINS = "LAST_WRITE_WINS",
  FIRST_WRITE_WINS = "FIRST_WRITE_WINS",
  MERGE = "MERGE",
  REJECT = "REJECT",
}

export interface IUpdateConflict {
  entityType: string;
  entityId: string;
  currentVersion: number;
  attemptedVersion: number;
  currentData: any;
  attemptedData: any;
  timestamp: Date;
}

@Injectable()
export class ConcurrentUpdateService {
  private readonly logger = new Logger(ConcurrentUpdateService.name);
  private readonly locks: Map<string, { holder: string; acquiredAt: Date; type: LockType }> = new Map();
  private readonly versions: Map<string, number> = new Map();

  constructor(
    private readonly atomicService: AtomicOperationsService,
    private readonly transactionService: TransactionOperationsService,
  ) {}

  async updateWithOptimisticLock(
    entityType: string,
    entityId: string,
    expectedVersion: number,
    updates: any,
    userId: string
  ): Promise<{ success: boolean; newVersion?: number; conflict?: IUpdateConflict }> {
    const key = `${entityType}:${entityId}`;
    const currentVersion = this.versions.get(key) || 0;

    if (currentVersion !== expectedVersion) {
      this.logger.warn(`Optimistic lock conflict for ${key}: expected v${expectedVersion}, got v${currentVersion}`);
      
      return {
        success: false,
        conflict: {
          entityType,
          entityId,
          currentVersion,
          attemptedVersion: expectedVersion,
          currentData: {}, // Would fetch current data
          attemptedData: updates,
          timestamp: new Date(),
        },
      };
    }

    // Perform update atomically
    const newVersion = currentVersion + 1;
    this.versions.set(key, newVersion);

    this.logger.log(`Optimistic update succeeded for ${key}: v${currentVersion} -> v${newVersion}`);
    return { success: true, newVersion };
  }

  async updateWithPessimisticLock(
    entityType: string,
    entityId: string,
    updates: any,
    userId: string,
    timeoutMs: number = 30000
  ): Promise<{ success: boolean; version?: number; error?: string }> {
    const key = `${entityType}:${entityId}`;

    // Acquire lock
    const lockAcquired = await this.acquireLock(key, userId, LockType.PESSIMISTIC, timeoutMs);
    
    if (!lockAcquired) {
      return { success: false, error: "Failed to acquire lock within timeout" };
    }

    try {
      // Perform update
      const currentVersion = this.versions.get(key) || 0;
      const newVersion = currentVersion + 1;
      this.versions.set(key, newVersion);

      this.logger.log(`Pessimistic update succeeded for ${key}: v${currentVersion} -> v${newVersion}`);
      return { success: true, version: newVersion };
    } finally {
      // Always release lock
      this.releaseLock(key, userId);
    }
  }

  async batchUpdate(
    updates: Array<{ entityType: string; entityId: string; data: any }>,
    userId: string,
    lockType: LockType = LockType.OPTIMISTIC
  ): Promise<{ successful: number; failed: number; conflicts: IUpdateConflict[] }> {
    let successful = 0;
    let failed = 0;
    const conflicts: IUpdateConflict[] = [];

    for (const update of updates) {
      try {
        const result = lockType === LockType.OPTIMISTIC
          ? await this.updateWithOptimisticLock(update.entityType, update.entityId, 0, update.data, userId)
          : await this.updateWithPessimisticLock(update.entityType, update.entityId, update.data, userId);

        if (result.success) {
          successful++;
        } else {
          failed++;
          if ('conflict' in result && result.conflict) {
            conflicts.push(result.conflict);
          }
        }
      } catch (error) {
        failed++;
        this.logger.error(`Batch update failed for ${update.entityType}:${update.entityId}`, error);
      }
    }

    return { successful, failed, conflicts };
  }

  async resolveConflict(
    conflict: IUpdateConflict,
    strategy: ConflictResolution,
    userId: string
  ): Promise<{ resolved: boolean; finalVersion: number }> {
    const key = `${conflict.entityType}:${conflict.entityId}`;

    switch (strategy) {
      case ConflictResolution.LAST_WRITE_WINS:
        this.versions.set(key, conflict.currentVersion + 1);
        return { resolved: true, finalVersion: conflict.currentVersion + 1 };

      case ConflictResolution.FIRST_WRITE_WINS:
        return { resolved: true, finalVersion: conflict.currentVersion };

      case ConflictResolution.MERGE:
        const merged = this.mergeData(conflict.currentData, conflict.attemptedData);
        this.versions.set(key, conflict.currentVersion + 1);
        return { resolved: true, finalVersion: conflict.currentVersion + 1 };

      case ConflictResolution.REJECT:
        return { resolved: false, finalVersion: conflict.currentVersion };
    }
  }

  async getEntityVersion(entityType: string, entityId: string): Promise<number> {
    const key = `${entityType}:${entityId}`;
    return this.versions.get(key) || 0;
  }

  private async acquireLock(
    key: string,
    userId: string,
    type: LockType,
    timeoutMs: number
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      if (!this.locks.has(key)) {
        this.locks.set(key, { holder: userId, acquiredAt: new Date(), type });
        this.logger.log(`Lock acquired on ${key} by ${userId}`);
        return true;
      }

      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return false;
  }

  private releaseLock(key: string, userId: string): boolean {
    const lock = this.locks.get(key);
    
    if (!lock || lock.holder !== userId) {
      this.logger.warn(`Lock release failed: ${key} not held by ${userId}`);
      return false;
    }

    this.locks.delete(key);
    this.logger.log(`Lock released on ${key} by ${userId}`);
    return true;
  }

  private mergeData(current: any, attempted: any): any {
    // Simple merge strategy - prefer non-null values from attempted data
    return {
      ...current,
      ...Object.fromEntries(
        Object.entries(attempted).filter(([_, value]) => value != null)
      ),
    };
  }
}

export { ConcurrentUpdateService };

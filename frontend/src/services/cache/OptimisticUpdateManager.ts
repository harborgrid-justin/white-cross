/**
 * Optimistic Update Manager
 *
 * Advanced optimistic update handling with:
 * - Queue management for concurrent mutations
 * - Conflict detection and resolution
 * - Three-way merge strategy
 * - Rollback capabilities
 * - Version-based optimistic concurrency control
 */

import { QueryClient } from '@tanstack/react-query';
import type {
  OptimisticUpdateContext,
  ConflictDetection,
  ConflictStrategy,
  MergeResult,
  QueuedMutation
} from './types';

/**
 * Optimistic Update Manager Implementation
 */
export class OptimisticUpdateManager {
  private queryClient: QueryClient;
  private updateContexts: Map<string, OptimisticUpdateContext> = new Map();
  private mutationQueue: QueuedMutation[] = [];
  private isProcessingQueue = false;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Create Optimistic Update
   *
   * @param context - Optimistic update context
   * @returns Update ID
   */
  createUpdate<T>(
    context: Omit<OptimisticUpdateContext<T>, 'id' | 'timestamp'>
  ): string {
    const id = this.generateUpdateId();
    const timestamp = Date.now();

    const fullContext: OptimisticUpdateContext<T> = {
      ...context,
      id,
      timestamp
    };

    this.updateContexts.set(id, fullContext as OptimisticUpdateContext);

    // Set optimistic data in React Query
    this.queryClient.setQueryData(
      context.queryKey as unknown[],
      context.optimisticData
    );

    return id;
  }

  /**
   * Commit Optimistic Update
   *
   * Called when mutation succeeds - removes optimistic context
   *
   * @param updateId - Update ID
   * @param serverData - Data from server
   * @returns Whether commit was successful
   */
  async commitUpdate<T>(updateId: string, serverData: T): Promise<boolean> {
    const context = this.updateContexts.get(updateId);

    if (!context) {
      console.warn(
        `[OptimisticUpdateManager] Cannot commit - update context not found: ${updateId}`
      );
      return false;
    }

    // Detect conflicts between optimistic and server data
    const conflict = this.detectConflict(
      context.previousData,
      context.optimisticData,
      serverData,
      context.version
    );

    if (conflict.hasConflict) {
      console.warn(
        `[OptimisticUpdateManager] Conflict detected during commit`,
        conflict
      );

      // Attempt to resolve conflict
      const mergeResult = await this.resolveConflict(
        context.previousData,
        context.optimisticData,
        serverData,
        ConflictStrategy.SERVER_WINS // Default strategy
      );

      if (mergeResult.success && mergeResult.data) {
        this.queryClient.setQueryData(
          context.queryKey as unknown[],
          mergeResult.data
        );
      } else {
        // Merge failed, use server data
        this.queryClient.setQueryData(context.queryKey as unknown[], serverData);
      }
    } else {
      // No conflict, use server data
      this.queryClient.setQueryData(context.queryKey as unknown[], serverData);
    }

    // Clean up context
    this.updateContexts.delete(updateId);

    return true;
  }

  /**
   * Rollback Optimistic Update
   *
   * Called when mutation fails - restores previous data
   *
   * @param updateId - Update ID
   * @returns Whether rollback was successful
   */
  rollbackUpdate(updateId: string): boolean {
    const context = this.updateContexts.get(updateId);

    if (!context) {
      console.warn(
        `[OptimisticUpdateManager] Cannot rollback - update context not found: ${updateId}`
      );
      return false;
    }

    // Restore previous data
    this.queryClient.setQueryData(
      context.queryKey as unknown[],
      context.previousData
    );

    // Clean up context
    this.updateContexts.delete(updateId);

    console.log(`[OptimisticUpdateManager] Rolled back update: ${updateId}`);

    return true;
  }

  /**
   * Detect Conflict Between Versions
   *
   * @param base - Base version (before optimistic update)
   * @param local - Local version (optimistic update)
   * @param remote - Remote version (from server)
   * @param baseVersion - Base version number
   * @returns Conflict detection result
   */
  private detectConflict<T>(
    base: T,
    local: T,
    remote: T,
    baseVersion: number
  ): ConflictDetection {
    const conflictingFields: string[] = [];

    // If versions match, no conflict
    const remoteVersion = (remote as { version?: number }).version;
    if (remoteVersion && remoteVersion === baseVersion) {
      return {
        hasConflict: false,
        conflictingFields: [],
        baseVersion,
        localVersion: baseVersion + 1,
        remoteVersion
      };
    }

    // Deep comparison to find conflicting fields
    const baseObj = base as Record<string, unknown>;
    const localObj = local as Record<string, unknown>;
    const remoteObj = remote as Record<string, unknown>;

    for (const key in localObj) {
      // Skip if not a data field
      if (key === 'version' || key === 'updatedAt' || key === 'id') {
        continue;
      }

      const baseValue = baseObj[key];
      const localValue = localObj[key];
      const remoteValue = remoteObj[key];

      // Check if both local and remote changed the same field differently
      if (
        localValue !== baseValue &&
        remoteValue !== baseValue &&
        localValue !== remoteValue
      ) {
        conflictingFields.push(key);
      }
    }

    return {
      hasConflict: conflictingFields.length > 0,
      conflictingFields,
      baseVersion,
      localVersion: baseVersion + 1,
      remoteVersion: remoteVersion || baseVersion
    };
  }

  /**
   * Resolve Conflict Using Strategy
   *
   * @param base - Base version
   * @param local - Local version
   * @param remote - Remote version
   * @param strategy - Conflict resolution strategy
   * @returns Merge result
   */
  private async resolveConflict<T>(
    base: T,
    local: T,
    remote: T,
    strategy: ConflictStrategy
  ): Promise<MergeResult<T>> {
    switch (strategy) {
      case ConflictStrategy.SERVER_WINS:
        return {
          success: true,
          data: remote,
          strategy
        };

      case ConflictStrategy.CLIENT_WINS:
        return {
          success: true,
          data: local,
          strategy
        };

      case ConflictStrategy.MERGE:
        return this.threeWayMerge(base, local, remote);

      case ConflictStrategy.LAST_WRITE_WINS:
        // Use remote (server is authoritative)
        return {
          success: true,
          data: remote,
          strategy
        };

      case ConflictStrategy.USER_RESOLVE:
        // For now, fallback to server wins
        // In a real implementation, would prompt user
        return {
          success: true,
          data: remote,
          strategy: ConflictStrategy.SERVER_WINS,
          conflicts: []
        };

      default:
        return {
          success: false,
          strategy
        };
    }
  }

  /**
   * Three-Way Merge
   *
   * Merges local and remote changes, using base as reference
   *
   * @param base - Base version
   * @param local - Local version
   * @param remote - Remote version
   * @returns Merge result
   */
  private threeWayMerge<T>(
    base: T,
    local: T,
    remote: T
  ): MergeResult<T> {
    const merged = { ...remote } as Record<string, unknown>;
    const conflicts: Array<{
      field: string;
      base: unknown;
      local: unknown;
      remote: unknown;
    }> = [];

    const baseObj = base as Record<string, unknown>;
    const localObj = local as Record<string, unknown>;
    const remoteObj = remote as Record<string, unknown>;

    // Iterate through all fields in local
    for (const key in localObj) {
      // Skip metadata fields
      if (key === 'version' || key === 'updatedAt' || key === 'id') {
        continue;
      }

      const baseValue = baseObj[key];
      const localValue = localObj[key];
      const remoteValue = remoteObj[key];

      // If local changed but remote didn't, use local
      if (localValue !== baseValue && remoteValue === baseValue) {
        merged[key] = localValue;
        continue;
      }

      // If remote changed but local didn't, use remote (already in merged)
      if (remoteValue !== baseValue && localValue === baseValue) {
        continue;
      }

      // If both changed to the same value, no conflict
      if (localValue === remoteValue) {
        continue;
      }

      // If both changed differently, record conflict
      if (localValue !== baseValue && remoteValue !== baseValue) {
        conflicts.push({
          field: key,
          base: baseValue,
          local: localValue,
          remote: remoteValue
        });
        // Use remote value for now (can be customized)
        merged[key] = remoteValue;
      }
    }

    return {
      success: conflicts.length === 0,
      data: merged as T,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
      strategy: ConflictStrategy.MERGE
    };
  }

  /**
   * Queue Mutation
   *
   * @param mutation - Mutation to queue
   * @returns Mutation ID
   */
  queueMutation<TVariables>(
    mutation: Omit<QueuedMutation<TVariables>, 'id' | 'timestamp' | 'retryCount'>
  ): string {
    const id = this.generateMutationId();
    const timestamp = Date.now();

    const queuedMutation: QueuedMutation<TVariables> = {
      ...mutation,
      id,
      timestamp,
      retryCount: 0
    };

    this.mutationQueue.push(queuedMutation as QueuedMutation);

    // Sort by priority (higher first)
    this.mutationQueue.sort((a, b) => b.priority - a.priority);

    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.processQueue();
    }

    return id;
  }

  /**
   * Process Mutation Queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.mutationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.mutationQueue.length > 0) {
      const mutation = this.mutationQueue.shift();
      if (!mutation) break;

      try {
        // In a real implementation, would execute the mutation here
        console.log(
          `[OptimisticUpdateManager] Processing queued mutation: ${mutation.operation}`,
          mutation
        );

        // Simulate success
        await new Promise((resolve) => setTimeout(resolve, 10));
      } catch (error) {
        console.error(
          `[OptimisticUpdateManager] Mutation failed: ${mutation.operation}`,
          error
        );

        // Retry logic
        if (mutation.retryCount < 3) {
          mutation.retryCount++;
          this.mutationQueue.push(mutation);
        } else {
          // Max retries exceeded, rollback if optimistic update exists
          if (mutation.optimisticUpdateId) {
            this.rollbackUpdate(mutation.optimisticUpdateId);
          }
        }
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Get Pending Updates Count
   *
   * @returns Number of pending optimistic updates
   */
  getPendingUpdatesCount(): number {
    return this.updateContexts.size;
  }

  /**
   * Get Queued Mutations Count
   *
   * @returns Number of queued mutations
   */
  getQueuedMutationsCount(): number {
    return this.mutationQueue.length;
  }

  /**
   * Clear All Pending Updates
   */
  clearAllUpdates(): void {
    for (const updateId of this.updateContexts.keys()) {
      this.rollbackUpdate(updateId);
    }
  }

  /**
   * Generate Update ID
   *
   * @returns Unique update ID
   */
  private generateUpdateId(): string {
    return `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate Mutation ID
   *
   * @returns Unique mutation ID
   */
  private generateMutationId(): string {
    return `mutation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get Update Context (for debugging)
   *
   * @param updateId - Update ID
   * @returns Update context
   */
  getUpdateContext(updateId: string): OptimisticUpdateContext | undefined {
    return this.updateContexts.get(updateId);
  }
}

// Singleton instance
let optimisticUpdateManagerInstance: OptimisticUpdateManager | null = null;

/**
 * Get Optimistic Update Manager Singleton
 *
 * @param queryClient - React Query client
 * @returns Optimistic update manager instance
 */
export function getOptimisticUpdateManager(
  queryClient: QueryClient
): OptimisticUpdateManager {
  if (!optimisticUpdateManagerInstance) {
    optimisticUpdateManagerInstance = new OptimisticUpdateManager(queryClient);
  }
  return optimisticUpdateManagerInstance;
}

/**
 * Reset Optimistic Update Manager (for testing)
 */
export function resetOptimisticUpdateManager(): void {
  optimisticUpdateManagerInstance = null;
}

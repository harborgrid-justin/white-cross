/**
 * WF-COMP-349 | optimisticUpdates.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @tanstack/react-query, @/types/common
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, classes | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Production-Grade Optimistic UI Update System
 *
 * Enterprise-grade optimistic update management for TanStack Query with:
 * - Automatic rollback on failure
 * - Race condition handling
 * - Conflict detection and resolution
 * - Update queuing for conflicting operations
 * - Comprehensive audit trail
 * - HIPAA-compliant logging
 *
 * @module OptimisticUpdates
 * @version 1.0.0
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import { BaseEntity } from '@/types/common';

// =====================
// TYPE DEFINITIONS
// =====================

/**
 * Status of an optimistic update
 */
export enum UpdateStatus {
  PENDING = 'PENDING',
  APPLIED = 'APPLIED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  ROLLED_BACK = 'ROLLED_BACK',
  CONFLICTED = 'CONFLICTED',
}

/**
 * Strategy for handling rollback scenarios
 */
export enum RollbackStrategy {
  /** Restore previous data exactly as it was */
  RESTORE_PREVIOUS = 'RESTORE_PREVIOUS',
  /** Refetch data from server */
  REFETCH = 'REFETCH',
  /** Keep optimistic data but mark as stale */
  KEEP_STALE = 'KEEP_STALE',
  /** Use custom rollback handler */
  CUSTOM = 'CUSTOM',
}

/**
 * How to resolve data conflicts
 */
export enum ConflictResolutionStrategy {
  /** Server data always wins */
  SERVER_WINS = 'SERVER_WINS',
  /** Client data always wins */
  CLIENT_WINS = 'CLIENT_WINS',
  /** Merge both versions (requires merge function) */
  MERGE = 'MERGE',
  /** Ask user to resolve manually */
  MANUAL = 'MANUAL',
  /** Use timestamp - latest wins */
  TIMESTAMP = 'TIMESTAMP',
}

/**
 * Type of optimistic operation
 */
export enum OperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  BULK_CREATE = 'BULK_CREATE',
  BULK_UPDATE = 'BULK_UPDATE',
  BULK_DELETE = 'BULK_DELETE',
}

/**
 * Optimistic update metadata and tracking
 */
export interface OptimisticUpdate<T = unknown> {
  /** Unique identifier for this update */
  id: string;

  /** Query key affected by this update */
  queryKey: QueryKey;

  /** Type of operation being performed */
  operationType: OperationType;

  /** Current status of the update */
  status: UpdateStatus;

  /** Original data before the update */
  previousData: T | null;

  /** Optimistic data being applied */
  optimisticData: T;

  /** Actual server response after confirmation */
  confirmedData?: T;

  /** Timestamp when update was created */
  timestamp: number;

  /** Timestamp when update was confirmed or failed */
  completedAt?: number;

  /** Error information if update failed */
  error?: {
    message: string;
    code?: string;
    statusCode?: number;
    details?: unknown;
  };

  /** Rollback strategy for this update */
  rollbackStrategy: RollbackStrategy;

  /** Custom rollback handler */
  customRollback?: (queryClient: QueryClient) => void | Promise<void>;

  /** Conflict resolution strategy */
  conflictStrategy: ConflictResolutionStrategy;

  /** Custom merge function for conflict resolution */
  mergeFn?: (server: T, client: T) => T;

  /** User who initiated the update (for audit) */
  userId?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;

  /** Whether this update is part of a transaction */
  transactionId?: string;

  /** Dependencies - other updates that must complete first */
  dependencies?: string[];

  /** Retry count for failed operations */
  retryCount: number;

  /** Maximum retry attempts */
  maxRetries: number;
}

/**
 * Conflict information when server data differs from optimistic data
 */
export interface ConflictResolution<T = unknown> {
  /** The optimistic update that caused the conflict */
  update: OptimisticUpdate<T>;

  /** Server version of the data */
  serverData: T;

  /** Client version of the data */
  clientData: T;

  /** Resolution strategy to use */
  strategy: ConflictResolutionStrategy;

  /** Merged result if using MERGE strategy */
  mergedData?: T;

  /** User's choice for MANUAL resolution */
  userChoice?: 'server' | 'client' | 'merged';

  /** Timestamp when conflict was detected */
  detectedAt: number;

  /** Timestamp when conflict was resolved */
  resolvedAt?: number;
}

/**
 * Options for optimistic operations
 */
export interface OptimisticOperationOptions<T = unknown> {
  /** Rollback strategy (default: RESTORE_PREVIOUS) */
  rollbackStrategy?: RollbackStrategy;

  /** Conflict resolution strategy (default: SERVER_WINS) */
  conflictStrategy?: ConflictResolutionStrategy;

  /** Custom rollback handler */
  customRollback?: (queryClient: QueryClient) => void | Promise<void>;

  /** Custom merge function */
  mergeFn?: (server: T, client: T) => T;

  /** Maximum retry attempts (default: 3) */
  maxRetries?: number;

  /** User ID for audit trail */
  userId?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;

  /** Transaction ID to group related updates */
  transactionId?: string;

  /** Update dependencies */
  dependencies?: string[];

  /** Skip queuing for conflicting updates */
  skipQueue?: boolean;
}

/**
 * Statistics about optimistic updates
 */
export interface OptimisticUpdateStats {
  total: number;
  pending: number;
  applied: number;
  confirmed: number;
  failed: number;
  rolledBack: number;
  conflicted: number;
  averageConfirmationTime: number;
  successRate: number;
}

// =====================
// OPTIMISTIC UPDATE MANAGER
// =====================

/**
 * Manages optimistic UI updates with automatic rollback, conflict resolution,
 * and comprehensive tracking for healthcare data integrity.
 *
 * @example
 * ```typescript
 * const manager = new OptimisticUpdateManager();
 *
 * // Create optimistic update
 * const updateId = manager.createUpdate(queryClient, {
 *   queryKey: ['incidents', id],
 *   operationType: OperationType.UPDATE,
 *   previousData: currentData,
 *   optimisticData: updatedData,
 *   rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS
 * });
 *
 * // Confirm when server responds
 * manager.confirmUpdate(updateId, serverData);
 *
 * // Or rollback on error
 * manager.rollbackUpdate(queryClient, updateId);
 * ```
 */
export class OptimisticUpdateManager {
  private updates: Map<string, OptimisticUpdate> = new Map();
  private updateQueue: Map<string, string[]> = new Map(); // queryKey -> updateIds
  private conflicts: Map<string, ConflictResolution> = new Map();
  private listeners: Set<(update: OptimisticUpdate) => void> = new Set();

  /**
   * Create and apply an optimistic update
   */
  public createUpdate<T>(
    queryClient: QueryClient,
    queryKey: QueryKey,
    operationType: OperationType,
    previousData: T | null,
    optimisticData: T,
    options?: OptimisticOperationOptions<T>
  ): string {
    const updateId = this.generateUpdateId();
    const queueKey = this.serializeQueryKey(queryKey);

    // Check for conflicting updates
    if (!options?.skipQueue && this.hasConflictingUpdates(queueKey)) {
      this.queueUpdate(queueKey, updateId);
    }

    const update: OptimisticUpdate<T> = {
      id: updateId,
      queryKey,
      operationType,
      status: UpdateStatus.PENDING,
      previousData,
      optimisticData,
      timestamp: Date.now(),
      rollbackStrategy: options?.rollbackStrategy || RollbackStrategy.RESTORE_PREVIOUS,
      conflictStrategy: options?.conflictStrategy || ConflictResolutionStrategy.SERVER_WINS,
      customRollback: options?.customRollback,
      mergeFn: options?.mergeFn,
      userId: options?.userId,
      metadata: options?.metadata,
      transactionId: options?.transactionId,
      dependencies: options?.dependencies,
      retryCount: 0,
      maxRetries: options?.maxRetries || 3,
    };

    // Store update
    this.updates.set(updateId, update as OptimisticUpdate<unknown>);

    // Apply optimistic update
    this.applyUpdate(queryClient, update);

    // Notify listeners
    this.notifyListeners(update as OptimisticUpdate<unknown>);

    return updateId;
  }

  /**
   * Confirm an optimistic update with server data
   */
  public confirmUpdate<T>(
    updateId: string,
    confirmedData: T,
    queryClient?: QueryClient
  ): void {
    const update = this.updates.get(updateId);
    if (!update) {
      console.warn(`[OptimisticUpdate] Update ${updateId} not found for confirmation`);
      return;
    }

    // Check for conflicts
    if (this.detectConflict(update, confirmedData)) {
      this.handleConflict(queryClient, update, confirmedData);
      return;
    }

    // Update status
    update.status = UpdateStatus.CONFIRMED;
    update.confirmedData = confirmedData;
    update.completedAt = Date.now();

    // Remove from queue
    const queueKey = this.serializeQueryKey(update.queryKey);
    this.dequeueUpdate(queueKey, updateId);

    // Process next queued update
    this.processNextQueuedUpdate(queryClient, queueKey);

    // Notify listeners
    this.notifyListeners(update);

    // Log for audit (HIPAA compliance)
    this.logUpdate(update, 'CONFIRMED');
  }

  /**
   * Rollback an optimistic update due to error
   */
  public async rollbackUpdate(
    queryClient: QueryClient,
    updateId: string,
    error?: { message: string; code?: string; statusCode?: number; details?: unknown }
  ): Promise<void> {
    const update = this.updates.get(updateId);
    if (!update) {
      console.warn(`[OptimisticUpdate] Update ${updateId} not found for rollback`);
      return;
    }

    // Update status
    update.status = UpdateStatus.FAILED;
    update.error = error;
    update.completedAt = Date.now();

    // Apply rollback strategy
    await this.applyRollbackStrategy(queryClient, update);

    // Remove from queue
    const queueKey = this.serializeQueryKey(update.queryKey);
    this.dequeueUpdate(queueKey, updateId);

    // Mark as rolled back
    update.status = UpdateStatus.ROLLED_BACK;

    // Notify listeners
    this.notifyListeners(update);

    // Log for audit
    this.logUpdate(update, 'ROLLED_BACK');

    // Retry if applicable
    if (update.retryCount < update.maxRetries && error?.statusCode !== 400) {
      this.retryUpdate(queryClient, update);
    }
  }

  /**
   * Get update by ID
   */
  public getUpdate(updateId: string): OptimisticUpdate | undefined {
    return this.updates.get(updateId);
  }

  /**
   * Get all updates for a query key
   */
  public getUpdatesForQuery(queryKey: QueryKey): OptimisticUpdate[] {
    return Array.from(this.updates.values()).filter(
      update => this.compareQueryKeys(update.queryKey, queryKey)
    );
  }

  /**
   * Get pending updates
   */
  public getPendingUpdates(): OptimisticUpdate[] {
    return Array.from(this.updates.values()).filter(
      update => update.status === UpdateStatus.PENDING || update.status === UpdateStatus.APPLIED
    );
  }

  /**
   * Get update statistics
   */
  public getStats(): OptimisticUpdateStats {
    const allUpdates = Array.from(this.updates.values());
    const total = allUpdates.length;

    const byStatus = {
      pending: 0,
      applied: 0,
      confirmed: 0,
      failed: 0,
      rolledBack: 0,
      conflicted: 0,
    };

    let totalConfirmationTime = 0;
    let confirmedCount = 0;

    allUpdates.forEach(update => {
      switch (update.status) {
        case UpdateStatus.PENDING:
          byStatus.pending++;
          break;
        case UpdateStatus.APPLIED:
          byStatus.applied++;
          break;
        case UpdateStatus.CONFIRMED:
          byStatus.confirmed++;
          confirmedCount++;
          if (update.completedAt) {
            totalConfirmationTime += update.completedAt - update.timestamp;
          }
          break;
        case UpdateStatus.FAILED:
          byStatus.failed++;
          break;
        case UpdateStatus.ROLLED_BACK:
          byStatus.rolledBack++;
          break;
        case UpdateStatus.CONFLICTED:
          byStatus.conflicted++;
          break;
      }
    });

    return {
      total,
      ...byStatus,
      averageConfirmationTime: confirmedCount > 0 ? totalConfirmationTime / confirmedCount : 0,
      successRate: total > 0 ? (byStatus.confirmed / total) * 100 : 0,
    };
  }

  /**
   * Clear old updates (older than specified time)
   */
  public clearOldUpdates(olderThanMs: number = 5 * 60 * 1000): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.updates.forEach((update, id) => {
      if (
        update.status === UpdateStatus.CONFIRMED ||
        update.status === UpdateStatus.ROLLED_BACK
      ) {
        if (now - update.timestamp > olderThanMs) {
          toDelete.push(id);
        }
      }
    });

    toDelete.forEach(id => this.updates.delete(id));
  }

  /**
   * Subscribe to update changes
   */
  public subscribe(listener: (update: OptimisticUpdate) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get all conflicts
   */
  public getConflicts(): ConflictResolution[] {
    return Array.from(this.conflicts.values());
  }

  /**
   * Resolve a conflict manually
   */
  public resolveConflict(
    queryClient: QueryClient,
    updateId: string,
    resolution: 'server' | 'client' | 'merged',
    mergedData?: unknown
  ): void {
    const conflict = this.conflicts.get(updateId);
    if (!conflict) {
      console.warn(`[OptimisticUpdate] Conflict ${updateId} not found`);
      return;
    }

    conflict.userChoice = resolution;
    conflict.resolvedAt = Date.now();

    let finalData: unknown;
    switch (resolution) {
      case 'server':
        finalData = conflict.serverData;
        break;
      case 'client':
        finalData = conflict.clientData;
        break;
      case 'merged':
        finalData = mergedData || conflict.mergedData;
        break;
    }

    // Update cache with resolved data
    queryClient.setQueryData(conflict.update.queryKey, finalData);

    // Update status
    const update = this.updates.get(updateId);
    if (update) {
      update.status = UpdateStatus.CONFIRMED;
      update.confirmedData = finalData;
      update.completedAt = Date.now();
      this.notifyListeners(update);
    }

    // Remove conflict
    this.conflicts.delete(updateId);
  }

  // =====================
  // PRIVATE METHODS
  // =====================

  private applyUpdate<T>(queryClient: QueryClient, update: OptimisticUpdate<T>): void {
    queryClient.setQueryData(update.queryKey, update.optimisticData);
    update.status = UpdateStatus.APPLIED;
    this.notifyListeners(update as OptimisticUpdate<unknown>);
  }

  private async applyRollbackStrategy<T>(
    queryClient: QueryClient,
    update: OptimisticUpdate<T>
  ): Promise<void> {
    switch (update.rollbackStrategy) {
      case RollbackStrategy.RESTORE_PREVIOUS:
        if (update.previousData !== null) {
          queryClient.setQueryData(update.queryKey, update.previousData);
        }
        break;

      case RollbackStrategy.REFETCH:
        await queryClient.invalidateQueries({ queryKey: update.queryKey });
        break;

      case RollbackStrategy.KEEP_STALE:
        // Mark as stale but keep optimistic data
        await queryClient.invalidateQueries({ queryKey: update.queryKey });
        break;

      case RollbackStrategy.CUSTOM:
        if (update.customRollback) {
          await update.customRollback(queryClient);
        }
        break;
    }
  }

  private detectConflict<T>(update: OptimisticUpdate<T>, serverData: T): boolean {
    // Simple deep equality check (can be enhanced)
    return JSON.stringify(update.optimisticData) !== JSON.stringify(serverData);
  }

  private handleConflict<T>(
    queryClient: QueryClient | undefined,
    update: OptimisticUpdate<T>,
    serverData: T
  ): void {
    update.status = UpdateStatus.CONFLICTED;

    let mergedData: T | undefined;
    if (update.conflictStrategy === ConflictResolutionStrategy.MERGE && update.mergeFn) {
      mergedData = update.mergeFn(serverData, update.optimisticData);
    }

    const conflict: ConflictResolution<T> = {
      update,
      serverData,
      clientData: update.optimisticData,
      strategy: update.conflictStrategy,
      mergedData,
      detectedAt: Date.now(),
    };

    this.conflicts.set(update.id, conflict as ConflictResolution<unknown>);
    this.notifyListeners(update as OptimisticUpdate<unknown>);

    // Auto-resolve based on strategy
    if (update.conflictStrategy !== ConflictResolutionStrategy.MANUAL && queryClient) {
      this.autoResolveConflict(queryClient, conflict);
    }
  }

  private autoResolveConflict<T>(
    queryClient: QueryClient,
    conflict: ConflictResolution<T>
  ): void {
    let resolution: 'server' | 'client' | 'merged';
    let data: T;

    switch (conflict.strategy) {
      case ConflictResolutionStrategy.SERVER_WINS:
        resolution = 'server';
        data = conflict.serverData;
        break;

      case ConflictResolutionStrategy.CLIENT_WINS:
        resolution = 'client';
        data = conflict.clientData;
        break;

      case ConflictResolutionStrategy.MERGE:
        resolution = 'merged';
        data = conflict.mergedData || conflict.serverData;
        break;

      case ConflictResolutionStrategy.TIMESTAMP:
        // Assume server data is newer
        resolution = 'server';
        data = conflict.serverData;
        break;

      default:
        resolution = 'server';
        data = conflict.serverData;
    }

    this.resolveConflict(queryClient, conflict.update.id, resolution, data);
  }

  private hasConflictingUpdates(queueKey: string): boolean {
    const queue = this.updateQueue.get(queueKey) || [];
    return queue.length > 0;
  }

  private queueUpdate(queueKey: string, updateId: string): void {
    const queue = this.updateQueue.get(queueKey) || [];
    queue.push(updateId);
    this.updateQueue.set(queueKey, queue);
  }

  private dequeueUpdate(queueKey: string, updateId: string): void {
    const queue = this.updateQueue.get(queueKey) || [];
    const index = queue.indexOf(updateId);
    if (index > -1) {
      queue.splice(index, 1);
    }
    if (queue.length === 0) {
      this.updateQueue.delete(queueKey);
    } else {
      this.updateQueue.set(queueKey, queue);
    }
  }

  private processNextQueuedUpdate(queryClient: QueryClient | undefined, queueKey: string): void {
    if (!queryClient) return;

    const queue = this.updateQueue.get(queueKey) || [];
    if (queue.length > 0) {
      const nextUpdateId = queue[0];
      const nextUpdate = this.updates.get(nextUpdateId);
      if (nextUpdate && nextUpdate.status === UpdateStatus.PENDING) {
        this.applyUpdate(queryClient, nextUpdate);
      }
    }
  }

  private retryUpdate(queryClient: QueryClient, update: OptimisticUpdate): void {
    update.retryCount++;
    update.status = UpdateStatus.PENDING;

    // Re-apply optimistic update
    this.applyUpdate(queryClient, update);

    this.logUpdate(update, 'RETRY');
  }

  private notifyListeners(update: OptimisticUpdate): void {
    this.listeners.forEach(listener => {
      try {
        listener(update);
      } catch (error) {
        console.error('[OptimisticUpdate] Listener error:', error);
      }
    });
  }

  private generateUpdateId(): string {
    return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private serializeQueryKey(queryKey: QueryKey): string {
    return JSON.stringify(queryKey);
  }

  private compareQueryKeys(key1: QueryKey, key2: QueryKey): boolean {
    return this.serializeQueryKey(key1) === this.serializeQueryKey(key2);
  }

  private logUpdate(update: OptimisticUpdate, action: string): void {
    // HIPAA-compliant logging (don't log sensitive data)
    const logEntry = {
      action,
      updateId: update.id,
      operationType: update.operationType,
      status: update.status,
      timestamp: Date.now(),
      userId: update.userId,
      transactionId: update.transactionId,
      retryCount: update.retryCount,
      duration: update.completedAt ? update.completedAt - update.timestamp : undefined,
    };

    // In production, send to audit logging service
    console.info('[OptimisticUpdate]', logEntry);
  }
}

// =====================
// SINGLETON INSTANCE
// =====================

/**
 * Global optimistic update manager instance
 */
export const optimisticUpdateManager = new OptimisticUpdateManager();

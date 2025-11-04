/**
 * WF-COMP-346 | optimisticHelpers.transactions.ts - Transaction and rollback support
 * Purpose: Transaction management and update confirmation/rollback
 * Upstream: @tanstack/react-query, @/types/common, ./optimisticUpdates
 * Downstream: Components, mutation hooks
 * Related: optimisticUpdates, optimisticHelpers.mutations
 * Exports: transaction and rollback functions
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Confirming or rolling back optimistic updates
 * LLM Context: Transaction management for coordinating multiple optimistic updates
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import { BaseEntity } from '@/types/common';
import { optimisticUpdateManager } from './optimisticUpdates';

// =====================
// ROLLBACK UTILITIES
// =====================

/**
 * Rollback an optimistic update
 *
 * Reverts an optimistic update by restoring the previous query data.
 * Call this when a mutation fails to undo the optimistic changes.
 *
 * @param queryClient - TanStack Query client
 * @param updateId - ID of the update to rollback
 * @param error - Optional error information
 * @returns Promise that resolves when rollback is complete
 *
 * @example
 * ```typescript
 * try {
 *   await apiCall();
 * } catch (error) {
 *   await rollbackUpdate(queryClient, updateId, {
 *     message: error.message,
 *     statusCode: 500
 *   });
 * }
 * ```
 */
export function rollbackUpdate(
  queryClient: QueryClient,
  updateId: string,
  error?: { message: string; code?: string; statusCode?: number }
): Promise<void> {
  return optimisticUpdateManager.rollbackUpdate(queryClient, updateId, error);
}

/**
 * Confirm an optimistic update with server data
 *
 * Confirms an optimistic update by replacing the optimistic data with
 * the real server response. Call this when a mutation succeeds.
 *
 * @param updateId - ID of the update to confirm
 * @param confirmedData - Real data from server
 * @param queryClient - Optional query client for cache updates
 *
 * @example
 * ```typescript
 * const serverData = await apiCall();
 * confirmUpdate(updateId, serverData, queryClient);
 * ```
 */
export function confirmUpdate<T>(
  updateId: string,
  confirmedData: T,
  queryClient?: QueryClient
): void {
  optimisticUpdateManager.confirmUpdate(updateId, confirmedData, queryClient);
}

/**
 * Replace temporary ID with real server ID after create confirmation
 *
 * Special confirmation handler for create operations that replaces the
 * temporary ID with the real server ID throughout the cache.
 *
 * @param queryClient - TanStack Query client
 * @param queryKey - Base query key for the entity type
 * @param updateId - ID of the optimistic update
 * @param tempId - Temporary ID that was generated
 * @param serverEntity - Real entity data from server with real ID
 *
 * @example
 * ```typescript
 * const { updateId, tempId } = optimisticCreate(...);
 * const serverEntity = await createApi();
 * confirmCreate(queryClient, ['incidents'], updateId, tempId, serverEntity);
 * ```
 */
export function confirmCreate<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  updateId: string,
  tempId: string,
  serverEntity: T
): void {
  // Update the entity in list with real ID
  const listQueryKey = Array.isArray(queryKey[0]) ? queryKey : [queryKey[0], 'list'];
  const listData = queryClient.getQueryData<{ data: T[] }>(listQueryKey);

  if (listData?.data) {
    const updatedData = {
      ...listData,
      data: listData.data.map(item =>
        item.id === tempId ? serverEntity : item
      ),
    };
    queryClient.setQueryData(listQueryKey, updatedData);
  }

  // Create entry with real ID
  const detailQueryKey = [...(Array.isArray(queryKey[0]) ? queryKey : [queryKey[0]]), 'detail', serverEntity.id];
  queryClient.setQueryData(detailQueryKey, serverEntity);

  // Confirm the update
  confirmUpdate(updateId, serverEntity, queryClient);
}

// =====================
// TRANSACTION SUPPORT
// =====================

/**
 * Begin a transaction for multiple related updates
 *
 * Creates a transaction ID that can be used to group multiple optimistic
 * updates together. All updates in a transaction can be committed or
 * rolled back as a single unit.
 *
 * @returns Transaction ID to use for related updates
 *
 * @example
 * ```typescript
 * const txnId = beginTransaction();
 * optimisticUpdate(queryClient, ['tasks'], 'task-1', { status: 'DONE' }, {
 *   metadata: { transactionId: txnId }
 * });
 * optimisticUpdate(queryClient, ['tasks'], 'task-2', { status: 'DONE' }, {
 *   metadata: { transactionId: txnId }
 * });
 * await commitTransaction(txnId, queryClient);
 * ```
 */
export function beginTransaction(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Commit a transaction (confirm all updates)
 *
 * Confirms all optimistic updates that are part of the specified transaction.
 * Call this when all related mutations in a transaction succeed.
 *
 * @param transactionId - ID of the transaction to commit
 * @param queryClient - Optional query client for cache updates
 *
 * @example
 * ```typescript
 * const txnId = beginTransaction();
 * // ... perform multiple optimistic updates with txnId ...
 * await commitTransaction(txnId, queryClient);
 * ```
 */
export function commitTransaction(
  transactionId: string,
  queryClient?: QueryClient
): void {
  const updates = optimisticUpdateManager
    .getPendingUpdates()
    .filter(update => update.transactionId === transactionId);

  updates.forEach(update => {
    optimisticUpdateManager.confirmUpdate(update.id, update.optimisticData, queryClient);
  });
}

/**
 * Rollback a transaction (rollback all updates)
 *
 * Rolls back all optimistic updates that are part of the specified transaction.
 * Call this when any mutation in a transaction fails to undo all changes.
 *
 * @param queryClient - TanStack Query client
 * @param transactionId - ID of the transaction to rollback
 * @returns Promise that resolves when all rollbacks are complete
 *
 * @example
 * ```typescript
 * const txnId = beginTransaction();
 * // ... perform multiple optimistic updates with txnId ...
 * try {
 *   await performAllMutations();
 * } catch (error) {
 *   await rollbackTransaction(queryClient, txnId);
 * }
 * ```
 */
export async function rollbackTransaction(
  queryClient: QueryClient,
  transactionId: string
): Promise<void> {
  const updates = optimisticUpdateManager
    .getPendingUpdates()
    .filter(update => update.transactionId === transactionId);

  await Promise.all(
    updates.map(update =>
      optimisticUpdateManager.rollbackUpdate(queryClient, update.id)
    )
  );
}

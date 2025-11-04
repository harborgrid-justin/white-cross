/**
 * WF-COMP-346 | optimisticHelpers.bulk.ts - Bulk operations
 * Purpose: Bulk create and delete operations for optimistic updates
 * Upstream: @tanstack/react-query, @/types/common, ./optimisticUpdates, ./optimisticHelpers.utils
 * Downstream: Components, pages, mutation hooks
 * Related: optimisticHelpers.mutations, optimisticHelpers.types
 * Exports: Bulk operation functions
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Bulk entity operations with optimistic updates
 * LLM Context: Bulk create and delete operations for multiple entities at once
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import { BaseEntity } from '@/types/common';
import {
  OptimisticUpdateManager,
  OperationType,
  OptimisticOperationOptions,
  optimisticUpdateManager,
} from './optimisticUpdates';
import { generateTempId } from './optimisticHelpers.utils';
import { OptimisticBulkCreateResult } from './optimisticHelpers.types';

// =====================
// BULK OPERATIONS
// =====================

/**
 * Optimistically create multiple entities
 *
 * Creates multiple temporary entities and adds them to the query cache.
 * Each entity gets a unique temporary ID. Use the returned tempIdMap to
 * track which temp IDs map to which real server IDs after confirmation.
 *
 * @param queryClient - TanStack Query client
 * @param queryKey - Query key for the entity list
 * @param entities - Array of entity data without ids/timestamps
 * @param options - Optional operation configuration
 * @returns Object with updateId, tempEntities array, and tempIdMap
 *
 * @example
 * ```typescript
 * const { updateId, tempEntities, tempIdMap } = optimisticBulkCreate(
 *   queryClient,
 *   ['tasks'],
 *   [
 *     { title: 'Task 1', status: 'TODO' },
 *     { title: 'Task 2', status: 'TODO' }
 *   ]
 * );
 * ```
 */
export function optimisticBulkCreate<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entities: Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
  options?: OptimisticOperationOptions<T[]>
): OptimisticBulkCreateResult<T> {
  const manager = options?.metadata?.manager as OptimisticUpdateManager || optimisticUpdateManager;

  // Generate temporary IDs and entities
  const now = new Date().toISOString();
  const tempIdMap = new Map<string, string>();
  const tempEntities: T[] = entities.map((entity, index) => {
    const tempId = generateTempId(`temp_bulk_${index}`);
    const tempEntity: T = {
      ...entity,
      id: tempId,
      createdAt: now,
      updatedAt: now,
    } as T;
    tempIdMap.set(tempId, ''); // Will be updated with real ID later
    return tempEntity;
  });

  // Get current list data
  const listQueryKey = Array.isArray(queryKey[0]) ? queryKey : [queryKey[0], 'list'];
  const previousData = queryClient.getQueryData<{ data: T[] }>(listQueryKey);

  // Create optimistic data
  const optimisticData = previousData
    ? { ...previousData, data: [...tempEntities, ...previousData.data] }
    : { data: tempEntities };

  // Create optimistic update
  const updateId = manager.createUpdate(
    queryClient,
    listQueryKey,
    OperationType.BULK_CREATE,
    previousData || null,
    optimisticData,
    (options as unknown) as OptimisticOperationOptions<{ data: T[] }>
  );

  return { updateId, tempEntities, tempIdMap };
}

/**
 * Optimistically delete multiple entities
 *
 * Removes multiple entities from both detail and list caches. The entities
 * are immediately hidden from the UI while the server request is pending.
 *
 * @param queryClient - TanStack Query client
 * @param queryKey - Base query key for the entity type
 * @param entityIds - Array of entity IDs to delete
 * @param options - Optional operation configuration
 * @returns Update ID if list data found, null otherwise
 *
 * @example
 * ```typescript
 * const updateId = optimisticBulkDelete(
 *   queryClient,
 *   ['tasks'],
 *   ['task-1', 'task-2', 'task-3']
 * );
 * ```
 */
export function optimisticBulkDelete<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entityIds: string[],
  options?: OptimisticOperationOptions<T[]>
): string | null {
  const manager = options?.metadata?.manager as OptimisticUpdateManager || optimisticUpdateManager;

  // Get current list data
  const listQueryKey = Array.isArray(queryKey[0]) ? queryKey : [queryKey[0], 'list'];
  const previousData = queryClient.getQueryData<{ data: T[] }>(listQueryKey);

  if (!previousData || !previousData.data) {
    return null;
  }

  // Create optimistic data without deleted entities
  const optimisticData = {
    ...previousData,
    data: previousData.data.filter(item => !entityIds.includes(item.id)),
  };

  // Create optimistic update
  const updateId = manager.createUpdate(
    queryClient,
    listQueryKey,
    OperationType.BULK_DELETE,
    previousData,
    optimisticData,
    (options as unknown) as OptimisticOperationOptions<{ data: T[] }>
  );

  // Remove from cache
  entityIds.forEach(id => {
    const detailQueryKey = [...(Array.isArray(queryKey[0]) ? queryKey : [queryKey[0]]), 'detail', id];
    queryClient.removeQueries({ queryKey: detailQueryKey } as any);
  });

  return updateId;
}

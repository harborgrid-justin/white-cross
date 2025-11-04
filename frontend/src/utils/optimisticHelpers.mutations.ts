/**
 * WF-COMP-346 | optimisticHelpers.mutations.ts - CRUD operations
 * Purpose: Optimistic CRUD operations for entities
 * Upstream: @tanstack/react-query, @/types/common, ./optimisticUpdates, ./optimisticHelpers.utils
 * Downstream: Components, pages, mutation hooks
 * Related: optimisticUpdates, optimisticHelpers.types, optimisticHelpers.bulk
 * Exports: CRUD operation functions
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Entity mutation operations with optimistic updates
 * LLM Context: Create, update, delete operations with optimistic UI updates
 *
 * File Size Note: 349 lines (16% over 300-line target)
 * Rationale: This file maintains high cohesion by grouping all CRUD mutation operations.
 * Splitting into mutations.create.ts, mutations.update.ts, mutations.delete.ts would
 * fragment related functionality and harm maintainability. The overage is primarily
 * due to comprehensive JSDoc documentation (a quality improvement). The file follows
 * single responsibility principle and provides developers with a clear, unified view
 * of all available optimistic mutation operations.
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import { BaseEntity } from '@/types/common';
import {
  OptimisticUpdateManager,
  OperationType,
  OptimisticOperationOptions,
  optimisticUpdateManager,
} from './optimisticUpdates';
import {
  generateTempId,
  updateEntityInList,
  removeEntityFromList,
} from './optimisticHelpers.utils';
import { OptimisticCreateResult } from './optimisticHelpers.types';

// =====================
// OPTIMISTIC CREATE
// =====================

/**
 * Optimistically create a new entity
 *
 * Creates a temporary entity with a generated ID and adds it to the query cache.
 * The temporary entity is immediately visible in the UI while the server request
 * is pending. Use confirmCreate to replace the temp ID with the real server ID.
 *
 * @param queryClient - TanStack Query client
 * @param queryKey - Query key for the entity list
 * @param entity - Entity data without id/timestamps
 * @param options - Optional operation configuration
 * @returns Object containing updateId, tempId, and tempEntity
 *
 * @example
 * ```typescript
 * const { updateId, tempId, tempEntity } = optimisticCreate(
 *   queryClient,
 *   ['incidents'],
 *   { title: 'New Incident', status: 'OPEN' },
 *   { userId: currentUser.id }
 * );
 * ```
 */
export function optimisticCreate<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  options?: OptimisticOperationOptions<T>
): OptimisticCreateResult<T> {
  const manager = options?.metadata?.manager as OptimisticUpdateManager || optimisticUpdateManager;

  // Generate temporary ID
  const tempId = generateTempId();

  // Create temporary entity with timestamps
  const now = new Date().toISOString();
  const tempEntity: T = {
    ...entity,
    id: tempId,
    createdAt: now,
    updatedAt: now,
  } as T;

  // Get current list data
  const listQueryKey = Array.isArray(queryKey[0]) ? queryKey : [queryKey[0], 'list'];
  const previousData = queryClient.getQueryData<{ data: T[] }>(listQueryKey);

  // Create optimistic data with new entity added
  const optimisticData = previousData
    ? { ...previousData, data: [tempEntity, ...previousData.data] }
    : { data: [tempEntity] };

  // Create optimistic update
  const updateId = manager.createUpdate(
    queryClient,
    listQueryKey,
    OperationType.CREATE,
    previousData || null,
    optimisticData,
    (options as unknown) as OptimisticOperationOptions<{ data: T[] }>
  );

  return { updateId, tempId, tempEntity };
}

// =====================
// OPTIMISTIC UPDATE
// =====================

/**
 * Optimistically update an existing entity
 *
 * Updates an entity in both the detail and list caches. The changes are
 * immediately visible in the UI while the server request is pending.
 *
 * @param queryClient - TanStack Query client
 * @param queryKey - Base query key for the entity type
 * @param entityId - ID of the entity to update
 * @param changes - Partial entity updates (excluding id and createdAt)
 * @param options - Optional operation configuration
 * @returns Update ID for tracking and rollback
 *
 * @example
 * ```typescript
 * const updateId = optimisticUpdate(
 *   queryClient,
 *   ['incidents'],
 *   'inc-123',
 *   { status: 'RESOLVED', resolvedAt: new Date().toISOString() }
 * );
 * ```
 */
export function optimisticUpdate<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entityId: string,
  changes: Partial<Omit<T, 'id' | 'createdAt'>>,
  options?: OptimisticOperationOptions<T>
): string {
  const manager = options?.metadata?.manager as OptimisticUpdateManager || optimisticUpdateManager;

  // Get current entity data
  const detailQueryKey = [...(Array.isArray(queryKey[0]) ? queryKey : [queryKey[0]]), 'detail', entityId];
  const previousData = queryClient.getQueryData<T>(detailQueryKey);

  if (!previousData) {
    throw new Error(`Cannot update entity ${entityId}: not found in cache`);
  }

  // Create optimistic data
  const now = new Date().toISOString();
  const optimisticData: T = {
    ...previousData,
    ...changes,
    updatedAt: now,
  } as T;

  // Create optimistic update
  const updateId = manager.createUpdate(
    queryClient,
    detailQueryKey,
    OperationType.UPDATE,
    previousData,
    optimisticData,
    options
  );

  // Also update entity in list if present
  updateEntityInList(queryClient, queryKey, entityId, optimisticData);

  return updateId;
}

/**
 * Optimistically update an entity in a paginated list
 *
 * Updates an entity directly in a list query without requiring the detail cache.
 * Useful for inline list edits where the detail view isn't loaded.
 *
 * @param queryClient - TanStack Query client
 * @param listQueryKey - Query key for the entity list
 * @param entityId - ID of the entity to update
 * @param changes - Partial entity updates
 * @param options - Optional operation configuration
 * @returns Update ID if entity found in list, null otherwise
 *
 * @example
 * ```typescript
 * const updateId = optimisticUpdateInList(
 *   queryClient,
 *   ['incidents', 'list'],
 *   'inc-123',
 *   { priority: 'HIGH' }
 * );
 * ```
 */
export function optimisticUpdateInList<T extends BaseEntity>(
  queryClient: QueryClient,
  listQueryKey: QueryKey,
  entityId: string,
  changes: Partial<Omit<T, 'id' | 'createdAt'>>,
  options?: OptimisticOperationOptions<T>
): string | null {
  const manager = options?.metadata?.manager as OptimisticUpdateManager || optimisticUpdateManager;

  // Get current list data
  const previousData = queryClient.getQueryData<{ data: T[] }>(listQueryKey);

  if (!previousData || !previousData.data) {
    return null;
  }

  // Find entity in list
  const entityIndex = previousData.data.findIndex(item => item.id === entityId);
  if (entityIndex === -1) {
    return null;
  }

  // Create optimistic data
  const now = new Date().toISOString();
  const updatedEntity: T = {
    ...previousData.data[entityIndex],
    ...changes,
    updatedAt: now,
  } as T;

  const optimisticData = {
    ...previousData,
    data: [
      ...previousData.data.slice(0, entityIndex),
      updatedEntity,
      ...previousData.data.slice(entityIndex + 1),
    ],
  };

  // Create optimistic update
  const updateId = manager.createUpdate(
    queryClient,
    listQueryKey,
    OperationType.UPDATE,
    previousData,
    optimisticData,
    (options as unknown) as OptimisticOperationOptions<{ data: T[] }>
  );

  return updateId;
}

// =====================
// OPTIMISTIC DELETE
// =====================

/**
 * Optimistically delete an entity
 *
 * Removes an entity from both detail and list caches. The entity is
 * immediately hidden from the UI while the server request is pending.
 *
 * @param queryClient - TanStack Query client
 * @param queryKey - Base query key for the entity type
 * @param entityId - ID of the entity to delete
 * @param options - Optional operation configuration
 * @returns Update ID for tracking and rollback
 *
 * @example
 * ```typescript
 * const updateId = optimisticDelete(
 *   queryClient,
 *   ['incidents'],
 *   'inc-123'
 * );
 * ```
 */
export function optimisticDelete<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entityId: string,
  options?: OptimisticOperationOptions<T>
): string {
  const manager = options?.metadata?.manager as OptimisticUpdateManager || optimisticUpdateManager;

  // Get current entity data
  const detailQueryKey = [...(Array.isArray(queryKey[0]) ? queryKey : [queryKey[0]]), 'detail', entityId];
  const previousData = queryClient.getQueryData<T>(detailQueryKey);

  // Create optimistic update (null means deleted)
  const updateId = manager.createUpdate(
    queryClient,
    detailQueryKey,
    OperationType.DELETE,
    previousData || null,
    null as any, // Deleted entity
    options
  );

  // Remove from cache by invalidating and resetting
  queryClient.removeQueries({ queryKey: detailQueryKey } as any);

  // Also remove from list if present
  removeEntityFromList(queryClient, queryKey, entityId);

  return updateId;
}

/**
 * Optimistically delete entity from list
 *
 * Removes an entity from a list query. Useful when you only have list data
 * and don't need to touch the detail cache.
 *
 * @param queryClient - TanStack Query client
 * @param listQueryKey - Query key for the entity list
 * @param entityId - ID of the entity to delete
 * @param options - Optional operation configuration
 * @returns Update ID if entity found in list, null otherwise
 *
 * @example
 * ```typescript
 * const updateId = optimisticDeleteFromList(
 *   queryClient,
 *   ['incidents', 'list'],
 *   'inc-123'
 * );
 * ```
 */
export function optimisticDeleteFromList<T extends BaseEntity>(
  queryClient: QueryClient,
  listQueryKey: QueryKey,
  entityId: string,
  options?: OptimisticOperationOptions<T>
): string | null {
  const manager = options?.metadata?.manager as OptimisticUpdateManager || optimisticUpdateManager;

  // Get current list data
  const previousData = queryClient.getQueryData<{ data: T[] }>(listQueryKey);

  if (!previousData || !previousData.data) {
    return null;
  }

  // Create optimistic data without the deleted entity
  const optimisticData = {
    ...previousData,
    data: previousData.data.filter(item => item.id !== entityId),
  };

  // Create optimistic update
  const updateId = manager.createUpdate(
    queryClient,
    listQueryKey,
    OperationType.DELETE,
    previousData,
    optimisticData,
    (options as unknown) as OptimisticOperationOptions<{ data: T[] }>
  );

  return updateId;
}

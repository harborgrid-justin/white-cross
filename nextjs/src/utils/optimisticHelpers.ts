/**
 * WF-COMP-346 | optimisticHelpers.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./optimisticUpdates | Dependencies: @tanstack/react-query, @/types/common, ./optimisticUpdates
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Optimistic Update Helper Functions
 *
 * Utility functions for common optimistic update patterns with TanStack Query.
 * Provides simple, type-safe functions for create, update, and delete operations.
 *
 * @module OptimisticHelpers
 * @version 1.0.0
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import { BaseEntity } from '@/types/common';
import {
  OptimisticUpdateManager,
  OperationType,
  OptimisticOperationOptions,
  optimisticUpdateManager,
} from './optimisticUpdates';

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Generate a temporary ID for optimistic creates
 * Uses a predictable prefix to identify temp IDs
 */
export function generateTempId(prefix: string = 'temp'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an ID is a temporary ID
 */
export function isTempId(id: string): boolean {
  return id.startsWith('temp_');
}

/**
 * Replace temp ID with real ID in data structure
 */
export function replaceTempId<T extends BaseEntity>(
  data: T,
  tempId: string,
  realId: string
): T {
  if (data.id === tempId) {
    return { ...data, id: realId };
  }
  return data;
}

/**
 * Replace temp IDs in array of entities
 */
export function replaceTempIdsInArray<T extends BaseEntity>(
  items: T[],
  tempId: string,
  realId: string
): T[] {
  return items.map(item => replaceTempId(item, tempId, realId));
}

// =====================
// OPTIMISTIC CREATE
// =====================

/**
 * Optimistically create a new entity
 *
 * @example
 * ```typescript
 * const tempId = optimisticCreate(
 *   queryClient,
 *   ['incidents'],
 *   newIncident,
 *   { userId: currentUser.id }
 * );
 * ```
 */
export function optimisticCreate<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  options?: OptimisticOperationOptions<T>
): { updateId: string; tempId: string; tempEntity: T } {
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
 * @example
 * ```typescript
 * const updateId = optimisticUpdate(
 *   queryClient,
 *   ['incidents', incidentId],
 *   { status: 'RESOLVED' }
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
 * @example
 * ```typescript
 * const updateId = optimisticDelete(
 *   queryClient,
 *   ['incidents'],
 *   incidentId
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

  // Remove from cache
  queryClient.removeQueries({ queryKey: detailQueryKey });

  // Also remove from list if present
  removeEntityFromList(queryClient, queryKey, entityId);

  return updateId;
}

/**
 * Optimistically delete entity from list
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

// =====================
// BULK OPERATIONS
// =====================

/**
 * Optimistically create multiple entities
 */
export function optimisticBulkCreate<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entities: Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
  options?: OptimisticOperationOptions<T[]>
): { updateId: string; tempEntities: T[]; tempIdMap: Map<string, string> } {
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
    queryClient.removeQueries({ queryKey: detailQueryKey });
  });

  return updateId;
}

// =====================
// ROLLBACK UTILITIES
// =====================

/**
 * Rollback an optimistic update
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
// CACHE UTILITIES
// =====================

/**
 * Update entity in list cache
 */
function updateEntityInList<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entityId: string,
  updatedEntity: T
): void {
  const listQueryKey = Array.isArray(queryKey[0]) ? queryKey : [queryKey[0], 'list'];
  const listData = queryClient.getQueryData<{ data: T[] }>(listQueryKey);

  if (listData?.data) {
    const entityIndex = listData.data.findIndex(item => item.id === entityId);
    if (entityIndex > -1) {
      const updatedData = {
        ...listData,
        data: [
          ...listData.data.slice(0, entityIndex),
          updatedEntity,
          ...listData.data.slice(entityIndex + 1),
        ],
      };
      queryClient.setQueryData(listQueryKey, updatedData);
    }
  }
}

/**
 * Remove entity from list cache
 */
function removeEntityFromList<T extends BaseEntity>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entityId: string
): void {
  const listQueryKey = Array.isArray(queryKey[0]) ? queryKey : [queryKey[0], 'list'];
  const listData = queryClient.getQueryData<{ data: T[] }>(listQueryKey);

  if (listData?.data) {
    const updatedData = {
      ...listData,
      data: listData.data.filter(item => item.id !== entityId),
    };
    queryClient.setQueryData(listQueryKey, updatedData);
  }
}

// =====================
// TRANSACTION SUPPORT
// =====================

/**
 * Begin a transaction for multiple related updates
 */
export function beginTransaction(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Commit a transaction (confirm all updates)
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

// =====================
// MERGE UTILITIES
// =====================

/**
 * Default merge function for conflict resolution
 * Merges server and client data, preferring server for conflicts
 */
export function defaultMergeFn<T extends BaseEntity>(server: T, client: T): T {
  return {
    ...client,
    ...server,
    // Keep client's updatedAt if newer
    updatedAt: new Date(client.updatedAt) > new Date(server.updatedAt)
      ? client.updatedAt
      : server.updatedAt,
  };
}

/**
 * Deep merge function for complex objects
 */
export function deepMergeFn<T extends BaseEntity>(server: T, client: T): T {
  const merged = { ...client };

  Object.keys(server).forEach(key => {
    const serverValue = (server as any)[key];
    const clientValue = (client as any)[key];

    if (serverValue === null || serverValue === undefined) {
      return;
    }

    if (typeof serverValue === 'object' && !Array.isArray(serverValue)) {
      (merged as any)[key] = { ...clientValue, ...serverValue };
    } else {
      (merged as any)[key] = serverValue;
    }
  });

  return merged;
}

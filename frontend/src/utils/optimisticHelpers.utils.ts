/**
 * WF-COMP-346 | optimisticHelpers.utils.ts - Utility functions
 * Purpose: Utility functions for optimistic updates (temp IDs, cache, merge)
 * Upstream: @tanstack/react-query, @/types/common
 * Downstream: optimisticHelpers.mutations, optimisticHelpers.transactions
 * Related: optimisticUpdates
 * Exports: utility functions
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Support functions for optimistic update operations
 * LLM Context: Utility functions for temp ID management, cache updates, and data merging
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import { BaseEntity } from '@/types/common';

// =====================
// TEMP ID UTILITIES
// =====================

/**
 * Generate a temporary ID for optimistic creates
 * Uses a predictable prefix to identify temp IDs
 *
 * @param prefix - Prefix for the temp ID (default: 'temp')
 * @returns A unique temporary ID string
 *
 * @example
 * ```typescript
 * const tempId = generateTempId(); // "temp_1699123456789_abc123def"
 * const bulkTempId = generateTempId('temp_bulk_0'); // "temp_bulk_0_1699123456789_abc123def"
 * ```
 */
export function generateTempId(prefix: string = 'temp'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an ID is a temporary ID
 *
 * @param id - The ID to check
 * @returns True if the ID starts with 'temp_'
 *
 * @example
 * ```typescript
 * isTempId('temp_1699123456789_abc123def'); // true
 * isTempId('real-uuid-12345'); // false
 * ```
 */
export function isTempId(id: string): boolean {
  return id.startsWith('temp_');
}

/**
 * Replace temp ID with real ID in data structure
 *
 * @param data - The entity to check
 * @param tempId - The temporary ID to replace
 * @param realId - The real server ID
 * @returns Updated entity with real ID if matched, otherwise unchanged
 *
 * @example
 * ```typescript
 * const entity = { id: 'temp_123', name: 'Test' };
 * const updated = replaceTempId(entity, 'temp_123', 'real-456');
 * // updated = { id: 'real-456', name: 'Test' }
 * ```
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
 *
 * @param items - Array of entities
 * @param tempId - The temporary ID to replace
 * @param realId - The real server ID
 * @returns Array with updated entity if found
 *
 * @example
 * ```typescript
 * const items = [
 *   { id: 'temp_123', name: 'Test' },
 *   { id: 'real-456', name: 'Other' }
 * ];
 * const updated = replaceTempIdsInArray(items, 'temp_123', 'real-789');
 * // First item will have id: 'real-789'
 * ```
 */
export function replaceTempIdsInArray<T extends BaseEntity>(
  items: T[],
  tempId: string,
  realId: string
): T[] {
  return items.map(item => replaceTempId(item, tempId, realId));
}

// =====================
// CACHE UTILITIES
// =====================

/**
 * Update entity in list cache
 * Used internally to keep list views in sync with entity updates
 *
 * @param queryClient - TanStack Query client
 * @param queryKey - Base query key for the entity type
 * @param entityId - ID of the entity to update
 * @param updatedEntity - The updated entity data
 *
 * @example
 * ```typescript
 * updateEntityInList(queryClient, ['incidents'], 'inc-123', updatedIncident);
 * ```
 */
export function updateEntityInList<T extends BaseEntity>(
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
 * Used internally to keep list views in sync with entity deletions
 *
 * @param queryClient - TanStack Query client
 * @param queryKey - Base query key for the entity type
 * @param entityId - ID of the entity to remove
 *
 * @example
 * ```typescript
 * removeEntityFromList(queryClient, ['incidents'], 'inc-123');
 * ```
 */
export function removeEntityFromList<T extends BaseEntity>(
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
// MERGE UTILITIES
// =====================

/**
 * Default merge function for conflict resolution
 * Merges server and client data, preferring server for conflicts
 *
 * @param server - Server version of the entity
 * @param client - Client version of the entity
 * @returns Merged entity with server data preferred
 *
 * @example
 * ```typescript
 * const merged = defaultMergeFn(serverData, clientData);
 * // Server fields override client fields, except updatedAt uses newer timestamp
 * ```
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
 * Performs a deep merge of server and client data
 *
 * @param server - Server version of the entity
 * @param client - Client version of the entity
 * @returns Deep merged entity with server data preferred
 *
 * @example
 * ```typescript
 * const merged = deepMergeFn(serverData, clientData);
 * // Nested objects are merged recursively
 * ```
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

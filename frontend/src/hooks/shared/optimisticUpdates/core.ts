/**
 * Core Optimistic Update Functions
 *
 * Core utilities for optimistic updates with automatic rollback on error.
 * Includes single item updates, list operations, and multi-query updates.
 *
 * @module hooks/shared/optimisticUpdates/core
 */

import { QueryClient } from '@tanstack/react-query';
import { OptimisticContext } from './types';

/**
 * Create an optimistic update for a single item
 *
 * @example
 * ```typescript
 * onMutate: async (variables) => {
 *   return createOptimisticUpdate(
 *     queryClient,
 *     ['students', variables.id],
 *     (old) => ({ ...old, ...variables })
 *   );
 * }
 * ```
 */
export const createOptimisticUpdate = async <T>(
  queryClient: QueryClient,
  queryKey: any[],
  updater: (old: T | undefined) => T
): Promise<OptimisticContext<T>> => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey });

  // Snapshot previous value
  const previousData = queryClient.getQueryData<T>(queryKey);

  // Optimistically update
  queryClient.setQueryData<T>(queryKey, updater);

  // Return context for rollback
  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create an optimistic update for a list (add item)
 */
export const createOptimisticListAdd = async <T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: any[],
  newItem: T
): Promise<OptimisticContext<T[]>> => {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T[]>(queryKey);

  queryClient.setQueryData<T[]>(queryKey, (old = []) => [newItem, ...old]);

  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create an optimistic update for a list (update item)
 */
export const createOptimisticListUpdate = async <T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: any[],
  itemId: string | number,
  updates: Partial<T>
): Promise<OptimisticContext<T[]>> => {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T[]>(queryKey);

  queryClient.setQueryData<T[]>(queryKey, (old = []) =>
    old.map(item => (item.id === itemId ? { ...item, ...updates } : item))
  );

  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create an optimistic update for a list (remove item)
 */
export const createOptimisticListRemove = async <T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: any[],
  itemId: string | number
): Promise<OptimisticContext<T[]>> => {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T[]>(queryKey);

  queryClient.setQueryData<T[]>(queryKey, (old = []) =>
    old.filter(item => item.id !== itemId)
  );

  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create an optimistic update for a paginated response
 */
export const createOptimisticPaginatedUpdate = async <T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: any[],
  itemId: string | number,
  updates: Partial<T>
): Promise<OptimisticContext<{ data: T[]; total: number; pagination: any }>> => {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<{ data: T[]; total: number; pagination: any }>(queryKey);

  queryClient.setQueryData<{ data: T[]; total: number; pagination: any }>(queryKey, (old) => {
    if (!old) return old;

    return {
      ...old,
      data: old.data.map(item => (item.id === itemId ? { ...item, ...updates } : item)),
    };
  });

  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create optimistic updates for multiple related queries
 *
 * @example
 * ```typescript
 * onMutate: async (variables) => {
 *   return createMultiQueryOptimisticUpdate(queryClient, [
 *     {
 *       queryKey: ['students', variables.studentId],
 *       updater: (old) => ({ ...old, ...variables })
 *     },
 *     {
 *       queryKey: ['students'],
 *       updater: (old) => old.map(s => s.id === variables.studentId ? { ...s, ...variables } : s)
 *     }
 *   ]);
 * }
 * ```
 */
export const createMultiQueryOptimisticUpdate = async (
  queryClient: QueryClient,
  updates: Array<{
    queryKey: any[];
    updater: (old: any) => any;
  }>
): Promise<OptimisticContext<Record<string, any>>> => {
  const previousDataMap: Record<string, any> = {};

  // Cancel and snapshot all queries
  for (const { queryKey } of updates) {
    await queryClient.cancelQueries({ queryKey });
    previousDataMap[JSON.stringify(queryKey)] = queryClient.getQueryData(queryKey);
  }

  // Apply all optimistic updates
  for (const { queryKey, updater } of updates) {
    queryClient.setQueryData(queryKey, updater);
  }

  return {
    previousData: previousDataMap,
    rollback: () => {
      for (const { queryKey } of updates) {
        const key = JSON.stringify(queryKey);
        queryClient.setQueryData(queryKey, previousDataMap[key]);
      }
    },
  };
};

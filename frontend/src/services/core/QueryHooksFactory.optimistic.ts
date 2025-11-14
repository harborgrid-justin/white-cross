/**
 * Optimistic Update Handlers for QueryHooksFactory
 *
 * This module contains handlers for optimistic UI updates during mutations,
 * providing immediate feedback to users while waiting for server responses.
 *
 * @module QueryHooksFactory.optimistic
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import { BaseEntity } from './BaseApiService';
import { ApiClientError } from './ApiClient';
import { OptimisticUpdateContext } from './QueryHooksFactory.types';

// ==========================================
// OPTIMISTIC UPDATE HANDLERS
// ==========================================

/**
 * Handle optimistic update for create operations
 *
 * For create operations, we typically don't do optimistic updates since we don't
 * have an ID yet, but we can prepare context for rollback if needed.
 *
 * @template TCreateDto - The DTO type for creating an entity
 * @param queryClient - The TanStack Query client instance
 * @param data - The data being created
 * @returns Context for potential rollback
 *
 * @internal
 */
export async function handleOptimisticCreate<TCreateDto>(
  queryClient: QueryClient,
  data: TCreateDto
): Promise<OptimisticUpdateContext<BaseEntity>> {
  // For create operations, we typically don't do optimistic updates
  // since we don't have an ID yet, but we can prepare for rollback
  return { optimisticData: data };
}

/**
 * Handle optimistic update for update operations
 *
 * Optimistically updates the cached entity data before the server responds,
 * providing immediate feedback to users. Stores previous data for rollback
 * if the mutation fails.
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @template TUpdateDto - The DTO type for updating an entity
 * @param queryClient - The TanStack Query client instance
 * @param detailQueryKey - The query key for the entity detail
 * @param id - The ID of the entity being updated
 * @param data - The update data
 * @returns Context containing previous data for rollback
 *
 * @internal
 */
export async function handleOptimisticUpdate<
  TEntity extends BaseEntity,
  TUpdateDto
>(
  queryClient: QueryClient,
  detailQueryKey: QueryKey,
  id: string,
  data: TUpdateDto
): Promise<OptimisticUpdateContext<TEntity>> {
  // Cancel any outgoing refetches to avoid race conditions
  await queryClient.cancelQueries({ queryKey: detailQueryKey });

  // Snapshot the previous value for rollback
  const previousData = queryClient.getQueryData<TEntity>(detailQueryKey);

  // Optimistically update to the new value
  if (previousData) {
    const optimisticData = { ...previousData, ...data } as TEntity;
    queryClient.setQueryData(detailQueryKey, optimisticData);
  }

  return { previousData, detailQueryKey };
}

/**
 * Handle optimistic update for delete operations
 *
 * Optimistically removes the entity from cache before the server confirms deletion,
 * providing immediate feedback. Stores previous data for rollback if the mutation fails.
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @param queryClient - The TanStack Query client instance
 * @param detailQueryKey - The query key for the entity detail
 * @returns Context containing previous data for rollback
 *
 * @internal
 */
export async function handleOptimisticDelete<TEntity extends BaseEntity>(
  queryClient: QueryClient,
  detailQueryKey: QueryKey
): Promise<OptimisticUpdateContext<TEntity>> {
  // Cancel any outgoing refetches to avoid race conditions
  await queryClient.cancelQueries({ queryKey: detailQueryKey });

  // Snapshot the previous value for rollback
  const previousData = queryClient.getQueryData<TEntity>(detailQueryKey);

  // Remove from cache optimistically
  queryClient.removeQueries({ queryKey: detailQueryKey });

  return { previousData, detailQueryKey };
}

/**
 * Handle mutation error and rollback optimistic updates
 *
 * When a mutation fails, this handler restores the previous cached data
 * and calls the configured error handler.
 *
 * @param queryClient - The TanStack Query client instance
 * @param error - The API client error that occurred
 * @param context - The optimistic update context containing rollback data
 * @param onError - The error handler callback
 *
 * @internal
 */
export function handleMutationError<TEntity extends BaseEntity>(
  queryClient: QueryClient,
  error: ApiClientError,
  context: OptimisticUpdateContext<TEntity> | undefined,
  onError: (error: ApiClientError) => void
): void {
  // Rollback optimistic updates on error
  if (context?.previousData && context?.detailQueryKey) {
    queryClient.setQueryData(context.detailQueryKey, context.previousData);
  }

  // Call the configured error handler
  onError(error);
}

/**
 * Create query key for a specific operation and parameters
 *
 * Generates a standardized query key structure for cache management.
 *
 * @param baseKey - The base query key array
 * @param operation - The operation type (e.g., 'list', 'detail', 'search')
 * @param params - Optional parameters to include in the key
 * @param keySerializer - Optional custom serializer for parameters
 * @returns The complete query key
 *
 * @example
 * ```typescript
 * const key = createQueryKey(['students'], 'detail', '123');
 * // Returns: ['students', 'detail', '123']
 * ```
 */
export function createQueryKey(
  baseKey: QueryKey,
  operation: string,
  params?: unknown,
  keySerializer?: (key: unknown) => string
): QueryKey {
  const result = [...baseKey, operation];

  if (params === undefined || params === null) {
    return result;
  }

  // Use custom serializer if provided
  if (keySerializer) {
    return [...result, keySerializer(params)];
  }

  return [...result, params];
}

/**
 * Create a default error handler with contextual logging
 *
 * Generates an error handler that logs errors with query key context
 * for better debugging and monitoring.
 *
 * @param queryKey - The base query key for context
 * @returns An error handler function
 *
 * @example
 * ```typescript
 * const errorHandler = createDefaultErrorHandler(['students']);
 * errorHandler(new ApiClientError('Failed to fetch'));
 * // Logs: "[students] API Error: Failed to fetch"
 * ```
 */
export function createDefaultErrorHandler(
  queryKey: QueryKey
): (error: ApiClientError) => void {
  return (error: ApiClientError) => {
    const context = `[${queryKey.join('.')}]`;
    console.error(`${context} API Error:`, {
      message: error.message,
      status: error.status,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
  };
}

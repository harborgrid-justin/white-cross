/**
 * Mutation Hooks for QueryHooksFactory
 *
 * This module provides React hooks for mutation operations (create, update, delete)
 * with support for optimistic updates, cache invalidation, and error handling.
 *
 * @module QueryHooksFactory.mutations
 */

import {
  useMutation,
  useQueryClient,
  UseMutationResult,
  QueryKey,
} from '@tanstack/react-query';
import { BaseEntity } from './BaseApiService';
import { ApiClientError } from './ApiClient';
import {
  CreateMutationOptions,
  UpdateMutationOptions,
  DeleteMutationOptions,
  BulkMutationOptions,
  ResolvedQueryHooksConfig,
  OptimisticUpdateContext,
} from './QueryHooksFactory.types';
import {
  handleOptimisticCreate,
  handleOptimisticUpdate,
  handleOptimisticDelete,
  handleMutationError,
  createQueryKey,
} from './QueryHooksFactory.optimistic';

// ==========================================
// MUTATION HOOK FACTORY FUNCTIONS
// ==========================================

/**
 * Create a mutation hook for creating new entities
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @template TCreateDto - The DTO type for creating an entity
 * @param service - The API service with create method
 * @param config - The resolved query hooks configuration
 * @param options - Optional mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * ```typescript
 * const createMutation = createUseCreateHook(studentService, config, {
 *   onSuccess: (newStudent) => console.log('Created:', newStudent)
 * });
 * ```
 */
export function createUseCreateHook<
  TEntity extends BaseEntity,
  TCreateDto
>(
  service: { create: (data: TCreateDto) => Promise<TEntity> },
  config: ResolvedQueryHooksConfig<TEntity>,
  options?: CreateMutationOptions<TCreateDto, TEntity>
): UseMutationResult<TEntity, ApiClientError, TCreateDto> {
  const queryClient = useQueryClient();
  const { invalidateList = true, optimistic = false, ...mutationOptions } = options || {};

  return useMutation<TEntity, ApiClientError, TCreateDto>({
    mutationFn: (data: TCreateDto) => service.create(data),
    onMutate: optimistic
      ? (data: TCreateDto) => handleOptimisticCreate(queryClient, data)
      : undefined,
    onSuccess: (data: TEntity, variables: TCreateDto, context: OptimisticUpdateContext<TEntity> | undefined) => {
      if (invalidateList) {
        queryClient.invalidateQueries({
          queryKey: createQueryKey(config.queryKey, 'list'),
        });
      }
      options?.onSuccess?.(data, variables, context);
    },
    onError: (
      error: ApiClientError,
      variables: TCreateDto,
      context: OptimisticUpdateContext<TEntity> | undefined
    ) => {
      handleMutationError(queryClient, error, context, config.onError);
      options?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
}

/**
 * Create a mutation hook for updating existing entities
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @template TUpdateDto - The DTO type for updating an entity
 * @param service - The API service with update method
 * @param config - The resolved query hooks configuration
 * @param options - Optional mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * ```typescript
 * const updateMutation = createUseUpdateHook(studentService, config, {
 *   optimistic: true,
 *   onSuccess: (updatedStudent) => console.log('Updated:', updatedStudent)
 * });
 * ```
 */
export function createUseUpdateHook<
  TEntity extends BaseEntity,
  TUpdateDto
>(
  service: { update: (id: string, data: TUpdateDto) => Promise<TEntity> },
  config: ResolvedQueryHooksConfig<TEntity>,
  options?: UpdateMutationOptions<TUpdateDto, TEntity>
): UseMutationResult<TEntity, ApiClientError, { id: string; data: TUpdateDto }> {
  const queryClient = useQueryClient();
  const {
    invalidateQueries = true,
    optimistic = config.enableOptimisticUpdates,
    ...mutationOptions
  } = options || {};

  return useMutation<TEntity, ApiClientError, { id: string; data: TUpdateDto }>({
    mutationFn: ({ id, data }) => service.update(id, data),
    onMutate: optimistic
      ? (variables: { id: string; data: TUpdateDto }) => {
          const detailQueryKey = createQueryKey(config.queryKey, 'detail', variables.id);
          return handleOptimisticUpdate(queryClient, detailQueryKey, variables.id, variables.data);
        }
      : undefined,
    onSuccess: (
      data: TEntity,
      variables: { id: string; data: TUpdateDto },
      context: OptimisticUpdateContext<TEntity> | undefined
    ) => {
      if (invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: createQueryKey(config.queryKey, 'list'),
        });
        queryClient.invalidateQueries({
          queryKey: createQueryKey(config.queryKey, 'detail', variables.id),
        });
      }

      // Update cache with fresh data
      queryClient.setQueryData(
        createQueryKey(config.queryKey, 'detail', variables.id),
        data
      );
      options?.onSuccess?.(data, variables, context);
    },
    onError: (
      error: ApiClientError,
      variables: { id: string; data: TUpdateDto },
      context: OptimisticUpdateContext<TEntity> | undefined
    ) => {
      handleMutationError(queryClient, error, context, config.onError);
      options?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
}

/**
 * Create a mutation hook for deleting entities
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @param service - The API service with delete method
 * @param config - The resolved query hooks configuration
 * @param options - Optional mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * ```typescript
 * const deleteMutation = createUseDeleteHook(studentService, config, {
 *   onSuccess: () => console.log('Deleted successfully')
 * });
 * ```
 */
export function createUseDeleteHook<TEntity extends BaseEntity>(
  service: { delete: (id: string) => Promise<void> },
  config: ResolvedQueryHooksConfig<TEntity>,
  options?: DeleteMutationOptions
): UseMutationResult<void, ApiClientError, string> {
  const queryClient = useQueryClient();
  const {
    invalidateQueries = true,
    optimistic = config.enableOptimisticUpdates,
    ...mutationOptions
  } = options || {};

  return useMutation<void, ApiClientError, string>({
    mutationFn: (id: string) => service.delete(id),
    onMutate: optimistic
      ? (id: string) => {
          const detailQueryKey = createQueryKey(config.queryKey, 'detail', id);
          return handleOptimisticDelete(queryClient, detailQueryKey);
        }
      : undefined,
    onSuccess: (
      data: void,
      id: string,
      context: OptimisticUpdateContext<TEntity> | undefined
    ) => {
      if (invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: createQueryKey(config.queryKey, 'list'),
        });
        queryClient.removeQueries({
          queryKey: createQueryKey(config.queryKey, 'detail', id),
        });
      }
      options?.onSuccess?.(data, id, context);
    },
    onError: (
      error: ApiClientError,
      variables: string,
      context: OptimisticUpdateContext<TEntity> | undefined
    ) => {
      handleMutationError(queryClient, error, context, config.onError);
      options?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
}

/**
 * Create a mutation hook for bulk create operations
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @template TCreateDto - The DTO type for creating an entity
 * @param service - The API service with bulkCreate method
 * @param config - The resolved query hooks configuration
 * @param options - Optional mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * ```typescript
 * const bulkCreateMutation = createUseBulkCreateHook(studentService, config, {
 *   onSuccess: (students) => console.log('Created:', students.length)
 * });
 * ```
 */
export function createUseBulkCreateHook<
  TEntity extends BaseEntity,
  TCreateDto
>(
  service: { bulkCreate: (data: TCreateDto[]) => Promise<TEntity[]> },
  config: ResolvedQueryHooksConfig<TEntity>,
  options?: BulkMutationOptions<TCreateDto[], TEntity[]>
): UseMutationResult<TEntity[], ApiClientError, TCreateDto[]> {
  const queryClient = useQueryClient();
  const { invalidateQueries = true, ...mutationOptions } = options || {};

  return useMutation<TEntity[], ApiClientError, TCreateDto[]>({
    mutationFn: (data: TCreateDto[]) => service.bulkCreate(data),
    onSuccess: (
      data: TEntity[],
      variables: TCreateDto[],
      context: OptimisticUpdateContext<TEntity> | undefined
    ) => {
      if (invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: createQueryKey(config.queryKey, 'list'),
        });
      }
      options?.onSuccess?.(data, variables, context);
    },
    onError: (
      error: ApiClientError,
      variables: TCreateDto[],
      context: OptimisticUpdateContext<TEntity> | undefined
    ) => {
      config.onError(error);
      options?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
}

/**
 * Create a mutation hook for bulk delete operations
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @param service - The API service with bulkDelete method
 * @param config - The resolved query hooks configuration
 * @param options - Optional mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * ```typescript
 * const bulkDeleteMutation = createUseBulkDeleteHook(studentService, config, {
 *   onSuccess: () => console.log('Bulk delete completed')
 * });
 * ```
 */
export function createUseBulkDeleteHook<TEntity extends BaseEntity>(
  service: { bulkDelete: (ids: string[]) => Promise<void> },
  config: ResolvedQueryHooksConfig<TEntity>,
  options?: BulkMutationOptions<string[], void>
): UseMutationResult<void, ApiClientError, string[]> {
  const queryClient = useQueryClient();
  const { invalidateQueries = true, ...mutationOptions } = options || {};

  return useMutation<void, ApiClientError, string[]>({
    mutationFn: (ids: string[]) => service.bulkDelete(ids),
    onSuccess: (
      data: void,
      ids: string[],
      context: OptimisticUpdateContext<TEntity> | undefined
    ) => {
      if (invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: createQueryKey(config.queryKey, 'list'),
        });
        ids.forEach((id: string) => {
          queryClient.removeQueries({
            queryKey: createQueryKey(config.queryKey, 'detail', id),
          });
        });
      }
      options?.onSuccess?.(data, ids, context);
    },
    onError: (
      error: ApiClientError,
      variables: string[],
      context: OptimisticUpdateContext<TEntity> | undefined
    ) => {
      config.onError(error);
      options?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
}

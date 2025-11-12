/**
 * Type definitions for QueryHooksFactory
 *
 * This module contains all TypeScript interfaces and type definitions used by the
 * QueryHooksFactory for creating type-safe TanStack Query hooks.
 *
 * @module QueryHooksFactory.types
 */

import {
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query';
import { BaseEntity, FilterParams } from './BaseApiService';
import { ApiClientError, PaginatedResponse } from './ApiClient';

// ==========================================
// FACTORY CONFIGURATION
// ==========================================

/**
 * Configuration options for query hooks factory
 *
 * @template TEntity - The entity type that extends BaseEntity
 */
export interface QueryHooksConfig<TEntity extends BaseEntity> {
  /**
   * Base query key for this resource (e.g., ['students'])
   */
  queryKey: QueryKey;

  /**
   * Default stale time in milliseconds (default: 5 minutes)
   */
  staleTime?: number;

  /**
   * Default garbage collection time in milliseconds (default: 10 minutes)
   * @deprecated Use gcTime instead of cacheTime
   */
  cacheTime?: number;

  /**
   * Default garbage collection time in milliseconds (default: 10 minutes)
   */
  gcTime?: number;

  /**
   * Enable automatic refetch on window focus (default: false)
   */
  refetchOnWindowFocus?: boolean;

  /**
   * Enable automatic refetch on reconnect (default: true)
   */
  refetchOnReconnect?: boolean;

  /**
   * Retry failed requests (default: 1)
   */
  retry?: number | boolean;

  /**
   * Custom error handler
   */
  onError?: (error: ApiClientError) => void;

  /**
   * Enable optimistic updates for mutations (default: true)
   */
  enableOptimisticUpdates?: boolean;

  /**
   * Custom query key serializer for better cache management
   */
  keySerializer?: (key: unknown) => string;
}

/**
 * Resolved configuration with all default values applied
 * Internal use only
 *
 * @internal
 */
export type ResolvedQueryHooksConfig<TEntity extends BaseEntity> = Required<
  Omit<QueryHooksConfig<TEntity>, 'cacheTime' | 'keySerializer'>
> & {
  gcTime: number;
  keySerializer?: (key: unknown) => string;
};

// ==========================================
// QUERY OPTIONS
// ==========================================

/**
 * Options for list queries with filtering support
 *
 * @template TEntity - The entity type that extends BaseEntity
 *
 * @example
 * ```typescript
 * const options: ListQueryOptions<Student> = {
 *   filters: { status: 'active', grade: '12' },
 *   enabled: true
 * };
 * ```
 */
export interface ListQueryOptions<TEntity extends BaseEntity>
  extends Omit<UseQueryOptions<PaginatedResponse<TEntity>, ApiClientError>, 'queryKey' | 'queryFn'> {
  filters?: FilterParams;
}

/**
 * Options for detail queries with ID parameter
 *
 * @template TEntity - The entity type that extends BaseEntity
 *
 * @example
 * ```typescript
 * const options: DetailQueryOptions<Student> = {
 *   id: '123',
 *   enabled: true
 * };
 * ```
 */
export interface DetailQueryOptions<TEntity extends BaseEntity>
  extends Omit<UseQueryOptions<TEntity, ApiClientError>, 'queryKey' | 'queryFn'> {
  id: string;
}

/**
 * Options for search queries with query string and filters
 *
 * @template TEntity - The entity type that extends BaseEntity
 *
 * @example
 * ```typescript
 * const options: SearchQueryOptions<Student> = {
 *   query: 'John',
 *   filters: { grade: '12' },
 *   minQueryLength: 3
 * };
 * ```
 */
export interface SearchQueryOptions<TEntity extends BaseEntity>
  extends Omit<UseQueryOptions<PaginatedResponse<TEntity>, ApiClientError>, 'queryKey' | 'queryFn'> {
  query: string;
  filters?: FilterParams;
  minQueryLength?: number;
}

// ==========================================
// MUTATION OPTIONS
// ==========================================

/**
 * Options for create mutations
 *
 * @template TCreate - The DTO type for creating an entity
 * @template TEntity - The entity type that extends BaseEntity
 *
 * @example
 * ```typescript
 * const options: CreateMutationOptions<CreateStudentDto, Student> = {
 *   invalidateList: true,
 *   optimistic: false,
 *   onSuccess: (student) => console.log('Created:', student)
 * };
 * ```
 */
export interface CreateMutationOptions<TCreate, TEntity extends BaseEntity>
  extends Omit<UseMutationOptions<TEntity, ApiClientError, TCreate>, 'mutationFn'> {
  /**
   * Invalidate list queries on success (default: true)
   */
  invalidateList?: boolean;
  /**
   * Enable optimistic updates (default: false for create operations)
   */
  optimistic?: boolean;
}

/**
 * Options for update mutations
 *
 * @template TUpdate - The DTO type for updating an entity
 * @template TEntity - The entity type that extends BaseEntity
 *
 * @example
 * ```typescript
 * const options: UpdateMutationOptions<UpdateStudentDto, Student> = {
 *   invalidateQueries: true,
 *   optimistic: true,
 *   onSuccess: (student) => console.log('Updated:', student)
 * };
 * ```
 */
export interface UpdateMutationOptions<TUpdate, TEntity extends BaseEntity>
  extends Omit<UseMutationOptions<TEntity, ApiClientError, { id: string; data: TUpdate }>, 'mutationFn'> {
  /**
   * Invalidate related queries on success (default: true)
   */
  invalidateQueries?: boolean;
  /**
   * Enable optimistic updates (default: true)
   */
  optimistic?: boolean;
}

/**
 * Options for delete mutations
 *
 * @example
 * ```typescript
 * const options: DeleteMutationOptions = {
 *   invalidateQueries: true,
 *   optimistic: true,
 *   onSuccess: () => console.log('Deleted successfully')
 * };
 * ```
 */
export interface DeleteMutationOptions
  extends Omit<UseMutationOptions<void, ApiClientError, string>, 'mutationFn'> {
  /**
   * Invalidate related queries on success (default: true)
   */
  invalidateQueries?: boolean;
  /**
   * Enable optimistic updates (default: true)
   */
  optimistic?: boolean;
}

/**
 * Options for bulk operations (create or delete)
 *
 * @template TData - The input data type for the bulk operation
 * @template TResult - The result type of the bulk operation
 *
 * @example
 * ```typescript
 * const options: BulkMutationOptions<CreateStudentDto[], Student[]> = {
 *   invalidateQueries: true,
 *   optimistic: false,
 *   onSuccess: (students) => console.log('Created:', students.length)
 * };
 * ```
 */
export interface BulkMutationOptions<TData, TResult>
  extends Omit<UseMutationOptions<TResult, ApiClientError, TData>, 'mutationFn'> {
  /**
   * Invalidate related queries on success (default: true)
   */
  invalidateQueries?: boolean;
  /**
   * Enable optimistic updates (default: false for bulk operations)
   */
  optimistic?: boolean;
}

// ==========================================
// OPTIMISTIC UPDATE CONTEXT
// ==========================================

/**
 * Context for optimistic updates, used for rollback on error
 *
 * @template TEntity - The entity type that extends BaseEntity
 *
 * @internal
 */
export interface OptimisticUpdateContext<TEntity extends BaseEntity> {
  /**
   * The previous data before the optimistic update
   */
  previousData?: TEntity;

  /**
   * The query key affected by the optimistic update
   */
  detailQueryKey?: QueryKey;

  /**
   * The optimistic data (used for create operations)
   */
  optimisticData?: unknown;
}

// ==========================================
// TYPE HELPERS
// ==========================================

/**
 * Type helper for extracting entity type from QueryHooksFactory instance
 *
 * @template T - The QueryHooksFactory instance type
 *
 * @example
 * ```typescript
 * type StudentEntity = EntityFromHooks<typeof studentHooks>;
 * ```
 */
export type EntityFromHooks<T> = T extends { useList: (...args: unknown[]) => unknown }
  ? T extends { useDetail: (options: DetailQueryOptions<infer E>) => unknown }
    ? E
    : never
  : never;

/**
 * Type helper for extracting create DTO type from QueryHooksFactory instance
 *
 * @template T - The QueryHooksFactory instance type
 *
 * @example
 * ```typescript
 * type CreateStudentDto = CreateDtoFromHooks<typeof studentHooks>;
 * ```
 */
export type CreateDtoFromHooks<T> = T extends { useCreate: (...args: unknown[]) => unknown }
  ? T extends { useCreate: (options?: CreateMutationOptions<infer C, unknown>) => unknown }
    ? C
    : never
  : never;

/**
 * Type helper for extracting update DTO type from QueryHooksFactory instance
 *
 * @template T - The QueryHooksFactory instance type
 *
 * @example
 * ```typescript
 * type UpdateStudentDto = UpdateDtoFromHooks<typeof studentHooks>;
 * ```
 */
export type UpdateDtoFromHooks<T> = T extends { useUpdate: (...args: unknown[]) => unknown }
  ? T extends { useUpdate: (options?: UpdateMutationOptions<infer U, unknown>) => unknown }
    ? U
    : never
  : never;

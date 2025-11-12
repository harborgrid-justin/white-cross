/**
 * Query Hooks for QueryHooksFactory
 *
 * This module provides React hooks for query operations (list, detail, search)
 * with support for caching, filtering, and automatic refetching.
 *
 * @module QueryHooksFactory.queries
 */

import {
  useQuery,
  UseQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { BaseEntity, FilterParams } from './BaseApiService';
import { ApiClientError, PaginatedResponse } from './ApiClient';
import {
  ListQueryOptions,
  DetailQueryOptions,
  SearchQueryOptions,
  ResolvedQueryHooksConfig,
} from './QueryHooksFactory.types';
import { createQueryKey } from './QueryHooksFactory.optimistic';

// ==========================================
// QUERY HOOK FACTORY FUNCTIONS
// ==========================================

/**
 * Create a query hook for fetching list of entities
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @param service - The API service with getAll method
 * @param config - The resolved query hooks configuration
 * @param options - Optional query options with filters
 * @returns TanStack Query result with paginated data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = createUseListHook(studentService, config, {
 *   filters: { status: 'active' }
 * });
 * ```
 */
export function createUseListHook<TEntity extends BaseEntity>(
  service: { getAll: (filters?: FilterParams) => Promise<PaginatedResponse<TEntity>> },
  config: ResolvedQueryHooksConfig<TEntity>,
  options?: ListQueryOptions<TEntity>
): UseQueryResult<PaginatedResponse<TEntity>, ApiClientError> {
  const { filters, ...queryOptions } = options || {};

  const queryKey = useMemo(
    () => createQueryKey(config.queryKey, 'list', filters, config.keySerializer),
    [config.queryKey, filters, config.keySerializer]
  );

  const queryFn = useCallback(
    () => service.getAll(filters),
    [service, filters]
  );

  return useQuery<PaginatedResponse<TEntity>, ApiClientError>({
    queryKey,
    queryFn,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    ...queryOptions,
  });
}

/**
 * Create a query hook for fetching single entity by ID
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @param service - The API service with getById method
 * @param config - The resolved query hooks configuration
 * @param options - Query options with required ID parameter
 * @returns TanStack Query result with entity data
 *
 * @example
 * ```typescript
 * const { data: student, isLoading } = createUseDetailHook(studentService, config, {
 *   id: '123'
 * });
 * ```
 */
export function createUseDetailHook<TEntity extends BaseEntity>(
  service: { getById: (id: string) => Promise<TEntity> },
  config: ResolvedQueryHooksConfig<TEntity>,
  options: DetailQueryOptions<TEntity>
): UseQueryResult<TEntity, ApiClientError> {
  const { id, ...queryOptions } = options;

  const queryKey = useMemo(
    () => createQueryKey(config.queryKey, 'detail', id, config.keySerializer),
    [config.queryKey, id, config.keySerializer]
  );

  const queryFn = useCallback(
    () => service.getById(id),
    [service, id]
  );

  return useQuery<TEntity, ApiClientError>({
    queryKey,
    queryFn,
    enabled: !!id,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: false, // Don't refetch details on window focus
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    ...queryOptions,
  });
}

/**
 * Create a query hook for searching entities
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @param service - The API service with search method
 * @param config - The resolved query hooks configuration
 * @param options - Query options with search query and optional filters
 * @returns TanStack Query result with paginated search results
 *
 * @example
 * ```typescript
 * const { data, isLoading } = createUseSearchHook(studentService, config, {
 *   query: searchTerm,
 *   minQueryLength: 3
 * });
 * ```
 */
export function createUseSearchHook<TEntity extends BaseEntity>(
  service: { search: (query: string, filters?: FilterParams) => Promise<PaginatedResponse<TEntity>> },
  config: ResolvedQueryHooksConfig<TEntity>,
  options: SearchQueryOptions<TEntity>
): UseQueryResult<PaginatedResponse<TEntity>, ApiClientError> {
  const { query, filters, minQueryLength = 1, ...queryOptions } = options;

  const queryKey = useMemo(
    () => createQueryKey(config.queryKey, 'search', { query, filters }, config.keySerializer),
    [config.queryKey, query, filters, config.keySerializer]
  );

  const queryFn = useCallback(
    () => service.search(query, filters),
    [service, query, filters]
  );

  const isEnabled = Boolean(query && query.trim().length >= minQueryLength);

  return useQuery<PaginatedResponse<TEntity>, ApiClientError>({
    queryKey,
    queryFn,
    enabled: isEnabled,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: false,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    ...queryOptions,
  });
}

// ==========================================
// QUERY KEY HELPER FUNCTIONS
// ==========================================

/**
 * Get the list query key for a specific resource
 *
 * @param queryKey - The base query key
 * @param filters - Optional filters to include in the key
 * @param keySerializer - Optional custom serializer
 * @returns The complete list query key
 *
 * @example
 * ```typescript
 * const key = getListQueryKey(['students'], { status: 'active' });
 * // Returns: ['students', 'list', { status: 'active' }]
 * ```
 */
export function getListQueryKey(
  queryKey: QueryKey,
  filters?: FilterParams,
  keySerializer?: (key: unknown) => string
): QueryKey {
  return createQueryKey(queryKey, 'list', filters, keySerializer);
}

/**
 * Get the detail query key for a specific entity
 *
 * @param queryKey - The base query key
 * @param id - The entity ID
 * @param keySerializer - Optional custom serializer
 * @returns The complete detail query key
 *
 * @example
 * ```typescript
 * const key = getDetailQueryKey(['students'], '123');
 * // Returns: ['students', 'detail', '123']
 * ```
 */
export function getDetailQueryKey(
  queryKey: QueryKey,
  id: string,
  keySerializer?: (key: unknown) => string
): QueryKey {
  return createQueryKey(queryKey, 'detail', id, keySerializer);
}

/**
 * Get the search query key for a specific search
 *
 * @param queryKey - The base query key
 * @param query - The search query string
 * @param filters - Optional filters to include in the key
 * @param keySerializer - Optional custom serializer
 * @returns The complete search query key
 *
 * @example
 * ```typescript
 * const key = getSearchQueryKey(['students'], 'John', { grade: '12' });
 * // Returns: ['students', 'search', { query: 'John', filters: { grade: '12' } }]
 * ```
 */
export function getSearchQueryKey(
  queryKey: QueryKey,
  query: string,
  filters?: FilterParams,
  keySerializer?: (key: unknown) => string
): QueryKey {
  return createQueryKey(queryKey, 'search', { query, filters }, keySerializer);
}

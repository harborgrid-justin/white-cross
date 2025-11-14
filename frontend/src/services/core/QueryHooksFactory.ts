/**
 * TanStack Query Hooks Factory
 * Enhanced with Next.js v16 integration for optimal SSR and streaming performance
 * Provides type-safe, reusable query and mutation hooks for API operations
 *
 * @version 3.0.0 - Next.js v16 integration with enhanced SSR, streaming, and edge compatibility
 */

import {
  UseQueryResult,
  UseMutationResult,
  QueryClient,
  QueryKey,
} from '@tanstack/react-query';
import { BaseApiService, BaseEntity, FilterParams } from './BaseApiService';
import { ApiClientError, PaginatedResponse } from './ApiClient';

// Import types
import {
  QueryHooksConfig,
  ResolvedQueryHooksConfig,
  ListQueryOptions,
  DetailQueryOptions,
  SearchQueryOptions,
  CreateMutationOptions,
  UpdateMutationOptions,
  DeleteMutationOptions,
  BulkMutationOptions,
  EntityFromHooks,
  CreateDtoFromHooks,
  UpdateDtoFromHooks,
} from './QueryHooksFactory.types';

// Import query hooks
import {
  createUseListHook,
  createUseDetailHook,
  createUseSearchHook,
  getListQueryKey,
  getDetailQueryKey,
  getSearchQueryKey,
} from './QueryHooksFactory.queries';

// Import mutation hooks
import {
  createUseCreateHook,
  createUseUpdateHook,
  createUseDeleteHook,
  createUseBulkCreateHook,
  createUseBulkDeleteHook,
} from './QueryHooksFactory.mutations';

// Import optimistic utilities
import {
  createQueryKey,
  createDefaultErrorHandler,
} from './QueryHooksFactory.optimistic';

// Re-export types for backward compatibility
export type {
  QueryHooksConfig,
  ListQueryOptions,
  DetailQueryOptions,
  SearchQueryOptions,
  CreateMutationOptions,
  UpdateMutationOptions,
  DeleteMutationOptions,
  BulkMutationOptions,
  EntityFromHooks,
  CreateDtoFromHooks,
  UpdateDtoFromHooks,
};

// ==========================================
// QUERY HOOKS FACTORY CLASS
// ==========================================

/**
 * Factory class for creating type-safe TanStack Query hooks
 * Provides consistent patterns for CRUD operations with caching and error handling
 *
 * @template TEntity - The entity type that extends BaseEntity
 * @template TCreateDto - The DTO type for creating entities (defaults to Partial<TEntity>)
 * @template TUpdateDto - The DTO type for updating entities (defaults to Partial<TCreateDto>)
 *
 * @example
 * ```typescript
 * const factory = new QueryHooksFactory(studentService, {
 *   queryKey: ['students'],
 *   staleTime: 5 * 60 * 1000,
 *   enableOptimisticUpdates: true
 * });
 *
 * // Use in components
 * const { data: students } = factory.useList();
 * const createMutation = factory.useCreate();
 * ```
 */
export class QueryHooksFactory<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
> {
  private readonly service: BaseApiService<TEntity, TCreateDto, TUpdateDto>;
  private readonly config: ResolvedQueryHooksConfig<TEntity>;

  constructor(
    service: BaseApiService<TEntity, TCreateDto, TUpdateDto>,
    config: QueryHooksConfig<TEntity>
  ) {
    this.service = service;

    // Handle deprecated cacheTime property and create resolved config
    const gcTime = config.gcTime ?? config.cacheTime ?? 10 * 60 * 1000;

    this.config = {
      queryKey: config.queryKey,
      staleTime: config.staleTime ?? 5 * 60 * 1000, // 5 minutes
      gcTime,
      refetchOnWindowFocus: config.refetchOnWindowFocus ?? false,
      refetchOnReconnect: config.refetchOnReconnect ?? true,
      retry: config.retry ?? 1,
      enableOptimisticUpdates: config.enableOptimisticUpdates ?? true,
      keySerializer: config.keySerializer,
      onError: config.onError ?? createDefaultErrorHandler(config.queryKey),
    };
  }

  // ==========================================
  // QUERY HOOKS
  // ==========================================

  /**
   * Hook for fetching list of entities with pagination and filtering
   */
  public useList = (
    options?: ListQueryOptions<TEntity>
  ): UseQueryResult<PaginatedResponse<TEntity>, ApiClientError> => {
    return createUseListHook(this.service, this.config, options);
  };

  /**
   * Hook for fetching single entity by ID
   */
  public useDetail = (
    options: DetailQueryOptions<TEntity>
  ): UseQueryResult<TEntity, ApiClientError> => {
    return createUseDetailHook(this.service, this.config, options);
  };

  /**
   * Hook for searching entities with debouncing support
   */
  public useSearch = (
    options: SearchQueryOptions<TEntity>
  ): UseQueryResult<PaginatedResponse<TEntity>, ApiClientError> => {
    return createUseSearchHook(this.service, this.config, options);
  };

  // ==========================================
  // MUTATION HOOKS
  // ==========================================

  /**
   * Hook for creating new entity with optimistic updates
   */
  public useCreate = (
    options?: CreateMutationOptions<TCreateDto, TEntity>
  ): UseMutationResult<TEntity, ApiClientError, TCreateDto> => {
    return createUseCreateHook(this.service, this.config, options);
  };

  /**
   * Hook for updating existing entity with optimistic updates
   */
  public useUpdate = (
    options?: UpdateMutationOptions<TUpdateDto, TEntity>
  ): UseMutationResult<TEntity, ApiClientError, { id: string; data: TUpdateDto }> => {
    return createUseUpdateHook(this.service, this.config, options);
  };

  /**
   * Hook for deleting entity with optimistic updates
   */
  public useDelete = (
    options?: DeleteMutationOptions
  ): UseMutationResult<void, ApiClientError, string> => {
    return createUseDeleteHook(this.service, this.config, options);
  };

  /**
   * Hook for bulk create operations
   */
  public useBulkCreate = (
    options?: BulkMutationOptions<TCreateDto[], TEntity[]>
  ): UseMutationResult<TEntity[], ApiClientError, TCreateDto[]> => {
    return createUseBulkCreateHook(this.service, this.config, options);
  };

  /**
   * Hook for bulk delete operations
   */
  public useBulkDelete = (
    options?: BulkMutationOptions<string[], void>
  ): UseMutationResult<void, ApiClientError, string[]> => {
    return createUseBulkDeleteHook(this.service, this.config, options);
  };

  // ==========================================
  // PUBLIC UTILITY METHODS
  // ==========================================

  /** Get current base query key */
  public getQueryKey = (): QueryKey => this.config.queryKey;

  /** Get list query key with optional filters */
  public getListQueryKey = (filters?: FilterParams): QueryKey =>
    getListQueryKey(this.config.queryKey, filters, this.config.keySerializer);

  /** Get detail query key for specific entity */
  public getDetailQueryKey = (id: string): QueryKey =>
    getDetailQueryKey(this.config.queryKey, id, this.config.keySerializer);

  /** Get search query key with query and filters */
  public getSearchQueryKey = (query: string, filters?: FilterParams): QueryKey =>
    getSearchQueryKey(this.config.queryKey, query, filters, this.config.keySerializer);

  /** Invalidate all queries for this resource */
  public invalidateAll = (queryClient: QueryClient): Promise<void> =>
    queryClient.invalidateQueries({ queryKey: this.config.queryKey });

  /** Clear all cached data for this resource */
  public clearCache = (queryClient: QueryClient): void => {
    queryClient.removeQueries({ queryKey: this.config.queryKey });
  };

  /** Get current configuration */
  public getConfig = (): Readonly<ResolvedQueryHooksConfig<TEntity>> => this.config;
}

// ==========================================
// FACTORY FUNCTION & TYPE HELPERS
// ==========================================

/**
 * Create a typed query hooks factory instance
 */
export function createQueryHooks<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
>(
  service: BaseApiService<TEntity, TCreateDto, TUpdateDto>,
  config: QueryHooksConfig<TEntity>
): QueryHooksFactory<TEntity, TCreateDto, TUpdateDto> {
  return new QueryHooksFactory(service, config);
}

/**
 * Type helper for query hooks factory instance
 */
export type QueryHooks<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
> = QueryHooksFactory<TEntity, TCreateDto, TUpdateDto>;

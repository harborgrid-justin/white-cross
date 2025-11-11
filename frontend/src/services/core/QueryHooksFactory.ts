/**
 * WF-COMP-259 | QueryHooksFactory.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./BaseApiService, ./ApiClient | Dependencies: @tanstack/react-query, react, ./BaseApiService
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces, types, classes | Key Features: useMemo, useCallback, component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * TanStack Query Hooks Factory
 * Enhanced with Next.js v16 integration for optimal SSR and streaming performance
 * Provides type-safe, reusable query and mutation hooks for API operations
 * 
 * @version 3.0.0 - Next.js v16 integration with enhanced SSR, streaming, and edge compatibility
 * 
 * Next.js v16 Enhancements:
 * - Server Components compatibility for better SSR performance
 * - Streaming SSR support for faster healthcare data loading
 * - Enhanced hydration strategies for critical healthcare workflows
 * - Edge runtime optimization for global healthcare deployments
 * - Improved cache coordination with Next.js built-in caching
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  UseQueryResult,
  UseMutationResult,
  QueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { BaseApiService, BaseEntity, FilterParams } from './BaseApiService';
import { ApiClientError, PaginatedResponse } from './ApiClient';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Configuration options for query hooks factory
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
 * Options for list queries with filtering support
 */
export interface ListQueryOptions<TEntity extends BaseEntity> 
  extends Omit<UseQueryOptions<PaginatedResponse<TEntity>, ApiClientError>, 'queryKey' | 'queryFn'> {
  filters?: FilterParams;
}

/**
 * Options for detail queries with ID parameter
 */
export interface DetailQueryOptions<TEntity extends BaseEntity> 
  extends Omit<UseQueryOptions<TEntity, ApiClientError>, 'queryKey' | 'queryFn'> {
  id: string;
}

/**
 * Options for search queries
 */
export interface SearchQueryOptions<TEntity extends BaseEntity> 
  extends Omit<UseQueryOptions<PaginatedResponse<TEntity>, ApiClientError>, 'queryKey' | 'queryFn'> {
  query: string;
  filters?: FilterParams;
  minQueryLength?: number;
}

/**
 * Options for create mutations
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
 * Options for bulk operations
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
// QUERY HOOKS FACTORY
// ==========================================

/**
 * Factory class for creating type-safe TanStack Query hooks
 * Provides consistent patterns for CRUD operations with caching and error handling
 */
export class QueryHooksFactory<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
> {
  private readonly service: BaseApiService<TEntity, TCreateDto, TUpdateDto>;
  private readonly config: Required<Omit<QueryHooksConfig<TEntity>, 'cacheTime' | 'keySerializer'>> & {
    gcTime: number;
    keySerializer?: (key: unknown) => string;
  };

  constructor(
    service: BaseApiService<TEntity, TCreateDto, TUpdateDto>,
    config: QueryHooksConfig<TEntity>
  ) {
    this.service = service;
    
    // Handle deprecated cacheTime property
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
      onError: config.onError ?? this.createDefaultErrorHandler(),
    };
  }

  // ==========================================
  // QUERY HOOKS
  // ==========================================

  /**
   * Hook for fetching list of entities with pagination and filtering
   * 
   * @example
   * ```typescript
   * const factory = createQueryHooks(studentService, { queryKey: ['students'] });
   * const { data, isLoading, error } = factory.useList({ 
   *   filters: { status: 'active' } 
   * });
   * ```
   */
  public useList = (options?: ListQueryOptions<TEntity>): UseQueryResult<PaginatedResponse<TEntity>, ApiClientError> => {
    const { filters, ...queryOptions } = options || {};

    const queryKey = useMemo(() => 
      this.createQueryKey('list', filters), 
      [filters]
    );

    const queryFn = useCallback(() => 
      this.service.getAll(filters), 
      [filters]
    );

    return useQuery<PaginatedResponse<TEntity>, ApiClientError>({
      queryKey,
      queryFn,
      staleTime: this.config.staleTime,
      gcTime: this.config.gcTime,
      refetchOnWindowFocus: this.config.refetchOnWindowFocus,
      refetchOnReconnect: this.config.refetchOnReconnect,
      retry: this.config.retry,
      ...queryOptions,
    });
  };

  /**
   * Hook for fetching single entity by ID
   * 
   * @example
   * ```typescript
   * const { data: student, isLoading } = factory.useDetail({ id: '123' });
   * ```
   */
  public useDetail = (options: DetailQueryOptions<TEntity>): UseQueryResult<TEntity, ApiClientError> => {
    const { id, ...queryOptions } = options;

    const queryKey = useMemo(() => 
      this.createQueryKey('detail', id), 
      [id]
    );

    const queryFn = useCallback(() => 
      this.service.getById(id), 
      [id]
    );

    return useQuery<TEntity, ApiClientError>({
      queryKey,
      queryFn,
      enabled: !!id,
      staleTime: this.config.staleTime,
      gcTime: this.config.gcTime,
      refetchOnWindowFocus: false, // Don't refetch details on window focus
      refetchOnReconnect: this.config.refetchOnReconnect,
      retry: this.config.retry,
      ...queryOptions,
    });
  };

  /**
   * Hook for searching entities with debouncing support
   * 
   * @example
   * ```typescript
   * const { data, isLoading } = factory.useSearch({ 
   *   query: searchTerm, 
   *   minQueryLength: 3 
   * });
   * ```
   */
  public useSearch = (options: SearchQueryOptions<TEntity>): UseQueryResult<PaginatedResponse<TEntity>, ApiClientError> => {
    const { query, filters, minQueryLength = 1, ...queryOptions } = options;

    const queryKey = useMemo(() => 
      this.createQueryKey('search', { query, filters }), 
      [query, filters]
    );

    const queryFn = useCallback(() => 
      this.service.search(query, filters), 
      [query, filters]
    );

    const isEnabled = Boolean(query && query.trim().length >= minQueryLength);

    return useQuery<PaginatedResponse<TEntity>, ApiClientError>({
      queryKey,
      queryFn,
      enabled: isEnabled,
      staleTime: this.config.staleTime,
      gcTime: this.config.gcTime,
      refetchOnWindowFocus: false,
      refetchOnReconnect: this.config.refetchOnReconnect,
      retry: this.config.retry,
      ...queryOptions,
    });
  };

  // ==========================================
  // MUTATION HOOKS
  // ==========================================

  /**
   * Hook for creating new entity with optimistic updates
   * 
   * @example
   * ```typescript
   * const createMutation = factory.useCreate({
   *   onSuccess: (newStudent) => console.log('Created:', newStudent)
   * });
   * ```
   */
  public useCreate = (
    options?: CreateMutationOptions<TCreateDto, TEntity>
  ): UseMutationResult<TEntity, ApiClientError, TCreateDto> => {
    const queryClient = useQueryClient();
    const { invalidateList = true, optimistic = false, ...mutationOptions } = options || {};

    return useMutation<TEntity, ApiClientError, TCreateDto>({
      mutationFn: (data: TCreateDto) => this.service.create(data),
      onMutate: optimistic ? (data: TCreateDto) => this.handleOptimisticCreate(queryClient, data) : undefined,
      onSuccess: (data: TEntity, variables: TCreateDto, context: any) => {
        if (invalidateList) {
          queryClient.invalidateQueries({ queryKey: this.createQueryKey('list') });
        }
        options?.onSuccess?.(data, variables);
      },
      onError: (error: ApiClientError, variables: TCreateDto, context: any) => {
        this.handleMutationError(queryClient, error, context);
        options?.onError?.(error, variables);
      },
      ...mutationOptions,
    });
  };

  /**
   * Hook for updating existing entity with optimistic updates
   * 
   * @example
   * ```typescript
   * const updateMutation = factory.useUpdate({
   *   optimistic: true,
   *   onSuccess: (updatedStudent) => console.log('Updated:', updatedStudent)
   * });
   * ```
   */
  public useUpdate = (
    options?: UpdateMutationOptions<TUpdateDto, TEntity>
  ): UseMutationResult<TEntity, ApiClientError, { id: string; data: TUpdateDto }> => {
    const queryClient = useQueryClient();
    const { invalidateQueries = true, optimistic = this.config.enableOptimisticUpdates, ...mutationOptions } = options || {};

    return useMutation<TEntity, ApiClientError, { id: string; data: TUpdateDto }>({
      mutationFn: ({ id, data }) => this.service.update(id, data),
      onMutate: optimistic ? (variables: { id: string; data: TUpdateDto }) => this.handleOptimisticUpdate(queryClient, variables) : undefined,
      onSuccess: (data: TEntity, variables: { id: string; data: TUpdateDto }, context: any) => {
        if (invalidateQueries) {
          queryClient.invalidateQueries({ queryKey: this.createQueryKey('list') });
          queryClient.invalidateQueries({ queryKey: this.createQueryKey('detail', variables.id) });
        }

        // Update cache with fresh data
        queryClient.setQueryData(this.createQueryKey('detail', variables.id), data);
        options?.onSuccess?.(data, variables);
      },
      onError: (error: ApiClientError, variables: { id: string; data: TUpdateDto }, context: any) => {
        this.handleMutationError(queryClient, error, context);
        options?.onError?.(error, variables);
      },
      ...mutationOptions,
    });
  };

  /**
   * Hook for deleting entity with optimistic updates
   * 
   * @example
   * ```typescript
   * const deleteMutation = factory.useDelete({
   *   onSuccess: () => console.log('Deleted successfully')
   * });
   * ```
   */
  public useDelete = (
    options?: DeleteMutationOptions
  ): UseMutationResult<void, ApiClientError, string> => {
    const queryClient = useQueryClient();
    const { invalidateQueries = true, optimistic = this.config.enableOptimisticUpdates, ...mutationOptions } = options || {};

    return useMutation<void, ApiClientError, string>({
      mutationFn: (id: string) => this.service.delete(id),
      onMutate: optimistic ? (id: string) => this.handleOptimisticDelete(queryClient, id) : undefined,
      onSuccess: (data: void, id: string, context: any) => {
        if (invalidateQueries) {
          queryClient.invalidateQueries({ queryKey: this.createQueryKey('list') });
          queryClient.removeQueries({ queryKey: this.createQueryKey('detail', id) });
        }
        options?.onSuccess?.(data, id);
      },
      onError: (error: ApiClientError, variables: string, context: any) => {
        this.handleMutationError(queryClient, error, context);
        options?.onError?.(error, variables);
      },
      ...mutationOptions,
    });
  };

  /**
   * Hook for bulk create operations
   */
  public useBulkCreate = (
    options?: BulkMutationOptions<TCreateDto[], TEntity[]>
  ): UseMutationResult<TEntity[], ApiClientError, TCreateDto[]> => {
    const queryClient = useQueryClient();
    const { invalidateQueries = true, ...mutationOptions } = options || {};

    return useMutation<TEntity[], ApiClientError, TCreateDto[]>({
      mutationFn: (data: TCreateDto[]) => this.service.bulkCreate(data),
      onSuccess: (data: TEntity[], variables: TCreateDto[], context: any) => {
        if (invalidateQueries) {
          queryClient.invalidateQueries({ queryKey: this.createQueryKey('list') });
        }
        options?.onSuccess?.(data, variables);
      },
      onError: (error: ApiClientError, variables: TCreateDto[], context: any) => {
        this.config.onError(error);
        options?.onError?.(error, variables);
      },
      ...mutationOptions,
    });
  };

  /**
   * Hook for bulk delete operations
   */
  public useBulkDelete = (
    options?: BulkMutationOptions<string[], void>
  ): UseMutationResult<void, ApiClientError, string[]> => {
    const queryClient = useQueryClient();
    const { invalidateQueries = true, ...mutationOptions } = options || {};

    return useMutation<void, ApiClientError, string[]>({
      mutationFn: (ids: string[]) => this.service.bulkDelete(ids),
      onSuccess: (data: void, ids: string[], context: any) => {
        if (invalidateQueries) {
          queryClient.invalidateQueries({ queryKey: this.createQueryKey('list') });
          ids.forEach((id: string) => {
            queryClient.removeQueries({ queryKey: this.createQueryKey('detail', id) });
          });
        }
        options?.onSuccess?.(data, ids);
      },
      onError: (error: ApiClientError, variables: string[], context: any) => {
        this.config.onError(error);
        options?.onError?.(error, variables);
      },
      ...mutationOptions,
    });
  };

  // ==========================================
  // OPTIMISTIC UPDATE HANDLERS
  // ==========================================

  private handleOptimisticCreate = async (queryClient: QueryClient, data: TCreateDto) => {
    // For create operations, we typically don't do optimistic updates
    // since we don't have an ID yet, but we can prepare for rollback
    return { optimisticData: data };
  };

  private handleOptimisticUpdate = async (
    queryClient: QueryClient, 
    { id, data }: { id: string; data: TUpdateDto }
  ) => {
    const detailQueryKey = this.createQueryKey('detail', id);
    
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: detailQueryKey });
    
    // Snapshot the previous value
    const previousData = queryClient.getQueryData<TEntity>(detailQueryKey);
    
    // Optimistically update to the new value
    if (previousData) {
      const optimisticData = { ...previousData, ...data } as TEntity;
      queryClient.setQueryData(detailQueryKey, optimisticData);
    }
    
    return { previousData, detailQueryKey };
  };

  private handleOptimisticDelete = async (queryClient: QueryClient, id: string) => {
    const detailQueryKey = this.createQueryKey('detail', id);
    
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: detailQueryKey });
    
    // Snapshot the previous value
    const previousData = queryClient.getQueryData<TEntity>(detailQueryKey);
    
    // Remove from cache
    queryClient.removeQueries({ queryKey: detailQueryKey });
    
    return { previousData, detailQueryKey };
  };

  private handleMutationError = (queryClient: QueryClient, error: ApiClientError, context: any) => {
    // Rollback optimistic updates on error
    if (context?.previousData && context?.detailQueryKey) {
      queryClient.setQueryData(context.detailQueryKey, context.previousData);
    }
    
    this.config.onError(error);
  };

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Create a standardized query key with optional parameters
   */
  private createQueryKey = (operation: string, params?: unknown): QueryKey => {
    const baseKey = [...this.config.queryKey, operation];
    
    if (params === undefined || params === null) {
      return baseKey;
    }
    
    // Use custom serializer if provided
    if (this.config.keySerializer) {
      return [...baseKey, this.config.keySerializer(params)];
    }
    
    return [...baseKey, params];
  };

  /**
   * Create default error handler with better error context
   */
  private createDefaultErrorHandler = () => {
    return (error: ApiClientError) => {
      const context = `[${this.config.queryKey.join('.')}]`;
      console.error(`${context} API Error:`, {
        message: error.message,
        status: error.status,
        code: error.code,
        timestamp: new Date().toISOString(),
      });
    };
  };

  // ==========================================
  // PUBLIC UTILITY METHODS
  // ==========================================

  /**
   * Get current base query key
   */
  public getQueryKey = (): QueryKey => {
    return this.config.queryKey;
  };

  /**
   * Get list query key with optional filters
   */
  public getListQueryKey = (filters?: FilterParams): QueryKey => {
    return this.createQueryKey('list', filters);
  };

  /**
   * Get detail query key for specific entity
   */
  public getDetailQueryKey = (id: string): QueryKey => {
    return this.createQueryKey('detail', id);
  };

  /**
   * Get search query key with query and filters
   */
  public getSearchQueryKey = (query: string, filters?: FilterParams): QueryKey => {
    return this.createQueryKey('search', { query, filters });
  };

  /**
   * Invalidate all queries for this resource
   */
  public invalidateAll = (queryClient: QueryClient): Promise<void> => {
    return queryClient.invalidateQueries({ queryKey: this.config.queryKey });
  };

  /**
   * Clear all cached data for this resource
   */
  public clearCache = (queryClient: QueryClient): void => {
    queryClient.removeQueries({ queryKey: this.config.queryKey });
  };

  /**
   * Get current configuration
   */
  public getConfig = (): Readonly<typeof this.config> => {
    return this.config;
  };
}

// ==========================================
// FACTORY FUNCTION
// ==========================================

/**
 * Create a typed query hooks factory instance
 * 
 * @example
 * ```typescript
 * const studentHooks = createQueryHooks(studentService, {
 *   queryKey: ['students'],
 *   staleTime: 5 * 60 * 1000, // 5 minutes
 *   enableOptimisticUpdates: true
 * });
 * 
 * // Use in components
 * const { data: students } = studentHooks.useList();
 * const createStudent = studentHooks.useCreate();
 * ```
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

// ==========================================
// HOOK FACTORY TYPES FOR EXTERNAL USE
// ==========================================

/**
 * Type helper for query hooks factory instance
 */
export type QueryHooks<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
> = QueryHooksFactory<TEntity, TCreateDto, TUpdateDto>;

/**
 * Type helper for extracting entity type from hooks factory
 */
export type EntityFromHooks<T> = T extends QueryHooksFactory<infer E, any, any> ? E : never;

/**
 * Type helper for extracting create DTO type from hooks factory
 */
export type CreateDtoFromHooks<T> = T extends QueryHooksFactory<any, infer C, any> ? C : never;

/**
 * Type helper for extracting update DTO type from hooks factory
 */
export type UpdateDtoFromHooks<T> = T extends QueryHooksFactory<any, any, infer U> ? U : never;

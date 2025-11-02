/**
 * TanStack React Query Module Declarations
 * Temporary type declarations for @tanstack/react-query until @types are properly installed
 */

declare module '@tanstack/react-query' {
  import { ReactNode } from 'react';

  // Query Client
  export class QueryClient {
    constructor(config?: QueryClientConfig);
    getQueryData<T = unknown>(queryKey: QueryKey): T | undefined;
    setQueryData<T = unknown>(queryKey: QueryKey, updater: T | ((old: T | undefined) => T)): void;
    invalidateQueries(filters?: InvalidateQueryFilters): Promise<void>;
    removeQueries(filters?: QueryFilters): void;
    cancelQueries(filters?: QueryFilters): Promise<void>;
    prefetchQuery<TData = unknown>(options: UseQueryOptions<TData>): Promise<void>;
    getQueryCache(): QueryCache;
    clear(): void;
  }

  export interface QueryCache {
    getAll(): Query[];
    find(filters?: QueryFilters): Query | undefined;
    findAll(filters?: QueryFilters): Query[];
  }

  export interface Query {
    queryKey: QueryKey;
    state: QueryState;
  }

  export interface QueryState {
    data: unknown;
    error: unknown;
    status: 'pending' | 'error' | 'success';
  }

  export interface QueryFilters {
    queryKey?: QueryKey;
    exact?: boolean;
    type?: 'active' | 'inactive' | 'all';
    predicate?: (query: any) => boolean;
  }

  export interface QueryClientConfig {
    defaultOptions?: {
      queries?: QueryOptions;
      mutations?: MutationOptions;
    };
    queryCache?: any; // Query cache instance
  }

  // Provider
  export const QueryClientProvider: React.FunctionComponent<{
    client: QueryClient;
    children?: ReactNode;
  }>;

  // Hooks
  export function useQuery<TData = unknown, TError = unknown>(
    options: UseQueryOptions<TData, TError>
  ): UseQueryResult<TData, TError>;

  export function useMutation<TData = unknown, TError = unknown, TVariables = unknown>(
    options: UseMutationOptions<TData, TError, TVariables>
  ): UseMutationResult<TData, TError, TVariables>;

  export function useQueryClient(): QueryClient;

  // Types
  export type QueryKey = readonly unknown[];

  export interface UseQueryOptions<TData = unknown, TError = unknown> {
    queryKey: QueryKey;
    queryFn: () => Promise<TData>;
    enabled?: boolean;
    retry?: boolean | number;
    staleTime?: number;
    cacheTime?: number;
    gcTime?: number; // Garbage collection time (replaces cacheTime in newer versions)
    refetchInterval?: number | false; // Auto-refetch interval
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    meta?: Record<string, any>; // Query metadata
    initialData?: TData | (() => TData); // Initial data for the query
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
  }

  export interface UseQueryResult<TData = unknown, TError = unknown> {
    data: TData | undefined;
    error: TError | null;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    isFetching: boolean;
    refetch: () => Promise<void>;
  }

  export interface UseMutationOptions<TData = unknown, TError = unknown, TVariables = unknown> {
    mutationFn: (variables: TVariables) => Promise<TData>;
    mutationKey?: QueryKey; // Unique key for the mutation
    retry?: boolean | number; // Retry configuration
    onMutate?: (variables: TVariables) => void | Promise<any>; // Pre-mutation callback
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
    onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
  }

  export interface UseMutationResult<TData = unknown, TError = unknown, TVariables = unknown> {
    mutate: (variables: TVariables) => void;
    mutateAsync: (variables: TVariables) => Promise<TData>;
    data: TData | undefined;
    error: TError | null;
    isLoading: boolean;
    isPending: boolean;
    isError: boolean;
    isSuccess: boolean;
    reset: () => void;
  }

  export interface QueryOptions {
    retry?: boolean | number;
    staleTime?: number;
    cacheTime?: number;
  }

  export interface MutationOptions {
    retry?: boolean | number;
  }

  export interface InvalidateQueryFilters {
    queryKey?: QueryKey;
    exact?: boolean;
    type?: 'active' | 'inactive' | 'all'; // Filter by query type
    predicate?: (query: any) => boolean; // Custom filter function
  }
}

declare module '@tanstack/react-query-devtools' {
  import { FunctionComponent } from 'react';

  export const ReactQueryDevtools: FunctionComponent<{
    initialIsOpen?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    buildActivity?: boolean; // Show build activity in devtools
  }>;
}

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
    clear(): void;
  }

  export interface QueryClientConfig {
    defaultOptions?: {
      queries?: QueryOptions;
      mutations?: MutationOptions;
    };
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
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
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
  }
}

declare module '@tanstack/react-query-devtools' {
  import { FunctionComponent } from 'react';

  export const ReactQueryDevtools: FunctionComponent<{
    initialIsOpen?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }>;
}

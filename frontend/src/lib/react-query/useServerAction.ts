/**
 * @fileoverview Server Action Wrapper Hook for TanStack Query
 * @module lib/react-query/useServerAction
 * @category Query Utilities
 *
 * Provides type-safe wrappers for server actions with TanStack Query.
 * Simplifies the migration from mock data to real server actions.
 *
 * @example
 * ```typescript
 * // Instead of manually creating useQuery hooks
 * const { data, isLoading } = useQuery({
 *   queryKey: ['students'],
 *   queryFn: () => getStudents(),
 * });
 *
 * // Use the wrapper for consistency
 * const { data, isLoading } = useServerQuery({
 *   queryKey: ['students'],
 *   action: getStudents,
 *   staleTime: 5 * 60 * 1000,
 * });
 * ```
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query';

/**
 * Type for server action response
 * Matches the ActionResult pattern used in server actions
 */
export interface ServerActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

/**
 * Options for useServerQuery hook
 */
export interface UseServerQueryOptions<TData = unknown, TError = Error> {
  queryKey: QueryKey;
  action: () => Promise<TData>;
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  retry?: number | boolean;
  meta?: {
    containsPHI?: boolean;
    errorMessage?: string;
    [key: string]: unknown;
  };
}

/**
 * Options for useServerMutation hook
 */
export interface UseServerMutationOptions<TData = unknown, TVariables = unknown, TError = Error> {
  action: (variables: TVariables) => Promise<ServerActionResult<TData>>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  invalidateQueries?: QueryKey[];
  meta?: {
    containsPHI?: boolean;
    errorMessage?: string;
    [key: string]: unknown;
  };
}

/**
 * Hook for querying data via server actions
 *
 * Wraps TanStack Query's useQuery with sensible defaults for server actions.
 * Provides consistent error handling and loading states.
 *
 * @param options - Query configuration options
 * @returns Query result with data, loading, and error states
 *
 * @example
 * ```typescript
 * import { getBudgetSummary } from '@/lib/actions/budget.actions';
 *
 * function BudgetPage() {
 *   const { data, isLoading, error } = useServerQuery({
 *     queryKey: ['budgetSummary', fiscalYear],
 *     action: () => getBudgetSummary({ fiscalYear }),
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *   });
 *
 *   if (isLoading) return <LoadingSkeleton />;
 *   if (error) return <ErrorState error={error} />;
 *
 *   return <BudgetUI data={data} />;
 * }
 * ```
 */
export function useServerQuery<TData = unknown, TError = Error>(
  options: UseServerQueryOptions<TData, TError>
) {
  const {
    queryKey,
    action,
    staleTime = 5 * 60 * 1000, // 5 minutes default
    gcTime = 30 * 60 * 1000, // 30 minutes default
    enabled = true,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    retry = 3,
    meta,
  } = options;

  return useQuery<TData, TError>({
    queryKey,
    queryFn: action,
    staleTime,
    gcTime,
    enabled,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    meta,
  });
}

/**
 * Hook for mutating data via server actions
 *
 * Wraps TanStack Query's useMutation with automatic cache invalidation
 * and error handling for server actions.
 *
 * @param options - Mutation configuration options
 * @returns Mutation result with mutate function and states
 *
 * @example
 * ```typescript
 * import { createBudgetCategoryAction } from '@/lib/actions/budget.actions';
 *
 * function CreateBudgetForm() {
 *   const mutation = useServerMutation({
 *     action: createBudgetCategoryAction,
 *     invalidateQueries: [['budgetCategories']],
 *     onSuccess: (data) => {
 *       toast.success('Budget category created');
 *     },
 *   });
 *
 *   const handleSubmit = (formData) => {
 *     mutation.mutate(formData);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {mutation.isLoading && <Spinner />}
 *       {mutation.error && <Error error={mutation.error} />}
 *       {/* Form fields *\/}
 *     </form>
 *   );
 * }
 * ```
 */
export function useServerMutation<TData = unknown, TVariables = unknown, TError = Error>(
  options: UseServerMutationOptions<TData, TVariables, TError>
) {
  const { action, onSuccess, onError, invalidateQueries, meta } = options;
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const result = await action(variables);

      if (!result.success) {
        throw new Error(result.error || 'Mutation failed');
      }

      return result.data as TData;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      if (invalidateQueries) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Call custom success handler
      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      // Call custom error handler
      if (onError) {
        onError(error, variables);
      }
    },
    meta,
  });
}

/**
 * Hook for paginated queries via server actions
 *
 * Simplifies pagination with server actions.
 *
 * @example
 * ```typescript
 * const { data, fetchNextPage, hasNextPage } = useServerPaginatedQuery({
 *   queryKey: ['students'],
 *   action: (page) => getStudents({ page }),
 * });
 * ```
 */
export function useServerPaginatedQuery<TData = unknown>(options: {
  queryKey: QueryKey;
  action: (page: number) => Promise<TData[]>;
  staleTime?: number;
}) {
  const { queryKey, action, staleTime = 5 * 60 * 1000 } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Simple pagination - fetch first page
      return action(1);
    },
    staleTime,
  });
}

/**
 * Helper to create query key with filters
 *
 * @param domain - Domain name (e.g., 'students', 'budgets')
 * @param resource - Resource type (e.g., 'list', 'detail')
 * @param filters - Optional filters object
 * @returns Properly structured query key
 *
 * @example
 * ```typescript
 * const queryKey = createQueryKey('students', 'list', { grade: '9th', status: 'active' });
 * // Returns: ['students', 'list', { grade: '9th', status: 'active' }]
 * ```
 */
export function createQueryKey(
  domain: string,
  resource: string,
  filters?: Record<string, unknown>
): QueryKey {
  const key: QueryKey = [domain, resource];
  if (filters && Object.keys(filters).length > 0) {
    key.push(filters);
  }
  return key;
}

/**
 * Default query options for different data types
 */
export const QUERY_DEFAULTS = {
  /** PHI data - short cache, no persistence */
  PHI: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    meta: { containsPHI: true },
  },

  /** Non-PHI user data - medium cache */
  USER_DATA: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },

  /** Static data - long cache */
  STATIC: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  },

  /** Real-time data - short cache, frequent updates */
  REALTIME: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30s
  },
} as const;

/**
 * Prefetch helper for server actions
 *
 * @example
 * ```typescript
 * // In a parent component or on hover
 * await prefetchServerQuery(queryClient, {
 *   queryKey: ['student', studentId],
 *   action: () => getStudent(studentId),
 * });
 * ```
 */
export async function prefetchServerQuery<TData = unknown>(
  queryClient: ReturnType<typeof useQueryClient>,
  options: UseServerQueryOptions<TData>
): Promise<void> {
  const { queryKey, action, staleTime = 5 * 60 * 1000 } = options;

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: action,
    staleTime,
  });
}

export default {
  useServerQuery,
  useServerMutation,
  useServerPaginatedQuery,
  createQueryKey,
  prefetchServerQuery,
  QUERY_DEFAULTS,
};

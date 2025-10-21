/**
 * TanStack Query Integration Middleware
 * 
 * Enterprise middleware for hybrid state management using TanStack Query and Redux.
 * Provides query key factories, cache synchronization, and optimistic updates.
 * 
 * @module tanstackIntegration.middleware
 */

import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Middleware } from '@reduxjs/toolkit';
import React from 'react';

/**
 * Standard query key factory for consistent cache management
 */
export const queryKeys = {
  // Students
  students: {
    all: ['students'] as const,
    lists: () => [...queryKeys.students.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.students.lists(), filters] as const,
    details: () => [...queryKeys.students.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.students.details(), id] as const,
  },
  
  // Medications
  medications: {
    all: ['medications'] as const,
    lists: () => [...queryKeys.medications.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.medications.lists(), filters] as const,
    details: () => [...queryKeys.medications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.medications.details(), id] as const,
    byStudent: (studentId: string) => [...queryKeys.medications.all, 'student', studentId] as const,
  },
  
  // Appointments
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.appointments.lists(), filters] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
    byNurse: (nurseId: string) => [...queryKeys.appointments.all, 'nurse', nurseId] as const,
    byStudent: (studentId: string) => [...queryKeys.appointments.all, 'student', studentId] as const,
  },
  
  // Health Records
  healthRecords: {
    all: ['healthRecords'] as const,
    lists: () => [...queryKeys.healthRecords.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.healthRecords.lists(), filters] as const,
    details: () => [...queryKeys.healthRecords.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.healthRecords.details(), id] as const,
    byStudent: (studentId: string) => [...queryKeys.healthRecords.all, 'student', studentId] as const,
  },
  
  // Inventory
  inventory: {
    all: ['inventory'] as const,
    lists: () => [...queryKeys.inventory.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.inventory.lists(), filters] as const,
    details: () => [...queryKeys.inventory.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.inventory.details(), id] as const,
    lowStock: () => [...queryKeys.inventory.all, 'lowStock'] as const,
  },

  // Communication
  communication: {
    all: ['communication'] as const,
    templates: () => [...queryKeys.communication.all, 'templates'] as const,
    messages: () => [...queryKeys.communication.all, 'messages'] as const,
    broadcasts: () => [...queryKeys.communication.all, 'broadcasts'] as const,
  },
};

/**
 * Hybrid hook that combines TanStack Query with Redux
 */
export function useHybridQuery<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    syncToRedux?: boolean;
    reduxSlice?: string;
    reduxAction?: string;
    optimisticUpdates?: boolean;
  } = {}
) {
  const dispatch = useDispatch();
  
  const query = useQuery({
    queryKey,
    queryFn,
    enabled: options.enabled,
    staleTime: options.staleTime,
    gcTime: options.gcTime,
  });

  // Sync successful data to Redux
  React.useEffect(() => {
    if (query.isSuccess && query.data && options.syncToRedux && options.reduxSlice && options.reduxAction) {
      dispatch({
        type: `${options.reduxSlice}/${options.reduxAction}`,
        payload: query.data,
      });
    }
  }, [query.isSuccess, query.data, options.syncToRedux, options.reduxSlice, options.reduxAction, dispatch]);
  
  return {
    ...query,
    // Additional hybrid utilities
    invalidateRedux: () => {
      if (options.reduxSlice) {
        dispatch({
          type: `${options.reduxSlice}/invalidateCache`,
        });
      }
    },
    syncToRedux: (data: TData) => {
      if (options.reduxSlice && options.reduxAction) {
        dispatch({
          type: `${options.reduxSlice}/${options.reduxAction}`,
          payload: data,
        });
      }
    },
  };
}

/**
 * Hybrid mutation hook with Redux coordination
 */
export function useHybridMutation<TData, TError, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
    optimisticUpdate?: (variables: TVariables) => any;
    rollbackAction?: string;
    successAction?: string;
    reduxSlice?: string;
    invalidateQueries?: readonly unknown[][];
  } = {}
) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      // Cancel outgoing refetches
      if (options.invalidateQueries) {
        await Promise.all(
          options.invalidateQueries.map(queryKey =>
            queryClient.cancelQueries({ queryKey })
          )
        );
      }
      
      // Optimistic update in Redux
      if (options.optimisticUpdate && options.reduxSlice) {
        const optimisticData = options.optimisticUpdate(variables);
        dispatch({
          type: `${options.reduxSlice}/optimisticUpdate`,
          payload: optimisticData,
        });
      }
      
      return { variables };
    },
    onSuccess: (data: TData, variables: TVariables) => {
      // Update Redux with successful result
      if (options.successAction && options.reduxSlice) {
        dispatch({
          type: `${options.reduxSlice}/${options.successAction}`,
          payload: data,
        });
      }
      
      // Invalidate related queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      options.onSuccess?.(data, variables);
    },
    onError: (error: TError, variables: TVariables, context: any) => {
      // Rollback optimistic update
      if (options.rollbackAction && options.reduxSlice && context) {
        dispatch({
          type: `${options.reduxSlice}/${options.rollbackAction}`,
          payload: context.variables,
        });
      }
      
      options.onError?.(error, variables);
    },
  });
}

/**
 * Cache synchronization utilities
 */
export const cacheSyncUtils = {
  /**
   * Sync TanStack Query cache with Redux store
   */
  syncQueryToRedux: <T>(
    queryClient: QueryClient,
    queryKey: readonly unknown[],
    reduxSlice: string,
    reduxAction: string,
    dispatch: any
  ) => {
    const data = queryClient.getQueryData<T>(queryKey);
    if (data) {
      dispatch({
        type: `${reduxSlice}/${reduxAction}`,
        payload: data,
      });
    }
  },
  
  /**
   * Sync Redux state to TanStack Query cache
   */
  syncReduxToQuery: <T>(
    queryClient: QueryClient,
    queryKey: readonly unknown[],
    data: T
  ) => {
    queryClient.setQueryData(queryKey, data);
  },
  
  /**
   * Invalidate both TanStack Query and Redux cache
   */
  invalidateBoth: (
    queryClient: QueryClient,
    queryKey: readonly unknown[],
    reduxSlice: string,
    dispatch: any
  ) => {
    // Invalidate TanStack Query
    queryClient.invalidateQueries({ queryKey });
    
    // Invalidate Redux cache
    dispatch({
      type: `${reduxSlice}/invalidateCache`,
    });
  },
};

/**
 * Background sync middleware for keeping caches in sync
 */
export function createCacheSyncMiddleware(queryClient: QueryClient): Middleware {
  return (_store) => (next) => (action: any) => {
    const result = next(action);
    
    // Auto-sync certain Redux actions to TanStack Query cache
    if (action.type && typeof action.type === 'string') {
      const [sliceName, actionName] = action.type.split('/');
      
      if (actionName === 'fulfilled' && action.payload) {
        // Sync successful async thunk results to query cache
        const entityId = action.meta?.arg?.id || action.payload.id;
        
        if (entityId) {
          // Update individual entity cache
          const entityQueryKeys = queryKeys[sliceName as keyof typeof queryKeys];
          if (entityQueryKeys && 'detail' in entityQueryKeys && typeof entityQueryKeys.detail === 'function') {
            const detailQueryKey = entityQueryKeys.detail(entityId);
            queryClient.setQueryData(detailQueryKey, action.payload);
          }
        }
        
        // Invalidate list queries to trigger refetch
        const listQueryKey = queryKeys[sliceName as keyof typeof queryKeys]?.all;
        if (listQueryKey) {
          queryClient.invalidateQueries({ queryKey: listQueryKey });
        }
      }
    }
    
    return result;
  };
}

/**
 * Query client configuration for enterprise use
 */
export const createQueryClientConfig = () => ({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount: number, error: any) => {
        // Don't retry mutations on client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 1; // Only retry once for mutations
      },
    },
  },
});

/**
 * Optimistic update helpers
 */
export const optimisticUpdateHelpers = {
  /**
   * Create optimistic update for list operations
   */
  createListOptimisticUpdate: <T>(
    queryKey: readonly unknown[],
    queryClient: QueryClient,
    operation: 'add' | 'update' | 'delete',
    item: T,
    getId: (item: T) => string | number
  ) => {
    return queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
      if (!old) return old;
      
      const id = getId(item);
      
      switch (operation) {
        case 'add':
          return [...old, item];
        case 'update':
          return old.map(existingItem => 
            getId(existingItem) === id ? { ...existingItem, ...item } : existingItem
          );
        case 'delete':
          return old.filter(existingItem => getId(existingItem) !== id);
        default:
          return old;
      }
    });
  },

  /**
   * Create optimistic update for detail operations
   */
  createDetailOptimisticUpdate: <T>(
    queryKey: readonly unknown[],
    queryClient: QueryClient,
    updates: Partial<T>
  ) => {
    return queryClient.setQueryData(queryKey, (old: T | undefined) => {
      if (!old) return old;
      return { ...old, ...updates };
    });
  },
};
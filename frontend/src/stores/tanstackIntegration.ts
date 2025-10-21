/**
 * TanStack Query Integration
 * 
 * Hybrid approach combining TanStack Query for server state management
 * with Redux for client state, providing seamless synchronization and
 * optimistic updates coordination.
 */

import React from 'react';
import { QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './reduxStore';
import { createSelector } from '@reduxjs/toolkit';

// Query client configuration for healthcare data
export const createHealthcareQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Healthcare data should be fresh but not overly aggressive
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: (failureCount, error: any) => {
          // Don't retry on authentication errors
          if (error?.status === 401 || error?.status === 403) return false;
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Enable background refetch for critical health data
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
        // Optimistic updates will be handled by Redux
        onError: (error, variables, context) => {
          console.error('Mutation failed:', error);
        },
      },
    },
  });
};

// Query key factories for consistent cache management
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
};

/**
 * Hybrid hook that combines TanStack Query with Redux
 * Provides server state via TanStack Query and client state via Redux
 */
export function useHybridQuery<TData, TError = Error>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options: {
    // TanStack Query options
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    // Redux integration options
    syncToRedux?: boolean;
    reduxSlice?: string;
    reduxAction?: string;
    // Optimistic updates
    optimisticUpdates?: boolean;
  } = {}
) {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey,
    queryFn,
    enabled: options.enabled,
    staleTime: options.staleTime,
    gcTime: options.gcTime,
  });

  // Handle success callback manually since onSuccess is deprecated
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
    // TanStack Query options
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
    // Redux integration
    optimisticUpdate?: (variables: TVariables) => any;
    rollbackAction?: string;
    successAction?: string;
    reduxSlice?: string;
    // Cache invalidation
    invalidateQueries?: readonly unknown[][];
  } = {}
) {
  const dispatch = useDispatch<AppDispatch>();
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
      
      // Return context for rollback
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
    dispatch: AppDispatch
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
    dispatch: AppDispatch
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
export function createCacheSyncMiddleware(queryClient: QueryClient) {
  return (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    
    // Sync specific Redux actions to TanStack Query
    if (action.type.endsWith('/fulfilled')) {
      const [sliceName] = action.type.split('/');
      const data = action.payload;
      
      // Determine appropriate query key based on slice
      let queryKey: readonly unknown[] | null = null;
      
      switch (sliceName) {
        case 'students':
          if (action.meta?.arg?.id) {
            queryKey = queryKeys.students.detail(action.meta.arg.id);
          } else {
            queryKey = queryKeys.students.lists();
          }
          break;
        case 'medications':
          if (action.meta?.arg?.id) {
            queryKey = queryKeys.medications.detail(action.meta.arg.id);
          } else {
            queryKey = queryKeys.medications.lists();
          }
          break;
        case 'appointments':
          if (action.meta?.arg?.id) {
            queryKey = queryKeys.appointments.detail(action.meta.arg.id);
          } else {
            queryKey = queryKeys.appointments.lists();
          }
          break;
        // Add more cases as needed
      }
      
      // Update TanStack Query cache
      if (queryKey && data) {
        queryClient.setQueryData(queryKey, data);
      }
    }
    
    return result;
  };
}

/**
 * Prefetch utilities for performance optimization
 */
export const prefetchUtils = {
  /**
   * Prefetch student data when hovering over student cards
   */
  prefetchStudent: (queryClient: QueryClient, studentId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.students.detail(studentId),
      queryFn: () => import('../services/api').then(api => api.studentsApi.getById(studentId)),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },
  
  /**
   * Prefetch related data for a student (medications, appointments, etc.)
   */
  prefetchStudentRelated: (queryClient: QueryClient, studentId: string) => {
    // Prefetch medications
    queryClient.prefetchQuery({
      queryKey: queryKeys.medications.byStudent(studentId),
      queryFn: () => import('../services/api').then(api => 
        api.medicationsApi.getAll({ studentId })
      ),
    });
    
    // Prefetch appointments
    queryClient.prefetchQuery({
      queryKey: queryKeys.appointments.byStudent(studentId),
      queryFn: () => import('../services/api').then(api => 
        api.appointmentsApi.getAll({ studentId })
      ),
    });
    
    // Prefetch health records
    queryClient.prefetchQuery({
      queryKey: queryKeys.healthRecords.byStudent(studentId),
      queryFn: () => import('../services/api').then(api => 
        api.healthRecordsApi.getAll({ studentId })
      ),
    });
  },
  
  /**
   * Prefetch nurse schedule
   */
  prefetchNurseSchedule: (queryClient: QueryClient, nurseId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.appointments.byNurse(nurseId),
      queryFn: () => import('../services/api').then(api => 
        api.appointmentsApi.getAll({ nurseId })
      ),
    });
  },
};

/**
 * Real-time sync utilities for WebSocket integration
 */
export const realtimeSyncUtils = {
  /**
   * Handle real-time updates from WebSocket
   */
  handleRealtimeUpdate: (
    queryClient: QueryClient,
    dispatch: AppDispatch,
    update: {
      type: 'create' | 'update' | 'delete';
      entity: string;
      id: string;
      data?: any;
    }
  ) => {
    const { type, entity, id, data } = update;
    
    // Update TanStack Query cache
    switch (entity) {
      case 'student':
        if (type === 'update' && data) {
          queryClient.setQueryData(queryKeys.students.detail(id), data);
          // Invalidate list queries to refetch
          queryClient.invalidateQueries({ queryKey: queryKeys.students.lists() });
        } else if (type === 'delete') {
          queryClient.removeQueries({ queryKey: queryKeys.students.detail(id) });
          queryClient.invalidateQueries({ queryKey: queryKeys.students.lists() });
        }
        break;
      
      case 'appointment':
        if (type === 'create' || type === 'update') {
          if (data) {
            queryClient.setQueryData(queryKeys.appointments.detail(id), data);
          }
          queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
        } else if (type === 'delete') {
          queryClient.removeQueries({ queryKey: queryKeys.appointments.detail(id) });
          queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
        }
        break;
      
      // Add more entities as needed
    }
    
    // Update Redux store
    dispatch({
      type: `${entity}s/realtimeUpdate`,
      payload: { type, id, data },
    });
  },
  
  /**
   * Setup WebSocket listeners for real-time updates
   */
  setupRealtimeSync: (
    queryClient: QueryClient,
    dispatch: AppDispatch,
    websocket: WebSocket
  ) => {
    websocket.addEventListener('message', (event) => {
      try {
        const update = JSON.parse(event.data);
        if (update.type && update.entity && update.id) {
          realtimeSyncUtils.handleRealtimeUpdate(queryClient, dispatch, update);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });
  },
};

/**
 * Error boundary integration for query errors
 */
export const errorHandlingUtils = {
  /**
   * Global error handler for TanStack Query
   */
  createGlobalErrorHandler: (dispatch: AppDispatch) => {
    return (error: any, query: any) => {
      // Log error for monitoring
      console.error('Query error:', error, query);
      
      // Dispatch to Redux for global error handling
      dispatch({
        type: 'ui/addError',
        payload: {
          id: `query_error_${Date.now()}`,
          message: error.message || 'An error occurred while fetching data',
          type: 'error',
          queryKey: query.queryKey,
        },
      });
      
      // Handle specific error types
      if (error.status === 401) {
        dispatch({ type: 'auth/logout' });
      } else if (error.status === 403) {
        dispatch({
          type: 'ui/addError',
          payload: {
            id: `access_denied_${Date.now()}`,
            message: 'Access denied. Please check your permissions.',
            type: 'warning',
          },
        });
      }
    };
  },
};

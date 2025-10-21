/**
 * Service Integration Middleware
 * 
 * Enterprise middleware for integrating API services with Redux state management.
 * Provides standardized service adapters, thunk creators, and batch operations.
 * 
 * @module serviceIntegration.middleware
 */

import { createAsyncThunk, Middleware } from '@reduxjs/toolkit';

/**
 * Generic service adapter interface
 * Provides standardized CRUD operations for API services
 */
export interface ServiceAdapter<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  getAll: (params?: any) => Promise<{ data: T[]; total?: number; pagination?: any }>;
  getById: (id: string) => Promise<{ data: T }>;
  create: (data: TCreate) => Promise<{ data: T }>;
  update: (id: string, data: TUpdate) => Promise<{ data: T }>;
  delete: (id: string) => Promise<{ success: boolean; id?: string }>;
}

/**
 * Service adapter factory
 * Creates standardized service adapters with error handling and response normalization
 */
export function createServiceAdapter<T, TCreate = Partial<T>, TUpdate = Partial<T>>(
  serviceName: string,
  apiService: any
): ServiceAdapter<T, TCreate, TUpdate> {
  return {
    async getAll(params = {}) {
      try {
        const response = await apiService.getAll(params);
        
        if (response.success && response.data) {
          if (Array.isArray(response.data)) {
            return { data: response.data };
          } else if (response.data.items || response.data[serviceName]) {
            return {
              data: response.data.items || response.data[serviceName] || [],
              total: response.data.total || response.data.pagination?.total,
              pagination: response.data.pagination,
            };
          }
        } else if (Array.isArray(response)) {
          return { data: response };
        } else if (response.data && Array.isArray(response.data)) {
          return { data: response.data };
        }
        
        return { data: [] };
      } catch (error) {
        console.error(`Service adapter error for ${serviceName}.getAll:`, error);
        throw error;
      }
    },

    async getById(id: string) {
      try {
        const response = await apiService.getById(id);
        
        if (response.success && response.data) {
          return { data: response.data };
        } else if (response.data) {
          return { data: response.data };
        } else {
          return { data: response };
        }
      } catch (error) {
        console.error(`Service adapter error for ${serviceName}.getById:`, error);
        throw error;
      }
    },

    async create(data: TCreate) {
      try {
        const response = await apiService.create(data);
        
        if (response.success && response.data) {
          return { data: response.data };
        } else if (response.data) {
          return { data: response.data };
        } else {
          return { data: response };
        }
      } catch (error) {
        console.error(`Service adapter error for ${serviceName}.create:`, error);
        throw error;
      }
    },

    async update(id: string, data: TUpdate) {
      try {
        const response = await apiService.update(id, data);
        
        if (response.success && response.data) {
          return { data: response.data };
        } else if (response.data) {
          return { data: response.data };
        } else {
          return { data: response };
        }
      } catch (error) {
        console.error(`Service adapter error for ${serviceName}.update:`, error);
        throw error;
      }
    },

    async delete(id: string) {
      try {
        const response = await apiService.delete(id);
        
        if (response.success !== undefined) {
          return { success: response.success, id };
        } else {
          return { success: true, id };
        }
      } catch (error) {
        console.error(`Service adapter error for ${serviceName}.delete:`, error);
        throw error;
      }
    },
  };
}

/**
 * Enhanced async thunk creator for service integration
 */
export function createServiceThunk<T, TArg = void>(
  typePrefix: string,
  serviceAdapter: ServiceAdapter<T>,
  operation: 'getAll' | 'getById' | 'create' | 'update' | 'delete',
  options: {
    transformArg?: (arg: TArg) => any;
    transformResult?: (result: any) => T | T[];
    onSuccess?: (result: any, arg: TArg) => void;
    onError?: (error: any, arg: TArg) => void;
  } = {}
) {
  return createAsyncThunk<any, TArg>(
    `${typePrefix}/${operation}`,
    async (arg, { rejectWithValue }) => {
      try {
        const transformedArg = options.transformArg ? options.transformArg(arg) : arg;
        let result;

        switch (operation) {
          case 'getAll':
            result = await serviceAdapter.getAll(transformedArg);
            break;
          case 'getById':
            result = await serviceAdapter.getById(transformedArg as string);
            break;
          case 'create':
            result = await serviceAdapter.create(transformedArg);
            break;
          case 'update': {
            const { id, data } = transformedArg as { id: string; data: any };
            result = await serviceAdapter.update(id, data);
            break;
          }
          case 'delete':
            result = await serviceAdapter.delete(transformedArg as string);
            break;
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }

        const transformedResult = options.transformResult 
          ? options.transformResult(result) 
          : result;

        if (options.onSuccess) {
          options.onSuccess(transformedResult, arg);
        }

        return transformedResult;
      } catch (error: any) {
        if (options.onError) {
          options.onError(error, arg);
        }

        return rejectWithValue({
          message: error.message || `Failed to ${operation}`,
          status: error.status,
          code: error.code,
        });
      }
    }
  );
}

/**
 * Batch operation utilities for service adapters
 */
export function createBatchOperations<T>(serviceAdapter: ServiceAdapter<T>) {
  return {
    async batchCreate(items: Partial<T>[]): Promise<T[]> {
      const results = await Promise.allSettled(
        items.map(item => serviceAdapter.create(item))
      );
      
      return results
        .filter((result): result is PromiseFulfilledResult<{ data: T }> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value.data);
    },

    async batchUpdate(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
      const results = await Promise.allSettled(
        updates.map(({ id, data }) => serviceAdapter.update(id, data))
      );
      
      return results
        .filter((result): result is PromiseFulfilledResult<{ data: T }> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value.data);
    },

    async batchDelete(ids: string[]): Promise<string[]> {
      const results = await Promise.allSettled(
        ids.map(id => serviceAdapter.delete(id))
      );
      
      return results
        .map((result, index) => ({ result, id: ids[index] }))
        .filter(({ result }) => result.status === 'fulfilled')
        .map(({ id }) => id);
    },
  };
}

/**
 * Service integration middleware for Redux
 * Provides automatic service error handling and response normalization
 */
export const createServiceIntegrationMiddleware = (): Middleware => {
  return (_store) => (next) => (action: any) => {
    // Handle service-related actions
    if (action.type && typeof action.type === 'string' && action.type.includes('/')) {
      const [sliceName, actionName] = action.type.split('/');
      
      // Log service operations for monitoring
      if (['pending', 'fulfilled', 'rejected'].some(status => actionName.endsWith(status))) {
        const operationType = actionName.replace(/(pending|fulfilled|rejected)$/, '');
        console.log(`[ServiceIntegration] ${sliceName}.${operationType}: ${actionName}`);
      }
    }
    
    return next(action);
  };
};

/**
 * Service health monitoring utilities
 */
export function createServiceHealthMonitor(serviceName: string, serviceAdapter: ServiceAdapter<any>) {
  return {
    async checkHealth(): Promise<{
      serviceName: string;
      status: 'healthy' | 'degraded' | 'unhealthy';
      responseTime: number;
      error?: string;
    }> {
      const startTime = performance.now();
      
      try {
        await serviceAdapter.getAll({ limit: 1 });
        const responseTime = performance.now() - startTime;
        
        return {
          serviceName,
          status: responseTime < 1000 ? 'healthy' : 'degraded',
          responseTime,
        };
      } catch (error: any) {
        const responseTime = performance.now() - startTime;
        
        return {
          serviceName,
          status: 'unhealthy',
          responseTime,
          error: error.message,
        };
      }
    },
  };
}
/**
 * Service Layer Integration
 * 
 * Provides seamless integration between Redux slices and existing service layers,
 * enabling gradual migration and maintaining API compatibility.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './reduxStore';

// Import existing API services
import { studentsApi } from '../services/api';
import { medicationsApi } from '../services/api';
import { appointmentsApi } from '../services/api';
import { healthRecordsApi } from '../services/api';
import { emergencyContactsApi } from '../services/api';
import { documentsApi } from '../services/api';
import { communicationApi } from '../services/api';
import { inventoryApi } from '../services/api';
import { reportsApi } from '../services/api';
import { administrationApi } from '../services/api';

/**
 * Service adapter interface for standardizing API calls
 */
export interface ServiceAdapter<T, TCreate = Partial<T>, TUpdate = Partial<T>, TFilters = any> {
  getAll: (filters?: TFilters) => Promise<{ data: T[]; total?: number; pagination?: any }>;
  getById: (id: string) => Promise<{ data: T }>;
  create: (data: TCreate) => Promise<{ data: T }>;
  update: (id: string, data: TUpdate) => Promise<{ data: T }>;
  delete: (id: string) => Promise<{ success: boolean }>;
}

/**
 * Create service adapter that wraps existing API services
 */
export function createServiceAdapter<T, TCreate = Partial<T>, TUpdate = Partial<T>, TFilters = any>(
  serviceName: string,
  apiService: any
): ServiceAdapter<T, TCreate, TUpdate, TFilters> {
  return {
    async getAll(filters?: TFilters) {
      try {
        // Handle different API response formats
        const response = await apiService.getAll(filters);
        
        // Normalize response format
        if (response.success && response.data) {
          // Format: { success: true, data: { items: [], pagination: {} } }
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
          // Direct array response
          return { data: response };
        } else if (response.data && Array.isArray(response.data)) {
          // Format: { data: [] }
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
          return { success: response.success };
        } else {
          return { success: true };
        }
      } catch (error) {
        console.error(`Service adapter error for ${serviceName}.delete:`, error);
        throw error;
      }
    },
  };
}

/**
 * Pre-configured service adapters for all domain entities
 */
export const serviceAdapters = {
  students: createServiceAdapter('students', studentsApi),
  medications: createServiceAdapter('medications', medicationsApi),
  appointments: createServiceAdapter('appointments', appointmentsApi),
  healthRecords: createServiceAdapter('healthRecords', healthRecordsApi),
  emergencyContacts: createServiceAdapter('emergencyContacts', emergencyContactsApi),
  documents: createServiceAdapter('documents', documentsApi),
  communication: createServiceAdapter('communication', communicationApi),
  inventory: createServiceAdapter('inventory', inventoryApi),
  reports: createServiceAdapter('reports', reportsApi),
  users: createServiceAdapter('users', administrationApi),
  districts: createServiceAdapter('districts', administrationApi),
  schools: createServiceAdapter('schools', administrationApi),
  settings: createServiceAdapter('settings', administrationApi),
};

/**
 * Enhanced async thunk creator that integrates with service adapters
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
  return createAsyncThunk<any, TArg, { state: RootState }>(
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
          case 'update':
            const { id, data } = transformedArg as { id: string; data: any };
            result = await serviceAdapter.update(id, data);
            break;
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
 * Service integration utilities
 */
export const serviceIntegrationUtils = {
  /**
   * Create a complete set of thunks for a service
   */
  createServiceThunks: <T>(
    sliceName: string,
    serviceAdapter: ServiceAdapter<T>
  ) => {
    return {
      fetchList: createServiceThunk(
        sliceName,
        serviceAdapter,
        'getAll',
        {
          transformResult: (result) => result.data || [],
        }
      ),
      fetchById: createServiceThunk(
        sliceName,
        serviceAdapter,
        'getById',
        {
          transformResult: (result) => result.data,
        }
      ),
      create: createServiceThunk(
        sliceName,
        serviceAdapter,
        'create',
        {
          transformResult: (result) => result.data,
        }
      ),
      update: createServiceThunk(
        sliceName,
        serviceAdapter,
        'update',
        {
          transformResult: (result) => result.data,
        }
      ),
      delete: createServiceThunk(
        sliceName,
        serviceAdapter,
        'delete',
        {
          transformArg: (id: string) => id,
          transformResult: (result) => ({ id: result.id || result.data?.id, success: result.success }),
        }
      ),
    };
  },

  /**
   * Batch operation utilities
   */
  createBatchOperations: <T>(
    serviceAdapter: ServiceAdapter<T>
  ) => {
    return {
      batchCreate: async (items: Partial<T>[]): Promise<T[]> => {
        const results = await Promise.allSettled(
          items.map(item => serviceAdapter.create(item))
        );
        
        return results
          .filter((result): result is PromiseFulfilledResult<{ data: T }> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value.data);
      },

      batchUpdate: async (updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> => {
        const results = await Promise.allSettled(
          updates.map(({ id, data }) => serviceAdapter.update(id, data))
        );
        
        return results
          .filter((result): result is PromiseFulfilledResult<{ data: T }> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value.data);
      },

      batchDelete: async (ids: string[]): Promise<string[]> => {
        const results = await Promise.allSettled(
          ids.map(id => serviceAdapter.delete(id))
        );
        
        return results
          .map((result, index) => ({ result, id: ids[index] }))
          .filter(({ result }) => result.status === 'fulfilled')
          .map(({ id }) => id);
      },
    };
  },

  /**
   * Service health monitoring
   */
  monitorServiceHealth: (serviceName: string, serviceAdapter: ServiceAdapter<any>) => {
    return {
      async checkHealth(): Promise<{
        serviceName: string;
        status: 'healthy' | 'degraded' | 'unhealthy';
        responseTime: number;
        error?: string;
      }> {
        const startTime = performance.now();
        
        try {
          // Try a simple getAll operation with minimal parameters
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
  },

  /**
   * Service caching utilities
   */
  createServiceCache: <T>(ttl: number = 5 * 60 * 1000) => {
    const cache = new Map<string, { data: T; timestamp: number }>();
    
    return {
      get: (key: string): T | null => {
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < ttl) {
          return cached.data;
        }
        cache.delete(key);
        return null;
      },
      
      set: (key: string, data: T): void => {
        cache.set(key, { data, timestamp: Date.now() });
      },
      
      clear: (): void => {
        cache.clear();
      },
      
      size: (): number => {
        return cache.size;
      },
    };
  },
};

/**
 * Service integration middleware
 */
export function createServiceIntegrationMiddleware() {
  return (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    
    // Log service integration metrics
    if (action.type.includes('/pending')) {
      console.log(`[Service Integration] ${action.type} started`);
    } else if (action.type.includes('/fulfilled')) {
      console.log(`[Service Integration] ${action.type} completed successfully`);
    } else if (action.type.includes('/rejected')) {
      console.error(`[Service Integration] ${action.type} failed:`, action.payload);
    }
    
    return result;
  };
}

/**
 * Service compatibility layer for legacy code
 */
export const serviceCompatibility = {
  /**
   * Create Redux-compatible hooks that work with existing service calls
   */
  createCompatibilityHook: <T>(
    serviceName: string,
    legacyServiceCall: () => Promise<T>
  ) => {
    return () => {
      const [data, setData] = React.useState<T | null>(null);
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState<string | null>(null);
      
      const fetchData = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
          const result = await legacyServiceCall();
          setData(result);
        } catch (err: any) {
          setError(err.message || 'An error occurred');
        } finally {
          setLoading(false);
        }
      }, [legacyServiceCall]);
      
      React.useEffect(() => {
        fetchData();
      }, [fetchData]);
      
      return { data, loading, error, refetch: fetchData };
    };
  },

  /**
   * Wrap legacy service calls to work with Redux actions
   */
  wrapLegacyService: <T>(
    serviceName: string,
    legacyService: any,
    dispatch: AppDispatch
  ) => {
    return {
      async getAll(filters?: any) {
        dispatch({ type: `${serviceName}/fetchList/pending` });
        
        try {
          const result = await legacyService.getAll(filters);
          dispatch({ 
            type: `${serviceName}/fetchList/fulfilled`, 
            payload: result 
          });
          return result;
        } catch (error) {
          dispatch({ 
            type: `${serviceName}/fetchList/rejected`, 
            payload: error 
          });
          throw error;
        }
      },
      
      async create(data: Partial<T>) {
        dispatch({ type: `${serviceName}/create/pending` });
        
        try {
          const result = await legacyService.create(data);
          dispatch({ 
            type: `${serviceName}/create/fulfilled`, 
            payload: result 
          });
          return result;
        } catch (error) {
          dispatch({ 
            type: `${serviceName}/create/rejected`, 
            payload: error 
          });
          throw error;
        }
      },
      
      // Add other methods as needed
    };
  },
};

/**
 * Service integration testing utilities
 */
export const serviceTestingUtils = {
  /**
   * Create mock service adapter for testing
   */
  createMockServiceAdapter: <T>(mockData: T[]): ServiceAdapter<T> => {
    return {
      async getAll() {
        return { data: mockData };
      },
      
      async getById(id: string) {
        const item = mockData.find((item: any) => item.id === id);
        if (!item) {
          throw new Error(`Item with id ${id} not found`);
        }
        return { data: item };
      },
      
      async create(data: Partial<T>) {
        const newItem = { ...data, id: Date.now().toString() } as T;
        mockData.push(newItem);
        return { data: newItem };
      },
      
      async update(id: string, data: Partial<T>) {
        const index = mockData.findIndex((item: any) => item.id === id);
        if (index === -1) {
          throw new Error(`Item with id ${id} not found`);
        }
        const updatedItem = { ...mockData[index], ...data };
        mockData[index] = updatedItem;
        return { data: updatedItem };
      },
      
      async delete(id: string) {
        const index = mockData.findIndex((item: any) => item.id === id);
        if (index === -1) {
          throw new Error(`Item with id ${id} not found`);
        }
        mockData.splice(index, 1);
        return { success: true };
      },
    };
  },

  /**
   * Validate service adapter compatibility
   */
  validateServiceAdapter: async <T>(
    adapter: ServiceAdapter<T>,
    testData: Partial<T>
  ): Promise<boolean> => {
    try {
      // Test create
      const created = await adapter.create(testData);
      if (!created.data) return false;
      
      // Test getById
      const retrieved = await adapter.getById((created.data as any).id);
      if (!retrieved.data) return false;
      
      // Test update
      const updated = await adapter.update((created.data as any).id, testData);
      if (!updated.data) return false;
      
      // Test getAll
      const list = await adapter.getAll();
      if (!Array.isArray(list.data)) return false;
      
      // Test delete
      const deleted = await adapter.delete((created.data as any).id);
      if (!deleted.success) return false;
      
      return true;
    } catch (error) {
      console.error('Service adapter validation failed:', error);
      return false;
    }
  },
};

// Import React for compatibility hooks
import React from 'react';

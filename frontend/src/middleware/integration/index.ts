/**
 * Integration Middleware Index
 * 
 * Centralized exports for integration middleware including service adapters,
 * TanStack Query integration, and hybrid state management.
 */

// Service Integration
export * from './serviceIntegration.middleware';

// TanStack Query Integration
export * from './tanstackIntegration.middleware';

// Main integration utilities
export {
  createServiceAdapter,
  createServiceThunk,
  createBatchOperations,
  createServiceHealthMonitor,
  createServiceIntegrationMiddleware,
} from './serviceIntegration.middleware';

export {
  queryKeys,
  useHybridQuery,
  useHybridMutation,
  cacheSyncUtils,
  createCacheSyncMiddleware,
  createQueryClientConfig,
  optimisticUpdateHelpers,
} from './tanstackIntegration.middleware';
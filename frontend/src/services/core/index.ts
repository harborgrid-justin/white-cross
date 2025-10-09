/**
 * Core API Services - Enterprise-grade API handling
 *
 * This module provides a comprehensive, type-safe API layer with:
 * - Enhanced error handling and retry logic
 * - Request/response interceptors
 * - Performance monitoring and tracking
 * - Type-safe CRUD operations
 * - TanStack Query integration
 * - Automatic token refresh
 * - Request deduplication
 */

// ==========================================
// CORE EXPORTS
// ==========================================

export { ApiClient, ApiClientError, apiClient } from './ApiClient';
export type {
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,
  ApiClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './ApiClient';

export { BaseApiService, createApiService } from './BaseApiService';
export type {
  BaseEntity,
  PaginationParams,
  FilterParams,
  CrudOperations,
} from './BaseApiService';

export { QueryHooksFactory, createQueryHooks } from './QueryHooksFactory';
export type {
  QueryHooksConfig,
  ListQueryOptions,
  DetailQueryOptions,
  CreateMutationOptions,
  UpdateMutationOptions,
  DeleteMutationOptions,
} from './QueryHooksFactory';

export { ApiMonitoring, apiMonitoring } from './ApiMonitoring';
export type {
  ApiMetrics,
  PerformanceStats,
  MonitoringConfig,
} from './ApiMonitoring';

// ==========================================
// CONFIGURED INSTANCE
// ==========================================

import { apiClient } from './ApiClient';
import { apiMonitoring } from './ApiMonitoring';

// Add monitoring interceptors to the API client
apiClient.addRequestInterceptor(apiMonitoring.createRequestInterceptor());
apiClient.addResponseInterceptor(apiMonitoring.createResponseInterceptor());

// Export configured instance as default
export default apiClient;

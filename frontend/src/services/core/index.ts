/**
 * WF-IDX-258 | index.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./ApiClient, ./ApiMonitoring | Dependencies: ./ApiClient, ./ApiMonitoring
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, types, named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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

export { ApiClient, ApiClientError, apiClient, createCancellableRequest } from './ApiClient';
export type {
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,
  ApiClientConfig,
  CancellableRequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ResilienceHook,
} from './ApiClient';

// Additional exports from extracted modules (for advanced usage)
export { normalizeError } from './ApiClient.errors';
export type { CancellableRequest } from './ApiClient.cancellation';
export {
  createAuthRequestInterceptor,
  createAuthResponseInterceptor,
  isRetryableError as isRetryableApiError,
  generateRequestId,
  sleep,
} from './ApiClient.interceptors';
export type { ResponseInterceptorOptions } from './ApiClient.interceptors';
export {
  getAuthToken,
  refreshAuthToken,
  handleAuthFailure,
} from './ApiClient.auth';

// Resilient API Client and components
export { ResilientApiClient, createResilientApiClient } from './ResilientApiClient';
export { ResilientRequestExecutor } from './ResilientRequestExecutor';
export type { RequestExecutorConfig } from './ResilientRequestExecutor';
export { ResilienceContextBuilder, resilienceContextBuilder } from './ResilienceContextBuilder';
export { ResilienceMetricsCollector } from './ResilienceMetricsCollector';
export type { AggregatedResilienceMetrics, MetricsCollectorConfig, HealthReport } from './ResilienceMetricsCollector';

// Export from new modular base-api structure (backward compatible)
export { BaseApiService, createApiService } from './base-api';
export type {
  BaseEntity,
  PaginationParams,
  FilterParams,
  CrudOperations,
  PaginatedResponse as BaseApiPaginatedResponse,
} from './base-api';

export { QueryHooksFactory, createQueryHooks } from './QueryHooksFactory';
export type {
  QueryHooksConfig,
  ListQueryOptions,
  DetailQueryOptions,
  SearchQueryOptions,
  CreateMutationOptions,
  UpdateMutationOptions,
  DeleteMutationOptions,
  BulkMutationOptions,
  QueryHooks,
  EntityFromHooks,
  CreateDtoFromHooks,
  UpdateDtoFromHooks,
} from './QueryHooksFactory';

export { ApiMonitoring, apiMonitoring } from './ApiMonitoring';
export type {
  ApiMetrics,
  PerformanceStats,
  MonitoringConfig,
} from './ApiMonitoring';

// ==========================================
// ERROR HANDLING
// ==========================================

export {
  ApiError,
  ValidationError,
  NetworkError,
  AuthenticationError,
  createApiError,
  createValidationError,
  createNetworkError,
  createAuthenticationError,
  isRetryableError,
  getUserFriendlyMessage,
  getErrorLogData,
} from './errors';

// ==========================================
// CONFIGURATION MANAGEMENT
// ==========================================

export {
  ConfigurationService,
  getConfiguration,
  configurationService,
} from './ConfigurationService';

export type {
  ApiConfig,
  SecurityConfig,
  CacheConfig,
  AuditConfig,
  ResilienceConfig,
  PerformanceConfig,
  AppConfiguration,
} from './ConfigurationService';

// ==========================================
// SERVICE REGISTRY & MANAGEMENT
// ==========================================

export {
  ServiceRegistry,
  serviceRegistry,
  RegisterService,
} from './ServiceRegistry';

export type {
  ServiceMetadata,
  ServiceCategory,
  ServiceHealth,
  ServiceStatus,
  ServiceMetrics,
  ServiceDependency,
} from './ServiceRegistry';

export {
  ServiceManager,
  getServiceManager,
  serviceManager,
} from './ServiceManager';

export type {
  ServiceInitializationOptions,
  ServiceHealth as ServiceManagerHealth,
  ServiceManagerStatus,
  ServiceLifecycleHooks,
} from './ServiceManager';

// Import additional service management exports
export type {
  ServiceInventoryEntry,
  RegistryState,
  DependencyCheckResult,
} from './ServiceRegistry.types';

// ==========================================
// CONFIGURATION MODULE
// ==========================================

export * from './config';

// ==========================================
// SERVICE INTERFACES
// ==========================================

export * from './interfaces';

// ==========================================
// SERVICE INITIALIZATION
// ==========================================

export {
  initializeServices,
  cleanupServices,
  isServicesInitialized,
  getInitializationStatus,
  reinitializeServices,
} from './initialize';

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

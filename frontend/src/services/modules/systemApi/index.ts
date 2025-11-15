/**
 * @fileoverview System API Module Entry Point
 *
 * @deprecated This module is deprecated and will be removed on 2026-06-30.
 * Please migrate to @/lib/actions/admin.monitoring and @/lib/actions/admin.settings instead.
 *
 * MIGRATION EXAMPLES:
 * ```typescript
 * // OLD: Using systemApi
 * import { createSystemApi } from '@/services/modules/systemApi';
 * const systemApi = createSystemApi(client);
 * const health = await systemApi.getHealth();
 * const config = await systemApi.getConfig();
 *
 * // NEW: Using Server Actions
 * import { getSystemHealth } from '@/lib/actions/admin.monitoring';
 * import { getSystemSettings } from '@/lib/actions/admin.settings';
 * const health = await getSystemHealth();
 * const config = await getSystemSettings();
 * ```
 *
 * Provides clean exports for all system administration functionality including
 * the main API service class, type definitions, validation schemas, and
 * individual operation modules.
 *
 * @module systemApi
 * @version 1.0.0
 * @since 2025-11-11
 */

// Main API service class and factory function
export { SystemApi, createSystemApi } from './systemApi';

// Core and specialized operation classes for advanced usage
export { SystemCoreOperations, createSystemCoreOperations } from './core-operations';
export { SystemSpecializedOperations, createSystemSpecializedOperations } from './specialized-operations';

// Comprehensive type definitions
export type {
  // System Configuration Types
  SystemConfig,
  UpdateSystemConfigRequest,
  ConfigCategory,
  ConfigValueType,

  // Feature Flag Types
  FeatureFlag,
  CreateFeatureFlagRequest,
  UpdateFeatureFlagRequest,
  FeatureFlagStatus,

  // Grade Transition Types
  GradeTransitionConfig,
  ExecuteGradeTransitionRequest,
  GradeTransitionResult,
  GradeTransitionStatus,

  // System Health Types
  SystemHealth,
  ComponentHealth,
  HealthCheckResponse,
  HealthStatus,
  ComponentStatus,

  // Integration Types
  Integration,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  IntegrationTestResult,
  IntegrationType,
  IntegrationStatus,

  // Data Synchronization Types
  SyncStatus,
  SyncLog,
  SyncStudentsRequest,
  SyncProgress,
  SyncStatusValue,

  // School & District Types
  School,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  SchoolStatistics,
  Address,

  // API Response Types
  SystemApiResponse,
  PaginatedResponse,
  BulkOperationResult,

  // Filter Types
  FilterOptions,
  IntegrationFilters,
  SchoolFilters,
  SyncLogFilters,

  // Audit Types
  ConfigurationAudit,
  FeatureFlagAudit,
  IntegrationAudit,
} from './types';

// Validation schemas and constants (for advanced usage)
export {
  // Configuration categories and value types
  CONFIG_CATEGORIES,
  CONFIG_VALUE_TYPES,
  
  // Integration and status types
  INTEGRATION_TYPES,
  INTEGRATION_STATUS_VALUES,
  GRADE_TRANSITION_STATUS_VALUES,
  SYNC_STATUS_VALUES,
  HEALTH_STATUS_VALUES,
  COMPONENT_STATUS_VALUES,

  // Validation regex patterns
  PHONE_REGEX,
  EMAIL_REGEX,
  FEATURE_FLAG_KEY_REGEX,
  SCHOOL_CODE_REGEX,
  ZIP_CODE_REGEX,

  // Validation schemas
  updateSystemConfigSchema,
  createFeatureFlagSchema,
  updateFeatureFlagSchema,
  executeGradeTransitionSchema,
  addressSchema,
  createIntegrationSchema,
  updateIntegrationSchema,
  createSchoolSchema,
  updateSchoolSchema,
  syncStudentsSchema,
} from './validation';

/**
 * Default export provides the factory function for creating SystemApi instances
 * 
 * This is the recommended way to create and use the SystemApi service.
 * 
 * @example
 * ```typescript
 * import createSystemApi from '@/services/modules/systemApi';
 * import { createApiClient } from '@/services/core/ApiClient';
 * 
 * const client = createApiClient();
 * const systemApi = createSystemApi(client);
 * 
 * // Use the API
 * const health = await systemApi.getHealth();
 * console.log(`System status: ${health.status}`);
 * ```
 */
export { createSystemApi as default } from './systemApi';

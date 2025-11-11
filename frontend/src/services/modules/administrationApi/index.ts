/**
 * @fileoverview Entry point for the modular AdministrationApi
 * 
 * This module provides clean exports for all administration functionality including
 * the main API service class, type definitions, validation schemas, and utility functions.
 * 
 * @module services/modules/administrationApi
 */

import { apiClient } from '../../core/ApiClient';
import { AdministrationApi, createAdministrationApi } from './administrationApi';

// Export the main API class and factory function
export { AdministrationApi, createAdministrationApi };

// Export all types for external use
export type {
  // Core domain types
  User,
  District,
  School,
  SystemSettings,
  SystemSettingItem,
  SystemHealth,
  BackupLog,
  License,
  SystemConfiguration,
  PerformanceMetric,
  TrainingModule,
  TrainingCompletion,
  UserTrainingProgress,
  AuditLog,
  
  // Request/input types
  CreateUserData,
  UpdateUserData,
  CreateDistrictData,
  UpdateDistrictData,
  CreateSchoolData,
  UpdateSchoolData,
  CreateLicenseData,
  UpdateLicenseData,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  RecordTrainingCompletionData,
  RecordMetricData,
  ConfigurationData,
  
  // Filter and query types
  UserQueryFilters,
  AuditLogQueryFilters,
  MetricFilters,
  
  // Enum and category types
  ConfigCategory,
  TrainingCategory,
  MetricType,
  
  // Interface types
  AdministrationApiOperations,
} from './types';

// Export validation schemas for external use
export {
  createUserSchema,
  updateUserSchema,
  createDistrictSchema,
  updateDistrictSchema,
  createSchoolSchema,
  updateSchoolSchema,
  createLicenseSchema,
  updateLicenseSchema,
  createTrainingModuleSchema,
  updateTrainingModuleSchema,
  configurationSchema,
} from './validation';

// Export operation classes for advanced usage
export { AdministrationCoreOperations } from './core-operations';
export { AdministrationSpecializedOperations } from './specialized-operations';

/**
 * Pre-configured AdministrationApi instance using the default API client
 * 
 * This is the recommended way to access administration functionality in most cases.
 * 
 * @example
 * ```typescript
 * import { administrationApi } from '@/services/modules/administrationApi';
 * 
 * // Get all users
 * const users = await administrationApi.getUsers({ isActive: true });
 * 
 * // Create a new district
 * const district = await administrationApi.createDistrict({
 *   name: 'Springfield School District',
 *   code: 'SSD-001'
 * });
 * 
 * // Get system health
 * const health = await administrationApi.getSystemHealth();
 * ```
 */
export const administrationApi = createAdministrationApi(apiClient);

/**
 * Default export - AdministrationApi class
 * 
 * Use this if you need to create multiple instances or use a custom ApiClient.
 * For most use cases, prefer the pre-configured `administrationApi` instance.
 */
export default AdministrationApi;

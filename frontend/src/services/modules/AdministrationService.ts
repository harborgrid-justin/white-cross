/**
 * @fileoverview Administration Service Layer (backward compatibility export)
 * @module services/modules/AdministrationService
 * @category Services - Administration & System Management
 *
 * This file provides backward compatibility for the refactored administration modules.
 * The original monolithic AdministrationService has been refactored into smaller,
 * maintainable modules organized by domain:
 *
 * - UserManagement - User CRUD operations with RBAC
 * - OrganizationManagement - District and school hierarchy management
 * - LicenseManagement - Software licensing and entitlements
 * - TrainingManagement - Educational content and progress tracking
 * - ConfigurationManagement - System settings and configurations
 * - MonitoringService - System health, backups, metrics, and audit logs
 *
 * All exports from this file maintain the original interface for backward compatibility.
 *
 * @see {@link administration} for the new modular structure
 * @see {@link AdministrationApi} for the unified API class
 *
 * @example Using AdministrationService (backward compatible)
 * ```typescript
 * import { AdministrationApi } from '@/services/modules/AdministrationService';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const adminService = new AdministrationApi(apiClient);
 * const districts = await adminService.getDistricts();
 * const users = await adminService.getUsers();
 * ```
 *
 * @example Using new modular structure (recommended)
 * ```typescript
 * import {
 *   UserManagementService,
 *   OrganizationManagementService
 * } from '@/services/modules/administration';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const userService = new UserManagementService(apiClient);
 * const orgService = new OrganizationManagementService(apiClient);
 * ```
 */

// Re-export everything from the refactored administration module
export * from './administration';

// Explicitly re-export the main exports for clarity
export {
  AdministrationApi,
  createAdministrationApi,

  // Individual service classes
  UserManagementService,
  OrganizationManagementService,
  LicenseManagementService,
  TrainingManagementService,
  ConfigurationManagementService,
  MonitoringService,

  // Validation schemas
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

  // Factory functions
  createUserManagementService,
  createOrganizationManagementService,
  createLicenseManagementService,
  createTrainingManagementService,
  createConfigurationManagementService,
  createMonitoringService,
} from './administration';

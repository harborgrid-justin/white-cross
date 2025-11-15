/**
 * @fileoverview Administration Service Layer (backward compatibility export)
 * @module services/modules/AdministrationService
 * @category Services - Administration & System Management
 *
 * @deprecated This service layer is deprecated. Use server actions from @/lib/actions/admin instead.
 *
 * MIGRATION PATH:
 * - For server components: Use server actions from @/lib/actions/admin
 * - For client components: Use server actions via client-side invocation
 * - This file will be removed in a future version
 *
 * This file provides backward compatibility for the refactored administration modules.
 * The original monolithic AdministrationService has been refactored into smaller,
 * maintainable modules organized by domain:
 *
 * - UserManagement - User CRUD operations with RBAC -> Use admin.users.ts actions
 * - OrganizationManagement - District and school hierarchy management -> Use admin.districts.ts and admin.schools.ts actions
 * - LicenseManagement - Software licensing and entitlements -> (To be migrated)
 * - TrainingManagement - Educational content and progress tracking -> (To be migrated)
 * - ConfigurationManagement - System settings and configurations -> Use admin.configuration.ts actions
 * - MonitoringService - System health, backups, metrics, and audit logs -> Use admin.monitoring.ts and admin.audit-logs.ts actions
 *
 * All exports from this file maintain the original interface for backward compatibility.
 *
 * @see {@link administration} for the new modular structure
 * @see {@link AdministrationApi} for the unified API class
 *
 * @example OLD (deprecated) - Using AdministrationService
 * ```typescript
 * import { AdministrationApi } from '@/services/modules/AdministrationService';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const adminService = new AdministrationApi(apiClient);
 * const districts = await adminService.getDistricts();
 * const users = await adminService.getUsers();
 * ```
 *
 * @example NEW (recommended) - Using server actions
 * ```typescript
 * import { getAdminDistricts, getAdminUsers } from '@/lib/actions/admin';
 *
 * // In server components or server actions
 * const districts = await getAdminDistricts();
 * const users = await getAdminUsers();
 * ```
 *
 * @example Client components can invoke server actions directly
 * ```typescript
 * 'use client';
 * import { getAdminDistricts } from '@/lib/actions/admin';
 *
 * export function DistrictsList() {
 *   const [districts, setDistricts] = useState([]);
 *
 *   useEffect(() => {
 *     getAdminDistricts().then(setDistricts);
 *   }, []);
 *
 *   // ... rest of component
 * }
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

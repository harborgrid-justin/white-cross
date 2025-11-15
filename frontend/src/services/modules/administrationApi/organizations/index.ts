/**
 * Organizations Management - Unified Interface
 *
 * @deprecated This module is deprecated and will be removed in a future version.
 * Migrate to server actions for better performance and type safety.
 *
 * Migration Guide:
 * - Districts: Use '@/lib/actions/admin.districts' server actions
 * - Schools: Use '@/lib/actions/admin.schools' server actions
 * - API Client: Use '@/lib/api/server' for server-side operations
 *
 * @example Migration from legacy to server actions
 * ```typescript
 * // DEPRECATED: Legacy API client approach
 * import { createDistrictsService } from '@/services/modules/administrationApi/organizations';
 * const service = createDistrictsService(apiClient);
 * const districts = await service.getDistricts();
 *
 * // RECOMMENDED: Server actions approach
 * import { getDistricts } from '@/lib/actions/admin.districts';
 * const districts = await getDistricts();
 * ```
 *
 * Comprehensive organizations management system with modular architecture.
 * This module provides a unified interface for all district and school operations
 * while maintaining clear separation of concerns.
 *
 * Features:
 * - District management (CRUD, settings, statistics, export)
 * - School management (CRUD, settings, statistics, bulk operations, export)
 * - Cross-organizational operations (hierarchy, search, statistics)
 * - Comprehensive validation and error handling
 * - Type-safe API interfaces
 *
 * @module services/modules/administrationApi/organizations
 */

import type { ApiClient } from '../../../core/ApiClient';

// ==========================================
// SERVICE IMPORTS
// ==========================================

import {
  DistrictsService,
  createDistrictsService
} from './districts';

import {
  SchoolsService,
  createSchoolsService
} from './schools';

import {
  OrganizationsService,
  createOrganizationsService
} from './organizations';

// ==========================================
// SERVICE EXPORTS
// ==========================================

export {
  DistrictsService,
  SchoolsService,
  OrganizationsService
};

export {
  createDistrictsService,
  createSchoolsService,
  createOrganizationsService
};

// ==========================================
// DEFAULT EXPORT
// ==========================================

/**
 * Default export - OrganizationsService class
 *
 * Provides unified access to both districts and schools services.
 * Use this for comprehensive organizational management.
 */
export default OrganizationsService;

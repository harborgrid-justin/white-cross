/**
 * Organizations Management - Unified Interface
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

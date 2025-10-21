/**
 * Legacy Service Exports
 *
 * Purpose: Maintains backward compatibility with legacy code
 *
 * IMPORTANT: All exports in this file are DEPRECATED
 * Please migrate to the new modular service architecture
 *
 * Migration Guide:
 * - Replace imports from '@/services/legacy' with specific module imports
 * - Use '@/services/modules/health' for health-related services
 * - Use '@/services/modules/[module]' for other specific services
 * - Refer to the migration documentation for detailed instructions
 *
 * @module services/legacy
 * @deprecated Since version 2.0.0
 */

import { HealthRecordsApi as LegacyHealthRecordsApi } from '../modules/healthRecordsApi';

// ==========================================
// DEPRECATION WARNINGS
// ==========================================

const deprecationWarning = (serviceName: string, replacement: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[DEPRECATION WARNING] ${serviceName} is deprecated.\n` +
      `Please use ${replacement} instead.\n` +
      `This legacy export will be removed in version 3.0.0.`
    );
  }
};

// ==========================================
// LEGACY HEALTH RECORDS API
// ==========================================

/**
 * @deprecated Use modular health services from '@/services/modules/health'
 */
export class HealthRecordsApi extends LegacyHealthRecordsApi {
  constructor() {
    super();
    deprecationWarning(
      'HealthRecordsApi (monolithic)',
      'modular health services:\n' +
      '  - allergiesApi from @/services/modules/health\n' +
      '  - chronicConditionsApi from @/services/modules/health\n' +
      '  - vaccinationsApi from @/services/modules/health\n' +
      '  - screeningsApi from @/services/modules/health\n' +
      '  - growthMeasurementsApi from @/services/modules/health\n' +
      '  - vitalSignsApi from @/services/modules/health\n' +
      '  - healthRecordsApi from @/services/modules/health'
    );
  }
}

// ==========================================
// LEGACY API OBJECT EXPORTS
// ==========================================

import { authApi } from '../modules/authApi';
import { studentsApi } from '../modules/studentsApi';
import { medicationsApi } from '../modules/medicationsApi';

/**
 * @deprecated Use individual API imports from '@/services/modules'
 */
export const legacyApi = {
  // Auth API - matches old authApi structure
  authApi: {
    login: (...args: any[]) => {
      deprecationWarning('legacyApi.authApi', 'authApi from @/services/modules/authApi');
      return authApi.login.apply(authApi, args);
    },
    register: (...args: any[]) => {
      deprecationWarning('legacyApi.authApi', 'authApi from @/services/modules/authApi');
      return authApi.register.apply(authApi, args);
    },
    verifyToken: (...args: any[]) => {
      deprecationWarning('legacyApi.authApi', 'authApi from @/services/modules/authApi');
      return authApi.verifyToken.apply(authApi, args);
    }
  },

  // Students API - matches old studentsApi structure
  studentsApi: {
    getAll: (page = 1, limit = 10) => {
      deprecationWarning('legacyApi.studentsApi', 'studentsApi from @/services/modules/studentsApi');
      return studentsApi.getAll({ page, limit });
    },
    getById: (...args: any[]) => {
      deprecationWarning('legacyApi.studentsApi', 'studentsApi from @/services/modules/studentsApi');
      return studentsApi.getById.apply(studentsApi, args);
    },
    create: (...args: any[]) => {
      deprecationWarning('legacyApi.studentsApi', 'studentsApi from @/services/modules/studentsApi');
      return studentsApi.create.apply(studentsApi, args);
    },
    update: (...args: any[]) => {
      deprecationWarning('legacyApi.studentsApi', 'studentsApi from @/services/modules/studentsApi');
      return studentsApi.update.apply(studentsApi, args);
    },
    delete: (...args: any[]) => {
      deprecationWarning('legacyApi.studentsApi', 'studentsApi from @/services/modules/studentsApi');
      return studentsApi.delete.apply(studentsApi, args);
    }
  },

  // Medications API - matches old medicationsApi structure
  medicationsApi: {
    getAll: (page = 1, limit = 20, search?: string) => {
      deprecationWarning('legacyApi.medicationsApi', 'medicationsApi from @/services/modules/medicationsApi');
      return medicationsApi.getAll({ page, limit, search });
    },
    create: (...args: any[]) => {
      deprecationWarning('legacyApi.medicationsApi', 'medicationsApi from @/services/modules/medicationsApi');
      return medicationsApi.create.apply(medicationsApi, args);
    },
    assignToStudent: (...args: any[]) => {
      deprecationWarning('legacyApi.medicationsApi', 'medicationsApi from @/services/modules/medicationsApi');
      return medicationsApi.assignToStudent.apply(medicationsApi, args);
    },
    logAdministration: (...args: any[]) => {
      deprecationWarning('legacyApi.medicationsApi', 'medicationsApi from @/services/modules/medicationsApi');
      return medicationsApi.logAdministration.apply(medicationsApi, args);
    }
  }
};

// ==========================================
// LEGACY COMPATIBILITY EXPORTS
// ==========================================

/**
 * @deprecated Use authApi from '@/services/modules/authApi'
 */
export const authApi_legacy = legacyApi.authApi;

/**
 * @deprecated Use studentsApi from '@/services/modules/studentsApi'
 */
export const studentsApi_legacy = legacyApi.studentsApi;

/**
 * @deprecated Use medicationsApi from '@/services/modules/medicationsApi'
 */
export const medicationsApi_legacy = legacyApi.medicationsApi;

/**
 * @deprecated Use individual health APIs from '@/services/modules/health'
 */
export const healthRecordApi = new HealthRecordsApi();

/**
 * @deprecated Use authApi from '@/services/modules/authApi'
 */
export const authApi_compat = legacyApi.authApi;

/**
 * @deprecated Use studentsApi from '@/services/modules/studentsApi'
 */
export const studentsApi_compat = legacyApi.studentsApi;

/**
 * @deprecated Use medicationsApi from '@/services/modules/medicationsApi'
 */
export const medicationsApi_compat = legacyApi.medicationsApi;

// ==========================================
// TYPE RE-EXPORTS FOR COMPATIBILITY
// ==========================================

/**
 * @deprecated Import types from their respective modules
 */
export type {
  HealthRecord,
  HealthRecordType,
  HealthRecordCreate,
  HealthRecordUpdate,
  HealthRecordFilters,
  HealthSummary,
  VaccinationRecord,
  CreateHealthRecordRequest,
  CreateAllergyRequest,
  CreateChronicConditionRequest,
  CreateVaccinationRequest
} from '../modules/healthRecordsApi';

// ==========================================
// MIGRATION HELPERS
// ==========================================

/**
 * Helper to check if code is using legacy imports
 */
export const checkLegacyUsage = (): void => {
  console.group('[LEGACY SERVICE USAGE DETECTED]');
  console.warn('Your code is using deprecated legacy service imports.');
  console.warn('Please migrate to the new modular service architecture:');
  console.table({
    'Old Import': ['@/services/legacy'],
    'New Import': ['@/services/modules/[specific-module]'],
    'Documentation': ['See /services/README.md for migration guide']
  });
  console.groupEnd();
};

// Check usage on module load in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(checkLegacyUsage, 1000);
}

// ==========================================
// DEFAULT EXPORT
// ==========================================

/**
 * @deprecated Do not use default exports from legacy module
 */
export default {
  message: 'This module is deprecated. Please use specific service imports from @/services/modules',
  legacyApi,
  healthRecordApi,
  checkLegacyUsage
};
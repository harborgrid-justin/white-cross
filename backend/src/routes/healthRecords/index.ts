/**
 * LOC: 977316651F
 * WC-RTE-HLT-000 | Health Records Module - Main Export
 *
 * UPSTREAM (imports from):
 *   - mainHealthRecords.ts (routes/healthRecords/routes/mainHealthRecords.ts)
 *   - allergies.ts (routes/healthRecords/routes/allergies.ts)
 *   - chronicConditions.ts (routes/healthRecords/routes/chronicConditions.ts)
 *   - vaccinations.ts (routes/healthRecords/routes/vaccinations.ts)
 *   - screenings.ts (routes/healthRecords/routes/screenings.ts)
 *   - ... and 3 more
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-HLT-000 | Health Records Module - Main Export
 * Purpose: Aggregates all health records route modules into a single export for the main server
 * Upstream: All route modules (mainHealthRecords, allergies, chronicConditions, etc.) | Dependencies: @hapi/hapi
 * Downstream: Main server configuration | Called by: ../index.ts or server setup
 * Related: ../services/healthRecordService, ../middleware/auth | Integrates: HIPAA audit logging, PHI protection
 * Exports: healthRecordRoutes (combined array of all health record route definitions)
 * Last Updated: 2025-10-18 | File Type: .ts - Route Aggregation Module
 * Critical Path: Individual route modules → Combine into single array → Export to server
 * LLM Context: Central aggregation point for all health records routes - imports from modular route files and exports unified route array
 */

import { ServerRoute } from '@hapi/hapi';
import { mainHealthRecordsRoutes } from './routes/mainHealthRecords';
import { allergiesRoutes } from './routes/allergies';
import { chronicConditionsRoutes } from './routes/chronicConditions';
import { vaccinationsRoutes } from './routes/vaccinations';
import { screeningsRoutes } from './routes/screenings';
import { growthMeasurementsRoutes } from './routes/growthMeasurements';
import { vitalSignsRoutes } from './routes/vitalSigns';
import { searchAndUtilityRoutes } from './routes/searchAndUtility';

/**
 * Combined health records routes array
 *
 * This array aggregates all health record-related routes from the following modules:
 *
 * 1. Main Health Records (9 routes) - Core CRUD operations for health records
 * 2. Allergies (8 routes) - Allergy management with severity tracking and contraindication checking
 * 3. Chronic Conditions (8 routes) - Long-term condition management with care plans
 * 4. Vaccinations (9 routes) - Immunization records with compliance tracking
 * 5. Screenings (7 routes) - Health screenings (vision, hearing, dental, etc.)
 * 6. Growth Measurements (7 routes) - Height, weight, BMI tracking with percentile analysis
 * 7. Vital Signs (5 routes) - BP, heart rate, temperature, etc. with trend analysis
 * 8. Search and Utility (3 routes) - Cross-record search, bulk operations, import/export
 *
 * Total: ~56 route definitions
 *
 * All routes are:
 * - JWT authenticated ('auth: jwt')
 * - PHI-protected with HIPAA compliance
 * - Fully documented with Swagger/OpenAPI
 * - Comprehensively validated with Joi schemas
 * - Audited for access and modifications
 *
 * @type {ServerRoute[]}
 */
export const healthRecordRoutes: ServerRoute[] = [
  // Main health records CRUD operations
  ...mainHealthRecordsRoutes,

  // Allergy management endpoints
  ...allergiesRoutes,

  // Chronic condition management with care plans
  ...chronicConditionsRoutes,

  // Vaccination records and compliance tracking
  ...vaccinationsRoutes,

  // Health screenings (vision, hearing, dental, etc.)
  ...screeningsRoutes,

  // Growth measurements and trend analysis
  ...growthMeasurementsRoutes,

  // Vital signs recording and monitoring
  ...vitalSignsRoutes,

  // Search, bulk operations, and data import/export
  ...searchAndUtilityRoutes
];

/**
 * Re-export types for external consumption
 */
export { AuthCredentials, PayloadData } from './types';

/**
 * Re-export validation schemas for potential reuse
 */
export * as validationSchemas from './validationSchemas';

/**
 * Module statistics (for documentation purposes)
 */
export const moduleInfo = {
  totalRoutes: healthRecordRoutes.length,
  modules: {
    mainHealthRecords: mainHealthRecordsRoutes.length,
    allergies: allergiesRoutes.length,
    chronicConditions: chronicConditionsRoutes.length,
    vaccinations: vaccinationsRoutes.length,
    screenings: screeningsRoutes.length,
    growthMeasurements: growthMeasurementsRoutes.length,
    vitalSigns: vitalSignsRoutes.length,
    searchAndUtility: searchAndUtilityRoutes.length
  },
  authRequired: true,
  phiProtected: true,
  hipaaCompliant: true,
  auditLogged: true
};

/**
 * @fileoverview Immunization Management Server Actions - Next.js v14+ Compatible
 * @module app/immunizations/actions
 *
 * HIPAA-compliant server actions for immunization data management with comprehensive
 * caching, audit logging, and error handling.
 *
 * This is the main entry point that re-exports all immunization-related functionality
 * from specialized modules for better code organization and maintainability.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all immunization operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * Module Organization:
 * - immunizations.types.ts: TypeScript type definitions
 * - immunizations.cache.ts: Cache configuration and cached data retrieval
 * - immunizations.crud.ts: Create, update, verify operations
 * - immunizations.forms.ts: Form data handling
 * - immunizations.compliance.ts: Compliance checking
 * - immunizations.utils.ts: Utility functions
 * - immunizations.reports.ts: Statistics and reporting
 */

'use server';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  ImmunizationRecord,
  CreateImmunizationRecordData,
  UpdateImmunizationRecordData,
  Vaccine,
  ImmunizationRequirement,
  ImmunizationExemption,
  ImmunizationFilters,
  ImmunizationAnalytics,
  ImmunizationStats,
} from './immunizations.types';

// ==========================================
// CACHE EXPORTS
// ==========================================

export {
  IMMUNIZATION_CACHE_TAGS,
  getImmunizationRecord,
  getImmunizationRecords,
  getStudentImmunizations,
  getVaccines,
  getImmunizationRequirements,
  getImmunizationAnalytics,
  clearImmunizationCache,
} from './immunizations.cache';

// ==========================================
// CRUD OPERATION EXPORTS
// ==========================================

export {
  createImmunizationRecordAction,
  updateImmunizationRecordAction,
  verifyImmunizationRecordAction,
} from './immunizations.crud';

// ==========================================
// FORM HANDLING EXPORTS
// ==========================================

export {
  createImmunizationRecordFromForm,
} from './immunizations.forms';

// ==========================================
// COMPLIANCE EXPORTS
// ==========================================

export {
  getStudentImmunizationCompliance,
} from './immunizations.compliance';

// ==========================================
// UTILITY EXPORTS
// ==========================================

export {
  immunizationRecordExists,
  getImmunizationRecordCount,
  getImmunizationOverview,
} from './immunizations.utils';

// ==========================================
// REPORTING EXPORTS
// ==========================================

export {
  getImmunizationStats,
  getImmunizationsDashboardData,
} from './immunizations.reports';

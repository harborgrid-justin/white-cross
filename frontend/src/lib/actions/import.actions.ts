/**
 * @fileoverview Import Management Server Actions - Next.js v14+ Compatible
 * @module app/import/actions
 *
 * HIPAA-compliant server actions for data import management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all import operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * This file serves as the main export point for all import-related functionality.
 * Actual implementations are organized into focused modules:
 * - import.types.ts: TypeScript type definitions
 * - import.cache.ts: Caching functions and configurations
 * - import.crud.ts: CRUD operations
 * - import.forms.ts: Form handling operations
 * - import.utils.ts: Utility functions
 * - import.dashboard.ts: Dashboard data and statistics
 */

'use server';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  ImportJob,
  CreateImportJobData,
  UpdateImportJobData,
  ImportTemplate,
  CreateImportTemplateData,
  UpdateImportTemplateData,
  ImportValidationRule,
  ImportError,
  ImportWarning,
  ImportFilters,
  ImportAnalytics,
} from './import.types';

// ==========================================
// CACHE EXPORTS
// ==========================================

export {
  IMPORT_CACHE_TAGS,
  getImportJob,
  getImportJobs,
  getImportTemplate,
  getImportTemplates,
  getImportAnalytics,
  clearImportCache,
} from './import.cache';

// ==========================================
// CRUD EXPORTS
// ==========================================

export {
  createImportJobAction,
  updateImportJobAction,
  startImportJobAction,
  validateImportJobAction,
  createImportTemplateAction,
} from './import.crud';

// ==========================================
// FORM HANDLING EXPORTS
// ==========================================

export {
  createImportJobFromForm,
  createImportTemplateFromForm,
} from './import.forms';

// ==========================================
// UTILITY EXPORTS
// ==========================================

export {
  importJobExists,
  importTemplateExists,
  getImportJobCount,
  getImportTemplateCount,
  getImportOverview,
} from './import.utils';

// ==========================================
// DASHBOARD EXPORTS
// ==========================================

export {
  getImportStats,
  getImportDashboardData,
} from './import.dashboard';

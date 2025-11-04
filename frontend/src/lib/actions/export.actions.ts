/**
 * @fileoverview Export Management Server Actions - Next.js v14+ Compatible
 * @module app/export/actions
 *
 * HIPAA-compliant server actions for data export management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all export operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * Architecture:
 * This file serves as a barrel export for all export-related functionality.
 * The implementation is split into focused modules for better maintainability:
 * - export.types.ts - Type definitions and interfaces
 * - export.cache.ts - Cached data retrieval functions
 * - export.jobs.ts - Export job CRUD operations
 * - export.templates.ts - Export template operations
 * - export.forms.ts - Form data handling
 * - export.utils.ts - Utility functions and statistics
 */

'use server';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  ExportJob,
  CreateExportJobData,
  UpdateExportJobData,
  ExportTemplate,
  CreateExportTemplateData,
  UpdateExportTemplateData,
  ExportFilters,
  ExportAnalytics,
  ExportStats
} from './export.types';

export { EXPORT_CACHE_TAGS } from './export.types';

// ==========================================
// CACHE FUNCTION EXPORTS
// ==========================================

export {
  getExportJob,
  getExportJobs,
  getExportTemplate,
  getExportTemplates,
  getExportAnalytics
} from './export.cache';

// ==========================================
// EXPORT JOB ACTION EXPORTS
// ==========================================

export {
  createExportJobAction,
  updateExportJobAction,
  startExportJobAction
} from './export.jobs';

// ==========================================
// EXPORT TEMPLATE ACTION EXPORTS
// ==========================================

export {
  createExportTemplateAction
} from './export.templates';

// ==========================================
// FORM HANDLING EXPORTS
// ==========================================

export {
  createExportJobFromForm,
  createExportTemplateFromForm
} from './export.forms';

// ==========================================
// UTILITY FUNCTION EXPORTS
// ==========================================

export {
  exportJobExists,
  exportTemplateExists,
  getExportJobCount,
  getExportTemplateCount,
  getExportOverview,
  getExportStats,
  getExportsDashboardData,
  clearExportCache
} from './export.utils';

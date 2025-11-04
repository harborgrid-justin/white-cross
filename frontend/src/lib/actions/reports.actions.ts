/**
 * @fileoverview Report Management Server Actions - Next.js v14+ Compatible
 * @module app/reports/actions
 *
 * HIPAA-compliant server actions for report generation and management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all report operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * This file serves as the main entry point, re-exporting functionality from focused modules:
 * - reports.types.ts - Type definitions and interfaces
 * - reports.cache.ts - Cached data fetching functions
 * - reports.crud.ts - Create, Update, Delete operations
 * - reports.generation.ts - Report generation and download
 * - reports.forms.ts - Form data handling
 * - reports.utils.ts - Utility functions
 * - reports.dashboard.ts - Dashboard statistics and analytics
 */

'use server';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  Report,
  ReportTemplate,
  CreateReportData,
  UpdateReportData,
  ReportFilters,
  ReportAnalytics,
} from './reports.types';

export { REPORT_CACHE_TAGS } from './reports.types';

// ==========================================
// CACHE FUNCTION EXPORTS
// ==========================================

export {
  getReport,
  getReports,
  getReportTemplates,
  getReportAnalytics,
  getScheduledReports,
} from './reports.cache';

// ==========================================
// CRUD OPERATION EXPORTS
// ==========================================

export {
  createReportAction,
  updateReportAction,
  deleteReportAction,
} from './reports.crud';

// ==========================================
// GENERATION OPERATION EXPORTS
// ==========================================

export {
  generateReportAction,
  downloadReportAction,
} from './reports.generation';

// ==========================================
// FORM HANDLING EXPORTS
// ==========================================

export {
  createReportFromForm,
} from './reports.forms';

// ==========================================
// UTILITY FUNCTION EXPORTS
// ==========================================

export {
  reportExists,
  getReportCount,
  getReportOverview,
  clearReportCache,
} from './reports.utils';

// ==========================================
// DASHBOARD FUNCTION EXPORTS
// ==========================================

export {
  getReportsStats,
  getReportsDashboardData,
} from './reports.dashboard';

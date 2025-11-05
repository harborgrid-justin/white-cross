/**
 * @fileoverview Admin Management Server Actions - Main Entry Point
 * @module app/admin/actions
 *
 * HIPAA-compliant server actions for administrative management with comprehensive
 * caching, audit logging, and error handling.
 *
 * This is the main entry point that re-exports all admin-related functionality
 * from specialized modules. Use this file for all admin action imports to maintain
 * backward compatibility.
 *
 * Module Organization:
 * - admin.types.ts: TypeScript type definitions
 * - admin.cache.ts: Cached read operations
 * - admin.users.ts: Admin user CRUD operations
 * - admin.districts.ts: District CRUD operations
 * - admin.schools.ts: School CRUD operations
 * - admin.settings.ts: System settings operations
 * - admin.utils.ts: Utility functions
 *
 * Features:
 * - Server actions with proper 'use server' directive (in implementation files)
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all admin operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * NOTE: This barrel file does NOT have 'use server' directive.
 * The 'use server' directive is present in implementation files that define
 * actual Server Actions. Barrel files cannot have 'use server' when re-exporting.
 */

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  AdminUser,
  CreateAdminUserData,
  UpdateAdminUserData,
  District,
  CreateDistrictData,
  School,
  CreateSchoolData,
  SystemSettings,
  ApiResponse,
} from './admin.types';

// ==========================================
// CACHE OPERATION EXPORTS
// ==========================================

export {
  getAdminUser,
  getAdminUsers,
  getDistrict,
  getDistricts,
  getSchool,
  getSchools,
  getSystemMetrics,
} from './admin.cache';

// ==========================================
// MONITORING OPERATION EXPORTS
// ==========================================

export {
  getSystemHealth,
  getPerformanceMetrics,
  getApiMetrics,
  getErrorLogs,
  getUserActivity,
  getRealTimeMetrics,
} from './admin.monitoring';

export type {
  SystemHealth,
  PerformanceMetrics,
  ApiMetrics,
  ErrorLog,
  UserActivity,
} from './admin.monitoring';

// ==========================================
// ADMIN USER OPERATION EXPORTS
// ==========================================

export {
  createAdminUserAction,
  updateAdminUserAction,
  deleteAdminUserAction,
  createAdminUserFromForm,
  updateAdminUserFromForm,
} from './admin.users';

// ==========================================
// DISTRICT OPERATION EXPORTS
// ==========================================

export {
  getAdminDistricts,
  getAdminDistrictById,
  revalidateDistrictsCache,
} from './admin.districts';

export type {
  DistrictSearchParams,
} from './admin.districts';

// ==========================================
// SCHOOL OPERATION EXPORTS
// ==========================================

export {
  getAdminSchools,
  getAdminSchoolById,
  revalidateSchoolsCache,
} from './admin.schools';

export type {
  SchoolSearchParams,
} from './admin.schools';

// ==========================================
// SYSTEM SETTINGS OPERATION EXPORTS
// ==========================================

export {
  updateSystemSettingAction,
} from './admin.settings';

// ==========================================
// UTILITY FUNCTION EXPORTS
// ==========================================

export {
  adminUserExists,
  districtExists,
  schoolExists,
  getAdminUserCount,
  getDistrictCount,
  getSchoolCount,
  clearAdminCache,
} from './admin.utils';

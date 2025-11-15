/**
 * @fileoverview Medication Management Server Actions - Next.js v14+ Compatible
 * @module app/medications/actions
 *
 * HIPAA-compliant server actions for medication data management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive (in implementation files)
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all PHI operations (medications are PHI)
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 * - Medication administration tracking
 *
 * This module serves as a re-export hub for all medication-related functionality,
 * which has been organized into focused submodules:
 * - medications.types.ts - Type definitions
 * - medications.cache.ts - Cached data fetching
 * - medications.crud.ts - Create, update, delete operations
 * - medications.administration.ts - Administration tracking
 * - medications.status.ts - Status change operations
 * - medications.utils.ts - Utility functions
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
  CreateMedicationData,
  UpdateMedicationData,
  AdministerMedicationData,
  MedicationFilters,
  MedicationLog,
  PaginatedMedicationsResponse,
  MedicationStats
} from './medications.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

export {
  getMedication,
  getMedications,
  getStudentMedications,
  getDueMedications,
  getPaginatedMedications,
  getMedicationHistory,
  getMedicationStats,
  getOverdueMedications,
  getOTCMedications,
  getControlledSubstances,
  getCategories,
  getCompletedAdministrations,
  getAdministrationRules,
  getAdministrationSchedule,
  getPrescriptions,
  getPrescription,
  getPrescriptionRefill,
  getInventoryReports,
  getExpirationReports,
  getComplianceReports,
  getRefillReports,
  getAdministrationReports,
  getLowStockInventory,
  getExpiringInventory,
  getInventoryItem,
  getMissedDoses,
  getMedicationSettings,
  getEmergencyMedications,
  getRecentAdministrations
} from './medications.cache';

// ==========================================
// CRUD OPERATIONS
// ==========================================

export {
  createMedication,
  createMedicationFromForm,
  updateMedication,
  updateMedicationFromForm,
  deleteMedication
} from './medications.crud';

// ==========================================
// ADMINISTRATION OPERATIONS
// ==========================================

export {
  administerMedication,
  administerMedicationFromForm
} from './medications.administration';

// ==========================================
// STATUS OPERATIONS
// ==========================================

export {
  discontinueMedication,
  requestMedicationRefill
} from './medications.status';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  medicationExists,
  getMedicationCount,
  clearMedicationCache,
  getMedicationsDashboardData
} from './medications.utils';

/**
 * @fileoverview Server Actions for Health Records Module
 * @module app/health-records/actions
 *
 * Next.js v16 App Router Server Actions for health records, immunizations, allergies, vital signs, and conditions.
 * HIPAA CRITICAL: ALL operations include mandatory audit logging for PHI access.
 * Enhanced with Next.js v16 caching capabilities and revalidation patterns.
 *
 * This module serves as the main entry point and re-exports specialized modules:
 * - health-records.types.ts - Type definitions and interfaces
 * - health-records.utils.ts - Shared utilities and authentication helpers
 * - health-records.crud.ts - Core CRUD operations for health records
 * - health-records.immunizations.ts - Immunization/vaccination record operations
 * - health-records.allergies.ts - Allergy record operations (emergency-critical PHI)
 * - health-records.stats.ts - Statistics and dashboard data operations
 *
 * NOTE: This file does NOT have 'use server' directive because it only re-exports
 * server actions from other files. The 'use server' directive is in the individual
 * implementation files (crud, immunizations, allergies, stats).
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { createHealthRecordAction } from '@/lib/actions/health-records.actions';
 *
 * function HealthRecordForm() {
 *   const [state, formAction, isPending] = useActionState(createHealthRecordAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type { ActionResult, HealthRecordsStats } from './health-records.types';

// ==========================================
// NOTE: Utility functions and constants are NOT re-exported here
// because "use server" files can only export async functions.
// Import directly from './health-records.utils' if needed.
// ==========================================

// ==========================================
// HEALTH RECORD CRUD ACTIONS
// ==========================================

export {
  createHealthRecordAction,
  getHealthRecordsAction,
  updateHealthRecordAction,
  deleteHealthRecordAction
} from './health-records.crud';

// ==========================================
// IMMUNIZATION ACTIONS
// ==========================================

export {
  createImmunizationAction
} from './health-records.immunizations';

// ==========================================
// ALLERGY ACTIONS
// ==========================================

export {
  createAllergyAction,
  getStudentAllergiesAction
} from './health-records.allergies';

// ==========================================
// STATISTICS AND DASHBOARD ACTIONS
// ==========================================

export {
  getHealthRecordsStats,
  getHealthRecordsDashboardData
} from './health-records.stats';

// ==========================================
// VITAL SIGNS ACTIONS
// ==========================================

export {
  createVitalSignsAction,
  updateVitalSignsAction,
  deleteVitalSignsAction
} from './health-records.vital-signs';

export type {
  VitalSigns,
  VitalSignsCreate
} from './health-records.vital-signs';

// ==========================================
// SCREENING ACTIONS
// ==========================================

export {
  ScreeningType,
  ScreeningOutcome,
  createScreeningAction,
  updateScreeningAction,
  deleteScreeningAction
} from './health-records.screenings';

export type {
  Screening,
  ScreeningCreate
} from './health-records.screenings';

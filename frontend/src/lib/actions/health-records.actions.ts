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

'use server';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type { ActionResult, HealthRecordsStats } from './health-records.types';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  BACKEND_URL,
  getAuthToken,
  getCurrentUserId,
  createAuditContext,
  enhancedFetch
} from './health-records.utils';

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

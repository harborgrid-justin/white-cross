/**
 * LOC: 7359200817-TYPES
 * WC-SVC-MED-TYPES | Medication Service Type Definitions
 *
 * UPSTREAM (imports from): None
 * DOWNSTREAM (imported by): All medication service modules
 */

/**
 * WC-SVC-MED-TYPES | Medication Service Type Definitions
 * Purpose: Shared TypeScript interfaces and types for medication services
 * Upstream: None | Dependencies: None
 * Downstream: All medication modules | Called by: All medication services
 * Related: medicationService.ts
 * Exports: All medication-related interfaces
 * Last Updated: 2025-10-18 | Dependencies: None
 * Critical Path: Type definitions for all medication operations
 * LLM Context: HIPAA-compliant medication type definitions
 */

export interface CreateMedicationData {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled?: boolean;
}

export interface CreateStudentMedicationData {
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  route: string;
  instructions?: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
}

export interface CreateMedicationLogData {
  studentMedicationId: string;
  nurseId: string;
  dosageGiven: string;
  timeGiven: Date;
  notes?: string;
  sideEffects?: string;
}

export interface CreateInventoryData {
  medicationId: string;
  batchNumber: string;
  expirationDate: Date;
  quantity: number;
  reorderLevel?: number;
  costPerUnit?: number;
  supplier?: string;
}

export interface CreateAdverseReactionData {
  studentMedicationId: string;
  reportedBy: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction: string;
  actionTaken: string;
  notes?: string;
  reportedAt: Date;
}

export interface MedicationReminder {
  id: string;
  studentMedicationId: string;
  studentName: string;
  medicationName: string;
  dosage: string;
  scheduledTime: Date;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface MedicationAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  medicationId?: string;
  medicationName?: string;
}

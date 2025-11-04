/**
 * @fileoverview Medication Type Definitions
 * @module app/medications/types
 *
 * TypeScript type definitions for medication management.
 * Shared types used across medication modules.
 */

import type { Medication } from '@/types/domain/medications';

// ==========================================
// ACTION RESULT TYPES
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==========================================
// MEDICATION DATA TYPES
// ==========================================

export interface CreateMedicationData {
  studentId: string;
  name: string;
  genericName?: string;
  dosage: string;
  dosageForm?: string;
  strength?: string;
  route: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  prescriptionNumber?: string;
  instructions?: string;
  sideEffects?: string;
  contraindications?: string;
  storage?: string;
  requiresParentConsent?: boolean;
  isControlledSubstance?: boolean;
  rxNumber?: string;
  refillsRemaining?: number;
}

export interface UpdateMedicationData {
  name?: string;
  genericName?: string;
  dosage?: string;
  dosageForm?: string;
  strength?: string;
  route?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
  prescriptionNumber?: string;
  instructions?: string;
  sideEffects?: string;
  contraindications?: string;
  storage?: string;
  requiresParentConsent?: boolean;
  isControlledSubstance?: boolean;
  rxNumber?: string;
  refillsRemaining?: number;
  isActive?: boolean;
}

export interface AdministerMedicationData {
  medicationId: string;
  studentId: string;
  administeredBy: string;
  administeredAt: string;
  dosageGiven: string;
  notes?: string;
  witnessedBy?: string;
  method?: string;
  location?: string;
}

// ==========================================
// FILTER AND QUERY TYPES
// ==========================================

export interface MedicationFilters {
  studentId?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  name?: string;
  prescribedBy?: string;
  isControlledSubstance?: boolean;
  requiresParentConsent?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ==========================================
// LOG AND HISTORY TYPES
// ==========================================

export interface MedicationLog {
  id: string;
  medicationId: string;
  studentId: string;
  administeredAt: string;
  administeredBy: string;
  dosageGiven: string;
  notes?: string;
  witnessedBy?: string;
  method?: string;
  location?: string;
  createdAt: string;
}

// ==========================================
// PAGINATION TYPES
// ==========================================

export interface PaginatedMedicationsResponse {
  medications: Medication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  total: number;
}

// ==========================================
// STATISTICS TYPES
// ==========================================

export interface MedicationStats {
  totalMedications: number;
  activePrescriptions: number;
  administeredToday: number;
  adverseReactions: number;
  lowStockCount: number;
  expiringCount: number;
}

/**
 * @fileoverview Immunization Type Definitions
 * @module lib/actions/immunizations/types
 *
 * TypeScript interfaces and types for immunization management.
 * Used across all immunization-related modules.
 */

// ==========================================
// ACTION RESULT TYPES
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// IMMUNIZATION RECORD TYPES
// ==========================================

export interface ImmunizationRecord {
  id: string;
  studentId: string;
  studentName: string;
  vaccineId: string;
  vaccineName: string;
  vaccineType: string;
  manufacturer: string;
  lotNumber: string;
  ndc: string;
  administeredDate: string;
  administeredBy: string;
  administeredByName: string;
  administrationSite: 'left-arm' | 'right-arm' | 'left-thigh' | 'right-thigh' | 'oral' | 'nasal' | 'other';
  dosage: string;
  doseNumber: number;
  seriesComplete: boolean;
  nextDueDate?: string;
  notes?: string;
  reactionObserved: boolean;
  reactionDetails?: string;
  documentedBy: string;
  documentedByName: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImmunizationRecordData {
  studentId: string;
  vaccineId: string;
  administeredDate: string;
  administeredBy: string;
  administrationSite: ImmunizationRecord['administrationSite'];
  dosage: string;
  doseNumber: number;
  seriesComplete?: boolean;
  nextDueDate?: string;
  notes?: string;
  reactionObserved?: boolean;
  reactionDetails?: string;
  lotNumber: string;
  ndc?: string;
}

export interface UpdateImmunizationRecordData {
  administeredDate?: string;
  administrationSite?: ImmunizationRecord['administrationSite'];
  dosage?: string;
  doseNumber?: number;
  seriesComplete?: boolean;
  nextDueDate?: string;
  notes?: string;
  reactionObserved?: boolean;
  reactionDetails?: string;
  lotNumber?: string;
  ndc?: string;
}

// ==========================================
// VACCINE TYPES
// ==========================================

export interface Vaccine {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  description: string;
  recommendedAges: string[];
  dosesRequired: number;
  intervalBetweenDoses: number; // days
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// REQUIREMENT TYPES
// ==========================================

export interface ImmunizationRequirement {
  id: string;
  grade: string;
  vaccineId: string;
  vaccineName: string;
  required: boolean;
  exemptionAllowed: boolean;
  notes?: string;
  effectiveDate: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// EXEMPTION TYPES
// ==========================================

export interface ImmunizationExemption {
  id: string;
  studentId: string;
  studentName: string;
  vaccineId: string;
  vaccineName: string;
  exemptionType: 'medical' | 'religious' | 'philosophical';
  reason: string;
  documentationProvided: boolean;
  approvedBy: string;
  approvedByName: string;
  approvedAt: string;
  expirationDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// FILTER TYPES
// ==========================================

export interface ImmunizationFilters {
  studentId?: string;
  vaccineId?: string;
  administeredBy?: string;
  dateFrom?: string;
  dateTo?: string;
  seriesComplete?: boolean;
  reactionObserved?: boolean;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

export interface ImmunizationAnalytics {
  totalRecords: number;
  uniqueStudents: number;
  completedSeries: number;
  pendingDoses: number;
  reactionsReported: number;
  complianceRate: number;
  overdueCount?: number;
  exemptionCount?: number;
  recentCount?: number;
  vaccineBreakdown: {
    vaccineId: string;
    vaccineName: string;
    count: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    administered: number;
    reactions: number;
  }[];
}

// ==========================================
// STATISTICS TYPES
// ==========================================

/**
 * Immunization Statistics Interface
 * Dashboard metrics for immunizations overview
 */
export interface ImmunizationStats {
  totalRecords: number;
  uniqueStudents: number;
  completedSeries: number;
  pendingDoses: number;
  averageCompliance: number;
  overdueImmunizations: number;
  exemptions: number;
  recentVaccinations: number;
  vaccineTypes: {
    covid19: number;
    influenza: number;
    measles: number;
    polio: number;
    hepatitis: number;
    other: number;
  };
}

/**
 * Medication Usage Report Types
 * 
 * Type definitions for medication administration tracking including:
 * - Medication compliance statistics
 * - Administration logs
 * - Student medication tracking
 * - Usage trends analysis
 */

import type { BaseEntity } from '../../core/common';
import type { DateRangeFilter } from './filters';

/**
 * Medication usage data with detailed statistics
 */
export interface MedicationUsageData {
  medication: {
    id: string;
    name: string;
    category: string;
  };
  usage: {
    administered: number;
    missed: number;
    refused: number;
    totalScheduled: number;
    complianceRate: number;
  };
  trends: Array<{
    date: string;
    administered: number;
    missed: number;
  }>;
}

/**
 * Medication information
 */
export interface MedicationInfo {
  id: string;
  name: string;
  genericName?: string;
  category?: string;
  dosageForm?: string;
  strength?: string;
}

/**
 * Student medication information
 */
export interface StudentMedicationInfo extends BaseEntity {
  studentId: string;
  medicationId: string;
  medication?: MedicationInfo;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  isActive: boolean;
  startDate: Date | string;
  endDate?: Date | string;
}

/**
 * Medication log entry
 */
export interface MedicationLog extends BaseEntity {
  studentMedicationId: string;
  studentMedication?: StudentMedicationInfo;
  timeGiven: Date | string;
  dosageGiven: string;
  givenBy: string;
  nurse?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  notes?: string;
  sideEffects?: string;
  witnessed?: boolean;
  witnessedBy?: string;
}

/**
 * Top medication by usage count
 */
export interface TopMedication {
  medicationName: string;
  medicationId?: string;
  count: number;
  percentage?: number;
  complianceRate?: number;
}

/**
 * Medication usage report aggregate data
 */
export interface MedicationUsageReport {
  administrationLogs: MedicationLog[];
  totalScheduled: number;
  totalLogs: number;
  complianceRate?: number;
  topMedications: TopMedication[];
  adverseReactions: MedicationLog[];
  missedDoses?: number;
  reportPeriod?: DateRangeFilter;
  generatedAt?: Date | string;
}

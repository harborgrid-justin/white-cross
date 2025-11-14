/**
 * WF-COMP-332 | medication-reports.ts - Medication usage report type definitions
 * Purpose: Type definitions for medication tracking, administration logs, and compliance
 * Upstream: report-filters.ts, common.ts | Dependencies: DateRangeFilter, BaseEntity
 * Downstream: Medication management components | Called by: Medication tracking services
 * Related: compliance-reports.ts, dashboard-reports.ts
 * Exports: Medication usage data, logs, compliance metrics
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Medication administration → Log recording → Compliance tracking → Reporting
 * LLM Context: Medication management and compliance reporting for school health services
 */

import type { BaseEntity } from '../common';
import type { DateRangeFilter } from './report-filters';

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

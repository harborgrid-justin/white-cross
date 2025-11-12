/**
 * WF-COMP-IMM | immunizations.statistics.ts - Dashboard Statistics and Analytics
 * Purpose: Type definitions for immunization dashboards, reports, and analytics
 * Upstream: Immunization records, compliance data
 * Downstream: Dashboard components, reports, analytics views
 * Related: immunizations.records.ts, immunizations.compliance.ts
 * Exports: ImmunizationDashboardStats, VaccineStatistics
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Aggregated statistics for compliance monitoring and reporting
 */

import type { VaccineCode } from './immunizations.codes';
import type { TrendDirection, AdministrationTrend } from './immunizations.enums';

// ==========================================
// DASHBOARD & STATISTICS
// ==========================================

/**
 * Immunization dashboard statistics
 */
export interface ImmunizationDashboardStats {
  // Overall compliance
  totalStudents: number;
  compliantStudents: number;
  partiallyCompliantStudents: number;
  nonCompliantStudents: number;
  exemptStudents: number;
  complianceRate: number; // Percentage

  // Status breakdown
  dueToday: number;
  dueThisWeek: number;
  dueThisMonth: number;
  overdue: number;

  // Administration stats
  administeredToday: number;
  administeredThisWeek: number;
  administeredThisMonth: number;
  administeredThisYear: number;

  // Vaccine-specific
  topVaccineDue: string[];
  mostCommonReaction: string;

  // Exemptions
  activeExemptions: number;
  medicalExemptions: number;
  religiousExemptions: number;
  philosophicalExemptions: number;

  // Inventory alerts
  lowStockVaccines: number;
  expiringVaccines: number; // Within 30 days
  expiredVaccines: number;

  // Trends
  complianceTrend: TrendDirection;
  administrationTrend: AdministrationTrend;

  lastUpdated: string;
}

/**
 * Vaccine-specific statistics
 */
export interface VaccineStatistics {
  vaccineCode: VaccineCode;
  vaccineName: string;

  // Administration counts
  totalAdministered: number;
  administeredThisYear: number;
  administeredThisMonth: number;

  // Compliance
  studentsRequired: number;
  studentsCompliant: number;
  studentsOverdue: number;
  studentsExempted: number;
  complianceRate: number;

  // Reactions
  totalReactions: number;
  mildReactions: number;
  moderateReactions: number;
  severeReactions: number;
  adverseEvents: number;

  // Inventory
  currentStock: number;
  daysOfSupply: number;
  needsReorder: boolean;

  lastUpdated: string;
}

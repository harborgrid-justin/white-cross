/**
 * LOC: 1EB0403DE9
 * WC-GEN-292 | types.ts - Report service type definitions
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - All report modules
 */

/**
 * WC-GEN-292 | types.ts - Report service type definitions
 * Purpose: Centralized type definitions for report service modules
 * Upstream: ../database/types/enums | Dependencies: None
 * Downstream: All report modules | Called by: Report modules
 * Related: reportService modules
 * Exports: interfaces, types | Key Services: Type safety
 * Last Updated: 2025-10-19 | File Type: .ts
 * Critical Path: Type definitions → Module usage → Type safety
 * LLM Context: Type definitions for healthcare reporting, HIPAA compliance required
 */

import {
  HealthRecordType,
  AllergySeverity,
  IncidentType,
  IncidentSeverity,
  ComplianceStatus,
  MetricType
} from '../../database/types/enums';
import {
  MedicationLog,
  IncidentReport,
  ChronicCondition,
  Student,
  AuditLog
} from '../../database/models';

/**
 * Generic date range filter interface
 */
export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

/**
 * Health trends analysis report structure
 * Includes aggregated health records, conditions, allergies, and temporal trends
 */
export interface HealthTrendsReport {
  healthRecords: Array<{ type: HealthRecordType; count: number }>;
  chronicConditions: Array<{ condition: string; count: number }>;
  allergies: Array<{ allergen: string; severity: AllergySeverity; count: number }>;
  monthlyTrends: Array<{ month: Date; type: HealthRecordType; count: number }>;
}

/**
 * Medication usage and compliance report structure
 * Tracks medication administration, compliance rates, and adverse reactions
 */
export interface MedicationUsageReport {
  administrationLogs: MedicationLog[];
  totalScheduled: number;
  totalLogs: number;
  topMedications: Array<{ medicationName: string; count: number }>;
  adverseReactions: MedicationLog[];
}

/**
 * Incident statistics and safety analytics report structure
 * Comprehensive incident tracking, categorization, and compliance monitoring
 */
export interface IncidentStatisticsReport {
  incidents: IncidentReport[];
  incidentsByType: Array<{ type: IncidentType; count: number }>;
  incidentsBySeverity: Array<{ severity: IncidentSeverity; count: number }>;
  incidentsByMonth: Array<{ month: Date; type: IncidentType; count: number }>;
  injuryStats: Array<{ type: IncidentType; severity: IncidentSeverity; count: number }>;
  notificationStats: Array<{ parentNotified: boolean; count: number }>;
  complianceStats: Array<{ legalComplianceStatus: ComplianceStatus; count: number }>;
  totalIncidents: number;
}

/**
 * Attendance and health visit correlation report structure
 * Analyzes patterns between health visits, incidents, chronic conditions, and appointments
 */
export interface AttendanceCorrelationReport {
  healthVisits: Array<{ studentId: string; count: number; student: Student }>;
  incidentVisits: Array<{ studentId: string; count: number; student: Student }>;
  chronicStudents: ChronicCondition[];
  appointmentFrequency: Array<{ studentId: string; count: number; student: Student }>;
}

/**
 * Real-time dashboard metrics structure
 * Current operational statistics for immediate monitoring
 */
export interface DashboardMetrics {
  activeStudents: number;
  todaysAppointments: number;
  pendingMedications: number;
  recentIncidents: number;
  lowStockItems: number;
  activeAllergies: number;
  chronicConditions: number;
  timestamp: Date;
}

/**
 * HIPAA compliance and regulatory report structure
 * Audit logs, medication compliance, incident compliance, and vaccination tracking
 */
export interface ComplianceReport {
  hipaaLogs: AuditLog[];
  medicationCompliance: Array<{ isActive: boolean; count: number }>;
  incidentCompliance: Array<{ legalComplianceStatus: ComplianceStatus; count: number }>;
  vaccinationRecords: number;
}

/**
 * Generic report filters interface with dynamic properties
 * Supports date ranges and custom filter criteria
 */
export interface ReportFilters extends Record<string, unknown> {
  startDate?: Date | string;
  endDate?: Date | string;
}

/**
 * Supported report types for custom report generation
 */
export type ReportType = 'students' | 'medications' | 'incidents' | 'appointments' | 'inventory';

/**
 * Export data wrapper with metadata
 */
export interface ExportData {
  reportType: string;
  exportDate: string;
  generatedBy: string;
  recordCount: number;
  data: any;
}

/**
 * Report summary structure
 */
export interface ReportSummary {
  totalRecords: number;
  timestamp?: Date;
  summary?: string;
  dataTypes?: string[];
  recordSample?: any[];
}

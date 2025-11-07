/**
 * Report Types Interfaces
 * Defines the structure of various report types
 */

import { AllergySeverity, HealthRecordType } from '../../common/enums';
import { MedicationLog } from '../../database/models/medication-log.model';
import { IncidentReport } from '../../database/models/incident-report.model';
import { ChronicCondition } from '../../database/models/chronic-condition.model';
import { Student } from '../../database/models/student.model';
import { AuditLog } from '../../database/models/audit-log.model';
import { OutputFormat, ReportStatus } from '../constants/report.constants';

/**
 * Health Trends Report Structure
 */
export interface HealthTrendsReport {
  healthRecords: Array<{ type: HealthRecordType; count: number }>;
  chronicConditions: Array<{ condition: string; count: number }>;
  allergies: Array<{
    allergen: string;
    severity: AllergySeverity;
    count: number;
  }>;
  monthlyTrends: Array<{ month: Date; type: HealthRecordType; count: number }>;
}

/**
 * Medication Usage Report Structure
 */
export interface MedicationUsageReport {
  administrationLogs: MedicationLog[];
  totalScheduled: number;
  totalLogs: number;
  topMedications: Array<{ medicationName: string; count: number }>;
  adverseReactions: MedicationLog[];
}

/**
 * Incident Statistics Report Structure
 */
export interface IncidentStatisticsReport {
  incidents: IncidentReport[];
  incidentsByType: Array<{ type: string; count: number }>;
  incidentsBySeverity: Array<{ severity: string; count: number }>;
  incidentsByMonth: Array<{ month: Date; type: string; count: number }>;
  injuryStats: Array<{ type: string; severity: string; count: number }>;
  notificationStats: Array<{ parentNotified: boolean; count: number }>;
  complianceStats: Array<{ legalComplianceStatus: string; count: number }>;
  totalIncidents: number;
}

/**
 * Attendance Correlation Report Structure
 */
export interface AttendanceCorrelationReport {
  healthVisits: Array<{ studentId: string; count: number; student: Student }>;
  incidentVisits: Array<{ studentId: string; count: number; student: Student }>;
  chronicStudents: ChronicCondition[];
  appointmentFrequency: Array<{
    studentId: string;
    count: number;
    student: Student;
  }>;
}

/**
 * Dashboard Metrics Structure
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
 * Compliance Report Structure
 */
export interface ComplianceReport {
  hipaaLogs: AuditLog[];
  medicationCompliance: Array<{ isActive: boolean; count: number }>;
  incidentCompliance: Array<{ legalComplianceStatus: string; count: number }>;
  vaccinationRecords: number;
}

/**
 * Performance Metrics Structure
 */
export interface PerformanceMetrics {
  metrics: any[];
  summary: Array<{
    metricType: string;
    avgValue: number;
    maxValue: number;
    minValue: number;
    count: number;
  }>;
}

/**
 * Generic Report Result Wrapper
 */
export interface ReportResult<T> {
  data: T;
  metadata: {
    generatedAt: Date;
    reportType: string;
    recordCount: number;
    parameters: Record<string, any>;
    executionTime?: number;
  };
}

/**
 * Export Result Structure
 */
export interface ExportResult {
  format: OutputFormat;
  filePath: string;
  downloadUrl: string;
  fileSize: number;
  generatedAt: Date;
  expiresAt?: Date;
}

/**
 * Report Generation Options
 */
export interface ReportGenerationOptions {
  outputFormat?: OutputFormat;
  includeCharts?: boolean;
  includeSummary?: boolean;
  async?: boolean;
  cacheResults?: boolean;
}

/**
 * Report Execution Context
 */
export interface ReportExecutionContext {
  reportId: string;
  status: ReportStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  progress?: number;
}

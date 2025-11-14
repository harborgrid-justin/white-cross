/**
 * Performance Metrics and Compliance Report Types
 * 
 * Type definitions for performance tracking and compliance reporting including:
 * - Nurse performance metrics
 * - System usage statistics
 * - Compliance tracking (HIPAA, FERPA)
 * - Audit logging
 */

import type { BaseEntity } from '../../core/common';
import type { DateRangeFilter } from './filters';

// ==================== Performance Metrics ====================

/**
 * Performance metrics with workload and system usage
 */
export interface PerformanceMetrics {
  nurseWorkload: Array<{
    nurseId: string;
    nurseName: string;
    appointmentsCompleted: number;
    medicationsAdministered: number;
    incidentsHandled: number;
    efficiency: number;
  }>;
  systemUsage: {
    activeUsers: number;
    documentsCreated: number;
    recordsUpdated: number;
    averageResponseTime: number;
  };
  complianceScores: Array<{
    category: string;
    score: number;
    target: number;
    status: 'good' | 'warning' | 'critical';
  }>;
}

/**
 * Performance metric data point
 */
export interface PerformanceMetric extends BaseEntity {
  metricType: string;
  metricValue: number;
  unit?: string;
  recordedAt: Date | string;
  context?: Record<string, unknown>;
  threshold?: number;
  isAlert?: boolean;
}

/**
 * Nurse performance metrics
 */
export interface NursePerformanceMetric {
  nurseId: string;
  nurseName: string;
  appointmentsCompleted: number;
  medicationsAdministered: number;
  incidentsHandled: number;
  studentsServed: number;
  averageResponseTime?: number;
  efficiency?: number;
  complianceScore?: number;
}

/**
 * System usage metrics
 */
export interface SystemUsageMetrics {
  activeUsers: number;
  totalLogins: number;
  documentsCreated: number;
  recordsUpdated: number;
  apiCalls: number;
  averageResponseTime: number;
  errorRate: number;
  uptime?: number;
}

/**
 * Performance metrics report aggregate data
 */
export interface PerformanceMetricsReport {
  metrics: PerformanceMetric[];
  nursePerformance?: NursePerformanceMetric[];
  systemUsage?: SystemUsageMetrics;
  period?: DateRangeFilter;
  generatedAt?: Date | string;
}

// ==================== Compliance Reporting ====================

/**
 * Audit log entry for compliance
 */
export interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  complianceCategory?: string;
  riskLevel?: string;
}

/**
 * Medication compliance statistics
 */
export interface MedicationComplianceStats {
  isActive: boolean;
  count: number;
  percentage?: number;
}

/**
 * Incident compliance statistics
 */
export interface IncidentComplianceStats {
  legalComplianceStatus: string;
  count: number;
  percentage?: number;
}

/**
 * Compliance category score
 */
export interface ComplianceCategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
  issues?: string[];
  recommendations?: string[];
}

/**
 * Compliance violation
 */
export interface ComplianceViolation extends BaseEntity {
  type: string;
  severity: string;
  description: string;
  affectedEntity?: string;
  affectedEntityId?: string;
  detectedAt: Date | string;
  resolvedAt?: Date | string;
  resolution?: string;
  reportedBy?: string;
}

/**
 * Compliance report aggregate data
 */
export interface ComplianceReport {
  hipaaLogs: AuditLog[];
  medicationCompliance: MedicationComplianceStats[];
  incidentCompliance: IncidentComplianceStats[];
  vaccinationRecords: number;
  overallScore?: number;
  categoryScores?: ComplianceCategoryScore[];
  violations?: ComplianceViolation[];
  recommendations?: string[];
  reportPeriod?: DateRangeFilter;
  generatedAt?: Date | string;
}

// ==================== Attendance Correlation ====================

/**
 * Attendance correlation data with patterns
 */
export interface AttendanceCorrelationData {
  correlations: Array<{
    healthCondition: string;
    absenceRate: number;
    correlation: number;
    significance: string;
  }>;
  patterns: Array<{
    pattern: string;
    affectedStudents: number;
    description: string;
  }>;
}

/**
 * Student with visit count
 */
export interface StudentVisitCount {
  studentId: string;
  count: number;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    grade: string;
  };
}

/**
 * Chronic condition information
 */
export interface ChronicCondition extends BaseEntity {
  studentId: string;
  condition: string;
  severity?: string;
  diagnosisDate?: Date | string;
  status?: string;
  managementPlan?: string;
  medications?: string[];
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    grade: string;
  };
}

/**
 * Attendance correlation report aggregate data
 */
export interface AttendanceCorrelationReport {
  healthVisits: StudentVisitCount[];
  incidentVisits: StudentVisitCount[];
  chronicStudents: ChronicCondition[];
  appointmentFrequency: StudentVisitCount[];
  correlationCoefficient?: number;
  averageVisitsPerStudent?: number;
  highRiskStudents?: number;
  reportPeriod?: DateRangeFilter;
  generatedAt?: Date | string;
}

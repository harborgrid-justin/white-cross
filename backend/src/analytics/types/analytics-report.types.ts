/**
 * @fileoverview Analytics Report Types
 * @module analytics/types
 * @description Type definitions for analytics report generation
 */

export enum AnalyticsReportType {
  HEALTH_OVERVIEW = 'HEALTH_OVERVIEW',
  MEDICATION_SUMMARY = 'MEDICATION_SUMMARY',
  STUDENT_HEALTH_SUMMARY = 'STUDENT_HEALTH_SUMMARY',
  COMPLIANCE_REPORT = 'COMPLIANCE_REPORT',
  DASHBOARD_SUMMARY = 'DASHBOARD_SUMMARY',
  INCIDENT_ANALYSIS = 'INCIDENT_ANALYSIS',
  APPOINTMENT_ANALYTICS = 'APPOINTMENT_ANALYTICS',
}

export enum AnalyticsTimePeriod {
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  LAST_6_MONTHS = 'LAST_6_MONTHS',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
}

export interface ReportGenerationOptions {
  format?: 'JSON' | 'CSV' | 'PDF' | 'XLSX';
  forceRegenerate?: boolean;
  saveToFile?: boolean;
  includeCharts?: boolean;
  filters?: Record<string, any>;
}

export interface ReportData {
  id: string;
  schoolId: string;
  type: AnalyticsReportType;
  period: AnalyticsTimePeriod;
  data: any;
  content: any;
  formattedContent: string;
  metadata: ReportMetadata;
  generatedAt: Date;
}

export interface ReportMetadata {
  id: string;
  title: string;
  type: AnalyticsReportType;
  generatedAt: Date;
  period: AnalyticsTimePeriod;
  format: string;
  size: number;
}

export interface AnalyticsOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthMetricsData {
  totalStudents: number;
  activeHealthRecords: number;
  medicationAdherence: number;
  immunizationCompliance: number;
  incidentCount: number;
  appointmentCompletion: number;
}

export interface StudentHealthMetrics {
  studentId: string;
  period: AnalyticsTimePeriod;
  healthRecords: number;
  medicationAdministrations: number;
  appointments: number;
  incidents: number;
  lastHealthRecord?: Date;
  lastMedication?: Date;
  upcomingAppointments: number;
}

export interface MedicationAnalyticsData {
  medications: Array<{
    name: string;
    count: number;
    students: number;
  }>;
  adherence: number;
  commonMedications: string[];
}

export interface AppointmentAnalyticsData {
  totalAppointments: number;
  completedAppointments: number;
  noShowAppointments: number;
  completionRate: number;
  averageWaitTime: number;
}

export interface IncidentAnalyticsData {
  totalIncidents: number;
  incidentTypes: Record<string, number>;
  severityBreakdown: Record<string, number>;
  resolutionTime: number;
}

export interface DashboardData {
  keyMetrics: Array<{
    name: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timestamp: Date;
  }>;
  upcomingAppointments: number;
  pendingTasks: number;
  recommendations: string[];
}

export interface ComplianceData {
  medicationAdherence: number;
  immunizationCompliance: number;
  appointmentCompletion: number;
  incidentReporting: number;
  overall: number;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL';
  areasOfConcern: string[];
  recommendations: string[];
}

export interface RiskAssessment {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
  score: number;
}

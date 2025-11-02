/**
 * WF-ANALYTICS-001 | analytics.ts - Analytics type definitions
 * Purpose: Comprehensive type definitions for analytics and reporting functionality
 * Upstream: common.ts, reports.ts | Dependencies: Base types
 * Downstream: analyticsApi.ts | Called by: Analytics service modules
 * Related: reports.ts, dashboard.ts
 * Exports: Analytics interfaces and types | Key Features: Analytics data structures
 * Last Updated: 2025-10-24 | File Type: .ts
 * Critical Path: Analytics API → Type validation → Data transformation
 * LLM Context: Central type definitions for analytics module
 */

import type { BaseEntity } from '../core/common';
import type { ReportType, ChartType } from './reports';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Report export format enumeration
 */
export enum ReportExportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
}

/**
 * Date grouping options for time-based analytics
 */
export enum DateGrouping {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

/**
 * Comparison period for trend analysis
 */
export enum ComparisonPeriod {
  PREVIOUS_PERIOD = 'PREVIOUS_PERIOD',
  PREVIOUS_YEAR = 'PREVIOUS_YEAR',
  PREVIOUS_QUARTER = 'PREVIOUS_QUARTER',
  PREVIOUS_MONTH = 'PREVIOUS_MONTH',
  PREVIOUS_WEEK = 'PREVIOUS_WEEK',
}

// ============================================================================
// QUERY PARAMETER TYPES
// ============================================================================

/**
 * Base analytics query parameters
 */
export interface AnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
  schoolId?: string;
  districtId?: string;
  studentId?: string;
  groupBy?: DateGrouping;
  includeComparison?: boolean;
  comparisonPeriod?: ComparisonPeriod;
}

// ============================================================================
// HEALTH METRICS TYPES
// ============================================================================

/**
 * Individual health metric data point
 */
export interface HealthMetrics extends BaseEntity {
  metricType: string;
  value: number;
  unit: string;
  studentId: string;
  schoolId: string;
  recordedDate: string;
  recordedBy: string;
  notes?: string;
}

/**
 * Health trends analysis data
 */
export interface HealthTrends {
  period: DateGrouping;
  trends: Array<{
    date: string;
    metrics: {
      visits: number;
      incidents: number;
      medications: number;
      vaccinations: number;
    };
  }>;
  comparison?: {
    period: ComparisonPeriod;
    percentChange: {
      visits: number;
      incidents: number;
      medications: number;
      vaccinations: number;
    };
  };
  summary: {
    totalVisits: number;
    totalIncidents: number;
    totalMedications: number;
    totalVaccinations: number;
    averagePerDay: number;
  };
}

// ============================================================================
// INCIDENT ANALYTICS TYPES
// ============================================================================

/**
 * Incident trends over time
 */
export interface IncidentTrends {
  period: DateGrouping;
  trends: Array<{
    date: string;
    count: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  }>;
  summary: {
    total: number;
    averagePerDay: number;
    mostCommonType: string;
    mostCommonSeverity: string;
  };
}

/**
 * Incident data by location
 */
export interface IncidentLocationData {
  location: string;
  count: number;
  percentage: number;
  incidents: Array<{
    id: string;
    type: string;
    severity: string;
    date: string;
  }>;
}

// ============================================================================
// MEDICATION ANALYTICS TYPES
// ============================================================================

/**
 * Medication usage analytics
 */
export interface MedicationUsage extends BaseEntity {
  medicationId: string;
  medicationName: string;
  totalAdministrations: number;
  uniqueStudents: number;
  schoolId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  trend: Array<{
    date: string;
    count: number;
  }>;
}

/**
 * Medication adherence data
 */
export interface MedicationAdherence extends BaseEntity {
  studentId: string;
  medicationId: string;
  medicationName: string;
  scheduledDoses: number;
  administeredDoses: number;
  missedDoses: number;
  adherenceRate: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

// ============================================================================
// APPOINTMENT ANALYTICS TYPES
// ============================================================================

/**
 * Appointment trends over time
 */
export interface AppointmentTrends {
  period: DateGrouping;
  trends: Array<{
    date: string;
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
  }>;
  summary: {
    totalScheduled: number;
    totalCompleted: number;
    totalCancelled: number;
    totalNoShow: number;
    completionRate: number;
    noShowRate: number;
  };
}

/**
 * No-show rate analytics
 */
export interface NoShowRate {
  overall: number;
  bySchool: Array<{
    schoolId: string;
    schoolName: string;
    noShowRate: number;
    totalAppointments: number;
    noShows: number;
  }>;
  trend: Array<{
    date: string;
    noShowRate: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

// ============================================================================
// SUMMARY TYPES
// ============================================================================

/**
 * Comprehensive analytics summary
 */
export interface AnalyticsSummary {
  period: {
    startDate: string;
    endDate: string;
  };
  health: {
    totalVisits: number;
    totalIncidents: number;
    averageVisitsPerDay: number;
    topIncidentType: string;
  };
  medications: {
    totalAdministrations: number;
    uniqueMedications: number;
    averageAdherenceRate: number;
    topMedication: string;
  };
  appointments: {
    totalScheduled: number;
    completionRate: number;
    noShowRate: number;
    averagePerDay: number;
  };
  students: {
    totalActive: number;
    withHealthConditions: number;
    onMedications: number;
    withIncidents: number;
  };
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

/**
 * Nurse-specific dashboard data
 */
export interface NurseDashboard {
  nurseId: string;
  nurseName: string;
  todaySchedule: Array<{
    time: string;
    studentName: string;
    type: 'MEDICATION' | 'APPOINTMENT' | 'CHECKUP';
    status: 'PENDING' | 'COMPLETED' | 'MISSED';
  }>;
  pendingTasks: Array<{
    id: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'MEDICATION_DUE' | 'INCIDENT' | 'COMPLIANCE' | 'INVENTORY';
    message: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    timestamp: string;
  }>;
  stats: {
    todayVisits: number;
    pendingMedications: number;
    upcomingAppointments: number;
    criticalAlerts: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

/**
 * Admin-specific dashboard data
 */
export interface AdminDashboard {
  scope: 'DISTRICT' | 'SCHOOL' | 'REGION';
  systemHealth: {
    uptime: number;
    activeUsers: number;
    responseTime: number;
    errorRate: number;
  };
  userActivity: {
    totalUsers: number;
    activeToday: number;
    newThisWeek: number;
    topUsers: Array<{
      userId: string;
      userName: string;
      activityCount: number;
    }>;
  };
  compliance: {
    overallScore: number;
    hipaaCompliance: number;
    ferpaCompliance: number;
    medicationCompliance: number;
    violations: number;
  };
  budget: {
    totalBudget: number;
    spent: number;
    remaining: number;
    percentUsed: number;
    topExpenseCategories: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
  };
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    timestamp: string;
  }>;
}

/**
 * School-specific dashboard data
 */
export interface SchoolDashboard {
  schoolId: string;
  schoolName: string;
  metrics: {
    totalStudents: number;
    activeStudents: number;
    studentsOnMedications: number;
    incidentsThisWeek: number;
    appointmentsToday: number;
  };
  healthTrends: {
    visits: Array<{ date: string; count: number }>;
    incidents: Array<{ date: string; count: number }>;
    medications: Array<{ date: string; count: number }>;
  };
  topIncidentTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  medicationAdherence: {
    overall: number;
    byGrade: Array<{
      grade: string;
      adherenceRate: number;
    }>;
  };
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    timestamp: string;
  }>;
  staffActivity: Array<{
    staffId: string;
    staffName: string;
    role: string;
    todayActivities: number;
  }>;
}

/**
 * Dashboard widget configuration
 */
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'FULL';
  position: {
    row: number;
    col: number;
  };
  config: Record<string, any>;
  refreshInterval?: number;
  visible: boolean;
}

// ============================================================================
// CUSTOM REPORT TYPES
// ============================================================================

/**
 * Custom report definition
 */
export interface CustomReport extends BaseEntity {
  name: string;
  description?: string;
  reportType: ReportType;
  config: CustomReportRequest;
  createdBy: string;
  lastRunAt?: string;
  tags?: string[];
  isPublic: boolean;
  shareWith?: string[];
}

/**
 * Custom report request parameters
 */
export interface CustomReportRequest {
  reportType: ReportType | string;
  title: string;
  description?: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters: Record<string, any>;
  groupBy?: string[];
  aggregations?: Array<{
    field: string;
    function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
    alias?: string;
  }>;
  sortBy?: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
  limit?: number;
  includeCharts?: boolean;
  chartConfig?: ChartConfiguration[];
  exportFormat?: ReportExportFormat;
  saveReport?: boolean;
  schedulable?: boolean;
}

/**
 * Custom report result data
 */
export interface CustomReportResult {
  reportId?: string;
  title: string;
  generatedAt: string;
  period: {
    startDate: string;
    endDate: string;
  };
  data: Array<Record<string, any>>;
  summary: {
    totalRecords: number;
    aggregations: Record<string, number>;
  };
  charts?: ChartConfiguration[];
  metadata: {
    generatedBy: string;
    executionTime: number;
    dataSource: string;
  };
}

/**
 * Report list response with pagination
 */
export interface ReportListResponse {
  reports: CustomReport[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Report schedule configuration
 */
export interface ReportSchedule extends BaseEntity {
  reportId: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  enabled: boolean;
  lastRunAt?: string;
  nextRunAt: string;
  recipients: string[];
  exportFormat: ReportExportFormat;
  includeAttachment: boolean;
}

/**
 * Create report schedule request
 */
export interface CreateReportScheduleRequest {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  recipients: string[];
  exportFormat: ReportExportFormat;
  includeAttachment?: boolean;
  enabled?: boolean;
}

// ============================================================================
// CHART CONFIGURATION TYPES
// ============================================================================

/**
 * Chart configuration for data visualization
 */
export interface ChartConfiguration {
  type: ChartType;
  title?: string;
  xAxis?: {
    label: string;
    field: string;
  };
  yAxis?: {
    label: string;
    field: string;
  };
  series: Array<{
    name: string;
    data: Array<{
      x: string | number;
      y: number;
      label?: string;
    }>;
    color?: string;
  }>;
  options?: {
    legend?: boolean;
    grid?: boolean;
    stacked?: boolean;
    responsive?: boolean;
    height?: number;
    width?: number;
  };
}

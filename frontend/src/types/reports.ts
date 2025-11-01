/**
 * WF-COMP-332 | reports.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Report Types and Interfaces for White Cross Healthcare Platform
 * Comprehensive type definitions for all reporting modules including:
 * - Health trends analysis
 * - Medication usage and compliance
 * - Incident statistics and safety analytics
 * - Attendance correlation
 * - Performance metrics
 * - Dashboard data
 * - Compliance reporting (HIPAA, FERPA)
 * - Custom report generation
 * - Export functionality
 */

import type { BaseEntity } from './common';

// ==================== Enum Types ====================

/**
 * Report type enumeration for different report categories
 */
export enum ReportType {
  HEALTH_TRENDS = 'HEALTH_TRENDS',
  MEDICATION_USAGE = 'MEDICATION_USAGE',
  INCIDENT_STATISTICS = 'INCIDENT_STATISTICS',
  ATTENDANCE_CORRELATION = 'ATTENDANCE_CORRELATION',
  COMPLIANCE = 'COMPLIANCE',
  PERFORMANCE_METRICS = 'PERFORMANCE_METRICS',
  DASHBOARD = 'DASHBOARD',
  CUSTOM = 'CUSTOM',
  STUDENTS = 'STUDENTS',
  MEDICATIONS = 'MEDICATIONS',
  INCIDENTS = 'INCIDENTS',
  APPOINTMENTS = 'APPOINTMENTS',
  INVENTORY = 'INVENTORY',
}

/**
 * Report export format options
 */
export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
}

/**
 * Report period for time-based filtering
 */
export enum ReportPeriod {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  THIS_QUARTER = 'THIS_QUARTER',
  LAST_QUARTER = 'LAST_QUARTER',
  THIS_YEAR = 'THIS_YEAR',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
}

/**
 * Chart types for data visualization
 */
export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
  PIE = 'PIE',
  AREA = 'AREA',
  SCATTER = 'SCATTER',
  DONUT = 'DONUT',
  HORIZONTAL_BAR = 'HORIZONTAL_BAR',
  STACKED_BAR = 'STACKED_BAR',
  RADAR = 'RADAR',
}

/**
 * Aggregation types for data grouping
 */
export enum AggregationType {
  COUNT = 'COUNT',
  SUM = 'SUM',
  AVG = 'AVG',
  MIN = 'MIN',
  MAX = 'MAX',
  MEDIAN = 'MEDIAN',
  PERCENTILE = 'PERCENTILE',
}

// ==================== Filter Types ====================

/**
 * Base date range filter for reports
 */
export interface DateRangeFilter {
  startDate?: Date | string;
  endDate?: Date | string;
  period?: ReportPeriod;
}

/**
 * Extended report filters with additional criteria
 */
export interface ReportFilters extends DateRangeFilter, Record<string, unknown> {
  reportType?: ReportType | string;
  category?: string;
  studentId?: string;
  nurseId?: string;
  schoolId?: string;
  districtId?: string;
  metricType?: string;
  severity?: string;
  status?: string;
  includeInactive?: boolean;
}

/**
 * Custom report builder filters with advanced options
 */
export interface CustomReportFilters extends ReportFilters {
  fields?: string[];
  groupBy?: string[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  aggregations?: Array<{
    field: string;
    type: AggregationType;
    alias?: string;
  }>;
}

// ==================== Health Trends Report Types ====================

/**
 * Health trend data for category-specific analysis
 */
export interface HealthTrendData {
  category: string;
  data: Array<{
    date: string;
    value: number;
    studentCount: number;
    incidents: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  insights: string[];
}

/**
 * Health record type count
 */
export interface HealthRecordTypeCount {
  type: string;
  count: number;
  percentage?: number;
}

/**
 * Chronic condition distribution
 */
export interface ChronicConditionCount {
  condition: string;
  count: number;
  percentage?: number;
  severity?: string;
}

/**
 * Allergy statistics
 */
export interface AllergyStatistics {
  allergen: string;
  severity: string;
  count: number;
  percentage?: number;
  affectedStudents?: number;
}

/**
 * Monthly trend data point
 */
export interface MonthlyTrendData {
  month: Date | string;
  type: string;
  count: number;
  change?: number;
  changePercentage?: number;
}

/**
 * Health trends report aggregate data
 */
export interface HealthTrendsReport {
  healthRecords: HealthRecordTypeCount[];
  chronicConditions: ChronicConditionCount[];
  allergies: AllergyStatistics[];
  monthlyTrends: MonthlyTrendData[];
  totalStudentsAffected?: number;
  reportPeriod?: DateRangeFilter;
  generatedAt?: Date | string;
}

// ==================== Medication Usage Report Types ====================

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

// ==================== Incident Statistics Report Types ====================

/**
 * Incident statistics with comprehensive metrics
 */
export interface IncidentStatistics {
  totalIncidents: number;
  incidentsByType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  incidentsBySeverity: Array<{
    severity: string;
    count: number;
    percentage: number;
  }>;
  trends: Array<{
    date: string;
    count: number;
    type: string;
  }>;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
}

/**
 * Student information for incident reports
 */
export interface IncidentStudentInfo {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  grade: string;
}

/**
 * Incident report detail
 */
export interface IncidentReport extends BaseEntity {
  studentId: string;
  student?: IncidentStudentInfo;
  type: string;
  severity: string;
  occurredAt: Date | string;
  location?: string;
  description: string;
  actionTaken?: string;
  parentNotified: boolean;
  notificationMethod?: string;
  notificationTime?: Date | string;
  followUpRequired: boolean;
  followUpNotes?: string;
  legalComplianceStatus: string;
  reportedBy: string;
  reportedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  witnesses?: string[];
  injuries?: string[];
  medicalAttentionRequired: boolean;
  medicalAttentionDetails?: string;
}

/**
 * Incident count by type
 */
export interface IncidentByType {
  type: string;
  count: number;
  percentage?: number;
}

/**
 * Incident count by severity
 */
export interface IncidentBySeverity {
  severity: string;
  count: number;
  percentage?: number;
}

/**
 * Monthly incident trend
 */
export interface MonthlyIncidentTrend {
  month: Date | string;
  type: string;
  count: number;
  change?: number;
  changePercentage?: number;
}

/**
 * Injury statistics by type and severity
 */
export interface InjuryStatistics {
  type: string;
  severity: string;
  count: number;
  percentage?: number;
}

/**
 * Parent notification statistics
 */
export interface NotificationStatistics {
  parentNotified: boolean;
  count: number;
  percentage?: number;
}

/**
 * Compliance statistics
 */
export interface ComplianceStatistics {
  legalComplianceStatus: string;
  count: number;
  percentage?: number;
}

/**
 * Incident statistics report aggregate data
 */
export interface IncidentStatisticsReport {
  incidents: IncidentReport[];
  incidentsByType: IncidentByType[];
  incidentsBySeverity: IncidentBySeverity[];
  incidentsByMonth: MonthlyIncidentTrend[];
  injuryStats: InjuryStatistics[];
  notificationStats: NotificationStatistics[];
  complianceStats: ComplianceStatistics[];
  totalIncidents: number;
  criticalIncidents?: number;
  averageResponseTime?: number;
  reportPeriod?: DateRangeFilter;
  generatedAt?: Date | string;
}

// ==================== Attendance Correlation Report Types ====================

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

// ==================== Performance Metrics Types ====================

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

// ==================== Dashboard Metrics Types ====================

/**
 * Real-time dashboard metrics
 */
export interface DashboardMetrics {
  activeStudents: number;
  todaysAppointments: number;
  pendingMedications: number;
  recentIncidents: number;
  lowStockItems: number;
  activeAllergies: number;
  chronicConditions: number;
  criticalAlerts?: number;
  timestamp: Date | string;
}

/**
 * Dashboard widget data
 */
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: unknown;
  config?: {
    chartType?: ChartType;
    refreshInterval?: number;
    filters?: ReportFilters;
  };
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Recent activity item
 */
export interface RecentActivity extends BaseEntity {
  type: string;
  description: string;
  userId?: string;
  userName?: string;
  priority?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

/**
 * System alert
 */
export interface SystemAlert extends BaseEntity {
  type: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source?: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date | string;
  resolvedAt?: Date | string;
}

/**
 * Complete dashboard data structure
 */
export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity?: RecentActivity[];
  alerts?: SystemAlert[];
  upcomingAppointments?: unknown[];
  widgets?: DashboardWidget[];
  refreshedAt: Date | string;
}

// ==================== Compliance Report Types ====================

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

// ==================== Custom Report Types ====================

/**
 * Report template definition
 */
export interface ReportTemplate extends BaseEntity {
  name: string;
  description?: string;
  reportType: ReportType | string;
  category?: string;
  filters?: CustomReportFilters;
  columns?: Array<{
    field: string;
    label: string;
    type?: string;
    format?: string;
  }>;
  charts?: Array<{
    type: ChartType;
    title: string;
    dataSource: string;
    config?: Record<string, unknown>;
  }>;
  isPublic: boolean;
  isDefault?: boolean;
  createdBy: string;
  lastUsedAt?: Date | string;
  usageCount?: number;
}

/**
 * Scheduled report configuration
 */
export interface ScheduledReport extends BaseEntity {
  templateId?: string;
  template?: ReportTemplate;
  name: string;
  description?: string;
  reportType: ReportType | string;
  filters?: CustomReportFilters;
  schedule: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone?: string;
  };
  recipients: Array<{
    email: string;
    name?: string;
    type?: string;
  }>;
  format: ReportFormat;
  isActive: boolean;
  lastRun?: Date | string;
  nextRun?: Date | string;
  createdBy: string;
}

/**
 * Custom report request payload
 */
export interface CustomReportRequest {
  reportType: ReportType | string;
  title?: string;
  description?: string;
  filters?: CustomReportFilters;
  parameters?: Record<string, unknown>;
  schedule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    time?: string;
    recipients?: string[];
  };
}

/**
 * Report generation result
 */
export interface ReportData {
  id: string;
  reportType: ReportType | string;
  title: string;
  description?: string;
  data: unknown;
  summary?: {
    totalRecords: number;
    recordsFiltered?: number;
    aggregations?: Record<string, unknown>;
  };
  filters?: ReportFilters;
  generatedAt: Date | string;
  generatedBy?: string;
  expiresAt?: Date | string;
}

// ==================== Export Types ====================

/**
 * Export request payload
 */
export interface ExportRequest extends CustomReportRequest {
  format: ReportFormat;
  includeCharts?: boolean;
  includeMetadata?: boolean;
  template?: string;
  pageSize?: 'A4' | 'LETTER' | 'LEGAL';
  orientation?: 'PORTRAIT' | 'LANDSCAPE';
  compression?: boolean;
}

/**
 * Export job status
 */
export interface ExportJob extends BaseEntity {
  reportType: ReportType | string;
  format: ReportFormat;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
  requestedBy: string;
  completedAt?: Date | string;
  expiresAt?: Date | string;
}

/**
 * Report share payload
 */
export interface ReportShareRequest {
  recipients: string[];
  message?: string;
  expiryDays?: number;
  allowDownload?: boolean;
  requireAuthentication?: boolean;
}

/**
 * Report history entry
 */
export interface ReportHistory extends BaseEntity {
  reportType: ReportType | string;
  title: string;
  filters?: ReportFilters;
  format?: ReportFormat;
  fileUrl?: string;
  fileSize?: number;
  generatedBy: string;
  viewCount?: number;
  downloadCount?: number;
  lastAccessedAt?: Date | string;
}

// ==================== Analytics Types ====================

/**
 * Usage analytics data
 */
export interface UsageAnalytics {
  period: DateRangeFilter;
  totalReports: number;
  reportsByType: Record<string, number>;
  reportsByFormat: Record<string, number>;
  activeUsers: number;
  averageGenerationTime: number;
  popularReports: Array<{
    reportType: string;
    count: number;
    percentage: number;
  }>;
  peakUsageHours: Array<{
    hour: number;
    count: number;
  }>;
}

/**
 * Report popularity metric
 */
export interface ReportPopularity {
  reportType: ReportType | string;
  templateId?: string;
  templateName?: string;
  totalViews: number;
  totalDownloads: number;
  uniqueUsers: number;
  averageRating?: number;
  lastUsed?: Date | string;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
}

/**
 * Performance insight
 */
export interface PerformanceInsight {
  type: 'METRIC' | 'TREND' | 'ANOMALY' | 'RECOMMENDATION';
  category: string;
  title: string;
  description: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
  value?: number;
  unit?: string;
  change?: number;
  changePercentage?: number;
  recommendedAction?: string;
  detectedAt: Date | string;
}

/**
 * Chart data structure for visualization
 */
export interface ChartData {
  type: ChartType;
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }>;
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: Record<string, unknown>;
    scales?: Record<string, unknown>;
  };
}

/**
 * Aggregated chart data with metadata
 */
export interface AggregatedChartData {
  chartData: ChartData;
  summary: {
    total: number;
    average?: number;
    median?: number;
    min?: number;
    max?: number;
  };
  period: DateRangeFilter;
  lastUpdated: Date | string;
}

// ==================== Additional Analytics Types ====================

/**
 * Health metrics summary data
 */
export interface HealthMetrics {
  totalHealthVisits: number;
  chronicConditionCount: number;
  allergyCount: number;
  vaccinationComplianceRate: number;
  screeningCompletionRate: number;
  trends?: HealthTrendData[];
}

/**
 * Health trends data alias for compatibility
 */
export type HealthTrends = HealthTrendsReport;

/**
 * Incident trends data
 */
export interface IncidentTrends {
  trends: Array<{
    date: string;
    count: number;
    type: string;
    severity?: string;
  }>;
  totalIncidents: number;
  averagePerDay?: number;
  peakDay?: string;
}

/**
 * Incident location data for heatmap and analysis
 */
export interface IncidentLocationData {
  location: string;
  count: number;
  severity?: Record<string, number>;
  types?: Record<string, number>;
  coordinates?: { x: number; y: number };
}

/**
 * Medication usage statistics
 */
export interface MedicationUsage {
  medicationId: string;
  medicationName: string;
  totalAdministered: number;
  totalScheduled: number;
  missedDoses: number;
  adherenceRate: number;
}

/**
 * Medication adherence tracking
 */
export interface MedicationAdherence {
  studentId: string;
  medicationId: string;
  adherenceRate: number;
  missedDoses: number;
  totalScheduled: number;
  lastAdministered?: Date | string;
}

/**
 * Appointment trends and statistics
 */
export interface AppointmentTrends {
  period: DateRangeFilter;
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  noShows: number;
  completionRate: number;
  noShowRate: number;
  trends: Array<{
    date: string;
    completed: number;
    canceled: number;
    noShows: number;
  }>;
}

/**
 * No-show rate statistics
 */
export interface NoShowRate {
  totalAppointments: number;
  noShows: number;
  noShowRate: number;
  byMonth?: Array<{
    month: string;
    noShowRate: number;
  }>;
}

/**
 * Analytics summary dashboard data
 */
export interface AnalyticsSummary {
  healthMetrics?: HealthMetrics;
  incidentStatistics?: IncidentStatistics;
  medicationCompliance?: {
    overallRate: number;
    topMedications: TopMedication[];
  };
  appointmentMetrics?: {
    totalScheduled: number;
    completionRate: number;
    noShowRate: number;
  };
  period: DateRangeFilter;
  generatedAt: Date | string;
}

/**
 * Nurse dashboard data
 */
export interface NurseDashboard {
  todaysAppointments: number;
  pendingMedications: number;
  recentIncidents: number;
  alertsCount: number;
  recentActivity?: RecentActivity[];
  upcomingTasks?: unknown[];
  metrics?: DashboardMetrics;
}

/**
 * Admin dashboard data
 */
export interface AdminDashboard {
  totalStudents: number;
  activeNurses: number;
  todaysMetrics: DashboardMetrics;
  complianceScore: number;
  criticalAlerts: number;
  systemHealth?: {
    uptime: number;
    errorRate: number;
    responseTime: number;
  };
  recentActivity?: RecentActivity[];
}

/**
 * School dashboard data
 */
export interface SchoolDashboard {
  schoolId: string;
  schoolName: string;
  enrollmentCount: number;
  healthVisitsToday: number;
  medicationsAdministered: number;
  incidentsThisWeek: number;
  complianceStatus: string;
  metrics?: DashboardMetrics;
}

/**
 * Custom report result
 */
export interface CustomReport {
  id: string;
  name: string;
  description?: string;
  reportType: ReportType | string;
  data: unknown;
  filters?: CustomReportFilters;
  createdBy: string;
  createdAt: Date | string;
  expiresAt?: Date | string;
}

/**
 * Custom report generation result
 */
export interface CustomReportResult {
  report: CustomReport;
  exportUrl?: string;
  downloadUrl?: string;
}

/**
 * Report list response with pagination
 */
export interface ReportListResponse {
  reports: ReportHistory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Report schedule configuration
 */
export interface ReportSchedule {
  id: string;
  reportType: ReportType | string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  schedule: {
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone?: string;
  };
  recipients: string[];
  format: ReportFormat;
  isActive: boolean;
  nextRun?: Date | string;
  lastRun?: Date | string;
}

/**
 * Create report schedule request
 */
export interface CreateReportScheduleRequest {
  reportType: ReportType | string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone?: string;
  recipients: string[];
  format: ReportFormat;
  filters?: CustomReportFilters;
}

/**
 * Analytics query parameters
 */
export interface AnalyticsQueryParams extends DateRangeFilter {
  groupBy?: string[];
  metrics?: string[];
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Chart configuration for visualizations
 */
export interface ChartConfiguration {
  type: ChartType;
  title?: string;
  dataSource: string;
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregation?: AggregationType;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
}

/**
 * Report export format alias
 */
export type ReportExportFormat = ReportFormat;

/**
 * Date grouping for time-series data
 */
export enum DateGrouping {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR'
}

/**
 * Comparison period for trend analysis
 */
export enum ComparisonPeriod {
  PREVIOUS_PERIOD = 'PREVIOUS_PERIOD',
  PREVIOUS_YEAR = 'PREVIOUS_YEAR',
  YEAR_TO_DATE = 'YEAR_TO_DATE',
  CUSTOM = 'CUSTOM'
}

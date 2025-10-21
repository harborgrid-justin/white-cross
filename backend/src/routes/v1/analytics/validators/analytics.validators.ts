/**
 * Analytics Validators
 * Validation schemas for health metrics, analytics, and reporting endpoints
 * Supports HIPAA-compliant health data analysis and trend reporting
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * Time Period Enum Values
 */
const TIME_PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'];

/**
 * Metric Types
 */
const METRIC_TYPES = [
  'HEALTH_VISIT_COUNT',
  'INCIDENT_COUNT',
  'MEDICATION_ADMINISTRATION_COUNT',
  'CHRONIC_CONDITION_PREVALENCE',
  'IMMUNIZATION_COMPLIANCE_RATE',
  'EMERGENCY_CONTACT_COVERAGE',
  'APPOINTMENT_NO_SHOW_RATE',
  'AVERAGE_RESPONSE_TIME',
  'STUDENT_HEALTH_SCORE'
];

/**
 * Report Formats
 */
const REPORT_FORMATS = ['JSON', 'PDF', 'CSV', 'XLSX'];

/**
 * Aggregation Levels
 */
const AGGREGATION_LEVELS = ['STUDENT', 'CLASS', 'GRADE', 'SCHOOL', 'DISTRICT'];

/**
 * Chart Types
 */
const CHART_TYPES = ['LINE', 'BAR', 'PIE', 'AREA', 'SCATTER'];

/**
 * Common Date Range Schema
 */
export const dateRangeSchema = Joi.object({
  startDate: Joi.date().iso().required().description('Start date for data range'),
  endDate: Joi.date().iso().required().description('End date for data range')
    .min(Joi.ref('startDate'))
    .messages({
      'date.min': 'End date must be after start date'
    })
});

/**
 * HEALTH METRICS VALIDATORS
 */

export const getHealthMetricsQuerySchema = Joi.object({
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  districtId: Joi.string().uuid().optional().description('Filter by district ID'),
  startDate: Joi.date().iso().required().description('Metrics start date'),
  endDate: Joi.date().iso().required().description('Metrics end date'),
  metricTypes: Joi.array()
    .items(Joi.string().valid(...METRIC_TYPES))
    .optional()
    .description('Specific metric types to retrieve'),
  aggregationLevel: Joi.string()
    .valid(...AGGREGATION_LEVELS)
    .optional()
    .default('SCHOOL')
    .description('Aggregation level for metrics'),
  compareWithPrevious: Joi.boolean()
    .optional()
    .default(true)
    .description('Include comparison with previous period')
});

export const getHealthTrendsQuerySchema = Joi.object({
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  districtId: Joi.string().uuid().optional().description('Filter by district ID'),
  startDate: Joi.date().iso().required().description('Trend analysis start date'),
  endDate: Joi.date().iso().required().description('Trend analysis end date'),
  timePeriod: Joi.string()
    .valid(...TIME_PERIODS)
    .optional()
    .default('MONTHLY')
    .description('Time period for trend grouping'),
  metrics: Joi.array()
    .items(Joi.string().valid(...METRIC_TYPES))
    .optional()
    .description('Metrics to include in trend analysis'),
  includeForecasting: Joi.boolean()
    .optional()
    .default(false)
    .description('Include predictive forecasting in trends')
});

export const getStudentHealthMetricsParamSchema = Joi.object({
  studentId: Joi.string().uuid().required().description('Student ID')
});

export const getStudentHealthMetricsQuerySchema = Joi.object({
  startDate: Joi.date().iso().optional().description('Start date for student metrics'),
  endDate: Joi.date().iso().optional().description('End date for student metrics'),
  includeHistory: Joi.boolean()
    .optional()
    .default(true)
    .description('Include historical trend data')
});

export const getSchoolMetricsParamSchema = Joi.object({
  schoolId: Joi.string().uuid().required().description('School ID')
});

export const getSchoolMetricsQuerySchema = Joi.object({
  startDate: Joi.date().iso().required().description('Metrics start date'),
  endDate: Joi.date().iso().required().description('Metrics end date'),
  gradeLevel: Joi.string().optional().description('Filter by grade level'),
  includeComparisons: Joi.boolean()
    .optional()
    .default(true)
    .description('Include district-wide comparisons')
});

/**
 * INCIDENT ANALYTICS VALIDATORS
 */

export const getIncidentTrendsQuerySchema = Joi.object({
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  startDate: Joi.date().iso().required().description('Trend analysis start date'),
  endDate: Joi.date().iso().required().description('Trend analysis end date'),
  incidentType: Joi.string().optional().description('Filter by incident type'),
  severity: Joi.string()
    .valid('MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL')
    .optional()
    .description('Filter by severity level'),
  groupBy: Joi.string()
    .valid('TYPE', 'LOCATION', 'TIME_OF_DAY', 'DAY_OF_WEEK', 'SEVERITY')
    .optional()
    .default('TYPE')
    .description('Group incidents by field')
});

export const getIncidentsByLocationQuerySchema = Joi.object({
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  startDate: Joi.date().iso().required().description('Analysis start date'),
  endDate: Joi.date().iso().required().description('Analysis end date'),
  location: Joi.string().optional().description('Filter by specific location'),
  includeHeatMap: Joi.boolean()
    .optional()
    .default(false)
    .description('Include spatial heat map data')
});

/**
 * MEDICATION ANALYTICS VALIDATORS
 */

export const getMedicationUsageQuerySchema = Joi.object({
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  startDate: Joi.date().iso().required().description('Usage analysis start date'),
  endDate: Joi.date().iso().required().description('Usage analysis end date'),
  medicationName: Joi.string().optional().description('Filter by medication name'),
  category: Joi.string().optional().description('Filter by medication category'),
  includeAdherenceRate: Joi.boolean()
    .optional()
    .default(true)
    .description('Include adherence rate calculations'),
  groupBy: Joi.string()
    .valid('MEDICATION', 'CATEGORY', 'STUDENT', 'TIME')
    .optional()
    .default('MEDICATION')
    .description('Group usage by field')
});

export const getMedicationAdherenceQuerySchema = Joi.object({
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  startDate: Joi.date().iso().required().description('Adherence analysis start date'),
  endDate: Joi.date().iso().required().description('Adherence analysis end date'),
  studentId: Joi.string().uuid().optional().description('Filter by student ID'),
  medicationId: Joi.string().uuid().optional().description('Filter by medication ID'),
  threshold: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .default(80)
    .description('Adherence threshold percentage for flagging')
});

/**
 * APPOINTMENT ANALYTICS VALIDATORS
 */

export const getAppointmentTrendsQuerySchema = Joi.object({
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  startDate: Joi.date().iso().required().description('Trend analysis start date'),
  endDate: Joi.date().iso().required().description('Trend analysis end date'),
  appointmentType: Joi.string().optional().description('Filter by appointment type'),
  status: Joi.string()
    .valid('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
    .optional()
    .description('Filter by appointment status'),
  groupBy: Joi.string()
    .valid('DAY', 'WEEK', 'MONTH', 'TYPE', 'STATUS')
    .optional()
    .default('MONTH')
    .description('Group appointments by field')
});

export const getNoShowRateQuerySchema = Joi.object({
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  startDate: Joi.date().iso().required().description('Analysis start date'),
  endDate: Joi.date().iso().required().description('Analysis end date'),
  appointmentType: Joi.string().optional().description('Filter by appointment type'),
  includeReasons: Joi.boolean()
    .optional()
    .default(true)
    .description('Include no-show reason analysis'),
  compareWithTarget: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .description('Target no-show rate for comparison')
});

/**
 * DASHBOARD ANALYTICS VALIDATORS
 */

export const getNurseDashboardQuerySchema = Joi.object({
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  timeRange: Joi.string()
    .valid('TODAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR')
    .optional()
    .default('TODAY')
    .description('Time range for dashboard data'),
  includeAlerts: Joi.boolean()
    .optional()
    .default(true)
    .description('Include active alerts and notifications'),
  includeUpcoming: Joi.boolean()
    .optional()
    .default(true)
    .description('Include upcoming appointments and tasks')
});

export const getAdminDashboardQuerySchema = Joi.object({
  districtId: Joi.string().uuid().optional().description('Filter by district ID'),
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  timeRange: Joi.string()
    .valid('TODAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR')
    .optional()
    .default('MONTH')
    .description('Time range for dashboard data'),
  includeComplianceMetrics: Joi.boolean()
    .optional()
    .default(true)
    .description('Include compliance and regulatory metrics'),
  includeFinancialData: Joi.boolean()
    .optional()
    .default(false)
    .description('Include financial/budget data')
});

export const getPlatformSummaryQuerySchema = Joi.object({
  districtId: Joi.string().uuid().optional().description('Filter by district ID'),
  schoolIds: Joi.array()
    .items(Joi.string().uuid())
    .optional()
    .description('Filter by multiple school IDs'),
  startDate: Joi.date().iso().optional().description('Summary start date'),
  endDate: Joi.date().iso().optional().description('Summary end date'),
  includeDetails: Joi.boolean()
    .optional()
    .default(false)
    .description('Include detailed breakdowns')
});

/**
 * CUSTOM REPORT VALIDATORS
 */

export const generateCustomReportSchema = Joi.object({
  reportName: Joi.string().trim().max(255).required().description('Report name/title'),
  reportType: Joi.string()
    .valid(
      'HEALTH_METRICS',
      'INCIDENT_ANALYSIS',
      'MEDICATION_USAGE',
      'APPOINTMENT_SUMMARY',
      'COMPLIANCE_STATUS',
      'STUDENT_HEALTH_SUMMARY',
      'IMMUNIZATION_REPORT',
      'CUSTOM'
    )
    .required()
    .description('Type of report to generate'),
  startDate: Joi.date().iso().required().description('Report period start date'),
  endDate: Joi.date().iso().required().description('Report period end date'),
  format: Joi.string()
    .valid(...REPORT_FORMATS)
    .optional()
    .default('JSON')
    .description('Report output format'),
  filters: Joi.object({
    schoolId: Joi.string().uuid().optional(),
    districtId: Joi.string().uuid().optional(),
    gradeLevel: Joi.string().optional(),
    studentIds: Joi.array().items(Joi.string().uuid()).optional(),
    includeCharts: Joi.boolean().optional().default(true),
    includeTrends: Joi.boolean().optional().default(true),
    includeComparisons: Joi.boolean().optional().default(true)
  }).optional().description('Additional report filters and options'),
  recipients: Joi.array()
    .items(Joi.string().email())
    .optional()
    .description('Email addresses to send report to'),
  schedule: Joi.object({
    frequency: Joi.string().valid('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY').optional(),
    nextRun: Joi.date().iso().optional()
  }).optional().description('Schedule for recurring reports')
});

export const getReportParamSchema = Joi.object({
  id: Joi.string().uuid().required().description('Report ID')
});

export const getReportQuerySchema = Joi.object({
  includeData: Joi.boolean()
    .optional()
    .default(true)
    .description('Include full report data or just metadata'),
  format: Joi.string()
    .valid(...REPORT_FORMATS)
    .optional()
    .description('Override report format for this request')
});

/**
 * COMPARISON & BENCHMARK VALIDATORS
 */

export const getComparisonDataQuerySchema = Joi.object({
  metricType: Joi.string()
    .valid(...METRIC_TYPES)
    .required()
    .description('Metric type to compare'),
  entityIds: Joi.array()
    .items(Joi.string().uuid())
    .min(2)
    .max(10)
    .required()
    .description('Entity IDs to compare (2-10 entities)'),
  entityType: Joi.string()
    .valid('STUDENT', 'SCHOOL', 'DISTRICT')
    .required()
    .description('Type of entities being compared'),
  startDate: Joi.date().iso().required().description('Comparison period start'),
  endDate: Joi.date().iso().required().description('Comparison period end'),
  includeDistrictAverage: Joi.boolean()
    .optional()
    .default(true)
    .description('Include district average for benchmark')
});

/**
 * EXPORT VALIDATORS
 */

export const exportAnalyticsDataSchema = Joi.object({
  dataType: Joi.string()
    .valid('HEALTH_METRICS', 'INCIDENTS', 'MEDICATIONS', 'APPOINTMENTS', 'CUSTOM')
    .required()
    .description('Type of data to export'),
  format: Joi.string()
    .valid(...REPORT_FORMATS)
    .required()
    .description('Export format'),
  startDate: Joi.date().iso().required().description('Export data start date'),
  endDate: Joi.date().iso().required().description('Export data end date'),
  filters: Joi.object().optional().description('Additional filters for export'),
  includeHeaders: Joi.boolean()
    .optional()
    .default(true)
    .description('Include column headers (CSV/XLSX)'),
  compressOutput: Joi.boolean()
    .optional()
    .default(false)
    .description('Compress export file (ZIP)')
});

/**
 * CHART DATA VALIDATORS
 */

export const getChartDataQuerySchema = Joi.object({
  chartType: Joi.string()
    .valid(...CHART_TYPES)
    .required()
    .description('Type of chart to generate'),
  metricType: Joi.string()
    .valid(...METRIC_TYPES)
    .required()
    .description('Metric to visualize'),
  schoolId: Joi.string().uuid().optional().description('Filter by school ID'),
  startDate: Joi.date().iso().required().description('Chart data start date'),
  endDate: Joi.date().iso().required().description('Chart data end date'),
  groupBy: Joi.string()
    .valid('HOUR', 'DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR')
    .optional()
    .default('DAY')
    .description('Time-based grouping for chart data'),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(30)
    .description('Maximum number of data points')
});

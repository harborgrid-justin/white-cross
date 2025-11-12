/**
 * @fileoverview Analytics Constants and Configuration
 * @module analytics
 * @description Configuration values and constants for analytics module
 */

export const ANALYTICS_CONSTANTS = {
  // Time periods in milliseconds
  TIME_PERIODS: {
    LAST_7_DAYS: 7 * 24 * 60 * 60 * 1000,
    LAST_30_DAYS: 30 * 24 * 60 * 60 * 1000,
    LAST_90_DAYS: 90 * 24 * 60 * 60 * 1000,
    LAST_6_MONTHS: 180 * 24 * 60 * 60 * 1000,
    LAST_YEAR: 365 * 24 * 60 * 60 * 1000,
  },

  // Default limits for queries
  QUERY_LIMITS: {
    HEALTH_RECORDS: 100,
    MEDICATION_LOGS: 100,
    APPOINTMENTS: 50,
    INCIDENTS: 10,
    UPCOMING_MEDICATIONS: 20,
    TOP_CONDITIONS: 10,
    TOP_MEDICATIONS: 10,
  },

  // Cache TTL values in seconds
  CACHE_TTL: {
    HEALTH_METRICS: 300, // 5 minutes
    DASHBOARD_DATA: 60,  // 1 minute
    TREND_DATA: 600,     // 10 minutes
    REPORT_DATA: 3600,   // 1 hour
  },

  // Thresholds for analytics calculations
  THRESHOLDS: {
    MEDICATION_ADHERENCE: 80,
    IMMUNIZATION_COMPLIANCE: 95,
    APPOINTMENT_COMPLETION: 85,
    NO_SHOW_RATE: 5.0,
    CRITICAL_INCIDENTS: 5,
  },

  // Default values for dashboard calculations
  DASHBOARD_DEFAULTS: {
    TIME_RANGE: 'TODAY',
    UPCOMING_HOURS: 4,
    ALERT_SEVERITY_LEVELS: ['CRITICAL', 'HIGH'],
    STATUS_THRESHOLDS: {
      OPERATIONAL: 0,
      ATTENTION_REQUIRED: 5,
      CRITICAL: 10,
    },
  },

  // Report generation settings
  REPORTS: {
    MAX_RECIPIENTS: 10,
    SUPPORTED_FORMATS: ['JSON', 'CSV', 'PDF', 'XLSX'],
    DEFAULT_FORMAT: 'JSON',
    RETENTION_DAYS: 90,
  },

  // Analytics calculation settings
  CALCULATIONS: {
    TREND_WINDOW_DAYS: 30,
    FORECAST_PERIODS: 3,
    CONFIDENCE_INTERVAL: 0.95,
    MIN_DATA_POINTS: 7,
  },

  // Performance monitoring
  PERFORMANCE: {
    SLOW_QUERY_THRESHOLD: 1000, // ms
    MAX_CONCURRENT_QUERIES: 5,
    QUERY_TIMEOUT: 30000, // ms
  },
} as const;

export const ANALYTICS_EVENTS = {
  METRICS_CALCULATED: 'analytics.metrics.calculated',
  REPORT_GENERATED: 'analytics.report.generated',
  DASHBOARD_LOADED: 'analytics.dashboard.loaded',
  TREND_ANALYZED: 'analytics.trend.analyzed',
  ALERT_TRIGGERED: 'analytics.alert.triggered',
} as const;

export const ANALYTICS_ERROR_CODES = {
  INVALID_DATE_RANGE: 'ANALYTICS_INVALID_DATE_RANGE',
  SCHOOL_NOT_FOUND: 'ANALYTICS_SCHOOL_NOT_FOUND',
  INSUFFICIENT_DATA: 'ANALYTICS_INSUFFICIENT_DATA',
  QUERY_TIMEOUT: 'ANALYTICS_QUERY_TIMEOUT',
  REPORT_GENERATION_FAILED: 'ANALYTICS_REPORT_GENERATION_FAILED',
  INVALID_PARAMETERS: 'ANALYTICS_INVALID_PARAMETERS',
} as const;

export const ANALYTICS_CACHE_KEYS = {
  HEALTH_METRICS: (schoolId: string, period: string) => `analytics:health_metrics:${schoolId}:${period}`,
  DASHBOARD_DATA: (schoolId: string, userType: string, timeRange: string) =>
    `analytics:dashboard:${schoolId}:${userType}:${timeRange}`,
  TREND_DATA: (schoolId: string, metricType: string, period: string) =>
    `analytics:trends:${schoolId}:${metricType}:${period}`,
  REPORT_DATA: (reportId: string) => `analytics:report:${reportId}`,
} as const;

// Health condition categories for analytics
export const HEALTH_CONDITION_CATEGORIES = {
  INFECTIOUS: ['FLU', 'COVID', 'STREP', 'RSV', 'MONONUCLEOSIS'],
  CHRONIC: ['ASTHMA', 'DIABETES', 'EPILEPSY', 'ALLERGIES', 'ANEMIA'],
  INJURY: ['SPRAINS', 'FRACTURES', 'CONCUSSIONS', 'CUTS', 'BURNS'],
  MENTAL_HEALTH: ['ANXIETY', 'DEPRESSION', 'ADHD', 'AUTISM'],
  OTHER: ['HEADACHE', 'STOMACH_ACHE', 'FEVER', 'FATIGUE'],
} as const;

// Medication categories for analytics
export const MEDICATION_CATEGORIES = {
  PAIN_RELIEF: ['IBUPROFEN', 'ACETAMINOPHEN', 'ASPIRIN'],
  ALLERGY: ['DIPHENHYDRAMINE', 'LORATADINE', 'CETIRIZINE'],
  ASTHMA: ['ALBUTEROL', 'FLUTICASONE', 'MONTELUKAST'],
  DIABETES: ['INSULIN', 'METFORMIN', 'GLIPIZIDE'],
  ANTIBIOTICS: ['AMOXICILLIN', 'AZITHROMYCIN', 'CEPHALEXIN'],
  OTHER: [],
} as const;

// Incident severity levels
export const INCIDENT_SEVERITY_LEVELS = {
  LOW: ['MINOR_INJURY', 'ILLNESS', 'ALLERGIC_REACTION_MILD'],
  MEDIUM: ['MODERATE_INJURY', 'ALLERGIC_REACTION_SEVERE', 'ASTHMA_ATTACK'],
  HIGH: ['SERIOUS_INJURY', 'SEIZURE', 'DIABETIC_EMERGENCY'],
  CRITICAL: ['LIFE_THREATENING', 'CARDIAC_ARREST', 'SEVERE_TRAUMA'],
} as const;

// Appointment types for analytics
export const APPOINTMENT_TYPES = {
  HEALTH_SCREENING: 'Health Screening',
  MEDICATION_CHECK: 'Medication Check',
  FOLLOW_UP: 'Follow-up',
  IMMUNIZATION: 'Immunization',
  EMERGENCY: 'Emergency',
  PHYSICAL_EXAM: 'Physical Exam',
} as const;

// Dashboard time ranges
export const DASHBOARD_TIME_RANGES = {
  TODAY: 'TODAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  QUARTER: 'QUARTER',
  YEAR: 'YEAR',
} as const;

// Report scheduling options
export const REPORT_SCHEDULES = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  ANNUAL: 'ANNUAL',
  ON_DEMAND: 'ON_DEMAND',
} as const;

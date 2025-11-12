/**
 * @fileoverview Analytics Interfaces and Types
 * @module analytics
 * @description Type definitions for analytics module
 */

export enum AnalyticsTimePeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum AnalyticsReportType {
  IMMUNIZATION_REPORT = 'IMMUNIZATION_REPORT',
  COMPLIANCE_STATUS = 'COMPLIANCE_STATUS',
  STUDENT_HEALTH_SUMMARY = 'STUDENT_HEALTH_SUMMARY',
  HEALTH_METRICS = 'HEALTH_METRICS',
}

export enum AnalyticsAggregationLevel {
  STUDENT = 'STUDENT',
  CLASS = 'CLASS',
  SCHOOL = 'SCHOOL',
  DISTRICT = 'DISTRICT',
}

export enum AnalyticsMetricType {
  HEALTH_VISITS = 'HEALTH_VISITS',
  MEDICATION_ADHERENCE = 'MEDICATION_ADHERENCE',
  INCIDENT_RATE = 'INCIDENT_RATE',
  IMMUNIZATION_COMPLIANCE = 'IMMUNIZATION_COMPLIANCE',
  APPOINTMENT_COMPLETION = 'APPOINTMENT_COMPLETION',
}

export interface AnalyticsQueryFilters {
  schoolId?: string;
  districtId?: string;
  studentId?: string;
  gradeLevel?: string;
  startDate?: Date;
  endDate?: Date;
  timePeriod?: AnalyticsTimePeriod;
  aggregationLevel?: AnalyticsAggregationLevel;
  includeComparisons?: boolean;
  includeForecasting?: boolean;
  compareWithPrevious?: boolean;
}

export interface HealthMetricsData {
  totalStudents: number;
  totalHealthVisits: number;
  totalMedicationAdministrations: number;
  totalIncidents: number;
  immunizationComplianceRate: number;
  topConditions: Array<{
    condition: string;
    count: number;
    percentage: number;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  }>;
  topMedications: Array<{
    medicationName: string;
    category: string;
    studentCount: number;
    administrationCount: number;
    sideEffectRate: number;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  }>;
  alerts: Array<{
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    count: number;
  }>;
}

export interface HealthTrendsData {
  healthConditionTrends: Array<{
    condition: string;
    dataPoints: Array<{
      date: Date;
      count: number;
      percentage: number;
    }>;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
    projectedIncrease: number;
  }>;
  medicationTrends: Array<{
    medicationName: string;
    dataPoints: Array<{
      date: Date;
      administrationCount: number;
      adherenceRate: number;
    }>;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  }>;
}

export interface StudentHealthMetrics {
  studentId: string;
  trends: {
    vitalSigns: Array<{
      date: Date;
      temperature?: number;
      bloodPressure?: string;
      heartRate?: number;
      respiratoryRate?: number;
      oxygenSaturation?: number;
      weight?: number;
      height?: number;
      bmi?: number;
    }>;
    healthVisits: Array<{
      id: string;
      type: string;
      title: string;
      date: Date;
      provider: string;
    }>;
    healthVisitsByType: Record<string, number>;
    medicationAdherence: {
      rate: number;
      scheduled: number;
      administered: number;
      missedDoses: number;
    };
    appointments: {
      total: number;
      completed: number;
      upcoming: number;
      cancelled: number;
    };
  };
  period: {
    startDate: Date;
    endDate: Date;
  };
  includesHistoricalData: boolean;
}

export interface IncidentAnalyticsData {
  trends: Array<{
    date: Date;
    count: number;
    severity: string;
  }>;
  byType: Array<{
    type: string;
    count: number;
    percentage: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
  byLocation: Array<{
    location: string;
    count: number;
    percentage: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;
  byTimeOfDay: Array<{
    hour: number;
    count: number;
    percentage: number;
  }>;
}

export interface MedicationAnalyticsData {
  usageChart: Array<{
    medicationName: string;
    dataPoints: Array<{
      date: Date;
      administrationCount: number;
    }>;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  }>;
  topMedications: Array<{
    medicationName: string;
    category: string;
    studentCount: number;
    administrationCount: number;
    sideEffectRate: number;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  }>;
  totalAdministrations: number;
  adherenceData?: Array<{
    medicationName: string;
    category: string;
    studentCount: number;
    administrationCount: number;
    adherenceRate: number;
    isBelowThreshold: boolean;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  }>;
}

export interface AppointmentAnalyticsData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  completionRate: number;
  noShowRate: number;
  byType: Array<{
    type: string;
    count: number;
    completionRate: number;
  }>;
  byMonth: Array<{
    month: string;
    scheduled: number;
    completed: number;
    noShow: number;
  }>;
}

export interface DashboardMetrics {
  totalPatients: number;
  activeAppointments: number;
  criticalAlerts: number;
  pendingMedications: number;
  status: 'OPERATIONAL' | 'ATTENTION_REQUIRED' | 'CRITICAL';
}

export interface NurseDashboardData {
  overview: DashboardMetrics;
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    studentId: string;
    description: string;
    time: Date;
  }>;
  upcomingTasks: Array<{
    type: string;
    studentId: string;
    medicationId?: string;
    appointmentType?: string;
    time: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
  timeRange: string;
  lastUpdated: Date;
}

export interface AdminDashboardData {
  summary: HealthMetricsData;
  complianceMetrics?: {
    immunizationCompliance: number;
    documentationCompliance: number;
    staffTrainingCompliance: number;
    auditReadiness: number;
  };
  insights: Array<{
    type: string;
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendation?: string;
  }>;
  timeRange: string;
  includesFinancialData: boolean;
  lastUpdated: Date;
}

export interface PlatformSummaryData {
  totalStudents: number;
  totalSchools: number;
  totalDistricts: number;
  healthMetrics: {
    totalHealthVisits: number;
    totalMedicationAdministrations: number;
    totalIncidents: number;
    immunizationCompliance: number;
  };
  alerts: Array<{
    type: string;
    severity: string;
    message: string;
    count: number;
  }>;
  systemStatus: 'OPERATIONAL' | 'MAINTENANCE' | 'DOWN';
  lastUpdated: Date;
}

export interface CustomReportData {
  id: string;
  reportName: string;
  reportType: AnalyticsReportType;
  generatedDate: Date;
  period: {
    start: Date;
    end: Date;
  };
  data: any;
  format: 'JSON' | 'CSV' | 'PDF' | 'XLSX';
  fileUrl?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export interface AnalyticsReportMetadata {
  id: string;
  title: string;
  reportType: string;
  generatedDate: Date;
  status: string;
  format: string;
  fileUrl?: string;
}

export interface AnalyticsOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  responseTime: number;
  metadata?: Record<string, any>;
}

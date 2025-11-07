import { TrendDirection } from '../enums';

/**
 * Health Metric
 */
export interface HealthMetric {
  metricName: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: TrendDirection;
  unit: string;
  category: string;
}

/**
 * Time Series Data Point
 */
export interface TimeSeriesDataPoint {
  date: Date;
  value: number;
  label?: string;
  metadata?: any;
}

/**
 * Chart Data
 */
export interface ChartData {
  chartType: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'SCATTER';
  title: string;
  description?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  datasets: {
    label: string;
    data: TimeSeriesDataPoint[] | { label: string; value: number }[];
    color?: string;
  }[];
}

/**
 * Health Condition Trend
 */
export interface HealthConditionTrend {
  condition: string;
  category: string;
  currentCount: number;
  previousCount: number;
  change: number;
  trend: TrendDirection;
  affectedStudents: string[];
  prevalenceRate: number;
  seasonality?: {
    peakMonths: string[];
    lowMonths: string[];
  };
}

/**
 * Medication Trend
 */
export interface MedicationTrend {
  medicationName: string;
  category: string;
  administrationCount: number;
  studentCount: number;
  change: number;
  trend: TrendDirection;
  commonReasons: string[];
  sideEffectRate: number;
}

/**
 * Incident Trend
 */
export interface IncidentTrend {
  incidentType: string;
  count: number;
  severity: 'MINOR' | 'MODERATE' | 'SERIOUS';
  trend: TrendDirection;
  commonLocations: string[];
  timeOfDayDistribution: { hour: number; count: number }[];
}

/**
 * Absence Correlation
 */
export interface AbsenceCorrelation {
  date: Date;
  absenceRate: number;
  healthVisits: number;
  fluLikeSymptoms: number;
  correlation: number;
}

/**
 * Population Health Summary
 */
export interface PopulationHealthSummary {
  period: { start: Date; end: Date };
  totalStudents: number;
  totalHealthVisits: number;
  averageVisitsPerStudent: number;
  visitTrend: TrendDirection;
  topConditions: HealthConditionTrend[];
  chronicConditionCount: number;
  newDiagnosesCount: number;
  totalMedicationAdministrations: number;
  medicationTrend: TrendDirection;
  topMedications: MedicationTrend[];
  totalIncidents: number;
  incidentRate: number;
  incidentTrend: TrendDirection;
  immunizationComplianceRate: number;
  immunizationTrend: TrendDirection;
  studentsNeedingVaccines: number;
  highRiskStudentCount: number;
  highRiskPercentage: number;
  alerts: {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    message: string;
    affectedCount: number;
  }[];
}

/**
 * Cohort Comparison
 */
export interface CohortComparison {
  cohorts: {
    name: string;
    filter: any;
    metrics: {
      metricName: string;
      value: number;
      unit: string;
    }[];
  }[];
}

/**
 * Predictive Insight
 */
export interface PredictiveInsight {
  insightType:
    | 'OUTBREAK_RISK'
    | 'STOCK_SHORTAGE'
    | 'COMPLIANCE_ISSUE'
    | 'CAPACITY_WARNING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  description: string;
  prediction: {
    timeframe: string;
    probability: number;
    impactedCount: number;
  };
  recommendations: string[];
}

/**
 * Student Statistics Type Definitions
 *
 * Shared TypeScript interfaces and types for statistics modules.
 *
 * @module hooks/students/statistics/types
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

/**
 * Enhanced API error type
 */
export interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Student enrollment statistics
 */
export interface EnrollmentStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  newThisYear: number;
  transferredOut: number;
  graduated: number;
  byGrade: Record<string, number>;
  bySchool?: Record<string, number>;
  trends: {
    monthlyGrowth: number;
    yearlyGrowth: number;
    projectedEndOfYear: number;
  };
}

/**
 * Health overview statistics
 */
export interface HealthStats {
  studentsWithAllergies: number;
  studentsWithMedications: number;
  studentsWithChronicConditions: number;
  recentIncidents: number;
  pendingAppointments: number;
  overdueCheckups: number;
  vaccinationCompliance: number;
  allergyBreakdown: Record<string, number>;
  medicationBreakdown: Record<string, number>;
  incidentTypes: Record<string, number>;
}

/**
 * Activity and engagement statistics
 */
export interface ActivityStats {
  totalVisits: number;
  averageVisitsPerStudent: number;
  mostVisitedTimes: Array<{ hour: number; count: number }>;
  nurseWorkload: Record<string, number>;
  visitReasons: Record<string, number>;
  seasonalTrends: Array<{ month: string; visits: number; incidents: number }>;
  peakDays: Array<{ date: string; visits: number }>;
}

/**
 * Risk assessment statistics
 */
export interface RiskStats {
  highRiskStudents: number;
  mediumRiskStudents: number;
  lowRiskStudents: number;
  studentsNeedingAttention: number;
  criticalAlerts: number;
  riskFactors: Record<string, number>;
  riskTrends: Array<{ date: string; highRisk: number; alerts: number }>;
}

/**
 * Compliance and regulatory statistics
 */
export interface ComplianceStats {
  vaccinationCompliance: number;
  physicalExamCompliance: number;
  emergencyContactCompliance: number;
  documentationCompliance: number;
  auditReadiness: number;
  complianceByGrade: Record<string, number>;
  nonCompliantStudents: Array<{
    studentId: string;
    name: string;
    issues: string[];
    urgency: 'low' | 'medium' | 'high';
  }>;
}

/**
 * Dashboard metrics overview
 */
export interface DashboardMetrics {
  enrollment: EnrollmentStats;
  health: HealthStats;
  activity: ActivityStats;
  risk: RiskStats;
  compliance: ComplianceStats;
  lastUpdated: string;
  alerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    message: string;
    count?: number;
    actionRequired?: boolean;
  }>;
}

/**
 * Time range options for analytics
 */
export type TimeRange =
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom';

/**
 * Custom time range definition
 */
export interface CustomTimeRange {
  from: string;
  to: string;
}

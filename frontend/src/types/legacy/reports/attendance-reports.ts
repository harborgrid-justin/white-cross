/**
 * WF-COMP-332 | attendance-reports.ts - Attendance correlation report type definitions
 * Purpose: Type definitions for attendance patterns and health visit correlations
 * Upstream: report-filters.ts, common.ts | Dependencies: DateRangeFilter, BaseEntity
 * Downstream: Attendance analytics components | Called by: Attendance tracking services
 * Related: health-trends.ts, performance-reports.ts
 * Exports: Attendance correlation data, student visit tracking, chronic condition monitoring
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Visit tracking → Correlation analysis → Pattern identification → Intervention planning
 * LLM Context: Attendance and health visit correlation analysis for student wellness monitoring
 */

import type { BaseEntity } from '../common';
import type { DateRangeFilter } from './report-filters';

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

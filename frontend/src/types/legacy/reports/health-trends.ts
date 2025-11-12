/**
 * WF-COMP-332 | health-trends.ts - Health trends report type definitions
 * Purpose: Type definitions for health trends analysis and reporting
 * Upstream: report-filters.ts, common.ts | Dependencies: DateRangeFilter
 * Downstream: Health trends components | Called by: Health analytics services
 * Related: attendance-reports.ts, dashboard-reports.ts
 * Exports: Health trend data types, chronic condition tracking, allergy statistics
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Health data collection → Trend analysis → Report generation
 * LLM Context: Healthcare trends reporting for student health monitoring and analysis
 */

import type { DateRangeFilter } from './report-filters';

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

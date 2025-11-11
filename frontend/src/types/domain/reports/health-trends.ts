/**
 * Health Trends Report Types
 * 
 * Type definitions for health trends analysis including:
 * - Health record type distributions
 * - Chronic condition tracking
 * - Allergy statistics
 * - Monthly trend analysis
 */

import type { DateRangeFilter } from './filters';

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

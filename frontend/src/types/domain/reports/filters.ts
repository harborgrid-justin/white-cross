/**
 * Report Filters Module
 * 
 * Common filter types and interfaces for report generation.
 * Provides standardized filtering capabilities across all report types.
 */

import type { ReportType, ReportPeriod, AggregationType } from './enums';

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

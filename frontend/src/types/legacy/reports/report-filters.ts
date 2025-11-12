/**
 * WF-COMP-332 | report-filters.ts - Report filter type definitions
 * Purpose: Filter and query parameter types for report generation
 * Upstream: report-enums.ts | Dependencies: ReportType, ReportPeriod, AggregationType
 * Downstream: All report modules | Called by: Report generation and query services
 * Related: custom-reports.ts, export-reports.ts
 * Exports: Filter interfaces for date ranges, reports, and custom queries
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: User filter input → Report query construction → Data retrieval
 * LLM Context: Filter type definitions for healthcare report query parameters
 */

import type { ReportType, ReportPeriod, AggregationType } from './report-enums';

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

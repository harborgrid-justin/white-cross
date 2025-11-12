/**
 * WF-COMP-332 | analytics-reports.ts - Report analytics type definitions
 * Purpose: Type definitions for usage analytics, chart data, and performance insights
 * Upstream: report-enums.ts, report-filters.ts | Dependencies: ReportType, ChartType, DateRangeFilter
 * Downstream: Analytics dashboard components | Called by: Analytics and insights services
 * Related: dashboard-reports.ts, performance-reports.ts
 * Exports: Usage analytics, report popularity, performance insights, chart data structures
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Usage data collection → Trend analysis → Insight generation → Visualization
 * LLM Context: Healthcare reporting system analytics and data visualization
 */

import type { ReportType, ChartType } from './report-enums';
import type { DateRangeFilter } from './report-filters';

/**
 * Usage analytics data
 */
export interface UsageAnalytics {
  period: DateRangeFilter;
  totalReports: number;
  reportsByType: Record<string, number>;
  reportsByFormat: Record<string, number>;
  activeUsers: number;
  averageGenerationTime: number;
  popularReports: Array<{
    reportType: string;
    count: number;
    percentage: number;
  }>;
  peakUsageHours: Array<{
    hour: number;
    count: number;
  }>;
}

/**
 * Report popularity metric
 */
export interface ReportPopularity {
  reportType: ReportType | string;
  templateId?: string;
  templateName?: string;
  totalViews: number;
  totalDownloads: number;
  uniqueUsers: number;
  averageRating?: number;
  lastUsed?: Date | string;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
}

/**
 * Performance insight
 */
export interface PerformanceInsight {
  type: 'METRIC' | 'TREND' | 'ANOMALY' | 'RECOMMENDATION';
  category: string;
  title: string;
  description: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
  value?: number;
  unit?: string;
  change?: number;
  changePercentage?: number;
  recommendedAction?: string;
  detectedAt: Date | string;
}

/**
 * Chart data structure for visualization
 */
export interface ChartData {
  type: ChartType;
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }>;
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: Record<string, unknown>;
    scales?: Record<string, unknown>;
  };
}

/**
 * Aggregated chart data with metadata
 */
export interface AggregatedChartData {
  chartData: ChartData;
  summary: {
    total: number;
    average?: number;
    median?: number;
    min?: number;
    max?: number;
  };
  period: DateRangeFilter;
  lastUpdated: Date | string;
}

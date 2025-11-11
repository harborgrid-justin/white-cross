/**
 * Analytics and Visualization Types
 * 
 * Type definitions for analytics, insights, and data visualization including:
 * - Usage analytics and trends
 * - Performance insights
 * - Chart data structures
 * - Report popularity metrics
 */

import type { ReportType, ChartType } from './enums';
import type { DateRangeFilter } from './filters';

// ==================== Analytics Types ====================

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

// ==================== Visualization Types ====================

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

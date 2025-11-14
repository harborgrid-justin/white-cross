/**
 * Type definitions for Report Analytics components
 */

import React from 'react';

/**
 * Time period options
 */
export type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

/**
 * Metric trend types
 */
export type TrendType = 'up' | 'down' | 'stable';

/**
 * Chart types for analytics
 */
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'donut' | 'gauge';

/**
 * Analytics metric interface
 */
export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  trend: TrendType;
  trendPercentage: number;
  unit: string;
  color: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
}

/**
 * Chart data interface
 */
export interface ChartData {
  id: string;
  title: string;
  type: ChartType;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  insights?: string[];
}

/**
 * Report usage statistics
 */
export interface ReportUsage {
  reportId: string;
  reportName: string;
  category: string;
  views: number;
  downloads: number;
  shares: number;
  avgExecutionTime: number;
  lastUsed: string;
  popularityScore: number;
}

/**
 * User engagement data
 */
export interface UserEngagement {
  userId: string;
  userName: string;
  department: string;
  reportsViewed: number;
  reportsCreated: number;
  avgSessionTime: number;
  lastActive: string;
  favoriteCategory: string;
}

/**
 * System performance metrics
 */
export interface SystemMetrics {
  avgResponseTime: number;
  successRate: number;
  errorRate: number;
  activeUsers: number;
  peakUsageTime: string;
  storageUsed: number;
  storageLimit: number;
}

/**
 * Props for the ReportAnalytics component
 */
export interface ReportAnalyticsProps {
  /** Analytics metrics */
  metrics?: AnalyticsMetric[];
  /** Chart data */
  charts?: ChartData[];
  /** Report usage statistics */
  reportUsage?: ReportUsage[];
  /** User engagement data */
  userEngagement?: UserEngagement[];
  /** System performance metrics */
  systemMetrics?: SystemMetrics;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Time period change handler */
  onTimePeriodChange?: (period: TimePeriod) => void;
  /** Export data handler */
  onExportData?: (format: 'csv' | 'pdf' | 'xlsx') => void;
  /** Refresh data handler */
  onRefreshData?: () => void;
  /** Drill down handler */
  onDrillDown?: (metricId: string, filters: Record<string, unknown>) => void;
}

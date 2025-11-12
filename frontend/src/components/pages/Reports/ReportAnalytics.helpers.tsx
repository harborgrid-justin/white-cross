/**
 * Helper utilities for Report Analytics components
 */

import React from 'react';
import { ArrowUp, ArrowDown, Minus, BarChart3, PieChart, LineChart, Activity } from 'lucide-react';
import { TrendType, ChartType } from './ReportAnalytics.types';

/**
 * Gets trend icon and styling based on trend type and percentage
 */
export const getTrendDisplay = (trend: TrendType, percentage: number): JSX.Element => {
  const config = {
    up: { icon: ArrowUp, color: 'text-green-600', bg: 'bg-green-100' },
    down: { icon: ArrowDown, color: 'text-red-600', bg: 'bg-red-100' },
    stable: { icon: Minus, color: 'text-gray-600', bg: 'bg-gray-100' }
  };

  const { icon: Icon, color, bg } = config[trend];
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color} ${bg}`}>
      <Icon className="w-3 h-3 mr-1" />
      {Math.abs(percentage).toFixed(1)}%
    </div>
  );
};

/**
 * Formats large numbers with K/M suffix
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Formats duration in milliseconds to readable string
 */
export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

/**
 * Gets chart icon component based on chart type
 */
export const getChartIcon = (type: ChartType): React.FC<{ className?: string }> => {
  const icons: Record<ChartType, React.FC<{ className?: string }>> = {
    line: LineChart,
    bar: BarChart3,
    pie: PieChart,
    area: LineChart,
    donut: PieChart,
    gauge: Activity
  };
  return icons[type] || BarChart3;
};

/**
 * Gets performance status badge styling based on response time
 */
export const getPerformanceStatusStyle = (avgResponseTime: number): { text: string; className: string } => {
  if (avgResponseTime < 2000) {
    return {
      text: 'Excellent',
      className: 'text-green-600 bg-green-100'
    };
  } else if (avgResponseTime < 5000) {
    return {
      text: 'Good',
      className: 'text-yellow-600 bg-yellow-100'
    };
  } else {
    return {
      text: 'Needs Attention',
      className: 'text-red-600 bg-red-100'
    };
  }
};

/**
 * Gets storage usage bar color based on percentage
 */
export const getStorageBarColor = (storageUsed: number, storageLimit: number): string => {
  const percentage = (storageUsed / storageLimit) * 100;

  if (percentage < 80) {
    return 'bg-green-600';
  } else if (percentage < 90) {
    return 'bg-yellow-600';
  } else {
    return 'bg-red-600';
  }
};

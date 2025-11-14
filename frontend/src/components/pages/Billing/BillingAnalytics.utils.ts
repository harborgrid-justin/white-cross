import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import type { AnalyticsMetric } from './BillingAnalytics.types';

/**
 * Formats value based on type
 */
export const formatValue = (
  value: number,
  format: AnalyticsMetric['format']
): string => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'days':
      return `${value} days`;
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
};

/**
 * Gets trend icon and color
 */
export const getTrendIcon = (
  trend: AnalyticsMetric['trend'],
  changePercentage: number
): React.ReactElement => {
  if (trend === 'up') {
    return React.createElement(ArrowUpRight, { className: 'w-4 h-4 text-green-600' });
  } else if (trend === 'down') {
    return React.createElement(ArrowDownRight, { className: 'w-4 h-4 text-red-600' });
  }
  return React.createElement(Activity, { className: 'w-4 h-4 text-gray-600' });
};

/**
 * Gets trend color class
 */
export const getTrendColor = (trend: AnalyticsMetric['trend']): string => {
  if (trend === 'up') return 'text-green-600';
  if (trend === 'down') return 'text-red-600';
  return 'text-gray-600';
};

/**
 * Formats date range label
 */
export const formatDateRangeLabel = (dateRange: string): string => {
  return dateRange
    .replace('-', ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
};
